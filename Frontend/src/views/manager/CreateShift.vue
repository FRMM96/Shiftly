<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import { useShiftStore } from '../../stores/shiftStore'

const router = useRouter()
const shiftStore = useShiftStore()

// --- Form state ---
const todayStr = new Date().toISOString().slice(0, 10)

const form = ref({
  workDate: todayStr,
  startTime: '09:00',
  endTime: '17:00',
  role: '',
  workersNeeded: '',
  pay: '',
  currency: 'SEK',
  priority: 'NORMAL',
  notes: ''
})

const eligibleWorkersCount = ref(12)
const submitting = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

const projectedCost = computed(() => {
  const workers = Number(form.value.workersNeeded) || 0
  const rate = Number(form.value.pay) || 0
  if (workers && rate) {
    return (workers * rate).toFixed(2)
  }
  return '0.00'
})

const roleNameMap = {
  nurse: 'Lead Nurse (ICU)',
  security: 'Security Supervisor',
  manager: 'Site Manager'
}

const handleSaveDraft = () => {
  modalSuccess.value = true
  modalMessage.value = 'Draft saved! You can come back and post it later.'
  showModal.value = true
}

const handleSubmit = async () => {
  if (!form.value.workDate || !form.value.role) {
    modalSuccess.value = false
    modalMessage.value = 'Please fill in the Work Date and Role before posting.'
    showModal.value = true
    return
  }

  // --- Strict payload serialization ---

  // 1. Date: parse the user input and extract local Y/M/D parts to avoid
  //    timezone drift that .toISOString() would introduce.
  const rawDate = new Date(form.value.workDate)
  const yyyy = rawDate.getFullYear()
  const mm   = String(rawDate.getMonth() + 1).padStart(2, '0')
  const dd   = String(rawDate.getDate()).padStart(2, '0')
  const isoDate = `${yyyy}-${mm}-${dd}`

  // 2. Times: native <input type="time"> gives us HH:MM in 24h format — use directly.
  const startTime = form.value.startTime.trim()
  const endTime   = form.value.endTime.trim()

  // 3. Pay: combine the numeric value and currency into a String as required
  //    by the backend schema (Prisma expects String or Null, not Int/Float).
  const pay = form.value.pay ? `${form.value.pay} ${form.value.currency}` : null

  // 4. Assemble the final payload with all fields the API contract requires.
  const formattedPayload = {
    business:  'Shiftly Business',          // required by backend
    roleName:  roleNameMap[form.value.role] || form.value.role,
    date:      isoDate,                     // guaranteed YYYY-MM-DD
    startTime,
    endTime,
    pay,
    priority:  form.value.priority || 'NORMAL',
    status:    'OPEN',                      // backend enum value
    notes:     form.value.notes?.trim() || undefined
  }

  console.log('Button clicked! Payload:', formattedPayload)

  submitting.value = true
  try {
    await shiftStore.createShift(formattedPayload)
    modalSuccess.value = true
    modalMessage.value = 'Shift posted successfully! Workers will be notified.'
    showModal.value = true
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = e?.message || 'Failed to post shift. Please try again.'
    showModal.value = true
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  if (modalSuccess.value && !form.value.notes) {
    // Only redirect after a successful post (not a draft save)
    router.push('/manager/schedule')
  }
}
</script>

<template>
  <ManagerLayout>
        
        <div class="page-header">
          <div class="breadcrumbs">
            <router-link to="/manager/schedule" class="breadcrumb-link">SHIFTS</router-link>
            <span class="separator">›</span>
            <span class="current">CREATE NEW SHIFT</span>
          </div>
          <h1 class="page-title">Post a Shift</h1>
          <p class="page-subtitle">Define requirements and schedule for the upcoming workforce demand.</p>
        </div>

        <form class="form-card" @submit.prevent="handleSubmit">
          
          <div class="form-grid">
            
            <div class="form-section">
              <h3 class="section-title">SHIFT TIMING</h3>
              
              <div class="form-group">
                <label>Work Date</label>
                <input type="date" v-model="form.workDate" />
              </div>

              <div class="time-row">
                <div class="form-group flex-1">
                  <label>Start Time</label>
                  <input type="time" v-model="form.startTime" />
                </div>

                <div class="form-group flex-1">
                  <label>End Time</label>
                  <input type="time" v-model="form.endTime" />
                </div>
              </div>

            </div>

            <div class="form-section">
              <h3 class="section-title">REQUIREMENTS</h3>
              
              <div class="form-group">
                <label>Role Selection</label>
                <div class="input-wrapper select-wrapper">
                   <svg class="input-icon left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  <select v-model="form.role">
                    <option value="" disabled selected hidden>Choose a role</option>
                    <option value="nurse">Lead Nurse (ICU)</option>
                    <option value="security">Security Supervisor</option>
                    <option value="manager">Site Manager</option>
                  </select>
                  <svg class="select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              <div class="form-group">
                <label>Workers Needed</label>
                <div class="input-wrapper">
                  <svg class="input-icon left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                  <input type="number" v-model="form.workersNeeded" placeholder="e.g. 5" min="1" />
                </div>
              </div>

              <div class="form-group">
                <label>Priority</label>
                <div class="input-wrapper select-wrapper">
                  <svg class="input-icon left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                  <select v-model="form.priority">
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                  <svg class="select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              <div class="form-group">
                <label>Pay Rate</label>
                <div class="pay-row">
                  <div class="input-wrapper" style="flex: 1;">
                    <svg class="input-icon left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <input type="number" v-model="form.pay" placeholder="e.g. 25.00" min="0" step="0.01" />
                  </div>
                  <div class="input-wrapper select-wrapper currency-select">
                    <select v-model="form.currency">
                      <option value="SEK">SEK</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                    </select>
                    <svg class="select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="form-group mt-5">
            <label>Internal Notes (Optional)</label>
            <textarea v-model="form.notes" placeholder="Add specific instructions for this shift..."></textarea>
          </div>

          <div class="form-footer">
            <div class="footer-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Posting will notify {{ eligibleWorkersCount }} eligible workers.</span>
            </div>
            <div class="footer-actions">
              <button type="button" class="btn btn-ghost" @click="handleSaveDraft" :disabled="submitting">Save Draft</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting">Posting...</span>
                <template v-else>
                  Post Shift
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </template>
              </button>
            </div>
          </div>

        </form>

        <div class="bottom-cards-row">
          
          <div class="summary-card cost-card">
            <div class="card-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="9" y2="15"></line><line x1="15" y1="12" x2="15" y2="15"></line></svg>
              <span class="live-badge">LIVE</span>
            </div>
            <h4>Projected Cost</h4>
            <div class="cost-value">${{ projectedCost }}</div>
            <p>Based on current rates and quantity.</p>
          </div>

          <div class="summary-card location-card">
            <div class="map-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            </div>
            <div class="location-details">
              <h4>
                Work Location
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </h4>
              <p>Radix Central Distribution Center, Sector 7-G</p>
              <a href="#" class="change-link">Change Location</a>
            </div>
          </div>

        </div>

  </ManagerLayout>

  <!-- Result Modal -->
  <ConfirmModal
    :is-open="showModal"
    :title="modalSuccess ? 'Success!' : 'Error'"
    :message="modalMessage"
    :type="modalSuccess ? 'success' : 'danger'"
    @close="closeModal"
  />

</template>

<style scoped>
/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.breadcrumbs a { color: var(--text-muted); text-decoration: none; }
.separator { color: #CBD5E1; }
.current { color: var(--text-dark); }

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

/* --- Form Card --- */
.form-card {
  background-color: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 2rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 0.05em;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-dark);
}

/* Input Styling */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  color: #9CA3AF;
  pointer-events: none;
}
.input-icon.left { left: 12px; }
.input-icon.right { right: 12px; }

