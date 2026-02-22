import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiFetch } from '../lib/api'
import { useUserStore } from './userStore'

export const useShiftStore = defineStore('shifts', () => {
  const shifts = ref([])

  const openShifts = computed(() => shifts.value.filter(s => s.status === 'OPEN'))

  const getShiftById = (id) => shifts.value.find(s => s.id == id)

  // Shifts the current user applied to (from open shift list payload)
  const myApplications = computed(() => {
    const userStore = useUserStore()
    if (!userStore.user) return []

    return shifts.value.filter(shift => Array.isArray(shift.applications) && shift.applications.length > 0)
  })

  // --- Manager actions ---
  async function fetchManagerShifts(params = {}) {
    const q = new URLSearchParams(params).toString()
    const res = await apiFetch(`/api/shifts${q ? `?${q}` : ''}`)
    // Normalize for frontend components expecting `date` as YYYY-MM-DD
    shifts.value = res.shifts.map(s => ({
      ...s,
      date: new Date(s.date).toISOString().slice(0, 10),
      role: s.roleName, // backward-compat for components using `role`
      applicants: undefined
    }))
    return shifts.value
  }

  async function createShift(newShift) {
    const body = {
      business: newShift.business || 'Shiftly Business',
      roleName: newShift.role || newShift.roleName,
      date: newShift.date, // YYYY-MM-DD
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      pay: newShift.pay,
      workerId: newShift.workerId || null,
      status: newShift.status === 'open' || newShift.status === 'OPEN' ? 'OPEN' : 'ACTIVE'
    }
    const res = await apiFetch('/api/shifts', { method: 'POST', body })
    await fetchManagerShifts()
    return res.shift
  }

  async function updateShift(updatedShift) {
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
    const res = await apiFetch(`/api/shifts/${updatedShift.id}`, { method: 'PATCH', body })
    await fetchManagerShifts()
    return res.shift
  }

  async function deleteShift(id) {
    await apiFetch(`/api/shifts/${id}`, { method: 'DELETE' })
    await fetchManagerShifts()
  }

  async function publishShift(id) {
    // Set to OPEN (and clear worker)
    await apiFetch(`/api/shifts/${id}`, { method: 'PATCH', body: { status: 'OPEN', workerId: null } })
    await fetchManagerShifts()
  }

  // --- Worker actions ---
  async function fetchMarketplace() {
    const res = await apiFetch('/api/marketplace/shifts')
    shifts.value = res.shifts.map(s => ({
      ...s,
      date: new Date(s.date).toISOString().slice(0, 10),
      role: s.roleName,
    }))
    return shifts.value
  }

  async function applyToShift(shiftId) {
    await apiFetch(`/api/marketplace/shifts/${shiftId}/apply`, { method: 'POST' })
    await fetchMarketplace()
  }

  async function fetchMyShifts() {
    const res = await apiFetch('/api/shifts/me')
    shifts.value = res.shifts.map(s => ({
      ...s,
      date: new Date(s.date).toISOString().slice(0, 10),
      role: s.roleName
    }))
    return shifts.value
  }

  // --- Manager: applicants + assign ---
  async function fetchApplicants(shiftId) {
    const res = await apiFetch(`/api/marketplace/shifts/${shiftId}/applicants`)
    return res.applicants
  }

  async function assignApplicant(shiftId, applicationId) {
    const res = await apiFetch(`/api/marketplace/shifts/${shiftId}/assign`, { method: 'POST', body: { applicationId } })
    await fetchManagerShifts()
    return res
  }

  return {
    shifts,
    openShifts,
    getShiftById,
    myApplications,
    fetchManagerShifts,
    createShift,
    updateShift,
    deleteShift,
    publishShift,
    fetchMarketplace,
    applyToShift,
    fetchMyShifts,
    fetchApplicants,
    assignApplicant
  }
})
