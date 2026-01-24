<script setup>
import { ref } from 'vue'
import { format } from 'date-fns'

// --- Components ---
import ShiftCard from '../components/ShiftCard.vue' // New Import
import BaseButton from '../components/BaseButton.vue'     // New Import

const props = defineProps({
  isOpen: Boolean,
  date: Date,
  shifts: Array
})

const emit = defineEmits(['close', 'updateShift', 'deleteShift', 'addShift', 'publishShift'])

// State for the "Add Shift" form
const isAdding = ref(false)
const newShift = ref({ name: '', role: 'Waiter', time: '09:00 - 17:00' })

// Actions
const startAdd = () => isAdding.value = true
const cancelAdd = () => isAdding.value = false

const saveNewShift = () => {
  emit('addShift', { ...newShift.value, status: 'active' })
  isAdding.value = false
  newShift.value = { name: '', role: 'Waiter', time: '09:00 - 17:00' }
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

            <BaseButton v-if="shift.status === 'sick'" variant="danger" size="sm"
              @click="$emit('publishShift', shift.id)">
              Find Replacement
            </BaseButton>

            <BaseButton v-if="shift.status === 'open'" variant="primary" size="sm">
              2 Applicants
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
          <input v-model="newShift.name" placeholder="Staff Name" class="input" />
          <select v-model="newShift.role" class="input">
            <option>Waiter</option>
            <option>Bartender</option>
            <option>Chef</option>
          </select>
          <input v-model="newShift.time" placeholder="09:00 - 17:00" class="input" />

          <div class="form-actions">
            <BaseButton variant="primary" block @click="saveNewShift">Save</BaseButton>
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
/* Modal Layout (Kept largely the same) */
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
  gap: 10px;
}

.input {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}
</style>