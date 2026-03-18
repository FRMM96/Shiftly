<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import CalendarGrid from '../../components/worker/WorkerCalendar.vue'
import { apiFetch } from '../../lib/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')
const worker = ref(null)
const schedule = ref([])
const selected = ref([])

onMounted(async () => {
  try {
    const res = await apiFetch(`/api/users/${route.params.id}`)
    worker.value = res.user
    schedule.value = (res.shifts || []).map(s => ({
      id: s.id,
      date: new Date(s.date).toISOString().slice(0, 10),
      role: s.roleName,
      business: s.business,
      time: `${s.startTime} - ${s.endTime}`,
      status: 'active'
    }))
  } catch (e) {
    error.value = e.message || 'Failed to load worker'
  } finally {
    loading.value = false
  }
})

function handleDateClick({ dateObj }) {
  const key = new Date(dateObj).toISOString().slice(0, 10)
  selected.value = schedule.value.filter(s => s.date === key)
}

function createShiftForDate(dateObj) {
  const key = new Date(dateObj).toISOString().slice(0, 10)
  router.push(`/manager/shift?workerId=${route.params.id}&date=${key}`)
}
</script>

<template>
  <ManagerLayout>
    <div v-if="loading">Loading…</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else class="page">
      <div class="header">
        <div>
          <h1>{{ worker.username }}</h1>
          <p>{{ worker.email }}</p>
        </div>
      </div>

      <CalendarGrid :schedule="schedule" @dateClick="handleDateClick" />

      <div class="panel">
        <h2>Selected date shifts</h2>
        <div v-if="selected.length === 0">No shifts on this date.</div>
        <div v-else class="list">
          <div v-for="shift in selected" :key="shift.id" class="item">
            <strong>{{ shift.role }}</strong>
            <div>{{ shift.time }}</div>
            <div>{{ shift.business }}</div>
          </div>
        </div>
      </div>

      <div class="panel">
        <h2>Create a shift for this worker</h2>
        <button @click="createShiftForDate(new Date())">Create shift for today</button>
        <p class="help">Click a date in the calendar, then use the URL query date or update this button later for your preferred flow.</p>
      </div>
    </div>
  </ManagerLayout>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1.25rem; }
.header h1 { margin: 0 0 0.25rem; font-size: 2rem; font-weight: 800; }
.header p { margin: 0; color: #64748b; }
.panel {
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
button {
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  background: #0f172a;
  color: #fff;
  cursor: pointer;
}
.help { color: #64748b; margin-top: 0.75rem; }
</style>