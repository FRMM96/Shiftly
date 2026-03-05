<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import { useShiftStore } from '../../stores/shiftStore'

const router = useRouter()
const shiftStore = useShiftStore()

// --- State ---
const assigning = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

onMounted(() => {
  shiftStore.fetchManagerShifts().catch(() => {})
})

const currentUser = ref({
  name: 'Alex Thompson',
  role: 'REGIONAL ADMIN',
  avatar: 'https://i.pravatar.cc/150?u=alex_thompson'
})

// Bind to store with fallback to mock data
const shiftsRequiringAttention = computed(() => {
  if (shiftStore.openShifts.length > 0) {
    return shiftStore.openShifts.map((s, index) => ({
      id: s.id,
      title: `${s.role || s.roleName} - ${s.business}`,
      location: s.business,
      date: `${s.date}, ${s.startTime || '?'} - ${s.endTime || '?'}`,
      urgency: index === 0 ? 'High Urgency' : null,
      applicantCount: Array.isArray(s.applications) ? s.applications.length : 0,
      iconColor: index % 2 === 0 ? 'blue' : 'green',
      applicants: Array.isArray(s.applications) ? s.applications.map(app => ({
        id: app.id,
        name: app.userName || app.username || 'Applicant',
        rating: app.rating || '4.5',
        role: s.role || s.roleName,
        time: app.appliedAt ? `Applied ${app.appliedAt}` : 'Applied recently',
        avatar: app.avatar || `https://i.pravatar.cc/150?u=${app.id}`
      })) : []
    }))
  }

  // Fallback mock data
  return [
    {
      id: 1,
      title: 'Morning Shift - ICU Nursing',
      location: 'Radix General Hospital',
      date: 'Oct 24, 07:00 - 15:00',
      urgency: 'High Urgency',
      applicantCount: 5,
      iconColor: 'blue',
      applicants: [
        { id: 101, name: 'Dr. Sarah Jenkins', rating: '4.9', role: 'RN Specialist', time: 'Applied 2h ago', avatar: 'https://i.pravatar.cc/150?u=sarah_j_doc' },
        { id: 102, name: 'Emily Chen', rating: '4.7', role: 'General Nursing', time: 'Applied 5h ago', avatar: 'https://i.pravatar.cc/150?u=emily_chen' }
      ]
    },
    {
      id: 2,
      title: 'Night Shift - Emergency Room',
      location: 'City Clinic West',
      date: 'Oct 25, 22:00 - 06:00',
      urgency: null,
      applicantCount: 3,
      iconColor: 'green',
      applicants: [
        { id: 103, name: 'Marcus Thorne', rating: '5.0', role: 'ER Specialist', time: 'Applied yesterday', avatar: 'https://i.pravatar.cc/150?u=marcus_thorne' }
      ]
    }
  ]
})

const handleApprove = async (shift, applicant) => {
  if (!confirm(`Are you sure you want to approve ${applicant.name} for this shift?`)) return
  assigning.value = true
  try {
    await shiftStore.assignApplicant(shift.id, applicant.id)
    modalSuccess.value = true
    modalMessage.value = `${applicant.name} has been approved and assigned!`
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = e?.message || 'Failed to approve applicant. Please try again.'
  } finally {
    assigning.value = false
    showModal.value = true
  }
}

const closeModal = () => {
  showModal.value = false
}

const handleViewProfile = (applicantId) => {
  router.push(`/manager/applicants/${applicantId}`)
}
</script>

