import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiFetch, setToken } from '../lib/api'

export const useUserStore = defineStore('user', () => {
  const user = ref({ 
    id: 999, 
    username: 'test_worker', 
    role: 'EMPLOYEE', 
    firstName: 'Test', 
    lastName: 'Worker',
    name: 'Test Worker',
    email: 'test_worker@shiftly.com',
    phone: '555-019-2831',
    cv: null,
    bio: 'Dedicated worker looking for shifts.',
    skills: ['Bartender', 'Waiter'],
    avatar: 'https://i.pravatar.cc/150?img=11'
  })
  const token = ref('fake-token-for-css-testing')

  // Put fake token in localStorage for api intercepts just in case
  if (typeof window !== 'undefined') {
    localStorage.setItem('shiftly_token', 'fake-token-for-css-testing')
  }

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

  const toggleSkill = (skill) => {
    if (!user.value.skills) user.value.skills = []
    const idx = user.value.skills.indexOf(skill)
    if (idx > -1) user.value.skills.splice(idx, 1)
    else user.value.skills.push(skill)
  }

  const updateProfile = (data) => {
    user.value = { ...user.value, ...data }
  }

  // Helper: check if user qualifies for a shift (simple match on roleName)
  const hasSkill = (requiredRole) => true // Placeholder: extend with real skills if you add them to backend

  return { user, token, isLoggedIn, isBoss, isEmployee, register, login, fetchMe, logout, toggleSkill, updateProfile, hasSkill }
})
