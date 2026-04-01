<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import StatusBadge from '../../components/shared/StatusBadge.vue'
import WorkerShiftCard from '../../components/shared/WorkerShiftCard.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import { useRouter } from 'vue-router'
import { useShiftStore } from '../../stores/shiftStore'
import { useScheduleStore } from '../../stores/scheduleStore'
import { useUserStore } from '../../stores/userStore'
import { useWorkerStore } from '../../stores/workerStore'
import api from '../../services/api'

const router = useRouter()
const shiftStore = useShiftStore()
const scheduleStore = useScheduleStore()
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
    await api.post('/clock', { shiftId: nextShift.value.id, type: 'CLOCK_IN' })
    modalSuccess.value = true
    modalMessage.value = 'You have clocked in successfully!'
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
        <div class="welcome-section">
          <h1>Welcome back, {{ user.name }}</h1>
          <p>You have {{ user.scheduledShiftsCount }} shifts scheduled for this week.</p>
        </div>

        <div class="next-shift-card">
          <div class="next-shift-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="next-shift-info">
            <span class="alert-label">NEXT SHIFT</span>
            <h3 v-if="nextShift">{{ nextShift.roleName || nextShift.role || 'Shift' }} — {{ nextShift.date }}</h3>
            <h3 v-else>No upcoming shifts</h3>
            <p v-if="nextShift">{{ nextShift.startTime }} – {{ nextShift.endTime }}. Remember to clock in via the app.</p>
            <p v-else>Check the marketplace for available shifts.</p>
          </div>
          <div class="next-shift-actions">
            <button class="btn btn-primary" :disabled="clockingIn" @click="handleClockIn">
              {{ clockingIn ? 'Clocking In...' : 'Clock In' }}
            </button>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-label">TOTAL HOURS (MTD)</span>
            <span class="stat-value">{{ stats.hours }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">ESTIMATED EARNINGS</span>
            <span class="stat-value">{{ stats.earnings }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">RATING</span>
            <span class="stat-value">{{ stats.rating }} <span class="star">★</span></span>
          </div>
        </div>

        <div class="dashboard-grid">
          
          <section class="shifts-section">
            <div class="section-header">
              <h2>Upcoming Shifts (7 Days)</h2>
              <router-link to="/worker/calendar" class="link">View Calendar</router-link>
            </div>
            
            <div class="shifts-list">
              <p v-if="!scheduleStore.loading && upcomingShifts.length === 0" style="color:var(--text-muted);font-size:0.9rem;">No upcoming shifts found.</p>
              <WorkerShiftCard v-for="shift in upcomingShifts" :key="shift.id" :shift="shift" />
            </div>
          </section>

          <section class="applications-section">
            <div class="section-header">
              <h2>Pending Applications</h2>
            </div>
            
            <div class="applications-list">
              <p v-if="!shiftStore.loading && pendingApplications.length === 0" style="color:var(--text-muted);font-size:0.9rem;">No pending applications.</p>
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

              <button class="btn btn-outline btn-block browse-btn" @click="router.push('/worker/marketplace')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Browse More Jobs
              </button>
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
  </WorkerLayout>
</template>

<style scoped>

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-section h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  color: var(--text-main);
}

.welcome-section p {
  color: var(--text-muted);
  font-size: 1.05rem;
  margin: 0;
}

/* --- Next Shift Alert Card --- */
.next-shift-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
}

.next-shift-icon {
  background-color: #fef3c7;
  color: #d97706;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.next-shift-info {
  flex-grow: 1;
}

.alert-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #d97706;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.35rem;
}

.next-shift-info h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.35rem 0;
}

.next-shift-info p {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}

.next-shift-actions {
  display: flex;
  gap: 0.75rem;
}

/* --- Buttons --- */
.btn {
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.btn-block {
  width: 100%;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}
.btn-primary:hover { background-color: var(--primary-hover); }

.btn-secondary {
  background-color: #f1f5f9;
  color: var(--text-main);
  border-color: #e2e8f0;
}
.btn-secondary:hover { background-color: #e2e8f0; }

.btn-outline {
  background-color: transparent;
  border-color: var(--primary);
  color: var(--primary);
}
.btn-outline:hover { background-color: #eff6ff; }

/* --- Stats Row --- */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star {
  color: #fbbf24;
  font-size: 1.25rem;
}

/* --- Dashboard Grid (Lists) --- */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 340px; /* Left takes remaining space, right is fixed */
  gap: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

/* --- Upcoming Shifts List --- */
.shifts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* --- Applications List --- */
.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.app-card h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.company {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 1rem 0;
}

.app-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
}

.applied-time {
  font-size: 0.8rem;
  color: #94a3b8;
  white-space: nowrap;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border);
  padding-top: 1rem;
}

.browse-btn {
  margin-top: 0.5rem;
  color: var(--text-muted);
  border-style: dashed;
  border-color: #cbd5e1;
}
.browse-btn:hover {
  background-color: #f8fafc;
  color: var(--text-main);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
}
</style>