<template>
  <ManagerLayout>
        
        <div class="page-header">
          <h1>Applicant Review</h1>
          <p>Review and approve healthcare professionals for open shifts.</p>
        </div>

        <div class="tabs-container">
          <button class="tab active">
            Pending <span class="tab-badge">12</span>
          </button>
          <button class="tab">Reviewed</button>
          <button class="tab">Shortlisted</button>
        </div>

        <div class="attention-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0047FF" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <h2>Shifts Requiring Attention</h2>
        </div>

        <div class="shifts-list">
          <div v-for="shift in shiftsRequiringAttention" :key="shift.id" class="shift-group-card">
            
            <div class="shift-header">
              <div class="shift-header-left">
                <div class="shift-icon" :class="`icon-${shift.iconColor}`">
                  <svg v-if="shift.iconColor === 'blue'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  <svg v-if="shift.iconColor === 'green'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line><line x1="7.05" y1="7.05" x2="16.95" y2="16.95"></line><line x1="7.05" y1="16.95" x2="16.95" y2="7.05"></line></svg>
                </div>
                <div class="shift-info">
                  <h3>{{ shift.title }}</h3>
                  <p>{{ shift.location }} <span class="dot">•</span> {{ shift.date }}</p>
                </div>
              </div>
              <div class="shift-header-right">
                <span v-if="shift.urgency" class="urgency-badge">{{ shift.urgency }}</span>
                <span class="applicant-count">{{ shift.applicantCount }} Applicants</span>
              </div>
            </div>

            <div class="applicants-list">
              <div v-for="app in shift.applicants" :key="app.id" class="applicant-row">
                
                <div class="applicant-info">
                  <img :src="app.avatar" :alt="app.name" class="applicant-avatar" />
                  <div class="applicant-details">
                    <h4>{{ app.name }}</h4>
                    <div class="applicant-meta">
                      <span class="rating">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        {{ app.rating }}
                      </span>
                      <span class="dot">•</span>
                      <span>{{ app.role }}</span>
                      <span class="dot">•</span>
                      <span>{{ app.time }}</span>
                    </div>
                  </div>
                </div>

                <div class="applicant-actions">
                  <button class="btn btn-outline" @click="handleViewProfile(app.id)">View Profile</button>
                  <button class="btn btn-primary" :disabled="assigning" @click="handleApprove(shift, app)">{{ assigning ? 'Approving...' : 'Approve' }}</button>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div class="load-more-container">
          <button class="btn-load-more">Load More Shifts</button>
        </div>

  </ManagerLayout>

  <!-- Approve Result Modal -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <div :class="modalSuccess ? 'modal-success' : 'modal-error'">
          <div class="modal-icon" :class="modalSuccess ? 'success-icon' : 'error-icon'">
            <svg v-if="modalSuccess" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h3>{{ modalSuccess ? 'Approved!' : 'Error' }}</h3>
          <p>{{ modalMessage }}</p>
        </div>
        <button class="btn btn-primary modal-close-btn" @click="closeModal">Got it</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.page-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

/* Tabs */
.tabs-container {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid var(--border);
  margin-top: 2rem;
  margin-bottom: 2.5rem;
}

.tab {
  background: none;
  border: none;
  padding: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  bottom: -1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab:hover {
  color: var(--text-dark);
}

.tab.active {
  color: var(--primary);
  font-weight: 600;
  border-bottom: 2px solid var(--primary);
}

.tab-badge {
  background-color: var(--primary);
  color: #FFFFFF;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

/* Section Header */
.attention-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.attention-header h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

/* --- Shift Group Cards --- */
.shifts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.shift-group-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.shift-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F8FAFC;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.shift-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.shift-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue { background-color: #EFF6FF; color: #2563EB; }
.icon-green { background-color: #DCFCE3; color: #16A34A; }

.shift-info h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.shift-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.dot { margin: 0 0.25rem; color: #9CA3AF; }

.shift-header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.urgency-badge {
  background-color: var(--urgency-bg);
  color: var(--urgency-text);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
}

.applicant-count {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-dark);
}

/* Applicants List */
.applicants-list {
  display: flex;
  flex-direction: column;
}

.applicant-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.applicant-row:last-child {
  border-bottom: none;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.applicant-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.applicant-details h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.applicant-meta {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-dark);
  font-weight: 600;
}

.applicant-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary);
  color: #FFFFFF;
  border: 1px solid var(--primary);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.btn-outline {
  background-color: #FFFFFF;
  border: 1px solid var(--border);
  color: var(--text-dark);
}

.btn-outline:hover {
  background-color: #F8FAFC;
}

/* Load More Button */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

.btn-load-more {
  background-color: #FFFFFF;
  border: 1px solid var(--border);
  color: var(--text-dark);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.btn-load-more:hover {
  background-color: #F8FAFC;
}

/* --- Responsive Adjustments --- */

@media (max-width: 768px) {
  .shift-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .shift-header-right { width: 100%; justify-content: space-between; }
  
  .applicant-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .applicant-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
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