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

const todayStr = new Date().toISOString().slice(0, 10)

const form = ref({
  workDate: todayStr,
  startTime: '09:00',
  endTime: '17:00',
  role: '',
  workerId: route.query.workerId || '',
  pay: '',
  currency: 'SEK',
  priority: 'NORMAL',
  notes: ''
})

const submitting = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

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
  const rate = Number(form.value.pay) || 0
  return rate ? rate.toFixed(2) : '0.00'
})

const handleSaveDraft = () => {
  modalSuccess.value = true
  modalMessage.value = 'Draft saved.'
  showModal.value = true
}

const handlePostShift = async () => {
  if (!form.value.workDate || !form.value.role) {
    modalSuccess.value = false
    modalMessage.value = 'Please fill Work Date and Role.'
    showModal.value = true
    return
  }

  const rawDate = new Date(form.value.workDate)
  const yyyy = rawDate.getFullYear()
  const mm   = String(rawDate.getMonth() + 1).padStart(2, '0')
  const dd   = String(rawDate.getDate()).padStart(2, '0')
  const isoDate = `${yyyy}-${mm}-${dd}`

  const pay = form.value.pay ? `${form.value.pay} ${form.value.currency}` : null

  const payload = {
    business:  'Shiftly Business',
    roleName:  form.value.role,
    date:      isoDate,
    startTime: form.value.startTime.trim(),
    endTime:   form.value.endTime.trim(),
    pay,
    priority:  form.value.priority || 'NORMAL',
    status:    form.value.workerId ? 'ACTIVE' : 'OPEN',
    notes:     form.value.notes?.trim() || undefined
  }

  submitting.value = true
  try {
    await shiftStore.createShift(payload)
    modalSuccess.value = true
    modalMessage.value = form.value.workerId
      ? 'Assigned company shift created successfully.'
      : 'Global open shift created successfully.'
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = e?.message || 'Failed to post shift.'
  } finally {
    submitting.value = false
    showModal.value = true
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

    <div class="form-card">
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
            <label>Priority</label>
            <select v-model="form.priority">
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div class="form-group">
            <label>Pay Rate</label>
            <div class="pay-row">
              <input type="number" v-model="form.pay" placeholder="e.g. 25.00" min="0" step="0.01" style="flex: 1;" />
              <select v-model="form.currency" class="currency-select">
                <option value="SEK">SEK</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">REQUIREMENTS</h3>

          <div class="form-group">
            <label>Role</label>
            <input type="text" v-model="form.role" placeholder="e.g. Bartender, Nurse, Warehouse Worker" />
          </div>

          <div class="form-group">
            <label>Assign Worker (optional)</label>
            <select v-model="form.workerId">
              <option value="">Open shift (unassigned)</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.username }}</option>
            </select>
            <span class="helper" v-if="loadingEmployees">Loading employees...</span>
          </div>

          <div class="form-group">
            <label>Internal Notes (Optional)</label>
            <textarea v-model="form.notes" placeholder="Add specific instructions for this shift..."></textarea>
          </div>
        </div>

      </div>

      <div class="form-footer">
        <div class="footer-info">
          <span>Eligible workers: {{ loadingEmployees ? 'Loading...' : employees.length }}</span>
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
      <div class="summary-card">
        <h4>Projected Cost</h4>
        <div class="cost-value">{{ projectedCost }} {{ form.currency }}</div>
      </div>
      <div class="summary-card">
        <h4>Current mode</h4>
        <p>{{ isAssignedShift ? 'Assigned company shift' : 'Global open shift' }}</p>
      </div>
    </div>
  </ManagerLayout>

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
  background: var(--bg-card, #fff);
  border: 1px solid var(--border, #e2e8f0);
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
  color: var(--text-dark, #0f172a);
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

input[type="text"], input[type="number"], input[type="date"], input[type="time"], select, textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border, #cbd5e1);
  border-radius: 8px;
  font-size: 0.95rem;
  box-sizing: border-box;
  background: var(--bg-card, #fff);
  color: var(--text-dark, #0f172a);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.time-row, .pay-row {
  display: flex;
  gap: 1rem;
}

.currency-select {
  width: 110px;
  flex-shrink: 0;
}

.flex-1 { flex: 1; }

.helper {
  color: var(--text-muted, #64748b);
  font-size: 0.85rem;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-top: 1px solid var(--border, #e2e8f0);
  background: var(--bg-card, #f8fafc);
  border-radius: 0 0 12px 12px;
}

.footer-info { font-size: 0.85rem; color: var(--text-muted, #64748b); }

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
  color: var(--text-dark, #0f172a);
}

.btn-primary {
  background: var(--primary, #0f172a);
  color: #fff;
}

.bottom-cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.summary-card {
  background: var(--bg-card, #fff);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 12px;
  padding: 1rem;
}

.summary-card h4 { margin: 0 0 0.5rem; font-size: 0.85rem; font-weight: 700; }
.summary-card p { margin: 0; color: var(--text-muted); font-size: 0.9rem; }

.cost-value {
  font-size: 2rem;
  font-weight: 800;
}

@media (max-width: 900px) {
  .form-grid, .bottom-cards-row { grid-template-columns: 1fr; }
  .time-row { flex-direction: column; }
}
</style>
