<script setup>
import { ref, watch } from 'vue'
import BaseButton from '../shared/BaseButton.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const staffData = ref({
  id: null,
  name: '',
  role: '',
  phone: '',
  email: ''
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.initialData) {
      staffData.value = { ...props.initialData }
    } else {
      staffData.value = { id: null, name: '', role: '', phone: '', email: '' }
    }
  }
})

const submitForm = () => {
  if (!staffData.value.name) return
  
  emit('save', { ...staffData.value })
  
  // Reset form
  staffData.value = {
    id: null,
    name: '',
    role: '',
    phone: '',
    email: ''
  }
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">
      <header class="modal-header">
        <div>
          <h2 class="modal-title">{{ initialData ? 'Edit Staff Profile' : 'Add New Staff' }}</h2>
          <p class="modal-subtitle">{{ initialData ? 'Update the details for this team member.' : 'Enter the details for your new team member.' }}</p>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>

      <div class="modal-content">
        <form @submit.prevent="submitForm" class="staff-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input 
              v-model="staffData.name" 
              type="text" 
              class="form-input" 
              placeholder="e.g. Sarah Jenkins" 
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label">Position / Role</label>
            <input 
              v-model="staffData.role" 
              type="text" 
              class="form-input" 
              placeholder="e.g. Bartender" 
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input 
              v-model="staffData.phone" 
              type="tel" 
              class="form-input" 
              placeholder="e.g. +46 70 123 45 67" 
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input 
              v-model="staffData.email" 
              type="email" 
              class="form-input" 
              placeholder="e.g. sarah@example.com" 
              required 
            />
          </div>

          <div class="form-actions">
            <BaseButton variant="primary" block type="submit">{{ initialData ? 'Save Changes' : 'Add Staff Member' }}</BaseButton>
            <BaseButton variant="secondary" block @click="$emit('close')" type="button">Cancel</BaseButton>
          </div>
        </form>
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
  max-width: 100%;
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

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: white;
}

.staff-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input::placeholder {
  color: #94a3b8;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}
</style>
