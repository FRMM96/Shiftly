import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useScheduleStore } from './scheduleStore'

export const useWorkerStore = defineStore('worker', () => {
  // Compute stats from real schedule data when available
  const workerStats = computed(() => {
    const scheduleStore = useScheduleStore()
    const shifts = scheduleStore.mySchedule

    if (shifts.length === 0) {
      return { hours: '0', tasks: '0', rating: 'N/A' }
    }

    // Calculate total hours from shifts
    let totalHours = 0
    for (const shift of shifts) {
      const start = shift.startTime?.split(':').map(Number) || [0, 0]
      const end = shift.endTime?.split(':').map(Number) || [0, 0]
      const hours = (end[0] + end[1] / 60) - (start[0] + start[1] / 60)
      if (hours > 0) totalHours += hours
    }

    return {
      hours: totalHours.toFixed(1),
      tasks: String(shifts.length),
      rating: 'N/A'
    }
  })

  return { workerStats }
})
