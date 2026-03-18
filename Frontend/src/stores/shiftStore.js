import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiFetch } from '../lib/api'

function normalizeShift(s) {
  return {
    ...s,
    date: new Date(s.date).toISOString().slice(0, 10),
    role: s.roleName,
    time: s.startTime && s.endTime ? `${s.startTime} - ${s.endTime}` : undefined,
    location: s.location || '',
    notes: s.notes || '',
    visibility: s.visibility || 'COMPANY'
  }
}

export const useShiftStore = defineStore('shifts', () => {
  const shifts = ref([])
  const marketplaceShifts = ref([])
  const applications = ref([])

  const openShifts = computed(() => shifts.value.filter(s => s.status === 'OPEN'))

  const getShiftById = (id) =>
    shifts.value.find(s => s.id == id) ||
    marketplaceShifts.value.find(s => s.id == id)

  async function fetchManagerShifts(params = {}) {
    const q = new URLSearchParams(params).toString()
    const res = await apiFetch(`/api/shifts${q ? `?${q}` : ''}`)
    shifts.value = (res.shifts || []).map(normalizeShift)
    return shifts.value
  }

  async function createShift(newShift) {
    const body = {
      business: newShift.business,
      location: newShift.location || null,
      notes: newShift.notes || null,
      roleName: newShift.roleName || newShift.role,
      date: newShift.date,
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      pay: newShift.pay || null,
      workerId: newShift.workerId || null,
      status: newShift.workerId ? 'ACTIVE' : (newShift.status || 'OPEN'),
      visibility: newShift.workerId ? 'COMPANY' : (newShift.visibility || 'GLOBAL')
    }

    const res = await apiFetch('/api/shifts', { method: 'POST', body })
    await fetchManagerShifts()
    return res.shift
  }

  async function addShift(shift) {
    return await createShift(shift)
  }

  async function updateShift(updatedShift) {
    const body = {
      business: updatedShift.business,
      location: updatedShift.location,
      notes: updatedShift.notes,
      roleName: updatedShift.roleName || updatedShift.role,
      date: updatedShift.date,
      startTime: updatedShift.startTime,
      endTime: updatedShift.endTime,
      pay: updatedShift.pay,
      workerId: updatedShift.workerId,
      status: updatedShift.status,
      visibility: updatedShift.visibility
    }
    const res = await apiFetch(`/api/shifts/${updatedShift.id}`, { method: 'PATCH', body })
    await fetchManagerShifts()
    return res.shift
  }

  async function deleteShift(id) {
    await apiFetch(`/api/shifts/${id}`, { method: 'DELETE' })
    await fetchManagerShifts()
  }

  async function fetchMarketplace() {
    const res = await apiFetch('/api/marketplace/shifts')
    marketplaceShifts.value = (res.shifts || []).map(normalizeShift)
    return marketplaceShifts.value
  }

  async function applyToShift(shiftId) {
    await apiFetch(`/api/marketplace/shifts/${shiftId}/apply`, { method: 'POST' })
    await fetchMarketplace()
    await fetchMyApplications()
  }

  async function fetchMyShifts() {
    const res = await apiFetch('/api/shifts/me')
    shifts.value = (res.shifts || []).map(normalizeShift)
    return shifts.value
  }

  async function fetchApplicants(shiftId) {
    const res = await apiFetch(`/api/marketplace/shifts/${shiftId}/applicants`)
    return res.applicants || []
  }

  async function assignApplicant(shiftId, applicationId) {
    const res = await apiFetch(`/api/marketplace/shifts/${shiftId}/assign`, {
      method: 'POST',
      body: { applicationId }
    })
    await fetchManagerShifts()
    return res
  }

  async function fetchMyApplications() {
    const res = await apiFetch('/api/marketplace/applications/me')
    applications.value = (res.applications || []).map(app => ({
      ...app,
      shift: app.shift ? normalizeShift(app.shift) : null
    }))
    return applications.value
  }

  return {
    shifts,
    marketplaceShifts,
    applications,
    openShifts,
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
    assignApplicant,
    fetchMyApplications
  }
})