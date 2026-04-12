<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import StatusBadge from '../../components/shared/StatusBadge.vue'
import WorkerShiftCard from '../../components/shared/WorkerShiftCard.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import { useRouter } from 'vue-router'
import { useScheduleStore } from '../../stores/scheduleStore'
import { useShiftStore } from '../../stores/shiftStore'
import { useUserStore } from '../../stores/userStore'
import { useWorkerStore } from '../../stores/workerStore'
import { useNotificationStore } from '../../stores/notificationStore'
import api from '../../services/api'
import { getCurrentLocation } from '../../services/geolocationService'

const notificationStore = useNotificationStore()
const router = useRouter()
const scheduleStore = useScheduleStore()
const shiftStore = useShiftStore()
const userStore = useUserStore()
const workerStore = useWorkerStore()

const clockingIn = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

onMounted(async () => {
  await Promise.allSettled([
    scheduleStore.fetchMySchedule(),
    shiftStore.fetchMyShifts()
  ])
})

const user = computed(() => ({
  name: userStore.user?.username || 'Worker',
  scheduledShiftsCount: scheduleStore.mySchedule.length
}))

const latestNotification = computed(() => {
  return notificationStore.notifications && notificationStore.notifications.length > 0
    ? notificationStore.notifications[0]
    : null
})

const stats = computed(() => ({
  hours: `${workerStore.workerStats.hours}h`,
  earnings: '—',
  rating: workerStore.workerStats.rating
}))

const nextShift = computed(() => {
  if (scheduleStore.mySchedule.length === 0) return null
  return scheduleStore.mySchedule[0]
})

const handleClockIn = async () => {
  if (!nextShift.value) return
  clockingIn.value = true
  try {
    const location = await getCurrentLocation()
    const payload = { shiftId: nextShift.value.id, type: 'CLOCK_IN' }
    if (location) payload.location = location
    await api.post('/clock', payload)
    modalSuccess.value = true
    modalMessage.value = location
      ? 'You have clocked in successfully! Location recorded.'
      : 'You have clocked in successfully!'
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = e?.response?.data?.message || 'Failed to clock in.'
  } finally {
    clockingIn.value = false
    showModal.value = true
  }
}

const upcomingShifts = computed(() => {
  return scheduleStore.mySchedule.map(s => {
    const d = new Date(s.date)
    return {
      id: s.id,
      month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      day: String(d.getDate()).padStart(2, '0'),
      title: s.role || s.roleName,
      time: s.time || 'TBD',
      location: s.business || 'Location TBD',
      pay: s.pay || 'TBD',
      status: (s.status || 'CONFIRMED').toUpperCase()
    }
  })
})

const pendingApplications = computed(() => {
  return shiftStore.myApplications.map(app => ({
    id: app.id,
    title: app.role || app.roleName,
    company: app.business,
    status: 'UNDER REVIEW',
    statusType: 'info',
    appliedDays: 1,
    pay: app.pay || 'TBD',
    actionText: 'View Details',
    actionType: 'outline'
  }))
})
</script>

<template>
  <WorkerLayout>
    <div class="page">
      <div class="welcome-section">
        <h1>Welcome back, {{ user.name }}</h1>
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
        <div class="next-shift-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div class="next-shift-info">
          <span class="alert-label">NEXT SHIFT</span>
          <h3>{{ nextShift.roleName || nextShift.role || 'Shift' }} — {{ nextShift.date }}</h3>
          <p>{{ nextShift.startTime || nextShift.time }} – {{ nextShift.endTime || 'TBD' }}. Remember to clock in via the app.</p>
        </div>
        <div class="next-shift-actions">
          <button class="btn btn-primary" :disabled="clockingIn" @click="handleClockIn">
            {{ clockingIn ? 'Clocking In...' : 'Clock In' }}
          </button>
        </div>
      </div>

      <div class="dashboard-grid">
        <section class="shifts-section card">
          <div class="section-header">
            <h2>Upcoming Shifts (7 Days)</h2>
            <router-link to="/worker/calendar" class="link">View Calendar</router-link>
          </div>
          
          <div class="shifts-list">
            <p v-if="scheduleStore.loading" style="color:var(--text-muted);font-size:0.9rem;">Loading shifts...</p>
            <p v-else-if="!scheduleStore.loading && upcomingShifts.length === 0" style="color:var(--text-muted);font-size:0.9rem;">No upcoming shifts found.</p>
            <WorkerShiftCard v-else v-for="shift in upcomingShifts" :key="shift.id" :shift="shift" />
          </div>
        </section>

        <section class="applications-section card">
          <div class="section-header">
            <h2>Pending Applications</h2>
            <router-link to="/worker/applications" class="link">View All</router-link>
          </div>
          
          <div class="applications-list">
            <p v-if="shiftStore.loading" style="color:var(--text-muted);font-size:0.9rem;">Loading applications...</p>
            <p v-else-if="!shiftStore.loading && pendingApplications.length === 0" style="color:var(--text-muted);font-size:0.9rem;">No pending applications.</p>
            <div v-for="app in pendingApplications" :key="app.id" class="app-card">
              <h4>{{ app.title }}</h4>
              <p class="company">{{ app.company }}</p>
              <div class="app-meta">
                <div class="meta-left">
                  <StatusBadge :text="app.status" :type="app.statusType" />
                </div>
                <span class="applied-time">Applied {{ app.appliedDays }} days ago</span>
              </div>
              <div class="app-footer">
                <span class="pay-rate">{{ app.pay }}</span>
                <button class="btn btn-sm" :class="app.actionType === 'solid' ? 'btn-primary' : 'btn-outline'">
                  {{ app.actionText }}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ConfirmModal
        v-if="showModal"
        :title="modalSuccess ? 'Success' : 'Error'"
        :message="modalMessage"
        @close="showModal = false"
        @confirm="showModal = false"
      />
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

/* Responsive adjustments */
@media (max-width: 1024px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
}
</style>