input[type="text"], input[type="number"], input[type="date"], input[type="time"], select, textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--text-dark);
  background-color: var(--bg-card);
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px #EFF6FF;
}

input::placeholder, textarea::placeholder {
  color: #9CA3AF;
}

.input-wrapper input { padding-left: 2.75rem; }

/* Custom Date/Select Wrappers */
.date-wrapper input { padding-right: 2.5rem; }

.select-wrapper { position: relative; }
.select-wrapper select {
  appearance: none;
  padding-left: 2.75rem;
  padding-right: 2.5rem;
  cursor: pointer;
}
.select-chevron {
  position: absolute;
  right: 12px;
  color: #64748B;
  pointer-events: none;
}

/* Time Row / Pay Row styling */
.time-row, .pay-row {
  display: flex;
  gap: 1rem;
}

.currency-select {
  width: 110px;
  flex-shrink: 0;
}
.currency-select select {
  padding-left: 1rem;
  padding-right: 2rem;
}

.flex-1 { flex: 1; }

.time-input-group {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--bg-card);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.time-input-group:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px #EFF6FF;
}

.time-input {
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  padding-right: 0 !important;
  width: 60%;
}

.am-pm-toggle {
  background: transparent;
  border: none;
  border-left: 1px solid var(--border);
  padding: 0 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-body);
  height: 100%;
  cursor: pointer;
}
.am-pm-toggle:hover { background-color: #F8FAFC; }

.time-icon { position: static; margin-left: 0.5rem; margin-right: 0.5rem; flex-shrink: 0;}

/* Notes Area */
.mt-5 { margin-top: 0.5rem; padding: 0 2rem; }

textarea {
  min-height: 100px;
  resize: vertical;
}

/* Form Footer */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border);
  background-color: #F8FAFC;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-ghost {
  background: transparent;
  color: var(--text-dark);
}
.btn-ghost:hover { background-color: #E2E8F0; }

.btn-primary {
  background-color: var(--primary);
  color: #FFFFFF;
}
.btn-primary:hover { background-color: var(--primary-hover); }

/* --- Bottom Cards --- */
.bottom-cards-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}

.summary-card {
  background-color: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 1.5rem;
}

.cost-card {
  background-color: #EFF6FF;
  border-color: #DBEAFE;
}

.card-header-icon {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  color: var(--primary);
}

.live-badge {
  background-color: var(--primary);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.cost-card h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 0.5rem 0;
}

.cost-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.cost-card p {
  font-size: 0.8rem;
  color: var(--text-body);
  margin: 0;
}

.location-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.map-placeholder {
  width: 100px;
  height: 100px;
  background-color: #F1F5F9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.location-details h4 {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 0.25rem 0;
}

.location-details h4 svg { color: var(--primary); }

.location-details p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
}

.change-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
}
.change-link:hover { text-decoration: underline; }

/* Responsive Adjustments */
@media (max-width: 900px) {
  .form-grid { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.5rem; }
  .mt-5 { padding: 0 1.5rem; }
  .bottom-cards-row { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .form-footer { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .footer-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
  .time-row { flex-direction: column; }
}

.breadcrumb-link { color: inherit; text-decoration: none; }
.breadcrumb-link:hover { text-decoration: underline; }
</style>