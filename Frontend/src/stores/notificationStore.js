import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiFetch } from '../lib/api'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])

  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.isRead).length
  )

  async function fetchMyNotifications() {
    const res = await apiFetch('/api/notifications/me')
    notifications.value = res.notifications || []
    return notifications.value
  }

  async function markAsRead(id) {
    await apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    const item = notifications.value.find(n => n.id === id)
    if (item) item.isRead = true
  }

  async function markAllAsRead() {
    await apiFetch('/api/notifications/read-all', { method: 'PATCH' })
    notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
  }

  return {
    notifications,
    unreadCount,
    fetchMyNotifications,
    markAsRead,
    markAllAsRead
  }
})