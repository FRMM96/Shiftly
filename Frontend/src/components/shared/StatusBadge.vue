<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  type: { type: String, default: '' }, // success, warning, info, confirm, tentative, critical, pending, open
  variant: { type: String, default: 'badge' } // 'badge' or 'pill'
})

const badgeClass = computed(() => {
  if (props.variant === 'pill') {
    return `status-pill ${props.type}`
  }
  return `badge ${props.type}`
})
</script>

<template>
  <span :class="badgeClass">{{ text }}</span>
</template>

<style scoped>
/* --- Pill Variant (Manager) --- */
.status-pill {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-block;
  white-space: nowrap;
}
.status-pill.critical { background-color: #FEF2F2; color: #991B1B; border: 1px solid #EF4444; }
.status-pill.pending { background-color: #FFF7ED; color: #9A3412; border: 1px solid #F59E0B; }
.status-pill.open { background-color: #EFF6FF; color: #1E40AF; border: 1px solid #3B82F6; }

/* --- Badge Variant --- */
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: inline-block;
  white-space: nowrap;
}

/* Worker Statuses */
.badge.confirmed, .badge.success { background-color: #dcfce3; color: #16a34a; }
.badge.tentative { background-color: #f1f5f9; color: #64748b; }
.badge.info { background-color: #e0e7ff; color: #4f46e5; text-transform: none; letter-spacing: normal;}
.badge.warning { background-color: #fef3c7; color: #d97706; text-transform: none; letter-spacing: normal;}

/* Manager Stat Badges */
.badge.badge-success { background-color: #DCFCE3; color: #166534; text-transform: none; letter-spacing: normal; }
.badge.badge-warning { background-color: #FFF7ED; color: #9A3412; text-transform: none; letter-spacing: normal; }
.badge.badge-info { background-color: #EFF6FF; color: #1E40AF; text-transform: none; letter-spacing: normal; }
</style>