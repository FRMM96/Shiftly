import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useTimeoffStore = defineStore('timeoff', () => {
  const requests = ref([])
  const loading = ref(false)

  const pendingRequests = computed(() => requests.value.filter(r => r.status === 'PENDING'))
  const approvedRequests = computed(() => requests.value.filter(r => r.status === 'APPROVED'))
  const deniedRequests = computed(() => requests.value.filter(r => r.status === 'DENIED'))

  async function fetchTimeOffRequests() {
    loading.value = true
    try {
      const res = await api.get('/timeoff')
      requests.value = res.data.requests
    } catch (err) {
      console.error('Failed to fetch time off requests:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTimeOffRequest(data) {
    const res = await api.post('/timeoff', data)
    requests.value.unshift(res.data.request)
    return res.data.request
  }

  async function updateTimeOffRequest(id, status) {
    const res = await api.patch(`/timeoff/${id}`, { status })
    const idx = requests.value.findIndex(r => r.id === id)
    if (idx !== -1) requests.value[idx] = { ...requests.value[idx], status }
    return res.data.request
  }

  return { requests, loading, pendingRequests, approvedRequests, deniedRequests, fetchTimeOffRequests, createTimeOffRequest, updateTimeOffRequest }
})
