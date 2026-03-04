<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useShiftStore } from '../../stores/shiftStore'
import { useUserStore } from '../../stores/userStore'
import ManagerLayout from '../../components/manager/ManagerLayout.vue'
import BaseButton from '../../components/shared/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const store = useShiftStore()
const userStore = useUserStore()

const isEditing = computed(() => !!route.params.id)
const shiftId = computed(() => route.params.id)

// Time Options
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = ['00', '15', '30', '45']

// REAL employees from backend
const employees = ref([])
const employeesLoading = ref(false)
const employeesError = ref('')

// Form state
const form = ref({
  business: '',        // ✅ backend expects "business"
  role: '',            // UI label, backend uses roleName
  date: '',
  startHour: '09',
  startMinute: '00',
  endHour: '17',
  endMinute: '00',
  pay: '',
  workerId: ''         // ✅ selected real employee account id
})

onMounted(async () => {
  // Load shifts (direct link / refresh)
  await store.fetchManagerShifts()

  // Load employees for dropdown
  employeesLoading.value = true
  employeesError.value = ''
  try {
    employees.value = await userStore.fetchEmployees()
  } catch (e) {
    employeesError.value = e.message || 'Failed to load employees'
  } finally {
    employeesLoading.value = false
  }

  // Edit mode: prefill
  if (isEditing.value) {
    const existingShift = store.getShiftById(shiftId.value)
    if (existingShift) {
      const [startH, startM] = existingShift.startTime.split(':')
      const [endH, endM] = existingShift.endTime.split(':')

      form.value = {
        business: existingShift.business || '',
        role: existingShift.roleName || existingShift.role || '',
        date: existingShift.date,
        startHour: startH,
        startMinute: startM,
        endHour: endH,
        endMinute: endM,
        pay: existingShift.pay ? String(existingShift.pay).replace(/\s*kr\/h\s*/i, '').trim() : '',
        workerId: existingShift.worker?.id || existingShift.workerId || ''
      }
    }
  }
})

const handleSubmit = async () => {
  // Backend expects: business, roleName, date, startTime, endTime, pay, workerId, status
  const shiftData = {
    business: form.value.business?.trim(),
    roleName: form.value.role,
    date: form.value.date,
    startTime: `${form.value.startHour}:${form.value.startMinute}`,
    endTime: `${form.value.endHour}:${form.value.endMinute}`,
    pay: form.value.pay ? `${form.value.pay} kr/h` : null,

    // If manager assigns a worker, it's ACTIVE. If not, it's OPEN.
    status: form.value.workerId ? 'ACTIVE' : 'OPEN',
    workerId: form.value.workerId || null
  }

  try {
    if (isEditing.value) {
      await store.updateShift({ id: shiftId.value, ...shiftData })
      alert('Shift updated!')
    } else {
      await store.createShift({ ...shiftData })
      alert('Shift created!')
    }
    router.push('/manager')
  } catch (e) {
    alert(e.message || 'Failed to save shift')
  }
}

const handleDelete = async () => {
  if (confirm("Delete this shift permanently?")) {
    try {
      await store.deleteShift(shiftId.value)
      router.push('/manager')
    } catch (e) {
      alert(e.message || 'Failed to delete shift')
    }
  }
}
</script>

<template>
  <ManagerLayout>
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">{{ isEditing ? 'Edit Shift' : 'Post New Shift' }}</h1>

        <BaseButton v-if="isEditing" variant="danger" size="sm" @click="handleDelete">
          Delete Shift
        </BaseButton>
      </header>

      <div class="form-card">
        <form @submit.prevent="handleSubmit" class="shift-form">

          <div class="form-group">
            <label>Business</label>
            <input
              type="text"
              v-model="form.business"
              class="input"
              placeholder="e.g. Bar Central"
              required
            />
          </div>

          <div class="form-group">
            <label>Role Needed</label>
            <select v-model="form.role" class="input" required>
              <option disabled value="">Select Role</option>
              <option>Bartender</option>
              <option>Waiter</option>
              <option>Chef</option>
              <option>Dishwasher</option>
              <option>Runner</option>
            </select>
          </div>

          <!-- ✅ REAL employees dropdown -->
          <div class="form-group">
            <label>Assign employee (optional)</label>

            <div v-if="employeesLoading" class="hint">Loading employees…</div>
            <div v-else-if="employeesError" class="error">{{ employeesError }}</div>

            <select v-else v-model="form.workerId" class="input">
              <option value="">— Leave open (marketplace shift) —</option>
              <option v-for="e in employees" :key="e.id" :value="e.id">
                {{ e.username }} ({{ e.email }})
              </option>
            </select>

            <div class="hint">
              If you assign someone here, the shift becomes <b>ACTIVE</b>. If you leave it empty, it becomes <b>OPEN</b>.
            </div>
          </div>

          <div class="form-group">
            <label>Date</label>
            <input type="date" v-model="form.date" class="input" required />
          </div>

          <div class="row">
            <div class="form-group">
              <label>Start Time (24h)</label>
              <div class="time-picker">
                <select v-model="form.startHour" class="input time-select">
                  <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                </select>
                <span class="colon">:</span>
                <select v-model="form.startMinute" class="input time-select">
                  <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>End Time (24h)</label>
              <div class="time-picker">
                <select v-model="form.endHour" class="input time-select">
                  <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                </select>
                <span class="colon">:</span>
                <select v-model="form.endMinute" class="input time-select">
                  <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Hourly Pay (kr)</label>
            <input type="number" v-model="form.pay" placeholder="150" class="input" required />
          </div>

          <div class="form-actions">
            <BaseButton type="submit" variant="primary" block size="lg">
              {{ isEditing ? 'Save Changes' : 'Publish Shift' }}
            </BaseButton>
          </div>

        </form>
      </div>
    </div>
  </ManagerLayout>
</template>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

/* Form Card */
.form-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.shift-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Inputs */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.row {
  display: flex;
  gap: 1.5rem;
}

.row .form-group {
  flex: 1;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.input {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.form-actions {
  margin-top: 1rem;
}

/* Time Picker Styles */
.time-picker {
  display: flex;
  align-items: center;
  gap: 5px;
}

.time-select {
  text-align: center;
  cursor: pointer;
}

.colon {
  font-weight: bold;
  color: #334155;
}

/* Small helper styles */
.hint {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 6px;
}
.error {
  font-size: 0.85rem;
  color: #ef4444;
}
</style>