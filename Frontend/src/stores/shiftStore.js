import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import { useUserStore } from './userStore'

export const useShiftStore = defineStore('shifts', () => {
  const shifts = ref([])
  const loading = ref(false)
  const error = ref(null)

  const openShifts = computed(() => shifts.value.filter(s => s.status === 'OPEN'))

  // All applicants across every open shift (for the Manager dashboard panel)
  const pendingApplicants = computed(() => {
    const seen = new Set()
    const result = []
    for (const shift of openShifts.value) {
      if (!Array.isArray(shift.applications)) continue
      for (const app of shift.applications) {
        if (!seen.has(app.id)) {
          seen.add(app.id)
          result.push({
            id: app.id,
            name: app.workerName || app.username || 'Unknown',
            role: shift.role || shift.roleName || 'Applicant',
            shiftId: shift.id
          })
        }
      }
    }
    return result
  })

  const getShiftById = (id) => shifts.value.find(s => s.id == id)

  // Shifts the current user applied to (from open shift list payload)
  const myApplications = computed(() => {
    const userStore = useUserStore()
    if (!userStore.user) return []

    return shifts.value.filter(shift => Array.isArray(shift.applications) && shift.applications.length > 0)
  })

  async function fetchManagerShifts(params = {}) {
    loading.value = true
    error.value = null
    try {
      const q = new URLSearchParams(params).toString()
      const response = await api.get(`/shifts${q ? `?${q}` : ''}`)
      // Normalize for frontend components expecting `date` as YYYY-MM-DD
      shifts.value = response.data.shifts.map(s => {
        const d = new Date(s.date)
        return {
          ...s,
          date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
          role: s.roleName, // backward-compat for components using `role`
          applicants: undefined
        }
      })
      return shifts.value
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch manager shifts'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function createShift(newShift) {
    loading.value = true
    try {
      const body = {
        business: newShift.business || 'Shiftly Business',
        roleName: newShift.role || newShift.roleName,
        date: newShift.date, // YYYY-MM-DD
        startTime: newShift.startTime,
        endTime: newShift.endTime,
        pay: newShift.pay,
        priority: newShift.priority || 'NORMAL',
        workerId: newShift.workerId || null,
        status: newShift.status === 'open' || newShift.status === 'OPEN' ? 'OPEN' : 'ACTIVE'
      }
      const response = await api.post('/shifts', body)
      await fetchManagerShifts()
      return response.data.shift
    } catch (err) {
      console.error('Create shift error:', err.response?.data || err.message)
      error.value = err.response?.data?.message || err.message || 'Failed to create shift'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function addShift(shift) {
    return await createShift(shift)
  }

  async function updateShift(updatedShift) {
    loading.value = true
    try {
      const body = {
        business: updatedShift.business,
        roleName: updatedShift.role || updatedShift.roleName,
        date: updatedShift.date,
        startTime: updatedShift.startTime,
        endTime: updatedShift.endTime,
        pay: updatedShift.pay,
        workerId: updatedShift.workerId,
        status: updatedShift.status
      }
      const response = await api.patch(`/shifts/${updatedShift.id}`, body)
      await fetchManagerShifts()
      return response.data.shift
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update shift'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function deleteShift(id) {
    loading.value = true
    try {
      await api.delete(`/shifts/${id}`)
      await fetchManagerShifts()
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete shift'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function publishShift(id) {
    loading.value = true
    try {
      // Set to OPEN (and clear worker)
      await api.patch(`/shifts/${id}`, { status: 'OPEN', workerId: null })
      await fetchManagerShifts()
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to publish shift'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  // --- Worker actions ---
  async function fetchMarketplace() {
    loading.value = true
    try {
      const response = await api.get('/marketplace/shifts')
      shifts.value = response.data.shifts.map(s => {
        const d = new Date(s.date)
        return {
          ...s,
          date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
          role: s.roleName,
        }
      })
      return shifts.value
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch marketplace'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function applyToShift(shiftId) {
    loading.value = true
    try {
      await api.post(`/marketplace/shifts/${shiftId}/apply`)
      await fetchMarketplace()
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to apply'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchMyShifts() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/shifts/me')
      shifts.value = response.data.shifts.map(s => {
        const d = new Date(s.date)
        return {
          ...s,
          date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
          role: s.roleName
        }
      })
      return shifts.value
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch my shifts'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchApplicants(shiftId) {
    loading.value = true
    try {
      const response = await api.get(`/marketplace/shifts/${shiftId}/applicants`)
      return response.data.applicants
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch applicants'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function assignApplicant(shiftId, applicationId) {
    loading.value = true
    try {
      const response = await api.post(`/marketplace/shifts/${shiftId}/assign`, { applicationId })
      await fetchManagerShifts()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to assign applicant'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  /**
   * Approve an applicant for a shift.
   * Calls POST /marketplace/shifts/:shiftId/assign with { applicationId }.
   * The backend atomically: accepts the chosen application, rejects all others,
   * assigns the worker, and flips the shift status to ACTIVE.
   * On success, removes the shift from local openShifts state.
   */
  async function approveApplicant(shiftId, applicationId) {
    loading.value = true
    try {
      const response = await api.post(`/marketplace/shifts/${shiftId}/assign`, { applicationId })
      // Remove from local shifts since status is now ACTIVE (no longer OPEN)
      shifts.value = shifts.value.filter(s => s.id !== shiftId)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to approve applicant'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function rejectApplicant(shiftId, applicationId) {
    loading.value = true
    try {
      await api.patch(`/marketplace/shifts/${shiftId}/applications/${applicationId}/reject`)
      const shift = shifts.value.find(s => s.id === shiftId)
      if (shift && Array.isArray(shift.applications)) {
        shift.applications = shift.applications.filter(a => a.id !== applicationId)
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to reject applicant'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchMyApplications() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/marketplace/applications/me')
      // Keep shifts in sync so myApplications computed works
      return res.data.applications || []
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch my applications'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  return {
    shifts,
    loading,
    error,
    openShifts,
    pendingApplicants,
    myApplications,
    getShiftById,
    fetchManagerShifts,
    createShift,
    addShift,
    updateShift,
    deleteShift,
    fetchMarketplace,
    applyToShift,
    fetchMyShifts,
    fetchApplicants,
    fetchMyApplications,
    assignApplicant,
    approveApplicant,
    rejectApplicant
  }
})