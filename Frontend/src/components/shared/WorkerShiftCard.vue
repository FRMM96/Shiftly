<script setup>
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  shift: { type: Object, required: true }
})
</script>

<template>
  <div class="shift-item">
    <div class="shift-date">
      <span class="month">{{ shift.month }}</span>
      <span class="day">{{ shift.day }}</span>
    </div>
    <div class="shift-details">
      <h4>{{ shift.title }}</h4>
      <div class="shift-meta">
        <span class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          {{ shift.time }}
        </span>
        <span class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {{ shift.location }}
        </span>
      </div>
    </div>
    <div class="shift-right">
      <span class="pay-rate">{{ shift.pay }}</span>
      <StatusBadge :text="shift.status" :type="shift.status.toLowerCase()" />
    </div>
  </div>
</template>

<style scoped>
/* --- Upcoming Shifts List --- */
.shift-item {
  display: flex;
  align-items: center;
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 12px;
  padding: 1.25rem;
  gap: 1.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.shift-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.shift-date {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem 0.5rem;
  min-width: 65px;
  text-align: center;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}

.shift-date .month {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted, #64748b);
  text-transform: uppercase;
}

.shift-date .day {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
}

.shift-details {
  flex-grow: 1;
}

.shift-details h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.shift-meta {
  display: flex;
  gap: 1.25rem;
  color: var(--text-muted, #64748b);
  font-size: 0.85rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.shift-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.pay-rate {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-main, #0f172a);
}
</style>
