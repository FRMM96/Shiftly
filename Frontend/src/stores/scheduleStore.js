import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiFetch } from '../lib/api'

export const useScheduleStore = defineStore('schedule', () => {
  const mySchedule = ref([])

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
