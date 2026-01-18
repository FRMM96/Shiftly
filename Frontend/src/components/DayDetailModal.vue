<script setup>
import { computed, ref } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  isOpen: Boolean,
  date: Date,
  shifts: Array // Only the shifts for THIS day
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
  newShift.value = { name: '', role: 'Waiter', time: '09:00 - 17:00' } // Reset
}

// Helper to determine status color logic
const getStatusLabel = (status) => {
  if (status === 'sick') return 'Needs Coverage'
  if (status === 'open') return 'Marketplace Open'
  return 'Confirmed'
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
        
        <div v-for="shift in shifts" :key="shift.id" class="shift-row" :class="shift.status">
          <div class="shift-info">
            <div class="time-badge">{{ shift.time }}</div>
            <div class="details">
              <span class="role">{{ shift.role }}</span>
              <span class="name" v-if="shift.name !== 'Open Slot'">{{ shift.name }}</span>
              <span class="status-badge" :class="shift.status">{{ getStatusLabel(shift.status) }}</span>
            </div>
          </div>

          <div class="actions">
            <button 
              v-if="shift.status === 'sick'" 
              @click="$emit('publishShift', shift.id)" 
              class="btn-action btn-publish"
            >
              Find Replacement
            </button>

            <button 
              v-if="shift.status === 'open'" 
              class="btn-action btn-applicants"
            >
              2 Applicants
            </button>

            <button @click="$emit('deleteShift', shift.id)" class="btn-icon">🗑️</button>
          </div>
        </div>

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
            <button @click="saveNewShift" class="btn-save">Save</button>
            <button @click="cancelAdd" class="btn-cancel">Cancel</button>
          </div>
        </div>
        <button v-else @click="startAdd" class="btn-add-block">+ Add Shift</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: flex-end; /* Aligns panel to right */
  z-index: 2000;
}

.modal-panel {
  background: white;
  width: 450px;
  height: 100%;
  box-shadow: -5px 0 15px rgba(0,0,0,0.1);
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

.modal-title { margin: 0; font-size: 1.25rem; }
.modal-subtitle { color: #64748b; margin: 5px 0 0 0; font-size: 0.9rem; }
.close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; line-height: 1; color: #94a3b8; }

.shift-list { flex: 1; overflow-y: auto; padding: 1.5rem; }

/* Shift Row Styling */
.shift-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: white;
}

.shift-row.sick { border-color: #fecaca; background: #fef2f2; }
.shift-row.open { border-color: #fde68a; border-style: dashed; }

.time-badge {
  font-size: 0.75rem;
  font-weight: bold;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 4px;
}

.details { display: flex; flex-direction: column; }
.role { font-weight: bold; font-size: 0.9rem; }
.name { font-size: 0.9rem; color: #475569; }

.status-badge {
  font-size: 0.7rem; text-transform: uppercase; font-weight: bold; margin-top: 4px;
}
.active .status-badge { color: #10b981; }
.sick .status-badge { color: #ef4444; }
.open .status-badge { color: #d97706; }

/* Actions */
.actions { display: flex; align-items: center; gap: 8px; }
.btn-action { border: none; border-radius: 4px; padding: 6px 10px; font-size: 0.75rem; font-weight: bold; cursor: pointer; }
.btn-publish { background: #ef4444; color: white; }
.btn-applicants { background: #f59e0b; color: white; }
.btn-icon { background: none; border: none; cursor: pointer; opacity: 0.5; }
.btn-icon:hover { opacity: 1; }

/* Add Form */
.add-section { padding: 1.5rem; border-top: 1px solid #e2e8f0; background: #f8fafc; }
.btn-add-block { width: 100%; padding: 12px; background: white; border: 1px dashed #cbd5e1; color: #64748b; font-weight: bold; cursor: pointer; border-radius: 8px; }
.btn-add-block:hover { border-color: #94a3b8; color: #0f172a; }

.add-form { display: flex; flex-direction: column; gap: 10px; }
.input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; }
.form-actions { display: flex; gap: 10px; margin-top: 5px; }
.btn-save { flex: 1; background: #0f172a; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; }
.btn-cancel { flex: 1; background: white; border: 1px solid #cbd5e1; padding: 8px; border-radius: 4px; cursor: pointer; }
</style>