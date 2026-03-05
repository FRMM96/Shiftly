<template>
  <div class="signup-page">
    <div class="signup-container">
      <h1>Sign Up</h1>
      <form @submit.prevent="handleSignUp">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" placeholder="Choose a username" required />

          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email" required />

          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Choose a password" :class="passwordMatchClass" required />

          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm your password" :class="passwordMatchClass" required />

          <label>Date of Birth</label>
          <div class="dob-group">
            <select v-model="dobYear" required>
              <option value="" disabled>Year</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
            <select v-model="dobMonth" required>
              <option value="" disabled>Month</option>
              <option v-for="m in months" :key="m.value" :value="m.value">{{ m.text }}</option>
            </select>
            <select v-model="dobDay" required>
              <option value="" disabled>Day</option>
              <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
            </select>
            
          </div>

          <label for="role">Account type</label>
          <select id="role" v-model="role">
            <option value="EMPLOYEE">Employee</option>
            <option value="BOSS">Manager</option>
          </select>
                    <!-- Company / Invite -->
          <div v-if="role === 'BOSS'" class="form-group">
            <label>Company name (create new company)</label>
            <input
              v-model="companyName"
              type="text"
              placeholder="e.g. IKEA Gothenburg"
            />

            <p style="margin: 6px 0; color: #606770; text-align:center;">OR</p>

            <label>Invite code (join existing company)</label>
            <input
              v-model="inviteCode"
              type="text"
              placeholder="Invite code"
            />
          </div>

          <div v-else class="form-group">
            <label>Invite code (required for employees)</label>
            <input
              v-model="inviteCode"
              type="text"
              placeholder="Invite code"
              required
            />
          </div>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading">{{ loading ? 'Creating…' : 'Sign Up' }}</button>
      </form>

      <div class="login-link">
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore'

export default {
  name: 'SignUpView',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      dobDay: '',
      dobMonth: '',
      dobYear: '',
      role: 'EMPLOYEE',
      loading: false,
      error: '',
      inviteCode: '',
      companyName: '',
    }
  },
  computed: {
    passwordMatchClass() {
      if (!this.password || !this.confirmPassword) return '';
      return this.password === this.confirmPassword ? 'match' : 'mismatch';
    },
    years() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let i = currentYear; i >= 1900; i--) {
        years.push(i)
      }
      return years
    },
    days() {
      const days = []
      for (let i = 1; i <= 31; i++) {
        days.push(i.toString().padStart(2, '0'))
      }
      return days
    },
    months() {
      return [
        { text: 'January', value: '01' },
        { text: 'February', value: '02' },
        { text: 'March', value: '03' },
        { text: 'April', value: '04' },
        { text: 'May', value: '05' },
        { text: 'June', value: '06' },
        { text: 'July', value: '07' },
        { text: 'August', value: '08' },
        { text: 'September', value: '09' },
        { text: 'October', value: '10' },
        { text: 'November', value: '11' },
        { text: 'December', value: '12' },
      ]
    }
  },
  methods: {
    async handleSignUp() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      const userStore = useUserStore()
      this.loading = true
      this.error = ''

      const dob = `${this.dobYear}-${this.dobMonth}-${this.dobDay}`
      try {
        const res = await userStore.register({
          email: this.email,
          username: this.username,
          password: this.password,
          role: this.role,
          inviteCode: this.inviteCode,
          companyName: this.companyName,
          dob
        })

        if (res?.companyInviteCode) {
          alert(`Company invite code: ${res.companyInviteCode}`)
        }

        // force login after signup
        userStore.logout()

        this.$router.push({
          name: 'login',
          query: { prefill: this.email || this.username, justSignedUp: '1' }
        })
      } catch (e) {
        this.error = e.message || 'Sign up failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>


<style scoped>
.signup-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.signup-container {
    background: #ffffff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

h1 {
    margin-bottom: 24px;
    color: #1c1e21;
    font-size: 28px;
    font-weight: 600;
}

.form-group {
    margin-bottom: 20px;
    text-align: left;
}

.dob-group {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.dob-group select {
    margin-bottom: 0;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #606770;
    font-size: 14px;
    font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
    width: 100%;
    padding: 12px;
    border: 1px solid #dddfe2;
    border-radius: 6px;
    font-size: 16px;
    box-sizing: border-box;
    /* Important for padding to be inside the width */
    transition: border-color 0.2s;
    margin-bottom: 15px;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

input[type="password"].match {
    border-color: #28a745;
    background-color: #f8fff9;
}

input[type="password"].match:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
}

input[type="password"].mismatch {
    border-color: #dc3545;
    background-color: #fff8f8;
}

input[type="password"].mismatch:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

button {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #0056b3;
}

.login-link {
    margin-top: 24px;
    font-size: 14px;
}

.login-link p {
    color: #606770;
}

.login-link a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
}

.login-link a:hover {
    text-decoration: underline;
}

.error {
  margin: 10px 0;
  color: #b00020;
  font-size: 14px;
}
</style>