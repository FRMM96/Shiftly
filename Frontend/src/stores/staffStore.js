import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchStaff() {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/users?role=EMPLOYEE')
      // Map backend user to the frontend shape
      staffList.value = (response.data.users || []).map(u => ({
        id: u.id,
        name: u.username,
        role: u.role,
        department: 'General',
        team: '',
        email: u.email,
        status: 'Active',
        statusType: 'success',
        dotColor: 'bg-green',
        avatar: null,
        initials: String(u.username).substring(0,2).toUpperCase()
      }))
    } catch (e) {
      error.value = e.response?.data?.message || e.message || 'Failed to fetch staff'
    } finally {
      loading.value = false
    }
  }

  const searchQuery = ref('')
  const selectedDepartment = ref('All')
  const selectedStatus = ref('All')

  const clearFilters = () => {
    searchQuery.value = ''
    selectedDepartment.value = 'All'
    selectedStatus.value = 'All'
  }

  // Alias for backward compatibility if any view uses fetchEmployees still
  const fetchEmployees = fetchStaff

  return { staffList, searchQuery, selectedDepartment, selectedStatus, clearFilters, fetchEmployees, fetchStaff, loading, error }
})