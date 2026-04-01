<script setup>
import { ref, computed, onMounted } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import TabBar from '../../components/shared/TabBar.vue'
import UserAvatar from '../../components/shared/UserAvatar.vue'
import { useTimeoffStore } from '../../stores/timeoffStore'

const timeoffStore = useTimeoffStore()
const activeTab = ref('pending')
const actionLoading = ref({})
const showModal = ref(false)
const modalSuccess = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

onMounted(() => {
  timeoffStore.fetchTimeOffRequests()
})

const displayedRequests = computed(() => {
  if (activeTab.value === 'pending') return timeoffStore.pendingRequests
  if (activeTab.value === 'approved') return timeoffStore.approvedRequests
  return timeoffStore.deniedRequests
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const handleAction = async (request, status) => {
  const label = status === 'APPROVED' ? 'approve' : 'deny'
  if (!confirm(`Are you sure you want to ${label} this time off request?`)) return

  actionLoading.value = { ...actionLoading.value, [request.id]: label }
  try {
    await timeoffStore.updateTimeOffRequest(request.id, status)
    modalSuccess.value = true
    modalTitle.value = status === 'APPROVED' ? 'Approved!' : 'Denied'
    modalMessage.value = `Time off request has been ${status.toLowerCase()}.`
  } catch (e) {
    modalSuccess.value = false
    modalTitle.value = 'Error'
    modalMessage.value = e?.message || 'Failed to update request.'
  } finally {
    const updated = { ...actionLoading.value }
    delete updated[request.id]
    actionLoading.value = updated
    showModal.value = true
  }
}
</script>

<template>
  <ManagerLayout>
    <div class="page-header">
      <h1>Time Off Requests</h1>
      <p>Review and manage employee time off requests.</p>
    </div>

    <TabBar
      :tabs="[
        { value: 'pending', label: 'Pending', badge: timeoffStore.pendingRequests.length },
        { value: 'approved', label: 'Approved', badge: timeoffStore.approvedRequests.length },
        { value: 'denied', label: 'Denied', badge: timeoffStore.deniedRequests.length }
      ]"
      v-model="activeTab"
      style="margin-bottom: 1.5rem;"
    />

    <div v-if="timeoffStore.loading" class="loading-state">Loading requests...</div>

    <div v-else-if="displayedRequests.length === 0" class="empty-state">
      <p>No {{ activeTab }} time off requests.</p>
    </div>

    <div v-else class="requests-list">
      <div v-for="req in displayedRequests" :key="req.id" class="request-card">
        <div class="request-info">
          <UserAvatar
            :image-url="`https://i.pravatar.cc/150?u=${req.user?.id || req.userId}`"
            :name="req.user?.username || 'Employee'"
            size="md"
          />
          <div class="request-details">
            <h4>{{ req.user?.username || 'Employee' }}</h4>
            <div class="request-meta">
              <span class="type-badge" :class="`type-${req.type?.toLowerCase()}`">{{ req.type }}</span>
              <span class="dot">&bull;</span>
              <span>{{ formatDate(req.startDate) }} - {{ formatDate(req.endDate) }}</span>
            </div>
            <p v-if="req.notes" class="request-notes">{{ req.notes }}</p>
          </div>
        </div>

        <div v-if="activeTab === 'pending'" class="request-actions">
          <button
            class="btn btn-decline"
            :disabled="!!actionLoading[req.id]"
            @click="handleAction(req, 'DENIED')"
          >
            {{ actionLoading[req.id] === 'deny' ? 'Denying...' : 'Deny' }}
          </button>
          <button
            class="btn btn-primary"
            :disabled="!!actionLoading[req.id]"
            @click="handleAction(req, 'APPROVED')"
          >
            {{ actionLoading[req.id] === 'approve' ? 'Approving...' : 'Approve' }}
          </button>
        </div>

        <div v-else class="request-status">
          <span class="status-badge" :class="`status-${req.status?.toLowerCase()}`">{{ req.status }}</span>
        </div>
      </div>
    </div>
  </ManagerLayout>

  <ConfirmModal
    :is-open="showModal"
    :title="modalTitle"
    :message="modalMessage"
    :type="modalSuccess ? 'success' : 'danger'"
    @close="showModal = false"
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

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.request-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.request-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.request-details h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.request-meta {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  gap: 0.5rem;
}

.request-notes {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0.5rem 0 0;
  font-style: italic;
}

.type-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
}
.type-annual { background-color: #EFF6FF; color: #2563EB; }
.type-sick { background-color: #FEF2F2; color: #DC2626; }
.type-personal { background-color: #F5F3FF; color: #7C3AED; }

.dot { color: #9CA3AF; }

.request-actions {
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
.btn-primary:hover { background-color: var(--primary-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-decline {
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
}
.btn-decline:hover { background-color: #FEE2E2; }
.btn-decline:disabled { opacity: 0.6; cursor: not-allowed; }

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
}
.status-approved { background-color: #DCFCE3; color: #16A34A; }
.status-denied { background-color: #FEF2F2; color: #DC2626; }
.status-pending { background-color: #FEF9C3; color: #CA8A04; }

@media (max-width: 768px) {
  .request-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .request-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
}
</style>
