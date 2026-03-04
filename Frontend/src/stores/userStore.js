import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiFetch, setToken } from '../lib/api'

export const useUserStore = defineStore('user', () => {

  // Session state
  const token = ref(typeof window !== 'undefined' ? localStorage.getItem('shiftly_token') : null)
  const user = ref(null)


  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isBoss = computed(() => user.value?.role === 'BOSS')
  const isEmployee = computed(() => user.value?.role === 'EMPLOYEE')

  async function register({ email, username, password, role, dob }) {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      auth: false,
      body: { email, username, password, role, dob }
    })
    token.value = res.token
    setToken(res.token)
    user.value = res.user
    return res
  }

  async function login({ emailOrUsername, password }) {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      auth: false,
      body: { emailOrUsername, password }
    })
    token.value = res.token
    setToken(res.token)
    user.value = res.user
    return res
  }

  async function fetchMe() {
    if (!token.value) return null
    const res = await apiFetch('/api/auth/me', { method: 'GET', auth: true })
    user.value = res.user
    return res.user
  }

  function logout() {
    token.value = null
    user.value = null
    setToken(null)
  }

  /**
   * Boss-only: fetch REAL users from the database.
   * Use: await userStore.fetchEmployees()
   */
  async function fetchEmployees() {
    const res = await apiFetch('/api/users?role=EMPLOYEE', { method: 'GET', auth: true })
    return res.users || []
  }

  // UI helpers (client-only)
  const toggleSkill = (skill) => {
    if (!user.value) return
    if (!Array.isArray(user.value.skills)) user.value.skills = []
    const idx = user.value.skills.indexOf(skill)
    if (idx > -1) user.value.skills.splice(idx, 1)
    else user.value.skills.push(skill)
  }

  const updateProfile = (data) => {
    if (!user.value) return
    user.value = { ...user.value, ...data }
  }

  // Simple helper: match shift roleName against user's skills (if present)
  const hasSkill = (requiredRole) => {
    if (!user.value) return false
    if (!requiredRole) return true
    const skills = user.value.skills
    if (!Array.isArray(skills)) return true // if backend doesn't store skills yet, don't block
    return skills.some(s => String(s).toLowerCase() === String(requiredRole).toLowerCase())
  }

  return {
    user,
    token,
    isLoggedIn,
    isBoss,
    isEmployee,
    register,
    login,
    fetchMe,
    logout,
    fetchEmployees,   
    toggleSkill,
    updateProfile,
    hasSkill
  }
})