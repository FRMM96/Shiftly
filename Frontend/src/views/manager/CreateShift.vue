<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import { useShiftStore } from '../../stores/shiftStore'
import { useUserStore } from '../../stores/userStore'

const route = useRoute()
const shiftStore = useShiftStore()
const userStore = useUserStore()

const employees = ref([])
const loadingEmployees = ref(false)

const form = ref({
  business: '',
  location: '',
  workDate: route.query.date || '',
  startHour: '09',
  startMinute: '00',
  endHour: '17',
  endMinute: '00',
  role: '',
  workerId: route.query.workerId || '',
  workersNeeded: '',
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
  if (form.value.workersNeeded) {
    return (Number(form.value.workersNeeded) * 84).toFixed(2)
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

    <div class="form-card">
      <div class="form-grid">
        <div class="form-section">
          <h3 class="section-title">SHIFT TIMING</h3>

          <div class="form-group">
            <label>Business</label>
            <input type="text" v-model="form.business" placeholder="e.g. Radix HQ" />
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

            <div class="form-group flex-1">
              <label>End Time</label>
              <div class="time-select-group">
                <select v-model="form.endHour">
                  <option v-for="h in hourOptions" :key="h" :value="h">{{ h }}</option>
                </select>
                <span class="time-separator">:</span>
                <select v-model="form.endMinute">
                  <option v-for="m in minuteOptions" :key="m" :value="m">{{ m }}</option>
                </select>
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

          <div class="form-group">
            <label>Assign existing employee (optional)</label>
            <select v-model="form.workerId">
              <option value="">No employee selected → create global shift</option>
              <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                {{ emp.username }} — {{ emp.email }}
              </option>
            </select>
            <small class="helper">
              {{ isAssignedShift ? 'This will become a company-assigned shift.' : 'This will become a global open shift visible across companies.' }}
            </small>
          </div>

          <div class="form-group">
            <label>Workers Needed</label>
            <input type="number" v-model="form.workersNeeded" placeholder="e.g. 5" min="1" />
          </div>
        </div>
      </div>

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

  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <h3>{{ modalSuccess ? 'Success' : 'Error' }}</h3>
        <p>{{ modalMessage }}</p>
        <button class="btn btn-primary modal-close-btn" @click="closeModal">Got it</button>
      </div>
    </div>
  </Teleport>
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

input, select, textarea {
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

.time-row {
  display: flex;
  gap: 1rem;
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

@media (max-width: 900px) {
  .form-grid, .bottom-cards-row { grid-template-columns: 1fr; }
  .time-row { flex-direction: column; }
}

@media (max-width: 600px) {
  .form-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>