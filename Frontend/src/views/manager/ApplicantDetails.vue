<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import TabBar from '../../components/shared/TabBar.vue'
import UserAvatar from '../../components/shared/UserAvatar.vue'
import LoadMoreButton from '../../components/shared/LoadMoreButton.vue'
import { useShiftStore } from '../../stores/shiftStore'

const route = useRoute()
const router = useRouter()
const shiftStore = useShiftStore()

// --- State ---
// Per-applicant loading: Map<applicantId, 'approve'|'reject'|null>
const actionLoading = ref({})
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')

const applicants = ref([])

const activeTab = ref('pending')

const shiftInfo = computed(() => {
  const shiftId = route.params.id
  const shift = shiftId ? shiftStore.getShiftById(shiftId) : null
  if (shift) {
    return `${shift.roleName || shift.role || 'Shift'} • ${shift.date} • ${shift.business || ''}`
  }
  return 'Shift Details'
})

onMounted(async () => {
  if (shiftStore.shifts.length === 0) {
    await shiftStore.fetchManagerShifts().catch(() => {})
  }
  const shiftId = route.params.id
  if (shiftId) {
    try {
      const fetched = await shiftStore.fetchApplicants(shiftId)
      if (fetched && fetched.length > 0) {
        applicants.value = fetched.map(a => ({
          id: a.id,
          name: a.user?.username || a.user?.name || a.userName || a.username || 'Applicant',
          avatar: a.avatar || `https://i.pravatar.cc/150?u=${a.id}`,
          rating: a.rating || '—',
          experience: a.experience || 'N/A',
          reliability: a.reliability || 'N/A',
          bio: a.bio || 'No bio available.',
          stats: { completed: a.completedShifts || 0, distance: a.distance || 'N/A' },
          isWarning: false
        }))
      }
    } catch {
      // No applicants found
    }
  }
})

const isApproving = (id) => actionLoading.value[id] === 'approve'
const isRejecting = (id) => actionLoading.value[id] === 'reject'
const isActing = (id) => !!actionLoading.value[id]

