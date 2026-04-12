import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'
import { cacheSchedule, getCachedSchedule } from '../services/offlineCache'

export const useScheduleStore = defineStore('schedule', () => {
  // State: worker's assigned shifts, normalized for calendar UI
  const mySchedule = ref([])
  const loading = ref(false)
  const error = ref('')

  // Selected shift detail (set when user clicks a calendar day)
  const selectedShift = ref(null)

  function normalizeShiftToScheduleItem(s) {
    const d = new Date(s.date)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const time = (s.startTime && s.endTime) ? `${s.startTime} - ${s.endTime}` : undefined
    return {
      id: s.id,
      date,
      status: 'active',
      role: s.roleName || s.role,
      business: s.business,
      time
    }
  }

  async function fetchMySchedule() {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/shifts/me')
      mySchedule.value = (response.data.shifts || []).map(normalizeShiftToScheduleItem)
      // Cache for offline access
      cacheSchedule(mySchedule.value).catch(() => {})
      return mySchedule.value
    } catch (e) {
      // Offline fallback: load from cache if network fails
      if (!e.response) {
        const cached = await getCachedSchedule()
        if (cached.length) {
          mySchedule.value = cached
          error.value = 'Showing cached data (offline)'
          return mySchedule.value
        }
      }
      error.value = e.response?.data?.message || e.message || 'Failed to load schedule'
      mySchedule.value = []
      throw e
    } finally {
      loading.value = false
    }
  }

  async function claimShift(shiftId) {
    loading.value = true
    error.value = ''
    try {
      await api.post(`/marketplace/shifts/${shiftId}/apply`)
    } catch (e) {
      error.value = e.response?.data?.message || e.message || 'Failed to apply to shift'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { mySchedule, loading, error, fetchMySchedule, claimShift, selectedShift }
})