<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import StatusBadge from '../../components/shared/StatusBadge.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import { useShiftStore } from '../../stores/shiftStore'
import { useNotificationStore } from '../../stores/notificationStore'
import { format, addDays, subDays } from 'date-fns'

const router = useRouter()
const shiftStore = useShiftStore()
const notificationStore = useNotificationStore()

const selectedDate = ref(new Date())
const formattedDate = computed(() => format(selectedDate.value, 'MMM dd, yyyy'))

const goToday = () => { selectedDate.value = new Date() }
const goPrev = () => { selectedDate.value = subDays(selectedDate.value, 7) }
const goNext = () => { selectedDate.value = addDays(selectedDate.value, 7) }

onMounted(() => {
  shiftStore.fetchManagerShifts().catch(() => {})
  notificationStore.fetchNotifications().catch(() => {})
})

// --- Assign modal state ---
const assigning = ref(false)
const showAssignModal = ref(false)
const assignSuccess = ref(false)
const assignMessage = ref('')

const handleAssign = async (shift) => {
  if (!confirm(`Assign an applicant to "${shift.position}"?`)) return
  assigning.value = true
  try {
    const applicants = await shiftStore.fetchApplicants(shift.id)
    if (applicants && applicants.length > 0) {
      await shiftStore.assignApplicant(shift.id, applicants[0].id)
      assignSuccess.value = true
      assignMessage.value = `Applicant assigned to "${shift.position}" successfully!`
    } else {
      assignSuccess.value = false
      assignMessage.value = 'No applicants found for this shift yet.'
    }
  } catch (e) {
    assignSuccess.value = false
    assignMessage.value = e?.message || 'Failed to assign. Please try again.'
  } finally {
    assigning.value = false
    showAssignModal.value = true
  }
}

// --- Data bound to store with fallback ---

const stats = computed(() => [
  { id: 1, label: 'Total Active Staff', value: shiftStore.shifts.filter(s => s.status === 'ACTIVE').length || '—', badge: 'Active', badgeType: 'success', icon: 'people', iconColor: 'blue' },
  { id: 2, label: 'Open Shifts', value: shiftStore.openShifts.length, badge: 'Urgent', badgeType: 'warning', icon: 'clipboard', iconColor: 'orange' },
  { id: 3, label: 'New Applicants', value: shiftStore.pendingApplicants.length, badge: 'New', badgeType: 'info', icon: 'user-search', iconColor: 'purple' },
  { id: 4, label: 'Total Shifts', value: shiftStore.shifts.length, badge: 'All', badgeType: 'success', icon: 'lightning', iconColor: 'green' }
])

const shiftsNeedingStaff = computed(() => {
  return shiftStore.openShifts.map(s => ({
    id: s.id,
    position: s.role || s.roleName,
    subtitle: s.date,
    location: s.business,
    time: `${s.startTime || '?'} - ${s.endTime || '?'}`,
    status: s.status,
    statusClass: s.status.toLowerCase()
  }))
})

// Wired to store — flattened list of all applicants across open shifts
const newApplicants = computed(() => shiftStore.pendingApplicants)

// Alerts and recent activity are not yet stored server-side.
// These sections will show empty state until a notifications API is wired up.
</script>

