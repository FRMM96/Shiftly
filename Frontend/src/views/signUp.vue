<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore' // Adjust path if needed

const router = useRouter()
const userStore = useUserStore()

// State
const fullName = ref('')
const email = ref('')
const dob = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('EMPLOYEE')
const inviteCode = ref('')
const companyName = ref('')
const agreeTerms = ref(false)

const loading = ref(false)
const error = ref('')

// Computed class for password matching visual feedback
const passwordMatchClass = computed(() => {
  if (!password.value || !confirmPassword.value) return ''
  return password.value === confirmPassword.value ? 'match' : 'mismatch'
})

// Submission Handler
const handleSignUp = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  if (!agreeTerms.value) {
    error.value = 'You must agree to the Terms of Service and Privacy Policy.'
    return
  }
  if (role.value === 'BOSS' && !companyName.value.trim() && !inviteCode.value.trim()) {
    error.value = 'Managers must provide a new Company Name or an existing Invite Code.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await userStore.register({
      email: email.value,
      username: fullName.value, // Mapping full name to username for your backend
      password: password.value,
      role: role.value,
      inviteCode: inviteCode.value,
      companyName: companyName.value
    })

    if (res?.companyInviteCode) {
      alert(`Company invite code: ${res.companyInviteCode}`)
    }

    // force login after signup
    userStore.logout()

    router.push({
      name: 'login',
      query: { prefill: email.value || fullName.value, justSignedUp: '1' }
    })
  } catch (e) {
    if (e.response?.data?.errors && Array.isArray(e.response.data.errors)) {
      error.value = e.response.data.errors.join(', ')
    } else {
      error.value = e.response?.data?.message || e.message || 'Sign up failed'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="signup-page">
    <header class="header">
      <div class="brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="#2563EB"/>
        </svg>
        <span class="brand-name">Baudix</span>
      </div>
      <div class="header-actions">
        <span class="has-account">Already have an account?</span>
        <router-link to="/login" class="btn btn-outline btn-sm">Log in</router-link>
      </div>
    </header>

    <main class="main-content">
      <div class="content-left">
        <h1 class="headline">Build the future<br><span>with Baudix.</span></h1>
        <p class="subtitle">Join thousands of developers and creators building the next generation of digital experiences.</p>

        <ul class="feature-list">
          <li class="feature-item">
            <span class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M13 3l-2 9H4l10 10 2-10h7l-10-9z"/></svg>
            </span>
            <div class="feature-text">
              <strong>Lightning Fast</strong>
              <p>Deploy your applications in seconds, not minutes.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2L2 7v10l10 5l10-5V7l-10-5zm0 17.5l-8-4v-8l8-4l8 4v8l-8 4zM12 11l4-3v6.5l-4 2l-4-2V8l4 3zm0-3l-2.5 2h5L12 8z"/></svg>
            </span>
            <div class="feature-text">
              <strong>Enterprise Security</strong>
              <p>Your data is protected with industry-leading standards.</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="content-right">
        <div class="form-card">
          <h2 class="card-title">Create Account</h2>
          <p class="card-subtitle">Enter your details to get started.</p>

          <form @submit.prevent="handleSignUp" class="signup-form">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <input type="text" id="fullName" v-model="fullName" placeholder="John Doe" required>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input type="email" id="email" v-model="email" placeholder="name@example.com" required>
              </div>
            </div>

            <div class="form-group">
              <label for="dob">Date of Birth</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <input type="date" id="dob" v-model="dob" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <input type="password" id="password" v-model="password" placeholder="••••••••" :class="passwordMatchClass" required>
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="••••••••" :class="passwordMatchClass" required>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="role">Account Type</label>
              <div class="input-wrapper select-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <select id="role" v-model="role">
                  <option value="EMPLOYEE">Employee</option>
                  <option value="BOSS">Manager</option>
                </select>
              </div>
            </div>

            <div v-if="role === 'EMPLOYEE'" class="form-group">
              <label>Invitation Code (Required for employees)</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                <input v-model="inviteCode" type="text" placeholder="Enter your code" required>
              </div>
            </div>

            <div v-if="role === 'BOSS'" class="form-row">
              <div class="form-group">
                <label>Company Name</label>
                <div class="input-wrapper">
                   <input v-model="companyName" type="text" placeholder="New company">
                </div>
              </div>
              <div class="form-group">
                <label>Or Invite Code</label>
                <div class="input-wrapper">
                   <input v-model="inviteCode" type="text" placeholder="Existing code">
                </div>
              </div>
            </div>

            <p v-if="error" class="error-text">{{ error }}</p>

            <div class="form-check">
              <input type="checkbox" id="agreeTerms" v-model="agreeTerms">
              <label for="agreeTerms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</label>
            </div>

            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create My Account' }}
            </button>
          </form>

          <div class="divider">
            <span class="divider-text">OR SIGN UP WITH</span>
          </div>

          <div class="social-signup">
            <button class="btn btn-outline-social">
              <img src="https://authjs.dev/img/providers/google.svg" alt="Google" width="18" height="18"> Google
            </button>
            <button class="btn btn-outline-social">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub
            </button>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p class="copyright">© 2024 Baudix Technologies Inc. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Help Center</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>

.signup-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #111827;
  background-color: #F8FAFC;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* --- Header --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 3rem;
  background-color: transparent;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-name {
  font-weight: 700;
  font-size: 1.25rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.has-account {
  color: #6B7280;
  font-size: 0.875rem;
}

/* --- Main Content --- */
.main-content {
  display: flex;
  flex: 1;
  padding: 2rem 3rem 4rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
  gap: 6rem;
  align-items: center;
}

/* --- Left Column --- */
.content-left {
  flex: 1;
  max-width: 450px;
}

.headline {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.headline span {
  color: #0047FF; /* Baudix bright blue */
}

.subtitle {
  font-size: 1rem;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 3rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.feature-icon {
  color: #0047FF;
  background-color: #E0E7FF;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.feature-text strong {
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: #111827;
}

.feature-text p {
  color: #6B7280;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
}

/* --- Right Column (Card) --- */
.content-right {
  width: 100%;
  max-width: 480px;
}

.form-card {
  background-color: #fff;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  color: #6B7280;
  margin: 0 0 2rem 0;
  font-size: 0.9rem;
}

/* --- Form Fields --- */
.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.signup-form label {
  display: block;
  font-weight: 600;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: #9CA3AF;
  pointer-events: none;
}

.signup-form input,
.signup-form select {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem; /* Space for icon */
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  font-size: 0.9rem;
  color: #111827;
  background-color: #F8FAFC;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.signup-form input:focus,
.signup-form select:focus {
  outline: none;
  border-color: #0047FF;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(0, 71, 255, 0.1);
}

.signup-form select {
  appearance: none;
  cursor: pointer;
}

/* Dropdown arrow replacement */
.select-wrapper::after {
  content: "▼";
  font-size: 0.6rem;
  color: #9CA3AF;
  position: absolute;
  right: 1rem;
  pointer-events: none;
}

/* Password Validation Colors */
input.match {
  border-color: #10B981;
  background-color: #F0FDF4;
}
input.mismatch {
  border-color: #EF4444;
  background-color: #FEF2F2;
}

.error-text {
  color: #EF4444;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: center;
}

/* --- Checkbox --- */
.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-check input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  margin: 0;
  border-radius: 4px;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  accent-color: #0047FF;
}

.form-check label {
  font-weight: 400;
  font-size: 0.8rem;
  color: #6B7280;
  margin: 0;
  cursor: pointer;
}

.form-check a {
  color: #0047FF;
  text-decoration: none;
  font-weight: 600;
}

.form-check a:hover {
  text-decoration: underline;
}

/* --- Buttons --- */
.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
}

.btn-block {
  width: 100%;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.btn-primary {
  color: #fff;
  background-color: #0047FF;
}

.btn-primary:hover:not(:disabled) {
  background-color: #003be0;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline {
  color: #111827;
  background-color: transparent;
  border: 1px solid #0047FF;
  color: #0047FF;
}

.btn-outline:hover {
  background-color: #F0F5FF;
}

.btn-outline-social {
  color: #374151;
  background-color: #fff;
  border: 1px solid #E2E8F0;
  flex: 1;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 8px;
}

.btn-outline-social:hover {
  background-color: #F8FAFC;
}

/* --- Divider & Social --- */
.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #E2E8F0;
  z-index: 1;
}

.divider-text {
  position: relative;
  background-color: #fff;
  padding: 0 0.75rem;
  color: #9CA3AF;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  z-index: 2;
}

.social-signup {
  display: flex;
  gap: 1rem;
}

/* --- Footer --- */
.footer {
  padding: 2rem;
  text-align: center;
  margin-top: auto;
}

.copyright {
  color: #9CA3AF;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.footer-links a {
  color: #9CA3AF;
  text-decoration: none;
  font-size: 0.75rem;
}

.footer-links a:hover {
  color: #6B7280;
}

/* Responsive */
@media (max-width: 968px) {
  .main-content {
    flex-direction: column;
    gap: 3rem;
    padding: 2rem;
  }
  .content-left, .content-right {
    max-width: 100%;
  }
  .content-left {
    text-align: center;
  }
  .feature-item {
    text-align: left;
  }
}
</style>