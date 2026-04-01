<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import api from '../services/api'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const isManager = computed(() => userStore.user?.role === 'BOSS')
const backPath = computed(() => isManager.value ? '/manager/profile' : '/worker/profile')

const passwordsMatch = computed(() => form.value.newPassword === form.value.confirmPassword)
const isValid = computed(() =>
  form.value.currentPassword.length > 0 &&
  form.value.newPassword.length >= 6 &&
  passwordsMatch.value
)

const handleSubmit = async () => {
  if (!isValid.value) return
  error.value = ''
  loading.value = true
  try {
    await api.patch('/profile/password', {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    })
    success.value = true
    setTimeout(() => router.push(backPath.value), 2000)
  } catch (e) {
    error.value = e?.response?.data?.message || 'Failed to change password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="change-password-page">
    <div class="form-container">
      <button class="back-btn" @click="router.push(backPath)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Profile
      </button>

      <h1>Change Password</h1>
      <p class="subtitle">Enter your current password and choose a new one.</p>

      <div v-if="success" class="success-message">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        Password changed successfully! Redirecting...
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            v-model="form.currentPassword"
            placeholder="Enter current password"
            required
          />
        </div>

        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            v-model="form.newPassword"
            placeholder="At least 6 characters"
            minlength="6"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            v-model="form.confirmPassword"
            placeholder="Repeat new password"
            required
          />
          <span v-if="form.confirmPassword && !passwordsMatch" class="field-error">Passwords do not match</span>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="!isValid || loading">
          {{ loading ? 'Changing...' : 'Change Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.change-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-main, #F3F4F6);
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.form-container {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 440px;
  width: 100%;
  border: 1px solid var(--border, #E5E7EB);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-muted, #6B7280);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
}
.back-btn:hover { color: var(--text-dark, #1F2937); }

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.subtitle {
  color: var(--text-muted, #6B7280);
  font-size: 0.95rem;
  margin: 0 0 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-dark, #1F2937);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border, #E5E7EB);
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: var(--primary, #0052CC);
}

.field-error {
  display: block;
  color: #DC2626;
  font-size: 0.8rem;
  margin-top: 0.35rem;
}

.error-message {
  background-color: #FEF2F2;
  color: #DC2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  border: 1px solid #FECACA;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #DCFCE3;
  color: #16A34A;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
}

.btn {
  width: 100%;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  margin-top: 0.5rem;
}

.btn-primary {
  background-color: var(--primary, #0052CC);
  color: #FFFFFF;
}
.btn-primary:hover { background-color: var(--primary-hover, #003D99); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
