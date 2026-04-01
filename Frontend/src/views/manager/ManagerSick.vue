<script setup>
import { ref, computed, onMounted } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import TabBar from '../../components/shared/TabBar.vue'
import UserAvatar from '../../components/shared/UserAvatar.vue'
import { useSickStore } from '../../stores/sickStore'

const sickStore = useSickStore()
const activeTab = ref('pending')
const actionLoading = ref({})
const showModal = ref(false)
const modalSuccess = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

onMounted(() => {
  sickStore.fetchSickLeaves()
})

const displayedLeaves = computed(() => {
  if (activeTab.value === 'pending') return sickStore.pendingLeaves
  return sickStore.acknowledgedLeaves
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const handleAcknowledge = async (leave) => {
  actionLoading.value = { ...actionLoading.value, [leave.id]: true }
  try {
    await sickStore.acknowledgeSickLeave(leave.id)
    modalSuccess.value = true
    modalTitle.value = 'Acknowledged'
    modalMessage.value = `Sick leave report has been acknowledged.`
  } catch (e) {
    modalSuccess.value = false
    modalTitle.value = 'Error'
    modalMessage.value = e?.message || 'Failed to acknowledge.'
  } finally {
    const updated = { ...actionLoading.value }
    delete updated[leave.id]
    actionLoading.value = updated
    showModal.value = true
  }
}
</script>

<template>
  <ManagerLayout>
    <div class="page-header">
      <h1>Sick Leave Reports</h1>
      <p>View and acknowledge employee sick leave reports.</p>
    </div>

    <TabBar
      :tabs="[
        { value: 'pending', label: 'New', badge: sickStore.pendingLeaves.length },
        { value: 'acknowledged', label: 'Acknowledged', badge: sickStore.acknowledgedLeaves.length }
      ]"
      v-model="activeTab"
      style="margin-bottom: 1.5rem;"
    />

    <div v-if="sickStore.loading" class="loading-state">Loading reports...</div>

    <div v-else-if="displayedLeaves.length === 0" class="empty-state">
      <p>No {{ activeTab === 'pending' ? 'new' : 'acknowledged' }} sick leave reports.</p>
    </div>

    <div v-else class="reports-list">
      <div v-for="leave in displayedLeaves" :key="leave.id" class="report-card">
        <div class="report-info">
          <UserAvatar
            :image-url="`https://i.pravatar.cc/150?u=${leave.user?.id || leave.userId}`"
            :name="leave.user?.username || 'Employee'"
            size="md"
          />
          <div class="report-details">
            <h4>{{ leave.user?.username || 'Employee' }}</h4>
            <div class="report-meta">
              <span>{{ formatDate(leave.date) }}</span>
              <span v-if="leave.reason" class="dot">&bull;</span>
              <span v-if="leave.reason">{{ leave.reason }}</span>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'pending'" class="report-actions">
          <button
            class="btn btn-primary"
            :disabled="!!actionLoading[leave.id]"
            @click="handleAcknowledge(leave)"
          >
            {{ actionLoading[leave.id] ? 'Acknowledging...' : 'Acknowledge' }}
          </button>
        </div>

        <div v-else class="report-status">
          <span class="status-badge status-acknowledged">Acknowledged</span>
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

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.report-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.report-details h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.report-meta {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  gap: 0.5rem;
}

.dot { color: #9CA3AF; }

.report-actions {
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

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
}
.status-acknowledged { background-color: #DCFCE3; color: #16A34A; }

@media (max-width: 768px) {
  .report-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
}
</style>
