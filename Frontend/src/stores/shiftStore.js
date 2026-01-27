import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useShiftStore = defineStore('shifts', () => {
  // 1. STATE: The Master List (Initial Mock Data)
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
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=60' 
    }
  ])

  // 2. GETTERS
  const openShifts = computed(() => shifts.value.filter(s => s.status === 'open'))
  
  // 3. ACTIONS
  const addShift = (newShift) => {
    console.log("Store: Adding shift...", newShift) // Debug log
    shifts.value.push({
      id: Date.now(),
      status: 'open', // Force status to open so it shows in feed
      business: 'Stockholm Bar', // Default business
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=60', // Default image
      ...newShift
    })
  }

  return { shifts, openShifts, addShift }
})