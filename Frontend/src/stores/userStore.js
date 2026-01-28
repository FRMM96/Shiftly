import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. STATE: The Worker's Profile
  const user = ref({
    name: 'Julian S.',
    email: 'julian@example.com',
    role: 'Worker', // or 'Manager'
    bio: 'Experienced bartender with 5 years in high-volume clubs.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    skills: ['Bartender', 'Waiter'] 
  })

  // 2. ACTIONS
  const updateProfile = (updatedData) => {
    user.value = { ...user.value, ...updatedData }
  }

  const toggleSkill = (skill) => {
    if (user.value.skills.includes(skill)) {
      user.value.skills = user.value.skills.filter(s => s !== skill)
    } else {
      user.value.skills.push(skill)
    }
  }

  // Helper to check if user qualifies for a shift
  const hasSkill = (requiredRole) => user.value.skills.includes(requiredRole)

  return { user, updateProfile, toggleSkill, hasSkill }
})