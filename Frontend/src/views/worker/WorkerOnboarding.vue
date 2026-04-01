<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import api from '../../services/api'

const router = useRouter()
const userStore = useUserStore()

const step = ref(1)
const loading = ref(false)
const error = ref('')

const form = ref({
  phone: '',
  emergencyContact: '',
  department: ''
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    await api.patch('/profile', {
      phone: form.value.phone,
      emergencyContact: form.value.emergencyContact,
      department: form.value.department,
      onboarded: true
    })
    userStore.user = { ...userStore.user, onboarded: true }
    router.push('/worker')
  } catch (e) {
    error.value = e?.response?.data?.message || 'Failed to save. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="onboarding-page">
    <div class="onboarding-card">
      <div class="steps-indicator">
        <div class="step-dot" :class="{ active: step >= 1 }">1</div>
        <div class="step-line" :class="{ active: step >= 2 }"></div>
        <div class="step-dot" :class="{ active: step >= 2 }">2</div>
      </div>

      <!-- Step 1: Welcome -->
      <div v-if="step === 1" class="step-content">
        <h1>Welcome to Shiftly!</h1>
        <p class="subtitle">Let's set up your profile so your team can find you.</p>

        <div class="info-card">
          <h3>Your Account</h3>
          <p class="company-name">{{ userStore.user?.username }}</p>
          <p class="company-sub">{{ userStore.user?.email }}</p>
        </div>

        <div class="form-group">
          <label>Department / Role</label>
          <input type="text" v-model="form.department" placeholder="e.g. Kitchen, Floor Staff, Delivery" />
        </div>

        <button class="btn btn-primary" @click="step = 2">Continue</button>
      </div>

      <!-- Step 2: Contact Info -->
      <div v-if="step === 2" class="step-content">
        <h1>Contact Information</h1>
        <p class="subtitle">Help your manager reach you when needed.</p>

        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" v-model="form.phone" placeholder="+46 70 123 4567" />
        </div>

        <div class="form-group">
          <label>Emergency Contact</label>
          <input type="text" v-model="form.emergencyContact" placeholder="Name - Phone Number" />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <div class="btn-row">
          <button class="btn btn-outline" @click="step = 1">Back</button>
          <button class="btn btn-primary" :disabled="loading" @click="handleSubmit">
            {{ loading ? 'Finishing...' : 'Get Started' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%);
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.onboarding-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 3rem;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
}

.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  background: #E5E7EB;
  color: #9CA3AF;
  transition: all 0.3s;
}

.step-dot.active {
  background: var(--primary, #0052CC);
  color: #FFFFFF;
}

.step-line {
  width: 80px;
  height: 3px;
  background: #E5E7EB;
  transition: background 0.3s;
}

.step-line.active {
  background: var(--primary, #0052CC);
}

.step-content h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
}

.subtitle {
  color: #6B7280;
  font-size: 0.95rem;
  margin: 0 0 2rem;
}

.info-card {
  background: #F8FAFC;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.info-card h3 {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem;
}

.company-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--primary, #0052CC);
}

.company-sub {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0.25rem 0 0;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: var(--primary, #0052CC);
}

.error-msg {
  background: #FEF2F2;
  color: #DC2626;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--primary, #0052CC);
  color: #FFFFFF;
  width: 100%;
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-outline {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  color: #374151;
}
.btn-outline:hover { background: #F9FAFB; }

.btn-row {
  display: flex;
  gap: 1rem;
}
.btn-row .btn-primary { flex: 1; }
.btn-row .btn-outline { flex: 0 0 auto; }
</style>
