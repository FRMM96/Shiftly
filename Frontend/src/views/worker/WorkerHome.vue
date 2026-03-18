<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import { useScheduleStore } from '../../stores/scheduleStore'
import { useShiftStore } from '../../stores/shiftStore'
import { useUserStore } from '../../stores/userStore'
import { useNotificationStore } from '../../stores/notificationStore'

const notificationStore = useNotificationStore()
const router = useRouter()
const scheduleStore = useScheduleStore()
const shiftStore = useShiftStore()
const userStore = useUserStore()

onMounted(async () => {
  await Promise.allSettled([
    scheduleStore.fetchMySchedule(),
    shiftStore.fetchMyApplications(),
    notificationStore.fetchMyNotifications()
  ])
})

const user = computed(() => userStore.user || {})

const upcomingShifts = computed(() => {
  return scheduleStore.mySchedule.slice(0, 5)
})

const nextShift = computed(() => upcomingShifts.value[0] || null)

const applicationItems = computed(() => shiftStore.applications.slice(0, 5))
const latestNotification = computed(() => notificationStore.notifications[0] || null)

</script>

<template>
  <WorkerLayout>
    <div class="page">
      <div class="welcome-section">
        <h1>Welcome back, {{ user.username || 'Worker' }}</h1>
        <p>You have {{ upcomingShifts.length }} scheduled shifts.</p>
      </div>

      <div
        v-if="latestNotification && !latestNotification.isRead"
        class="notif-banner"
      >
        <strong>{{ latestNotification.title }}</strong>
        <p>{{ latestNotification.message }}</p>
      </div>

      <div v-if="nextShift" class="next-shift-card">
        <div>
          <div class="small-label">NEXT SHIFT</div>
          <h3>{{ nextShift.role }}</h3>
          <p>{{ nextShift.date }} • {{ nextShift.time }}</p>
          <p>{{ nextShift.business }}</p>
        </div>
        <button class="btn btn-secondary" @click="router.push('/worker/calendar')">View Calendar</button>
      </div>

      <div class="dashboard-grid">
        <section class="card">
          <div class="section-header">
            <h2>Upcoming Shifts</h2>
            <router-link to="/worker/calendar">View Calendar</router-link>
          </div>

          <div v-if="scheduleStore.loading">Loading shifts…</div>
          <div v-else-if="scheduleStore.error">{{ scheduleStore.error }}</div>
          <div v-else-if="upcomingShifts.length === 0">No shifts assigned yet.</div>

          <div v-else class="list">
            <div v-for="shift in upcomingShifts" :key="shift.id" class="list-item">
              <div>
                <strong>{{ shift.role }}</strong>
                <div>{{ shift.date }} • {{ shift.time }}</div>
                <div>{{ shift.business }}</div>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="section-header">
            <h2>My Applications</h2>
            <router-link to="/worker/applications">View All</router-link>
          </div>

          <div v-if="applicationItems.length === 0">No applications yet.</div>

          <div v-else class="list">
            <div v-for="app in applicationItems" :key="app.id" class="list-item">
              <div>
                <strong>{{ app.shift?.roleName || app.shift?.role || 'Shift' }}</strong>
                <div>{{ app.shift?.business }}</div>
                <div>Status: {{ app.status }}</div>
              </div>
            </div>
          </div>

          <button class="btn btn-primary full" @click="router.push('/worker/marketplace')">
            Browse open shifts
          </button>
        </section>
      </div>
    </div>
  </WorkerLayout>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1.5rem; }
.welcome-section h1 { margin: 0 0 0.25rem; font-size: 2rem; font-weight: 800; }
.welcome-section p { margin: 0; color: #64748b; }

.next-shift-card, .card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem;
}

.next-shift-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.small-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.35rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.25rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  background: #0f172a;
  color: #fff;
}

.btn-secondary {
  background: #f1f5f9;
  color: #0f172a;
}

.full {
  width: 100%;
  margin-top: 1rem;
}

@media (max-width: 900px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .next-shift-card { flex-direction: column; align-items: flex-start; }
}

.notif-banner {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  border-radius: 12px;
  padding: 1rem;
}
.notif-banner p {
  margin: 0.35rem 0 0;
}
</style>