<template>
  <ManagerLayout>
        
        <div class="page-title-row">
          <div>
            <h1>Executive Dashboard</h1>
            <p>Real-time oversight for Western Region Operations</p>
          </div>
          <div class="title-actions">
            <button class="btn btn-outline" @click="goPrev">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="btn btn-outline" @click="goToday">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {{ formattedDate }}
            </button>
            <button class="btn btn-outline" @click="goNext">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
            <button class="btn btn-primary" @click="router.push('/manager/shift')">
              + Create Shift
            </button>
          </div>
        </div>

        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.id" class="stat-card">
            <div class="stat-header">
              <div class="stat-icon-wrapper" :class="`bg-${stat.iconColor}`">
                <svg v-if="stat.icon === 'people'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <svg v-if="stat.icon === 'clipboard'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="12" y1="11" x2="12" y2="17"></line><line x1="12" y1="17" x2="12" y2="17"></line></svg>
                <svg v-if="stat.icon === 'user-search'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <svg v-if="stat.icon === 'lightning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <StatusBadge :text="stat.badge" :type="`badge-${stat.badgeType}`" />
            </div>
            <div class="stat-info">
              <span class="stat-label">{{ stat.label }}</span>
              <h3 class="stat-value">{{ stat.value }}</h3>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          
          <div class="grid-left">
            
            <div class="panel">
              <div class="panel-header">
                <div class="panel-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  <h2>Shifts Needing Staff</h2>
                </div>
                <router-link to="/manager/schedule" class="view-all">View all</router-link>
              </div>

              <table class="data-table">
                <thead>
                  <tr>
                    <th>POSITION</th>
                    <th>LOCATION</th>
                    <th>TIME</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="shiftStore.loading">
                    <td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">Loading shifts…</td>
                  </tr>
                  <tr v-else-if="shiftsNeedingStaff.length === 0">
                    <td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">No open shifts found. <router-link to="/manager/shift">Create one →</router-link></td>
                  </tr>
                  <tr v-for="shift in shiftsNeedingStaff" :key="shift.id" v-else>
                    <td>
                      <strong>{{ shift.position }}</strong>
                      <span class="sub-text">{{ shift.subtitle }}</span>
                    </td>
                    <td>{{ shift.location }}</td>
                    <td>{{ shift.time }}</td>
                    <td>
                      <StatusBadge :text="shift.status" :type="shift.statusClass" variant="pill" />
                    </td>
                    <td>
                      <button class="btn btn-action" :disabled="assigning" @click="handleAssign(shift)">Assign</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="panel mt-4">
              <div class="panel-header mb-3">
            <div class="panel-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              <h2>New Applicants</h2>
            </div>
            <button class="view-all" style="background:none;border:none;cursor:pointer;" @click="router.push('/manager/shift')">+ Create Shift</button>
          </div>

              <div class="applicants-grid" v-if="newApplicants.length > 0">
                <div v-for="app in newApplicants" :key="app.id" class="applicant-card">
                  <div class="app-avatar-placeholder">{{ app.name.charAt(0) }}</div>
                  <div class="app-info">
                    <strong>{{ app.name }}</strong>
                    <span>{{ app.role }}</span>
                  </div>
                  <div class="app-actions">
                    <button class="btn-icon btn-reject" @click="shiftStore.rejectApplicant(app.shiftId, app.id)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                    <button class="btn-icon btn-accept" @click="shiftStore.approveApplicant(app.shiftId, app.id)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                  </div>
                </div>
              </div>
              <p v-else style="color:var(--text-muted);font-size:0.9rem;margin:0;">No pending applicants right now.</p>
            </div>

          </div>

          <div class="grid-right">
            
            <div class="alerts-section">
              <div class="panel-title mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <h2>Urgent Alerts</h2>
              </div>
              
              <div class="alerts-list">
                <p style="color:var(--text-muted);font-size:0.9rem;margin:0;">No urgent alerts at this time.</p>
              </div>
            </div>

            <div class="activity-section mt-4">
              <h2>Recent Activity</h2>

              <div v-if="notificationStore.notifications.length > 0" class="timeline">
                <div v-for="n in notificationStore.notifications.slice(0, 5)" :key="n.id" class="timeline-item">
                  <div class="timeline-icon bg-info">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  </div>
                  <div class="timeline-content">
                    <p>{{ n.message }}</p>
                    <span class="time">{{ new Date(n.createdAt).toLocaleString() }}</span>
                  </div>
                </div>
              </div>
              <p v-else style="color:var(--text-muted);font-size:0.9rem;margin:0 0 1rem 0;">No recent activity to display.</p>
            </div>

          </div>
        </div>

  </ManagerLayout>

  <ConfirmModal
    :is-open="showAssignModal"
    :title="assignSuccess ? 'Assigned!' : 'Notice'"
    :message="assignMessage"
    :type="assignSuccess ? 'success' : 'danger'"
    @close="showAssignModal = false"
  />

</template>

<style scoped>

