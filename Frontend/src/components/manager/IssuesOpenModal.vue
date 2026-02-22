<script setup>
import { computed } from 'vue'
import BaseButton from '../shared/BaseButton.vue'
import ShiftCard from '../shared/ShiftCard.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  shifts: { type: Array, default: () => [] },
  openShifts: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'resolveSick', 'deleteShift'])

const router = useRouter()

const sickShifts = computed(() => {
  return props.shifts.filter(s => s.status === 'sick')
})

const handleResolveSick = (id) => {
  emit('resolveSick', id)
}

const handleDeleteShift = (id) => {
  emit('deleteShift', id)
}

const handleEditShift = (id) => {
  router.push(`/manager/shift/${id}`)
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">
      <header class="modal-header">
        <div>
          <h2 class="modal-title">Issues & Open Shifts</h2>
          <p class="modal-subtitle">Manage sick leaves and marketplace posts</p>
        </div>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>

      <div class="modal-content">
        <div v-if="sickShifts.length === 0 && openShifts.length === 0" class="empty-state">
          No current issues or open shifts.
        </div>

        <!-- Sick Shifts Section -->
        <section v-if="sickShifts.length > 0" class="section-area">
          <h3 class="section-title text-danger">⚠️ Requires Attention</h3>
          <div class="issues-list">
            <ShiftCard
              v-for="shift in sickShifts"
              :key="shift.id"
              :shift="shift"
            >
              <template #actions>
                <BaseButton
                  variant="danger"
                  size="sm"
                  @click="handleResolveSick(shift.id)"
                >
                  Find Replacement
                </BaseButton>
              </template>
            </ShiftCard>
          </div>
        </section>

        <!-- Open Shifts Section -->
        <section v-if="openShifts.length > 0" class="section-area">
          <div class="section-header">
            <h3 class="section-title">🚀 Live on Marketplace</h3>
            <span class="badge-count">{{ openShifts.length }} active</span>
          </div>
          <div class="issues-list">
            <ShiftCard
              v-for="shift in openShifts"
              :key="shift.id"
              :shift="shift"
            >
              <template #actions>
                <div class="marketplace-actions-container">
                  <div class="shift-extra-details">
                    <div class="detail-item"><strong>Date:</strong> {{ shift.date }}</div>
                    <div class="detail-item"><strong>Role:</strong> {{ shift.role }}</div>
                    <div class="detail-item"><strong>Time:</strong> {{ shift.startTime ? `${shift.startTime} - ${shift.endTime}` : shift.time }}</div>
                    <div class="detail-item"><strong>Pay:</strong> {{ shift.pay || "N/A" }}</div>
                  </div>
                  <div class="action-row">
                    <span class="applicant-count">{{ shift.applicants ? shift.applicants.length : 0 }} Applicants</span>
                    <BaseButton variant="secondary" size="sm" @click="handleEditShift(shift.id)">Edit Shift</BaseButton>
                    <BaseButton variant="danger" size="sm" @click="handleDeleteShift(shift.id)">Cancel Shift</BaseButton>
                  </div>
                </div>
              </template>
            </ShiftCard>
          </div>
        </section>
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
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
  font-style: italic;
}

.section-area {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;
}

.text-danger {
  color: #ef4444;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.badge-count {
  background: #f1f5f9;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.marketplace-actions-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.shift-extra-details {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 12px;
    background: #f8fafc;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
}

.detail-item {
    font-size: 0.85rem;
    color: #475569;
}

.detail-item strong {
    color: #0f172a;
    font-weight: 600;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.applicant-count {
  font-size: 0.85rem;
  color: #64748b;
  margin-right: auto;
  font-style: italic;
}
</style>
