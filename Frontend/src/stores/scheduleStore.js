import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScheduleStore = defineStore('schedule', () => {
  
  // 1. STATE: The Worker's personal schedule (Using your newer Feb dates)
  const mySchedule = ref([
    { 
      id: 101, 
      date: '2026-02-02', 
      status: 'active', // Green
      role: 'Bartender', 
      business: 'Stockholm Bar', 
      time: '18:00 - 02:00' 
    },
    { 
      id: 102, 
      date: '2026-02-05', 
      status: 'sick', // Red
      reason: 'Flu' 
    },
    { 
      id: 103, 
      date: '2026-02-14', 
      status: 'request_off', // Orange
      reason: 'Valentine’s Day' 
    },
    // Added one more active shift so the calendar looks populated
    { 
      id: 104, 
      date: '2026-02-20', 
      status: 'active', 
      role: 'Waiter', 
      business: 'Nightclub X', 
      time: '20:00 - 04:00' 
    }
  ])

  // 2. HELPER: Keep this! It makes your components cleaner.
  // Instead of writing ".find()" inside the template, you just call this.
  const getDayStatus = (dateString) => {
    return mySchedule.value.find(s => s.date === dateString)
  }

  // 3. ACTIONS
  const requestTimeOff = (date, reason) => {
    console.log(`Requesting off for ${date}: ${reason}`)
    mySchedule.value.push({
      id: Date.now(),
      date: date,
      status: 'request_off',
      reason: reason
    })
  }

  // Keep this too - allows workers to call in sick from the dashboard
  const markSick = (date) => {
    const shift = mySchedule.value.find(s => s.date === date)
    if (shift) {
        shift.status = 'sick'
        shift.reason = 'Reported Sick'
    }
  }

  return { 
    mySchedule, 
    getDayStatus, 
    requestTimeOff, 
    markSick 
  }
})