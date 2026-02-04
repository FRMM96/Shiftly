<script setup>
import { defineProps, defineEmits } from 'vue'
import { format } from 'date-fns'
import BaseButton from '../shared/BaseButton.vue'
import ShiftCard from '../shared/ShiftCard.vue'

const props = defineProps(['isOpen', 'date', 'shifts'])
const emit = defineEmits(['close', 'requestTimeOff'])

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

      <div class="shift-list">
        <!-- List Shifts or Requests -->
        <div v-if="shifts.length > 0">
            <ShiftCard v-for="shift in shifts" :key="shift.id" :shift="shift" class="mb-3">
                 <!-- Actions could go here, e.g. "Call in Sick" -->
            </ShiftCard>
        </div>

        <div v-else class="empty-state">
          No shifts scheduled for this day.
        </div>
      </div>

      <div class="actions-section">
          <!-- Worker Action: Request Time Off -->
           <BaseButton variant="secondary" block @click="$emit('requestTimeOff', date)">
              Request Time Off
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
</style>
