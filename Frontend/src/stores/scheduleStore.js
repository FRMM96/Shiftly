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
  const requestTimeOff = (date, reason, time) => {
    console.log(`Requesting off for ${date}: ${reason}`)
    mySchedule.value.push({
      id: Date.now(),
      date: date,
      status: 'request_off',
      reason: reason || 'Personal Time',
      time: time || 'All Day'
    })
  }

  const markSick = (date) => {
    console.log(`Marking sick for ${date}`)
    mySchedule.value.push({
      id: Date.now(),
      date: date,
      status: 'sick',
      reason: 'Sick Leave',
      time: 'All Day'
    })
  }

  const updateTimeOff = (id, updatedData) => {
    const index = mySchedule.value.findIndex(s => s.id === id)
    if (index !== -1) {
      mySchedule.value[index] = { ...mySchedule.value[index], ...updatedData }
    }
  }

  const deleteTimeOff = (id) => {
    mySchedule.value = mySchedule.value.filter(s => s.id !== id)
  }

  return { mySchedule, getDayStatus, fetchMySchedule, requestTimeOff, markSick, updateTimeOff, deleteTimeOff }
})
