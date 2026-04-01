<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import { useShiftStore } from '../../stores/shiftStore'
import { useUserStore } from '../../stores/userStore'

const route = useRoute()
const shiftStore = useShiftStore()
const userStore = useUserStore()

const employees = ref([])
const loadingEmployees = ref(false)

// --- Form state ---
const todayStr = new Date().toISOString().slice(0, 10)

const form = ref({
  workDate: todayStr,
  startTime: '09:00',
  endTime: '17:00',
  role: '',
  workerId: route.query.workerId || '',
  workersNeeded: '',
  pay: '',
  currency: 'SEK',
  priority: 'NORMAL',
  notes: ''
})

const submitting = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minuteOptions = ['00', '15', '30', '45']

const isAssignedShift = computed(() => !!form.value.workerId)

onMounted(async () => {
  loadingEmployees.value = true
  try {
    employees.value = await userStore.fetchEmployees()
  } catch {
    employees.value = []
  } finally {
    loadingEmployees.value = false
  }
})

const projectedCost = computed(() => {
  const workers = Number(form.value.workersNeeded) || 0
  const rate = Number(form.value.pay) || 0
  if (workers && rate) {
    return (workers * rate).toFixed(2)
  }
  return '0.00'
})

const handleSaveDraft = () => {
  modalSuccess.value = true
  modalMessage.value = 'Draft saved.'
  showModal.value = true
}

const handlePostShift = async () => {
  if (!form.value.workDate || !form.value.role || !form.value.business || !form.value.location) {
    modalSuccess.value = false
    modalMessage.value = 'Please fill Business, Location, Work Date and Role.'
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
  submitting.value = true
  try {
    await shiftStore.createShift({
      business: form.value.business,
      location: form.value.location,
      notes: form.value.notes,
      roleName: form.value.role,
      date: form.value.workDate,
      startTime: `${form.value.startHour}:${form.value.startMinute}`,
      endTime: `${form.value.endHour}:${form.value.endMinute}`,
      pay: null,
      workerId: form.value.workerId || null,
      status: form.value.workerId ? 'ACTIVE' : 'OPEN',
      visibility: form.value.workerId ? 'COMPANY' : 'GLOBAL'
    })

    modalSuccess.value = true
    modalMessage.value = form.value.workerId
      ? 'Assigned company shift created successfully.'
      : 'Global open shift created successfully.'
    showModal.value = true
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = e?.message || 'Failed to post shift.'
    showModal.value = true
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <ManagerLayout>
    <div class="page-header">
      <h1 class="page-title">Post a Shift</h1>
      <p class="page-subtitle">
        Pick an employee for a company shift, or leave it empty to create a global open shift.
      </p>
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

          <div class="form-group">
            <label>Work Location</label>
            <input type="text" v-model="form.location" placeholder="e.g. City Center, Main Floor" />
          </div>

          <div class="form-group">
            <label>Work Date</label>
            <input type="date" v-model="form.workDate" />
          </div>

          <div class="time-row">
            <div class="form-group flex-1">
              <label>Start Time</label>
              <div class="time-select-group">
                <select v-model="form.startHour">
                  <option v-for="h in hourOptions" :key="h" :value="h">{{ h }}</option>
                </select>
                <span class="time-separator">:</span>
                <select v-model="form.startMinute">
                  <option v-for="m in minuteOptions" :key="m" :value="m">{{ m }}</option>
                </select>
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
        </div>

        <div class="form-section">
          <h3 class="section-title">REQUIREMENTS</h3>

          <div class="form-group">
            <label>Role</label>
            <input type="text" v-model="form.role" placeholder="e.g. Bartender, Nurse, Warehouse Worker" />
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

      <div class="form-group notes-group">
        <label>Internal Notes (Optional)</label>
        <textarea v-model="form.notes" placeholder="Add specific instructions for this shift..."></textarea>
      </div>

      <div class="form-footer">
        <div class="footer-info">
          <span>Eligible workers: {{ loadingEmployees ? 'Loading…' : employees.length }}</span>
        </div>

        <div class="footer-actions">
          <button class="btn btn-ghost" @click="handleSaveDraft" :disabled="submitting">Save Draft</button>
          <button class="btn btn-primary" @click="handlePostShift" :disabled="submitting">
            {{ submitting ? 'Posting...' : 'Post Shift' }}
          </button>
        </div>
      </div>
    </div>

    <div class="bottom-cards-row">
      <div class="summary-card cost-card">
        <h4>Projected Cost</h4>
        <div class="cost-value">${{ projectedCost }}</div>
      </div>

      <div class="summary-card location-card">
        <h4>Current mode</h4>
        <p>{{ isAssignedShift ? 'Assigned company shift' : 'Global open shift' }}</p>
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
.page-header { margin-bottom: 2rem; }
.page-title { font-size: 2rem; font-weight: 800; margin: 0 0 0.25rem; }
.page-subtitle { margin: 0; color: #64748b; }

.form-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1rem;
  text-transform: uppercase;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
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
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  box-sizing: border-box;
}

textarea {
  min-height: 100px;
  resize: vertical;
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

.time-select-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-separator {
  font-weight: 700;
}

.notes-group {
  padding: 0 2rem;
}

.form-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-ghost {
  background: transparent;
  color: #0f172a;
}

.btn-primary {
  background: #0f172a;
  color: #fff;
}

.bottom-cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.summary-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}

.cost-value {
  font-size: 2rem;
  font-weight: 800;
}

.helper {
  color: #64748b;
  font-size: 0.85rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  width: 90%;
  max-width: 360px;
  background: #fff;
  border-radius: 14px;
  padding: 1.5rem;
  text-align: center;
}

.modal-close-btn {
  width: 100%;
  margin-top: 1rem;
}

/* Responsive Adjustments */
@media (max-width: 900px) {
  .form-grid, .bottom-cards-row { grid-template-columns: 1fr; }
  .time-row { flex-direction: column; }
}

.breadcrumb-link { color: inherit; text-decoration: none; }
.breadcrumb-link:hover { text-decoration: underline; }
</style>