import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useSickStore = defineStore('sick', () => {
  const sickLeaves = ref([])
  const loading = ref(false)

  const pendingLeaves = computed(() => sickLeaves.value.filter(s => !s.acknowledged))
  const acknowledgedLeaves = computed(() => sickLeaves.value.filter(s => s.acknowledged))

  async function fetchSickLeaves() {
    loading.value = true
    try {
      const res = await api.get('/sick')
      sickLeaves.value = res.data.sickLeaves
    } catch (err) {
      console.error('Failed to fetch sick leaves:', err)
    } finally {
      loading.value = false
    }
  }

  async function reportSick(data) {
    const res = await api.post('/sick', data)
    sickLeaves.value.unshift(res.data.sickLeave)
    return res.data.sickLeave
  }

  async function acknowledgeSickLeave(id) {
    const res = await api.patch(`/sick/${id}`)
    const idx = sickLeaves.value.findIndex(s => s.id === id)
    if (idx !== -1) sickLeaves.value[idx] = { ...sickLeaves.value[idx], acknowledged: true }
    return res.data.sickLeave
  }

  return { sickLeaves, loading, pendingLeaves, acknowledgedLeaves, fetchSickLeaves, reportSick, acknowledgeSickLeave }
})