.page-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.page-title-row h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.page-title-row p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.title-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-primary { background-color: var(--primary); color: #FFFFFF; }
.btn-primary:hover { background-color: var(--primary-hover); }

.btn-outline { background-color: #FFFFFF; border-color: var(--border); color: var(--text-dark); }
.btn-outline:hover { background-color: #F9FAFB; }

.btn-block { width: 100%; justify-content: center; }

/* --- Stats Grid --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-blue { background-color: #EFF6FF; color: #2563EB; }
.bg-orange { background-color: #FFF7ED; color: #EA580C; }
.bg-purple { background-color: #F5F3FF; color: #7C3AED; }
.bg-green { background-color: #DCFCE3; color: #16A34A; }

.stat-icon-wrapper svg { stroke-width: 2.5px; }

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
}

/* --- Dashboard Grid Layout --- */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.panel {
  background-color: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  padding: 1.5rem;
}

.mt-4 { margin-top: 1.5rem; }
.mb-3 { margin-bottom: 1.25rem; }

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.panel-title h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.view-all {
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}
.view-all:hover { text-decoration: underline; }

/* --- Table --- */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  font-size: 0.75rem;
  color: #9CA3AF;
  font-weight: 700;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
  letter-spacing: 0.05em;
}

.data-table td {
  padding: 1rem 0;
  border-bottom: 1px solid #F3F4F6;
  font-size: 0.9rem;
  color: var(--text-dark);
}

.data-table tr:last-child td { border-bottom: none; padding-bottom: 0; }

.data-table td strong { display: block; font-weight: 600; margin-bottom: 0.25rem; }
.sub-text { font-size: 0.8rem; color: var(--text-muted); }

.btn-action {
  background-color: #EFF6FF;
  color: #2563EB;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-action:hover { background-color: #DBEAFE; }

/* --- Applicants Grid --- */
.applicants-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.applicant-card {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  gap: 1rem;
}

.app-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.app-info { flex-grow: 1; }
.app-info strong { display: block; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem;}
.app-info span { font-size: 0.8rem; color: var(--text-muted); }

.app-actions {
  display: flex;
  gap: 0.4rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-reject { color: #9CA3AF; }
.btn-reject:hover { background: #F3F4F6; color: #EF4444; }

.btn-accept { background: var(--primary); border-color: var(--primary); color: white; }
.btn-accept:hover { background: var(--primary-hover); }

/* --- Alerts Section --- */
.alerts-section h2, .activity-section h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-danger { background-color: var(--red-bg); border-left-color: var(--red-border); color: var(--red-text); }
.alert-warning { background-color: var(--orange-bg); border-left-color: var(--orange-border); color: var(--orange-text); }
.alert-info { background-color: var(--blue-bg); border-left-color: var(--blue-border); color: var(--blue-text); }

.alert-icon { margin-top: 2px; }

.alert-content strong { display: block; font-size: 0.95rem; margin-bottom: 0.25rem; }
.alert-content p { margin: 0; font-size: 0.85rem; line-height: 1.4; opacity: 0.9; }

/* --- Activity Timeline --- */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
}

/* Vertical Line */
.timeline::before {
  content: '';
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 15px;
  width: 2px;
  background-color: var(--border);
  z-index: 1;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.timeline-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: white; /* to cover the line */
  border: 2px solid white;
}

.timeline-icon.bg-success { background-color: var(--green-bg); color: var(--green-border); }
.timeline-icon.bg-info { background-color: var(--blue-bg); color: var(--blue-border); }
.timeline-icon.bg-warning { background-color: var(--orange-bg); color: var(--orange-border); }

.timeline-content { padding-top: 0.25rem; }
.timeline-content strong { display: block; font-size: 0.95rem; margin-bottom: 0.2rem; }
.timeline-content p { margin: 0 0 0.25rem 0; font-size: 0.85rem; color: var(--text-dark); }
.timeline-content .time { font-size: 0.75rem; color: #9CA3AF; }

/* --- Responsive Adjustments --- */
@media (max-width: 1200px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .applicants-grid { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr; }
  .page-title-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
}

/* --- Modal --- */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff; border-radius: 16px; padding: 2rem;
  max-width: 380px; width: 90%; text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-icon {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.25rem;
}
.success-icon { background: #DCFCE3; color: #16A34A; }
.error-icon { background: #FEE2E2; color: #DC2626; }
.modal-box h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; }
.modal-box p { color: #6B7280; font-size: 0.95rem; margin: 0 0 1.5rem; }
.modal-close-btn { width: 100%; }
</style>