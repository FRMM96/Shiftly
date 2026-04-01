import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)

  const notificationsByGroup = computed(() => {
    const groups = {}
    for (const n of notifications.value) {
      const dateKey = new Date(n.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      })
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push({
        ...n,
        isUnread: !n.read,
        dateGroup: dateKey
      })
    }
    return groups
  })

  async function fetchNotifications(page = 1) {
    loading.value = true
    try {
      const response = await api.get(`/notifications?page=${page}&limit=20`)
      notifications.value = response.data.notifications
      unreadCount.value = response.data.unread
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      loading.value = false
    }
  }

  async function markAllAsRead() {
    try {
      await api.patch('/notifications/read-all')
      notifications.value.forEach(n => { n.read = true })
      unreadCount.value = 0
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  async function markAsRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`)
      const n = notifications.value.find(n => n.id === id)
      if (n) {
        n.read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  return { notifications, notificationsByGroup, unreadCount, loading, fetchNotifications, markAllAsRead, markAsRead }
})
