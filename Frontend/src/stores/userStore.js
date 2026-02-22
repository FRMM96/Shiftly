import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiFetch, setToken } from '../lib/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('shiftly_token') || null)

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isBoss = computed(() => user.value?.role === 'BOSS')
  const isEmployee = computed(() => user.value?.role === 'EMPLOYEE')

  async function register({ email, username, password, role }) {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      auth: false,
      body: { email, username, password, role }
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

  // Helper: check if user qualifies for a shift (simple match on roleName)
  const hasSkill = (requiredRole) => true // Placeholder: extend with real skills if you add them to backend

  return { user, token, isLoggedIn, isBoss, isEmployee, register, login, fetchMe, logout, hasSkill }
})
