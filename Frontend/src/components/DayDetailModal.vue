<script setup>
import { ref } from 'vue'
import { format } from 'date-fns'
import { useStaffStore } from '../stores/staffStore' // <--- Import Staff Store

// Components
import BaseButton from './BaseButton.vue'
import ShiftCard from './ShiftCard.vue'

const props = defineProps(['isOpen', 'date', 'shifts'])
const emit = defineEmits(['close', 'addShift', 'deleteShift', 'publishShift'])

const staffStore = useStaffStore() // <--- Init Store
// --- Time Options ---
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = ['00', '15', '30', '45']
// State for the "Add Shift" form
const isAdding = ref(false)

// Form Data
const newShift = ref({
  workerId: '', // We store the ID
  role: '',
  startHour: '09',
  startMinute: '00',
  endHour: '17',
  endMinute: '00'
})

// Actions
const startAdd = () => isAdding.value = true
const cancelAdd = () => {
  isAdding.value = false
  // Reset
  newShift.value = { workerId: '', role: '', startHour: '09', startMinute: '00', endHour: '17', endMinute: '00' }
}

// Auto-fill Role when Worker is selected
const handleWorkerSelect = () => {
  const worker = staffStore.staffList.find(p => p.id === newShift.value.workerId)
  if (worker) {
    newShift.value.role = worker.role
  }
}

const submitShift = () => {
  // Find the full name based on the ID
  const worker = staffStore.staffList.find(p => p.id === newShift.value.workerId)

  // Combine Time
  const startTime = `${newShift.value.startHour}:${newShift.value.startMinute}`
  const endTime = `${newShift.value.endHour}:${newShift.value.endMinute}`

  emit('addShift', {
    name: worker ? worker.name : 'Unassigned',
    role: newShift.value.role,
    time: `${startTime} - ${endTime}`,
    status: 'active' // Default to active since we assigned a worker
  })

  cancelAdd()
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">

      <header class="modal-header">
        <div>
          <h2 class="modal-title">{{ date ? format(date, 'EEEE, MMMM do') : '' }}</h2>
          <p class="modal-subtitle">{{ shifts.length }} shifts scheduled</p>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>

      <div class="shift-list">
        <ShiftCard v-for="shift in shifts" :key="shift.id" :shift="shift" class="mb-3">
          <template #actions>
            <BaseButton v-if="shift.status === 'sick'" variant="danger" size="sm" @click="$emit('publishShift', shift.id)">
              Find Replacement
            </BaseButton>
            <BaseButton variant="ghost" size="sm" @click="$emit('deleteShift', shift.id)">
              🗑️
            </BaseButton>
          </template>
        </ShiftCard>

        <div v-if="shifts.length === 0 && !isAdding" class="empty-state">
          No shifts scheduled for this day.
        </div>
      </div>

      <div class="add-section">
        <div v-if="isAdding" class="add-form">
          <h4 class="form-title">Assign Staff</h4>
          
          <div class="form-group">
            <select v-model="newShift.workerId" @change="handleWorkerSelect" class="input" required>
              <option value="" disabled>Select Staff Member</option>
              <option v-for="person in staffStore.staffList" :key="person.id" :value="person.id">
                {{ person.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <input v-model="newShift.role" placeholder="Role" class="input" />
          </div>

          <div class="form-group time-row">
            <div class="time-picker">
               <select v-model="newShift.startHour" class="input time-select">
                   <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
               </select>
               <span class="colon">:</span>
               <select v-model="newShift.startMinute" class="input time-select">
                   <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
               </select>
            </div>
            
            <span class="to">to</span>
            
            <div class="time-picker">
               <select v-model="newShift.endHour" class="input time-select">
                   <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
               </select>
               <span class="colon">:</span>
               <select v-model="newShift.endMinute" class="input time-select">
                   <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
               </select>
            </div>
          </div>

          <div class="form-actions">
            <BaseButton variant="primary" block @click="submitShift">Save</BaseButton>
            <BaseButton variant="secondary" block @click="cancelAdd">Cancel</BaseButton>
          </div>
        </div>

        <BaseButton v-else variant="secondary" block @click="startAdd">
          + Add Shift
        </BaseButton>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Modal Layout */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
}

.modal-panel {
  background: white;
  width: 450px;
  height: 100%;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f8fafc;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.modal-subtitle {
  color: #64748b;
  margin: 5px 0 0 0;
  font-size: 0.9rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  color: #94a3b8;
}

.shift-list {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #f8fafc;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
  font-style: italic;
}

/* Add Form */
.add-section {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: white;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-title {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #334155;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.to {
  color: #64748b;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}
.time-row { display: flex; align-items: center; justify-content: space-between; }
.time-picker { display: flex; align-items: center; gap: 2px; }
.time-select { width: 60px; text-align: center; padding: 10px 5px; cursor: pointer; }
.colon { font-weight: bold; margin: 0 2px; }
.to { color: #64748b; font-size: 0.9rem; margin: 0 10px; }

</style>