const handleApprove = async (applicant) => {
  const shiftId = route.params.id
  if (!confirm(`Approve ${applicant.name} for this shift?\n\nThis will automatically reject all other pending applicants.`)) return
  actionLoading.value = { ...actionLoading.value, [applicant.id]: 'approve' }
  try {
    await shiftStore.approveApplicant(shiftId, applicant.id)
    // Remove all applicants from the list — shift is now ACTIVE
    applicants.value = []
    modalSuccess.value = true
    modalTitle.value = 'Approved!'
    modalMessage.value = `${applicant.name} has been approved and assigned to the shift. All other applicants have been notified.`
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

const handleDeny = async (applicant) => {
  const shiftId = route.params.id
  if (!confirm(`Are you sure you want to decline ${applicant.name}?`)) return
  actionLoading.value = { ...actionLoading.value, [applicant.id]: 'reject' }
  try {
    await shiftStore.rejectApplicant(shiftId, applicant.id)
    // Remove from local list
    applicants.value = applicants.value.filter(a => a.id !== applicant.id)
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

const closeModal = () => {
  showModal.value = false
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <ManagerLayout>
    <div class="main-content">
      
      <div class="page-header-section">
        
        <div class="header-left">
          <a href="#" class="back-link" @click.prevent="goBack">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Applicant Review
          </a>
          <h1 class="page-title">Shift Applicants</h1>
          <p class="shift-subtitle">{{ shiftInfo }}</p>
        </div>

        <TabBar
          :tabs="[
            { value: 'pending', label: `Pending (${applicants.length})` },
            { value: 'approved', label: 'Approved' },
            { value: 'denied', label: 'Denied' }
          ]"
          v-model="activeTab"
          style="margin-bottom: 1.5rem;"
        />

      </div>

      <div class="filter-bar">
        <div class="filter-pills">
          <span class="pill pill-primary">Highest Reliability First</span>
          <span class="pill pill-outline">Rating > 4.5</span>
        </div>
        <button class="btn-filter">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
          Filter Results
        </button>
      </div>

      <div v-if="applicants.length === 0" style="text-align:center;padding:3rem;color:#6B7280;background:#fff;border:1px solid var(--border);border-radius:12px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" style="margin-bottom:1rem;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
        <h3 style="font-size:1.1rem;font-weight:700;margin:0 0 0.25rem;">No applicants yet</h3>
        <p style="margin:0;">There are no applicants for this shift.</p>
      </div>

      <div v-else class="applicants-list">
        
        <div v-for="applicant in applicants" :key="applicant.id" class="applicant-card">
          
          <div class="avatar-col">
            <UserAvatar :image-url="applicant.avatar" :name="applicant.name" size="lg" />
          </div>

          <div class="content-col">
            
            <div class="card-top-row">
              <h2 class="applicant-name">{{ applicant.name }}</h2>
              <div class="action-buttons">
                <button
                  class="btn btn-approve"
                  :disabled="isActing(applicant.id)"
                  @click="handleApprove(applicant)"
                >
                  <svg v-if="!isApproving(applicant.id)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <svg v-else class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10" /></svg>
                  {{ isApproving(applicant.id) ? 'Approving...' : 'Approve' }}
                </button>
                <button
                  class="btn btn-deny"
                  :disabled="isActing(applicant.id)"
                  @click="handleDeny(applicant)"
                >
                  <svg v-if="!isRejecting(applicant.id)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  <svg v-else class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10" /></svg>
                  {{ isRejecting(applicant.id) ? 'Declining...' : 'Decline' }}
                </button>
              </div>
            </div>

            <div class="meta-row">
              <span class="meta-item rating-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                {{ applicant.rating }}/5
              </span>
              <span class="dot">•</span>
              <span class="meta-item">{{ applicant.experience }} exp.</span>
              <span class="dot">•</span>
              <span class="meta-item font-bold" :class="applicant.isWarning ? 'text-orange' : 'text-green'">
                {{ applicant.reliability }} Reliability
              </span>
            </div>

            <p class="applicant-bio">
              {{ applicant.bio }}
            </p>

            <div class="stats-row">
              <div class="stat-block">
                <span class="stat-label">Previous Shifts</span>
                <span class="stat-value">{{ applicant.stats.completed }} Completed</span>
              </div>
              <div class="stat-block">
                <span class="stat-label">Location</span>
                <span class="stat-value">{{ applicant.stats.distance }} away</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div class="load-more-container">
        <button class="btn-load-more">Load More Applicants</button>
      </div>

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
          <h3>{{ modalTitle }}</h3>
          <p>{{ modalMessage }}</p>
        </div>
        <button class="btn btn-primary modal-close-btn" @click="closeModal">Got it</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

/* --- Main Content --- */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  flex-grow: 1;
  width: 100%;
}

/* Page Header */
.page-header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--primary-dark);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.back-link:hover { text-decoration: underline; }

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.shift-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

/* Tabs Segmented Control */
.tabs-container {
  display: flex;
  background-color: #F3F4F6;
  padding: 0.35rem;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background-color: var(--primary-dark);
  color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-pills {
  display: flex;
  gap: 0.75rem;
}

.pill {
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.pill-primary {
  background-color: #EFF6FF;
  color: var(--primary-dark);
}

.pill-outline {
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--text-body);
}

.btn-filter {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-body);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-filter:hover { color: var(--text-dark); }

/* --- Applicant Cards --- */
.applicants-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.applicant-card {
  background-color: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.avatar-col {
  flex-shrink: 0;
}

.avatar-img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.content-col {
  flex-grow: 1;
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.applicant-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-approve {
  background-color: var(--success-bg);
  color: #FFFFFF;
  border: none;
}
.btn-approve:hover { background-color: #059669; }

.btn-deny {
  background-color: var(--danger-bg);
  color: var(--danger-text);
  border: 1px solid var(--danger-border);
}
.btn-deny:hover { background-color: #FEE2E2; }

/* Meta Row */
.meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating-text {
  color: var(--star-color);
  font-weight: 600;
}

.dot { font-size: 0.8rem; opacity: 0.5; }
.font-bold { font-weight: 700; }
.text-green { color: var(--success-text); }
.text-orange { color: var(--warning-text); }

.applicant-bio {
  font-size: 0.9rem;
  color: var(--text-body);
  line-height: 1.5;
  margin: 0 0 1.25rem 0;
}

/* Stats Row */
.stats-row {
  display: flex;
  gap: 3rem;
}

.stat-block {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.2rem;
}

.stat-value {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* --- Load More --- */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

.btn-load-more {
  background-color: var(--bg-card);
  color: var(--primary-dark);
  border: 1px solid var(--border);
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.btn-load-more:hover { background-color: #F9FAFB; }

/* --- Responsive --- */
@media (max-width: 768px) {
  .page-header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .applicant-card {
    flex-direction: column;
  }
  
  .card-top-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  
  .stats-row {
    gap: 1.5rem;
    flex-direction: column;
  }
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
.btn-primary {
  background-color: var(--primary-dark, #2563EB);
  color: #FFFFFF;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary:hover { background-color: #1D4ED8; }

@keyframes spin-anim {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.spin {
  animation: spin-anim 0.8s linear infinite;
  display: inline-block;
}
</style>