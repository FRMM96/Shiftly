import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiFetch } from '../lib/api'

export const useScheduleStore = defineStore('schedule', () => {
  // State: worker's assigned shifts, normalized for calendar UI
  const mySchedule = ref([])
  const loading = ref(false)
  const error = ref('')

  function normalizeShiftToScheduleItem(s) {
    const date = new Date(s.date).toISOString().slice(0, 10)
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
      const res = await apiFetch('/api/shifts/me', { method: 'GET', auth: true })
      mySchedule.value = (res.shifts || []).map(normalizeShiftToScheduleItem)
      return mySchedule.value
    } catch (e) {
      error.value = e.message || 'Failed to load schedule'
      mySchedule.value = []
      throw e
    } finally {
      loading.value = false
    }
  }

  // These require backend support (time-off requests / sick leave).
  // Keep them explicit so we don't accidentally fall back to hardcoded state.
  async function markSick() {
    throw new Error('Not implemented: connect markSick() to backend endpoint')
  }

  async function requestTimeOff() {
    throw new Error('Not implemented: connect requestTimeOff() to backend endpoint')
  }

  return { mySchedule, loading, error, fetchMySchedule, markSick, requestTimeOff }
})