<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { format } from 'date-fns'
import BaseButton from '../shared/BaseButton.vue'
import ShiftCard from '../shared/ShiftCard.vue'

const props = defineProps(['isOpen', 'date', 'shifts'])
const emit = defineEmits(['close', 'requestTimeOff', 'markSick', 'updateTimeOff', 'deleteTimeOff'])

const isRequestingOff = ref(false)
const requestReason = ref('')
const isAllDay = ref(true)
const startTime = ref('')
const endTime = ref('')
const editingShiftId = ref(null)

const timeOptions = []
for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 60; j += 30) {
    const hour = i.toString().padStart(2, '0')
    const min = j.toString().padStart(2, '0')
    timeOptions.push(`${hour}:${min}`)
  }
}

const handleRequestTimeOffClick = () => {
  isRequestingOff.value = true
  editingShiftId.value = null
  requestReason.value = ''
  isAllDay.value = true
  startTime.value = ''
  endTime.value = ''
}

const handleEditClick = (shift) => {
  isRequestingOff.value = true
  editingShiftId.value = shift.id
  requestReason.value = shift.reason || ''
  
  if (shift.time && shift.time !== 'All Day') {
     isAllDay.value = false
     const parts = shift.time.split(' - ')
     if (parts.length === 2) {
       startTime.value = parts[0]
       endTime.value = parts[1]
     }
  } else {
     isAllDay.value = true
     startTime.value = ''
     endTime.value = ''
  }
}

const handleDeleteClick = (shiftId) => {
  if (confirm('Are you sure you want to delete this time off request?')) {
    emit('deleteTimeOff', shiftId)
    emit('close')
  }
}

const cancelRequest = () => {
  isRequestingOff.value = false
  editingShiftId.value = null
  requestReason.value = ''
  isAllDay.value = true
  startTime.value = ''
  endTime.value = ''
}

const submitRequest = () => {
  let timeStr = null
  if (!isAllDay.value && startTime.value && endTime.value) {
    timeStr = `${startTime.value} - ${endTime.value}`
  }
  
  if (editingShiftId.value !== null) {
      emit('updateTimeOff', {
         id: editingShiftId.value,
         date: props.date,
         reason: requestReason.value || 'Personal Time',
         time: timeStr
      })
  } else {
      emit('requestTimeOff', { 
        date: props.date, 
        reason: requestReason.value || 'Personal Time',
        time: timeStr
      })
  }
  
  cancelRequest()
  emit('close')
}

const handleSick = (shift) => {
  emit('markSick', props.date)
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">

      <header class="modal-header">
        <div>
          <h2 class="modal-title">{{ date ? format(date, 'EEEE, MMMM do') : '' }}</h2>
          <p class="modal-subtitle">{{ shifts.length }} items</p>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>

      <div class="shift-list" v-if="!isRequestingOff">
        <!-- List Shifts or Requests -->
        <div v-if="shifts.length > 0">
            <ShiftCard v-for="shift in shifts" :key="shift.id" :shift="shift" class="mb-3">
                 <template #actions v-if="shift.status === 'active'">
                    <BaseButton variant="danger" outline size="sm" @click="() => handleSick(shift)" class="mt-2" style="width: 100%;">
                      Call in Sick
                    </BaseButton>
                 </template>
                 <template #actions v-else-if="shift.status === 'request_off'">
                    <div class="time-off-details" v-if="shift.time && shift.time !== 'All Day'">
                        <ul class="time-list">
                            <li><strong>Start Time:</strong> {{ shift.time.split(' - ')[0] }}</li>
                            <li><strong>End Time:</strong> {{ shift.time.split(' - ')[1] }}</li>
                        </ul>
                    </div>
                    <div class="flex-actions mt-2">
                        <BaseButton variant="secondary" outline size="sm" @click="() => handleEditClick(shift)" class="flex-1">
                          Edit
                        </BaseButton>
                        <BaseButton variant="danger" outline size="sm" @click="() => handleDeleteClick(shift.id)" class="flex-1">
                          Delete
                        </BaseButton>
                    </div>
                 </template>
            </ShiftCard>
        </div>

        <div v-else class="empty-state">
          No shifts scheduled for this day.
        </div>
      </div>
      
      <div v-else class="request-form">
        <h3 class="form-title">Request Time Off</h3>
        
        <div class="form-group mb-3">
          <label>Reason (Optional)</label>
          <input type="text" v-model="requestReason" placeholder="e.g., Doctor appointment" class="form-input" />
        </div>
        
        <div class="form-group mb-3 checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="isAllDay" />
            <span>All Day</span>
          </label>
        </div>
        
        <div v-if="!isAllDay" class="time-inputs mb-3">
          <div class="input-col">
            <label>Start Time</label>
            <select v-model="startTime" class="form-input">
              <option value="" disabled>Select time</option>
              <option v-for="time in timeOptions" :key="'start-'+time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div class="input-col">
            <label>End Time</label>
            <select v-model="endTime" class="form-input">
              <option value="" disabled>Select time</option>
              <option v-for="time in timeOptions" :key="'end-'+time" :value="time">{{ time }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="actions-section flex-actions" v-if="!isRequestingOff">
           <BaseButton variant="danger" outline class="flex-1" @click="handleSick(null)">
              Call in Sick
           </BaseButton>
           <BaseButton variant="secondary" class="flex-1" @click="handleRequestTimeOffClick">
              Request Time Off
           </BaseButton>
      </div>
      <div class="actions-section flex-actions" v-else>
          <BaseButton variant="secondary" outline class="flex-1" @click="cancelRequest">
             Cancel
          </BaseButton>
          <BaseButton variant="primary" class="flex-1" @click="submitRequest">
             Submit Request
          </BaseButton>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Modal Layout - Identical to Manager's */
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
}

.mb-3 { margin-bottom: 0.75rem; }

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
  font-style: italic;
}

.actions-section {
    padding: 1.5rem;
    border-top: 1px solid #e2e8f0;
    background: white;
}

/* Form Styles */
.request-form {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  background-color: #f8fafc;
}

.form-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #0f172a;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.form-input:focus {
  border-color: #3b82f6;
}

label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0;
}

.time-inputs {
  display: flex;
  gap: 1rem;
}

.input-col {
  flex: 1;
}

.flex-actions {
  display: flex;
  gap: 1rem;
}

.flex-1 {
  flex: 1;
}

.time-off-details {
  background: #f1f5f9;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.time-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
  font-size: 0.85rem;
  color: #475569;
}

.time-list li {
  margin-bottom: 0.25rem;
}

.time-list li:last-child {
  margin-bottom: 0;
}

.time-list strong {
  color: #0f172a;
}
</style>
