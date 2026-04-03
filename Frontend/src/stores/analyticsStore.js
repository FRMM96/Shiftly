import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useAnalyticsStore = defineStore('analytics', () => {
  // Manager KPIs
  const managerSummary = ref(null)
  // Worker KPIs
  const workerSummary = ref(null)
  // Chart data
  const shiftsByStatus = ref(null)
  const hoursByWeek = ref([])

  const loading = ref(false)
  const error = ref(null)

  async function fetchManagerSummary() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/analytics/summary')
      managerSummary.value = res.data
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch analytics'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchWorkerSummary() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/analytics/worker-summary')
      workerSummary.value = res.data
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch analytics'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchShiftsByStatus() {
    try {
      const res = await api.get('/analytics/shifts-by-status')
      shiftsByStatus.value = res.data
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch shift breakdown'
      throw new Error(error.value)
    }
  }

  async function fetchHoursByWeek() {
    try {
      const res = await api.get('/analytics/hours-by-week')
      hoursByWeek.value = res.data
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch weekly hours'
      throw new Error(error.value)
    }
  }

  return {
    managerSummary,
    workerSummary,
    shiftsByStatus,
    hoursByWeek,
    loading,
    error,
    fetchManagerSummary,
    fetchWorkerSummary,
    fetchShiftsByStatus,
    fetchHoursByWeek,
  }
})
