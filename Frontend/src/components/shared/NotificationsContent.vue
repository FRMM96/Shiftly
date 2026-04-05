<template>
  <div class="notifications-page">
    <div class="page-header">
      <div class="title-section">
        <h1>Notifications</h1>
        <span class="badge badge-primary" v-if="unreadCount > 0">{{ unreadCount }}</span>
      </div>
      <button class="btn btn-primary btn-read" @click="handleMarkAllAsRead" :disabled="markingRead">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        {{ markingRead ? 'Marking...' : 'Mark all as read' }}
      </button>
    </div>

    <TabBar
      :tabs="['All', 'Unread', 'Archived']"
      v-model="activeTab"
      style="margin-bottom: 2rem;"
    />

    <div v-if="notificationStore.loading" style="text-align:center;padding:3rem;color:#6B7280;">
      <p>Loading notifications...</p>
    </div>

    <div v-else-if="Object.keys(filteredNotificationsByGroup).length === 0" style="text-align:center;padding:3rem;color:#6B7280;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" style="margin-bottom:1rem;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
      <h3 style="font-size:1.1rem;font-weight:700;margin:0 0 0.25rem;">You're all caught up</h3>
      <p style="margin:0;">No notifications to display.</p>
    </div>

    <div v-for="(group, dateLabel) in filteredNotificationsByGroup" :key="dateLabel" class="notifications-group">
      <div class="group-label">{{ dateLabel }}</div>
      
      <div
        v-for="notif in group"
        :key="notif.id"
        class="notification-card"
        :class="{ 'unread': notif.isUnread }"
      >
        <div class="icon-wrapper" :class="iconBgClass(notif.type)">
          <!-- Shift icons (available / assigned) -->
          <template v-if="iconCategory(notif.type) === 'shift'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </template>
          <!-- Application icons -->
          <template v-else-if="iconCategory(notif.type) === 'application'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          </template>
          <!-- Swap icons -->
          <template v-else-if="iconCategory(notif.type) === 'swap'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
          </template>
          <!-- Time off icons -->
          <template v-else-if="iconCategory(notif.type) === 'timeoff'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </template>
          <!-- Sick leave icons -->
          <template v-else-if="iconCategory(notif.type) === 'sick'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </template>
          <!-- Clock icons -->
          <template v-else-if="iconCategory(notif.type) === 'clock'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </template>
          <!-- Default -->
          <template v-else>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </template>
        </div>
        <div class="notification-content">
          <div class="header-row">
            <h4>{{ notif.message }}</h4>
            <span class="time">{{ formatTime(notif.createdAt) }}</span>
          </div>
          <div class="action-buttons">
            <button v-if="notif.type === 'SHIFT_AVAILABLE'" class="btn btn-primary btn-sm" @click="handleClaimShift(notif)" :disabled="claimingId === notif.id">{{ claimingId === notif.id ? 'Claiming...' : 'Claim Shift' }}</button>
            <button v-if="notif.actionUrl" class="btn btn-outline btn-sm" @click="handleViewDetails(notif)">View Details</button>
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal
      :is-open="showModal"
      :title="modalSuccess ? 'Success!' : 'Error'"
      :message="modalMessage"
      :type="modalSuccess ? 'success' : 'danger'"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import TabBar from '../../components/shared/TabBar.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import { useNotificationStore } from '../../stores/notificationStore'
import { useScheduleStore } from '../../stores/scheduleStore'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const notificationStore = useNotificationStore()
const scheduleStore = useScheduleStore()

const { notificationsByGroup, unreadCount } = storeToRefs(notificationStore)

onMounted(() => {
  notificationStore.fetchNotifications().catch(() => {})
})

const activeTab = ref('All')
const markingRead = ref(false)
const claimingId = ref(null)

const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

const handleMarkAllAsRead = async () => {
  markingRead.value = true
  await notificationStore.markAllAsRead()
  markingRead.value = false
}

const handleClaimShift = async (notif) => {
  claimingId.value = notif.id
  try {
    await scheduleStore.claimShift(notif.id)
    modalSuccess.value = true
    modalMessage.value = 'Shift claimed successfully!'
    notif.hasActions = false
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = 'Failed to claim shift.'
  } finally {
    claimingId.value = null
    showModal.value = true
  }
}

function handleViewDetails(notif) {
  if (!notif.read) notificationStore.markAsRead(notif.id)
  if (notif.actionUrl) {
    router.push(notif.actionUrl)
  }
}

/** Map backend notification type to an icon category for the template */
function iconCategory(type) {
  switch (type) {
    case 'SHIFT_AVAILABLE':
    case 'SHIFT_ASSIGNED':
      return 'shift'
    case 'APPLICATION':
    case 'APPLICATION_REJECTED':
      return 'application'
    case 'SWAP_REQUEST':
    case 'SWAP_ACCEPTED':
    case 'SWAP_REJECTED':
      return 'swap'
    case 'TIME_OFF_REQUEST':
    case 'TIME_OFF_RESPONSE':
      return 'timeoff'
    case 'SICK_LEAVE':
    case 'SICK_ACKNOWLEDGED':
      return 'sick'
    case 'CLOCK_IN':
    case 'CLOCK_OUT':
      return 'clock'
    default:
      return 'default'
  }
}

function formatTime(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function iconBgClass(type) {
  const cat = iconCategory(type)
  switch (cat) {
    case 'shift': return 'bg-blue'
    case 'application': return 'bg-blue-pale'
    case 'swap': return 'bg-green'
    case 'timeoff': return 'bg-orange-pale'
    case 'sick': return 'bg-orange-pale'
    case 'clock': return 'bg-gray-pale'
    default: return 'bg-gray-pale'
  }
}

const filteredNotificationsByGroup = computed(() => {
  if (activeTab.value === 'All') return notificationsByGroup.value

  const filtered = {}
  for (const [dateLabel, group] of Object.entries(notificationsByGroup.value)) {
    const matching = group.filter(n => {
      if (activeTab.value === 'Unread') return n.isUnread
      if (activeTab.value === 'Archived') return false
      return true
    })
    if (matching.length > 0) {
      filtered[dateLabel] = matching
    }
  }
  return filtered
})
</script>

<style scoped>
.notifications-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #111827;
  max-width: 1000px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-section h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: #111827;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.badge-primary {
  background-color: #2563EB;
  color: white;
  min-width: 24px;
  height: 24px;
  padding: 0 0.4rem;
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

.btn-primary { background-color: #2563EB; color: #FFFFFF; }
.btn-primary:hover { background-color: #1D4ED8; }
.btn-outline { background-color: #FFFFFF; border-color: #E5E7EB; color: #374151; }
.btn-outline:hover { background-color: #F9FAFB; }

.btn-sm {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
}

.tabs-container {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.tab {
  background: white;
  border: 1px solid #E5E7EB;
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  background: #F9FAFB;
}

.tab.active {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}

.notifications-group {
  margin-bottom: 2.5rem;
}

.group-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9CA3AF;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.notification-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.notification-card.unread {
  background: #F8FAFC;
  border-color: #DBEAFE;
}


.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bg-blue { background-color: #2563EB; color: white; }
.bg-green { background-color: #10B981; color: white; }
.bg-orange-pale { background-color: #FFF7ED; }
.bg-blue-pale { background-color: #EFF6FF; }
.bg-gray-pale { background-color: #F3F4F6; }

.notification-content {
  flex-grow: 1;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.header-row h4 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}

.header-row .time {
  font-size: 0.85rem;
  color: #6B7280;
}


.action-buttons {
  display: flex;
  gap: 0.75rem;
}
</style>
