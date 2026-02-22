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
          <input type="password" id="password" v-model="password" placeholder="Choose a password" required />

          <label for="role">Account type</label>
          <select id="role" v-model="role">
            <option value="EMPLOYEE">Employee</option>
            <option value="BOSS">Manager</option>
          </select>
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
      role: 'EMPLOYEE',
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleSignUp() {
      const userStore = useUserStore()
      this.loading = true
      this.error = ''
      try {
        await userStore.register({ email: this.email, username: this.username, password: this.password, role: this.role })
        if (userStore.user.role === 'BOSS') this.$router.push('/manager')
        else this.$router.push('/worker')
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
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.login-container {
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

label {
    display: block;
    margin-bottom: 8px;
    color: #606770;
    font-size: 14px;
    font-weight: 500;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #dddfe2;
    border-radius: 6px;
    font-size: 16px;
    box-sizing: border-box;
    /* Important for padding to be inside the width */
    transition: border-color 0.2s;
}

input[type="text"]:focus,
input[type="password"]:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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

.register-link {
    margin-top: 24px;
    font-size: 14px;
}

.register-link p {
    color: #606770;
}

.register-link a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
}

.register-link a:hover {
    text-decoration: underline;
}

.error {
  margin: 10px 0;
  color: #b00020;
  font-size: 14px;
}
</style>