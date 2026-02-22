import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiFetch } from '../lib/api'

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
      reason: 'Personal Time',
      time: '10:00 - 14:00'
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

  const getDayStatus = (dateString) => {
    return mySchedule.value.find(s => s.date === dateString)
  }

  async function fetchMySchedule() {
    const res = await apiFetch('/api/shifts/me')
    mySchedule.value = res.shifts.map(s => ({
      id: s.id,
      date: new Date(s.date).toISOString().slice(0, 10),
      status: s.status === 'ACTIVE' ? 'active' : s.status.toLowerCase(),
      role: s.roleName,
      business: s.business,
      time: `${s.startTime} - ${s.endTime}`,
    }))
    return mySchedule.value
  }

  // Placeholder actions (you can wire these later with real endpoints)
  const requestTimeOff = (date, reason) => {
    console.log(`Requesting off for ${date}: ${reason}`)
  }

  const markSick = (date) => {
    console.log(`Marking sick for ${date}`)
  }

  return { mySchedule, getDayStatus, fetchMySchedule, requestTimeOff, markSick }
})
