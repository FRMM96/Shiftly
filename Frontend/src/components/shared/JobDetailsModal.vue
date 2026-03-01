<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  shift: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <div v-if="shift">
        <header class="modal-header">
          <h2>{{ shift.role }} at {{ shift.business }}</h2>
          <button class="close-btn" @click="$emit('close')">&times;</button>
        </header>
        
        <div class="modal-body">
          <div class="info-row">
            <span class="info-label">Date:</span>
            <span>{{ shift.date }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Time:</span>
            <span>{{ shift.startTime }} - {{ shift.endTime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Pay:</span>
            <span class="pay-amount">{{ shift.pay }}</span>
          </div>
          
          <div class="details-section" v-if="shift.tasks && shift.tasks.length">
            <h3>Tasks</h3>
            <ul>
              <li v-for="(task, index) in shift.tasks" :key="index">{{ task }}</li>
            </ul>
          </div>
          
          <div class="details-section" v-if="shift.expectations">
            <h3>Expectations</h3>
            <p>{{ shift.expectations }}</p>
          </div>
          
          <div class="details-section" v-if="shift.requirements && shift.requirements.length">
            <h3>Requirements</h3>
            <ul>
              <li v-for="(req, index) in shift.requirements" :key="index">{{ req }}</li>
            </ul>
          </div>
        </div>
        
        <footer class="modal-footer">
          <BaseButton variant="secondary" outline @click="$emit('close')">Close</BaseButton>
          <slot name="action"></slot>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
}
.close-btn:hover {
  color: #0f172a;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.info-label {
  font-weight: 600;
  color: #64748b;
}

.pay-amount {
  font-weight: 700;
  color: #166534;
}

.details-section {
  margin-top: 1.5rem;
}

.details-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.25rem;
}

.details-section p, .details-section ul {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  padding-left: 1.2rem;
}

.details-section p {
  padding-left: 0;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
