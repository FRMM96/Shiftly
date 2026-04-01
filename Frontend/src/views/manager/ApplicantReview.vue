<script setup>
import { ref, onMounted } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import TabBar from '../../components/shared/TabBar.vue'
import UserAvatar from '../../components/shared/UserAvatar.vue'
import LoadMoreButton from '../../components/shared/LoadMoreButton.vue'
import { useShiftStore } from '../../stores/shiftStore'

const shiftStore = useShiftStore()
const loading = ref(false)
const error = ref('')
const rows = ref([])

// --- State ---
const actionLoading = ref({}) // { [applicantId]: 'approve'|'reject' }
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const activeTab = ref('pending')

// Reactive local state to store full applicant lists per shift ID
const shiftApplicants = ref({})
const shiftsRequiringAttention = computed(() => {
  if (activeTab.value !== 'pending') return []
  
  return shiftStore.openShifts.map((s, index) => {
    // Check if we fetched the full applicants list for this shift
    const applicantsList = shiftApplicants.value[s.id] || []
    
    return {
      id: s.id,
      title: `${s.role || s.roleName} - ${s.business}`,
      location: s.business,
      date: `${s.date}, ${s.startTime || '?'} - ${s.endTime || '?'}`,
      urgency: index === 0 ? 'High Urgency' : null,
      applicantCount: Array.isArray(s.applications) ? s.applications.length : 0,
      iconColor: index % 2 === 0 ? 'blue' : 'green',
      applicants: applicantsList.map(app => ({
        id: app.id,
        name: app.user?.username || app.user?.name || app.name || 'Applicant',
        rating: '4.5', // Mocked rating
        role: s.role || s.roleName,
        time: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Applied recently',
        avatar: `https://i.pravatar.cc/150?u=${app.user?.id || app.id}`
      }))
    }
  })
})

const fetchAllApplicants = async () => {
  for (const shift of shiftStore.openShifts) {
    if (Array.isArray(shift.applications) && shift.applications.length > 0) {
      try {
        const applicants = await shiftStore.fetchApplicants(shift.id)
        shiftApplicants.value[shift.id] = applicants
      } catch (err) {
        console.error(`Failed to fetch applicants for shift ${shift.id}:`, err)
      }
    }
  }
}

onMounted(async () => {
  await shiftStore.fetchManagerShifts().catch(() => {})
  await fetchAllApplicants()
})

const isApproving = (id) => actionLoading.value[id] === 'approve'
const isRejecting = (id) => actionLoading.value[id] === 'reject'
const isActing = (id) => !!actionLoading.value[id]

const handleApprove = async (shift, applicant) => {
  if (!confirm(`Approve ${applicant.name} for this shift?\n\nThis will automatically reject all other pending applicants.`)) return
  actionLoading.value = { ...actionLoading.value, [applicant.id]: 'approve' }
  try {
    await shiftStore.approveApplicant(shift.id, applicant.id)
    // Remove all applicants for this shift from local state (shift is now ACTIVE)
    shiftApplicants.value[shift.id] = []
    modalSuccess.value = true
    modalTitle.value = 'Approved!'
    modalMessage.value = `${applicant.name} has been approved and assigned to the shift.`
  } catch (e) {
    modalSuccess.value = false
    modalTitle.value = 'Error'
    modalMessage.value = e?.message || 'Failed to approve applicant. Please try again.'
  } finally {
    const updated = { ...actionLoading.value }
    delete updated[applicant.id]
    actionLoading.value = updated
    showModal.value = true
  }
}

const handleDecline = async (shift, applicant) => {
  if (!confirm(`Are you sure you want to decline ${applicant.name}?`)) return
  actionLoading.value = { ...actionLoading.value, [applicant.id]: 'reject' }
  try {
    await shiftStore.rejectApplicant(shift.id, applicant.id)
    // Remove this applicant from local list
    if (shiftApplicants.value[shift.id]) {
      shiftApplicants.value[shift.id] = shiftApplicants.value[shift.id].filter(
        a => a.id !== applicant.id
      )
    }
    modalSuccess.value = true
    modalTitle.value = 'Declined'
    modalMessage.value = `${applicant.name} has been removed from the applicant list.`
  } catch (e) {
    modalSuccess.value = false
    modalTitle.value = 'Error'
    modalMessage.value = e?.message || 'Failed to decline applicant. Please try again.'
  } finally {
    const updated = { ...actionLoading.value }
    delete updated[applicant.id]
    actionLoading.value = updated
    showModal.value = true
  }
}

async function assign(shiftId, applicationId) {
  try {
    await shiftStore.assignApplicant(shiftId, applicationId)
    await load()
    alert('Applicant assigned')
  } catch (e) {
    alert(e.message || 'Failed to assign applicant')
  }
}

const pendingCount = computed(() => {
  let count = 0
  for (const s of shiftStore.openShifts) {
    if (Array.isArray(s.applications)) count += s.applications.length
  }
  return count
})

const handleViewProfile = (applicantId) => {
  router.push(`/manager/applicants/${applicantId}`)
}
</script>

<template>
  <ManagerLayout>
    <h1>Applicant Review</h1>

        <TabBar
          :tabs="[
            { value: 'pending', label: 'Pending', badge: pendingCount },
            { value: 'reviewed', label: 'Reviewed' },
            { value: 'shortlisted', label: 'Shortlisted' }
          ]"
          v-model="activeTab"
          style="margin-bottom: 1.5rem;"
        />

        <div v-if="activeTab !== 'pending'" class="empty-tab-state">
          <p>No {{ activeTab }} applicants yet.</p>
        </div>

        <div v-if="activeTab === 'pending'" class="attention-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0047FF" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <h2>Shifts Requiring Attention</h2>
        </div>

        <div v-if="activeTab === 'pending'" class="shifts-list">
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
                  <UserAvatar :image-url="app.avatar" :name="app.name" size="md" />
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
                  <button
                    class="btn btn-decline"
                    :disabled="isActing(app.id)"
                    @click="handleDecline(shift, app)"
                  >
                    <svg v-if="!isRejecting(app.id)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    <svg v-else class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10" /></svg>
                    {{ isRejecting(app.id) ? 'Declining...' : 'Decline' }}
                  </button>
                  <button
                    class="btn btn-primary"
                    :disabled="isActing(app.id)"
                    @click="handleApprove(shift, app)"
                  >
                    <svg v-if="!isApproving(app.id)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <svg v-else class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10" /></svg>
                    {{ isApproving(app.id) ? 'Approving...' : 'Approve' }}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        <LoadMoreButton v-if="activeTab === 'pending'" text="Load More Shifts" />

        <div v-if="row.applicants.length === 0">No applicants yet.</div>

  <ConfirmModal
    :is-open="showModal"
    :title="modalTitle"
    :message="modalMessage"
    :type="modalSuccess ? 'success' : 'danger'"
    @close="closeModal"
  />
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
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
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

.btn-decline {
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-decline:hover {
  background-color: #FEE2E2;
}

.btn-decline:disabled,
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes spin-anim {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.spin {
  animation: spin-anim 0.8s linear infinite;
  display: inline-block;
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

.empty-tab-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}
</style>