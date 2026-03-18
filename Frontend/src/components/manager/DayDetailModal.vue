


<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { useStaffStore } from '../../stores/staffStore'
import BaseButton from '../shared/BaseButton.vue'
import ShiftCard from '../shared/ShiftCard.vue'

const props = defineProps(['isOpen', 'date', 'shifts'])
const emit = defineEmits(['close', 'addShift', 'deleteShift', 'publishShift', 'updateShift'])
const staffStore = useStaffStore()

onMounted(() => {
  staffStore.fetchStaff().catch(() => {})
})

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = ['00', '15', '30', '45']
const isAdding = ref(false)
const isEditing = ref(false)
const editingShiftId = ref(null)

const newShift = ref({ workerId: '', role: '', startHour: '09', startMinute: '00', endHour: '17', endMinute: '00' })

const startAdd = () => { isAdding.value = true; isEditing.value = false; editingShiftId.value = null; newShift.value = { workerId: '', role: '', startHour: '09', startMinute: '00', endHour: '17', endMinute: '00' } }
const cancelAdd = () => { isAdding.value = false; isEditing.value = false; editingShiftId.value = null; newShift.value = { workerId: '', role: '', startHour: '09', startMinute: '00', endHour: '17', endMinute: '00' } }

const editShift = (shift) => {
  isAdding.value = true
  isEditing.value = true
  editingShiftId.value = shift.id
  const workerId = shift.workerId || shift.worker?.id || ''
  const [start, end] = (shift.time || `${shift.startTime} - ${shift.endTime}`).split(' - ')
  const [sHour, sMinute] = start.split(':')
  const [eHour, eMinute] = end.split(':')
  newShift.value = { workerId, role: shift.role || shift.roleName || '', startHour: sHour, startMinute: sMinute, endHour: eHour, endMinute: eMinute }
}

const handleWorkerSelect = () => {
  const worker = staffStore.staffList.find(p => p.id === newShift.value.workerId)
  if (worker && !newShift.value.role) newShift.value.role = worker.role === 'EMPLOYEE' ? '' : worker.role
}

const submitShift = () => {
  const worker = staffStore.staffList.find(p => p.id === newShift.value.workerId)
  const startTime = `${newShift.value.startHour}:${newShift.value.startMinute}`
  const endTime = `${newShift.value.endHour}:${newShift.value.endMinute}`
  const payload = {
    id: editingShiftId.value,
    workerId: worker?.id || null,
    name: worker ? worker.name : 'Unassigned',
    role: newShift.value.role,
    roleName: newShift.value.role,
    date: props.date ? format(props.date, 'yyyy-MM-dd') : undefined,
    startTime,
    endTime,
    time: `${startTime} - ${endTime}`,
    status: worker ? 'ACTIVE' : 'OPEN'
  }
  if (isEditing.value) emit('updateShift', payload)
  else emit('addShift', payload)
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
            <BaseButton v-if="shift.status === 'sick'" variant="danger" size="sm" @click="$emit('publishShift', shift.id)">Find Replacement</BaseButton>
            <BaseButton variant="secondary" size="sm" @click="editShift(shift)">Edit Shift</BaseButton>
            <BaseButton variant="ghost" size="sm" @click="$emit('deleteShift', shift.id)">Delete Shift</BaseButton>
          </template>
        </ShiftCard>
        <div v-if="shifts.length === 0 && !isAdding" class="empty-state">No shifts scheduled for this day.</div>
      </div>
      <div class="action-section">
        <template v-if="!isAdding">
          <BaseButton variant="primary" block @click="startAdd">Add Shift</BaseButton>
        </template>
        <template v-else>
          <h3 class="form-title">{{ isEditing ? 'Edit Shift' : 'Add New Shift' }}</h3>
          <div class="form-group">
            <select v-model="newShift.workerId" @change="handleWorkerSelect" class="input">
              <option value="">— Leave open (marketplace shift) —</option>
              <option v-for="person in staffStore.staffList" :key="person.id" :value="person.id">{{ person.name }}</option>
            </select>
          </div>
          <div class="form-group"><input v-model="newShift.role" placeholder="Role" class="input" /></div>
          <div class="form-group time-row">
            <div class="time-picker"><select v-model="newShift.startHour" class="input time-select"><option v-for="h in hours" :key="h" :value="h">{{ h }}</option></select><span class="colon">:</span><select v-model="newShift.startMinute" class="input time-select"><option v-for="m in minutes" :key="m" :value="m">{{ m }}</option></select></div>
            <span class="to">to</span>
            <div class="time-picker"><select v-model="newShift.endHour" class="input time-select"><option v-for="h in hours" :key="h" :value="h">{{ h }}</option></select><span class="colon">:</span><select v-model="newShift.endMinute" class="input time-select"><option v-for="m in minutes" :key="m" :value="m">{{ m }}</option></select></div>
          </div>
          <div class="button-row"><BaseButton variant="primary" block @click="submitShift">{{ isEditing ? 'Update' : 'Save' }}</BaseButton><BaseButton variant="secondary" outline block @click="cancelAdd">Cancel</BaseButton></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.45);display:flex;justify-content:flex-end;z-index:1000}.modal-panel{width:min(420px,100%);background:#fff;height:100%;display:flex;flex-direction:column}.modal-header{padding:1rem 1.25rem;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between}.modal-title{margin:0}.modal-subtitle{margin:.25rem 0 0;color:#64748b}.close-btn{border:none;background:none;font-size:1.5rem;cursor:pointer}.shift-list{flex:1;overflow:auto;padding:1rem}.action-section{padding:1rem;border-top:1px solid #e5e7eb}.form-group{margin-bottom:.75rem}.input{width:100%;padding:.75rem;border:1px solid #cbd5e1;border-radius:10px}.time-row{display:flex;align-items:center;gap:.5rem}.time-picker{display:flex;align-items:center;gap:.35rem}.time-select{width:72px}.button-row{display:flex;gap:.75rem}.empty-state{color:#64748b;text-align:center;padding:1rem}
</style>
