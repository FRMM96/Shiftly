<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import CalendarGrid from '../../components/worker/WorkerCalendar.vue'
import { useScheduleStore } from '../../stores/scheduleStore'

const scheduleStore = useScheduleStore()
const selected = ref(null)

onMounted(async () => {
  await scheduleStore.fetchMySchedule().catch(() => {})
})

function handleDateClick({ dateObj }) {
  const key = new Date(dateObj).toISOString().slice(0, 10)
  selected.value = scheduleStore.mySchedule.filter(s => s.date === key)
}

const selectedDateLabel = computed(() => {
  if (!selected.value || selected.value.length === 0) return 'No shift selected'
  return selected.value[0].date
})
</script>

<template>
  <WorkerLayout>
    <div class="page">
      <h1>My Schedule</h1>

      <div v-if="scheduleStore.loading">Loading schedule…</div>
      <div v-else-if="scheduleStore.error">{{ scheduleStore.error }}</div>
      <div v-else>
        <CalendarGrid :schedule="scheduleStore.mySchedule" @dateClick="handleDateClick" />

        <div class="details-card">
          <h2>Selected date</h2>
          <p>{{ selectedDateLabel }}</p>

          <div v-if="selected && selected.length > 0" class="list">
            <div v-for="shift in selected" :key="shift.id" class="item">
              <strong>{{ shift.role }}</strong>
              <div>{{ shift.time }}</div>
              <div>{{ shift.business }}</div>
            </div>
          </div>

          <div v-else>No shifts on this date.</div>
        </div>
      </div>
    </div>
  </WorkerLayout>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1.5rem; }
h1 { margin: 0; font-size: 2rem; font-weight: 800; }
.details-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem;
}
.list { display: flex; flex-direction: column; gap: 0.75rem; }
.item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}
</style>