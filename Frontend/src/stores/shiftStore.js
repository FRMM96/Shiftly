import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useShiftStore = defineStore('shifts', () => {
  // 1. STATE: The Master List
  const shifts = ref([
    // Keep some mock data for testing
    { 
      id: 1, 
      business: 'Stockholm Bar', 
      role: 'Bartender', 
      startTime: '18:00', 
      endTime: '02:00', 
      pay: '180 kr/h', 
      date: '2026-01-27', 
      status: 'open', // open, active, sick
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=60' 
    }
  ])

  // 2. GETTERS: Filter specific views
  const openShifts = computed(() => shifts.value.filter(s => s.status === 'open'))
  
  // 3. ACTIONS: Modify data
  const addShift = (newShift) => {
    // Add default mock image/business if missing
    const shiftWithDefaults = {
      id: Date.now(),
      status: 'open',
      business: 'My Restaurant', // In a real app, this comes from the logged-in user
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=60',
      ...newShift
    }
    shifts.value.push(shiftWithDefaults)
  }

  return { shifts, openShifts, addShift }
})