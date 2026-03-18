import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiFetch } from '../lib/api'

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchStaff() {
    loading.value = true
    error.value = ''
    try {
      const res = await apiFetch('/api/users?role=EMPLOYEE')
      staffList.value = (res.users || []).map(u => ({
        id: u.id,
        name: u.username,
        username: u.username,
        email: u.email,
        role: u.role,
        initials: String(u.username || 'U')
          .split(' ')
          .map(x => x[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      }))
      return staffList.value
    } catch (e) {
      error.value = e.message || 'Failed to load staff'
      staffList.value = []
      throw e
    } finally {
      loading.value = false
    }
  }

  return { staffList, loading, error, fetchStaff }
})