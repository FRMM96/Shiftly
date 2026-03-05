<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import StatusBadge from '../../components/shared/StatusBadge.vue'
import { useShiftStore } from '../../stores/shiftStore'

const router = useRouter()
const shiftStore = useShiftStore()

onMounted(() => {
  shiftStore.fetchManagerShifts().catch(() => {})
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
const currentUser = ref({
  name: 'Alex Thompson',
  role: 'REGIONAL ADMIN',
  avatar: 'https://i.pravatar.cc/150?u=alex_thompson'
})

const stats = ref([
  { id: 1, label: 'Total Active Staff', value: '1,248', badge: '+12%', badgeType: 'success', icon: 'people', iconColor: 'blue' },
  { id: 2, label: 'Open Shifts', value: '18', badge: 'Urgent', badgeType: 'warning', icon: 'clipboard', iconColor: 'orange' },
  { id: 3, label: 'New Applicants', value: '34', badge: 'New', badgeType: 'info', icon: 'user-search', iconColor: 'purple' },
  { id: 4, label: 'Fill Rate', value: '94%', badge: '98.2%', badgeType: 'success', icon: 'lightning', iconColor: 'green' }
])

const shiftsNeedingStaff = computed(() => {
  if (shiftStore.openShifts.length > 0) {
    return shiftStore.openShifts.map(s => ({
      id: s.id,
      position: s.role || s.roleName,
      subtitle: s.date,
      location: s.business,
      time: `${s.startTime || '?'} - ${s.endTime || '?'}`,
      status: s.status,
      statusClass: s.status.toLowerCase()
    }))
  }
  return [
    { id: 1, position: 'Lead Nurse (ICU)', subtitle: 'Night Shift', location: 'St. Mary\'s General', time: 'Tonight, 22:00', status: 'CRITICAL', statusClass: 'critical' },
    { id: 2, position: 'Security Supervisor', subtitle: 'Event Coverage', location: 'Downtown Plaza', time: 'Tomorrow, 08:00', status: 'PENDING', statusClass: 'pending' },
    { id: 3, position: 'Site Manager', subtitle: 'Project Alpha', location: 'Silicon Harbor', time: 'Aug 26, 09:00', status: 'OPEN', statusClass: 'open' }
  ]
})

const newApplicants = ref([
  { id: 1, name: 'Sarah Jenkins', role: 'Registered Nurse', exp: '5y Exp', avatar: 'https://i.pravatar.cc/150?u=sarah_j' },
  { id: 2, name: 'Michael Chen', role: 'Security Expert', exp: '8y Exp', avatar: 'https://i.pravatar.cc/150?u=michael_c' },
  { id: 3, name: 'Elena Rodriguez', role: 'Operations Lead', exp: '12y Exp', avatar: 'https://i.pravatar.cc/150?u=elena_r' },
  { id: 4, name: 'David Park', role: 'Logistics Manager', exp: '4y Exp', avatar: 'https://i.pravatar.cc/150?u=david_p' }
])

const alerts = ref([
  { id: 1, type: 'danger', icon: 'ambulance', title: 'Staff Absence', text: 'James Wilson (Site A) called out. Replacement needed within 2 hours.' },
  { id: 2, type: 'warning', icon: 'clock', title: 'Compliance Warning', text: '14 staff certifications expiring in 30 days. Renewal required.' },
  { id: 3, type: 'info', icon: 'megaphone', title: 'System Update', text: 'Mobile app version 4.2 scheduled for deployment tonight 00:00.' }
])

const activities = ref([
  { id: 1, type: 'success', title: 'Shift Filled', text: 'Marcus Wright accepted ICU Morning Shift', time: '10 minutes ago' },
  { id: 2, type: 'info', title: 'New Application', text: 'Elena Rodriguez applied for Ops Lead', time: '45 minutes ago' },
  { id: 3, type: 'warning', title: 'Schedule Updated', text: 'Shift #1092 changed from 8hr to 12hr', time: '2 hours ago' }
])
</script>

<template>
  <ManagerLayout>
        
        <div class="page-title-row">
          <div>
            <h1>Executive Dashboard</h1>
            <p>Real-time oversight for Western Region Operations</p>
          </div>
          <div class="title-actions">
            <button class="btn btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Aug 24, 2024
            </button>
            <button class="btn btn-primary">
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
                <a href="#" class="view-all" @click.prevent="router.push('/manager/schedule')">View all</a>
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
                  <tr v-for="shift in shiftsNeedingStaff" :key="shift.id">
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

              <div class="applicants-grid">
                <div v-for="app in newApplicants" :key="app.id" class="applicant-card">
                  <img :src="app.avatar" :alt="app.name" class="app-avatar" />
                  <div class="app-info">
                    <strong>{{ app.name }}</strong>
                    <span>{{ app.role }} • {{ app.exp }}</span>
                  </div>
                  <div class="app-actions">
                    <button class="btn-icon btn-reject"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                    <button class="btn-icon btn-accept"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="grid-right">
            
            <div class="alerts-section">
              <div class="panel-title mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <h2>Urgent Alerts</h2>
              </div>
              
              <div class="alerts-list">
                <div v-for="alert in alerts" :key="alert.id" class="alert-card" :class="`alert-${alert.type}`">
                  <div class="alert-icon">
                    <svg v-if="alert.icon === 'ambulance'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="6" width="16" height="12" rx="2"></rect><circle cx="8" cy="18" r="2"></circle><circle cx="16" cy="18" r="2"></circle><line x1="12" y1="10" x2="12" y2="14"></line><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                    <svg v-if="alert.icon === 'clock'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <svg v-if="alert.icon === 'megaphone'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  </div>
                  <div class="alert-content">
                    <strong>{{ alert.title }}</strong>
                    <p>{{ alert.text }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="activity-section mt-4">
              <h2>Recent Activity</h2>
              
              <div class="timeline">
                <div v-for="item in activities" :key="item.id" class="timeline-item">
                  <div class="timeline-icon" :class="`bg-${item.type}`">
                    <svg v-if="item.type === 'success'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <svg v-if="item.type === 'info'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <svg v-if="item.type === 'warning'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </div>
                  <div class="timeline-content">
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.text }}</p>
                    <span class="time">{{ item.time }}</span>
                  </div>
                </div>
              </div>

              <button class="btn btn-outline btn-block">Load More Activity</button>
            </div>

          </div>
        </div>

  </ManagerLayout>

  <!-- Assign Result Modal -->
  <Teleport to="body">
    <div v-if="showAssignModal" class="modal-overlay" @click.self="showAssignModal = false">
      <div class="modal-box">
        <div :class="assignSuccess ? 'modal-success' : 'modal-error'">
          <div class="modal-icon" :class="assignSuccess ? 'success-icon' : 'error-icon'">
            <svg v-if="assignSuccess" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h3>{{ assignSuccess ? 'Assigned!' : 'Notice' }}</h3>
          <p>{{ assignMessage }}</p>
        </div>
        <button class="btn btn-primary modal-close-btn" @click="showAssignModal = false">Got it</button>
      </div>
    </div>
  </Teleport>

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