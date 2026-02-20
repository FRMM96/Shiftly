<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useStaffStore } from '../../stores/staffStore'
import BaseButton from '../shared/BaseButton.vue'
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  activeShifts: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'editShift', 'updateShift', 'deleteShift'])

const staffStore = useStaffStore()

const currentTime = ref(new Date())
let timer = null
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = ['00', '15', '30', '45']

// Edit State
const isEditing = ref(false)
const editingShiftId = ref(null)

const editData = ref({
  workerId: '',
  role: '',
  startHour: '09',
  startMinute: '00',
  endHour: '17',
  endMinute: '00'
})

const startEdit = (shift) => {
  isEditing.value = true
  editingShiftId.value = shift.id
  
  const worker = staffStore.staffList.find(p => p.name === shift.name)
  const workerId = worker ? worker.id : ''
  
  const parsed = parseShiftTimes(shift)
  let sHour = '09', sMin = '00', eHour = '17', eMin = '00'
  
  if (parsed) {
    [sHour, sMin] = parsed.sTime.split(':');
    [eHour, eMin] = parsed.eTime.split(':');
  }

  editData.value = {
    workerId,
    role: shift.role,
    startHour: sHour,
    startMinute: sMin,
    endHour: eHour,
    endMinute: eMin
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editingShiftId.value = null
}

const handleWorkerSelect = () => {
  const worker = staffStore.staffList.find(p => p.id === editData.value.workerId)
  if (worker) {
    editData.value.role = worker.role
  }
}

const submitEdit = () => {
  const worker = staffStore.staffList.find(p => p.id === editData.value.workerId)
  const startTime = `${editData.value.startHour}:${editData.value.startMinute}`
  const endTime = `${editData.value.endHour}:${editData.value.endMinute}`

  emit('updateShift', {
    id: editingShiftId.value,
    name: worker ? worker.name : 'Unassigned',
    role: editData.value.role,
    time: `${startTime} - ${endTime}`
  })
  
  cancelEdit()
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentTime.value = new Date()
    timer = setInterval(() => {
      currentTime.value = new Date()
    }, 60000) // update every minute
  } else {
    clearInterval(timer)
  }
})

onUnmounted(() => {
  clearInterval(timer)
})

const parseShiftTimes = (shift) => {
  const baseDateStr = shift.date // e.g. "2026-02-20"
  let sTime = null
  let eTime = null

  if (shift.startTime && shift.endTime) {
    sTime = shift.startTime
    eTime = shift.endTime
  } else if (shift.time) {
    const parts = shift.time.split(' - ')
    if (parts.length === 2) {
      sTime = parts[0]
      eTime = parts[1]
    }
  }

  if (!sTime || !eTime || !baseDateStr) return null

  const startBaseStr = `${baseDateStr}T${sTime}:00`
  const endBaseStr = `${baseDateStr}T${eTime}:00`
  
  const startDate = new Date(startBaseStr)
  const endDate = new Date(endBaseStr)

  // Handle overnight shifts
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1)
  }

  return { startDate, endDate, sTime, eTime }
}

const getRemainingTimeStr = (shift) => {
  const parsed = parseShiftTimes(shift)
  if (!parsed) return 'Unknown'
  
  const diffMs = parsed.endDate - currentTime.value
  if (diffMs <= 0) return 'Finished'

  const totalMins = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m left`
  }
  return `${mins}m left`
}

const getShiftTimeStr = (shift) => {
  const parsed = parseShiftTimes(shift)
  if (!parsed) return shift.time || 'Unknown'
  return `${parsed.sTime} - ${parsed.eTime}`
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">
      <header class="modal-header">
        <div>
          <h2 class="modal-title">Working Now</h2>
          <p class="modal-subtitle">{{ activeShifts.length }} people currently on shift</p>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>

      <div class="shift-list">
        <div v-if="activeShifts.length === 0 && !isEditing" class="empty-state">
          No one is working right now.
        </div>
        
        <div v-for="shift in activeShifts" :key="shift.id" class="active-shift-card">
          <div class="shift-card-content" v-show="!isEditing || editingShiftId !== shift.id">
            <div class="card-left">
              <h3 class="role">{{ shift.role }}</h3>
              <div class="user-row" v-if="shift.name && shift.name !== 'Open Slot'">
                <span class="avatar-tiny">{{ shift.name.charAt(0) }}</span>
                <span class="name">{{ shift.name }}</span>
              </div>
              <span v-else class="name text-muted">Unassigned</span>
            </div>
            <div class="card-right">
              <div class="time-range">{{ getShiftTimeStr(shift) }}</div>
              <div class="time-left" :class="{'time-glow': true}">{{ getRemainingTimeStr(shift) }}</div>
              <div class="card-actions">
                <BaseButton variant="secondary" size="sm" @click="startEdit(shift)">Edit</BaseButton>
                <BaseButton variant="danger" size="sm" @click="$emit('deleteShift', shift.id)">Delete</BaseButton>
              </div>
            </div>
          </div>

          <!-- Inline Edit Form (Only shows for THIS shift) -->
          <div v-if="isEditing && editingShiftId === shift.id" class="inline-edit-form">
            <h4 class="form-title">Edit Shift Details</h4>
            
            <div class="form-group">
              <select v-model="editData.workerId" @change="handleWorkerSelect" class="input" required>
                <option value="" disabled>Select Staff Member</option>
                <option v-for="person in staffStore.staffList" :key="person.id" :value="person.id">
                  {{ person.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <input v-model="editData.role" placeholder="Role" class="input" />
            </div>

            <div class="form-group time-row">
              <div class="time-picker">
                 <select v-model="editData.startHour" class="input time-select">
                     <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                 </select>
                 <span class="colon">:</span>
                 <select v-model="editData.startMinute" class="input time-select">
                     <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
                 </select>
              </div>
              
              <span class="to">to</span>
              
              <div class="time-picker">
                 <select v-model="editData.endHour" class="input time-select">
                     <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                 </select>
                 <span class="colon">:</span>
                 <select v-model="editData.endMinute" class="input time-select">
                     <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
                 </select>
              </div>
            </div>

            <div class="form-actions">
              <BaseButton variant="primary" block @click="submitEdit">Update</BaseButton>
              <BaseButton variant="secondary" block @click="cancelEdit">Cancel</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
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
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
  font-style: italic;
}

.active-shift-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #10b981;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.shift-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.active-shift-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.avatar-tiny {
  width: 20px;
  height: 20px;
  background: #cbd5e1;
  color: white;
  border-radius: 50%;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.name {
  font-size: 0.85rem;
  color: #475569;
}

.text-muted {
  color: #94a3b8;
  font-style: italic;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.time-range {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
}

.time-left {
  font-size: 0.85rem;
  font-weight: 700;
  color: #10b981;
}

.time-glow {
  text-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

/* Edit Form Styles */
.inline-edit-form {
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px dashed #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
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
  justify-content: space-between;
}

.time-picker {
  display: flex;
  align-items: center;
  gap: 2px;
}

.time-select {
  width: 60px;
  text-align: center;
  padding: 10px 5px;
  cursor: pointer;
}

.colon {
  font-weight: bold;
  margin: 0 2px;
}

.to {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 10px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}
</style>
