import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref([
    { id: 1, name: 'Sarah Jenkins', role: 'Chef' },
    { id: 2, name: 'Mike Thompson', role: 'Waiter' },
    { id: 3, name: 'Jenny Lindberg', role: 'Bartender' },
    { id: 4, name: 'Jeff Hardy', role: 'Dishwasher' },
  ])

  return { staffList }
})