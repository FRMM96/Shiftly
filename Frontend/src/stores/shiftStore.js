import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'

export const useShiftStore = defineStore('shifts', () => {
  // 1. STATE
  const shifts = ref([
    { 
      id: 1, 
      business: 'Stockholm Bar', 
      role: 'Bartender', 
      startTime: '18:00', 
      endTime: '02:00', 
      pay: '180 kr/h', 
      date: '2026-01-27', 
      status: 'open',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=60',
      applicants: [] // <--- CRITICAL: Must initialize this to avoid crashes
    }
  ])

  // 2. GETTERS
  const openShifts = computed(() => shifts.value.filter(s => s.status === 'open'))
  
  const getShiftById = (id) => shifts.value.find(s => s.id == id)

  // SAFE Getter: Finds shifts the current user applied to
  const myApplications = computed(() => {
    const userStore = useUserStore()
    if (!userStore.user) return []
    
    return shifts.value.filter(shift => {
      // Safety check: Does the array exist?
      if (!shift.applicants) return false
      
      // Check if user is in the list
      return shift.applicants.some(applicant => applicant.email === userStore.user.email)
    })
  })

  // 3. ACTIONS
  
  // --- Manager Actions ---
  const addShift = (newShift) => {
    shifts.value.push({
      id: Date.now(),
      status: 'open',
      business: 'Stockholm Bar',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=60',
      applicants: [], // <--- Initialize empty array for new shifts
      ...newShift
    })
  }

  const updateShift = (updatedShift) => {
    const index = shifts.value.findIndex(s => s.id === updatedShift.id)
    if (index !== -1) {
      shifts.value[index] = { ...shifts.value[index], ...updatedShift }
    }
  }

  const deleteShift = (id) => {
    shifts.value = shifts.value.filter(s => s.id !== id)
  }

  // --- Worker Actions ---
  const applyToShift = (shiftId, workerProfile) => {
    const shift = shifts.value.find(s => s.id === shiftId)
    
    if (shift) {
        // Ensure array exists
        if (!shift.applicants) shift.applicants = []
        
        // Check for duplicates
        const exists = shift.applicants.find(a => a.email === workerProfile.email)
        
        if (!exists) {
            shift.applicants.push({
                ...workerProfile,
                appliedAt: new Date().toLocaleDateString(),
                status: 'pending'
            })
        }
    }
  }

  // 4. RETURN EVERYTHING
  return { 
    shifts, 
    openShifts, 
    getShiftById, 
    myApplications, // <--- Added
    addShift, 
    updateShift, 
    deleteShift,
    applyToShift    // <--- Added
  }
})