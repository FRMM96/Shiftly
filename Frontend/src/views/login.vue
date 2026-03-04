<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Email or username</label>
          <input type="text" id="username" v-model="emailOrUsername" placeholder="Enter your email or username" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="forgot-link">
          <a href="#" @click.prevent="showForgotModal = true">Forgot password?</a>
        </div>

        <button type="submit" :disabled="loading">{{ loading ? 'Logging in…' : 'Login' }}</button>
      </form>

      <div class="register-link">
        <p>Don't have an account? <router-link to="/signup">Register here</router-link></p>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotModal" class="modal-overlay" @click.self="closeForgotModal">
      <div class="modal-content">
        <h2>Reset Password</h2>
        <p>Enter your email address to receive a new password.</p>
        <form @submit.prevent="handleForgotPassword">
          <div class="form-group">
            <input type="email" v-model="forgotEmail" placeholder="Email address" required />
          </div>
          <p v-if="forgotError" class="error">{{ forgotError }}</p>
          <p v-if="forgotSuccess" class="success">{{ forgotSuccess }}</p>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeForgotModal" :disabled="forgotLoading">Cancel</button>
            <button type="submit" class="btn-submit" :disabled="forgotLoading">{{ forgotLoading ? 'Sending...' : 'Send' }}</button>
          </div>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="info" class="info">{{ info }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore'

export default {
  name: 'LoginView',
  data() {
    return {
      emailOrUsername: '',
      password: '',
      loading: false,
      error: '',
      showForgotModal: false,
      forgotEmail: '',
      forgotLoading: false,
      forgotError: '',
      forgotSuccess: ''
    }
  },
  mounted() {
    const prefill = this.$route.query.prefill
    const justSignedUp = this.$route.query.justSignedUp === '1'
    if (prefill) this.emailOrUsername = String(prefill)
    if (justSignedUp) this.info = 'Account created. Please log in with your new details.'
  },
    methods: {
    async handleLogin() {
      const userStore = useUserStore()
      this.loading = true
      this.error = ''
      try {
        await userStore.login({ emailOrUsername: this.emailOrUsername, password: this.password })
        // Route by role
        if (userStore.user.role === 'BOSS') this.$router.push('/manager')
        else this.$router.push('/worker')
      } catch (e) {
        this.error = e.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },
    closeForgotModal() {
      this.showForgotModal = false;
      this.forgotEmail = '';
      this.forgotError = '';
      this.forgotSuccess = '';
    },
    async handleForgotPassword() {
      this.forgotLoading = true;
      this.forgotError = '';
      this.forgotSuccess = '';
      
      // Simulate an API call to send the email
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.forgotSuccess = `A new password has been sent to ${this.forgotEmail}`;
        // Optionally close modal after a delay
        setTimeout(() => {
          if (this.showForgotModal) this.closeForgotModal();
        }, 3000);
      } catch (e) {
        this.forgotError = 'Failed to send password. Please try again.';
      } finally {
        this.forgotLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Keep your existing styles; only add an error style */
.error {
  margin: 10px 0;
  color: #b00020;
  font-size: 14px;
}
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

.forgot-link {
    margin-bottom: 20px;
    text-align: right;
    font-size: 14px;
}

.forgot-link a {
    color: #007bff;
    text-decoration: none;
}

.forgot-link a:hover {
    text-decoration: underline;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #ffffff;
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h2 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 22px;
    color: #1c1e21;
}

.modal-content p {
    font-size: 14px;
    color: #606770;
    margin-bottom: 20px;
    line-height: 1.5;
}

.modal-content input[type="email"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #dddfe2;
    border-radius: 6px;
    font-size: 16px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.modal-content input[type="email"]:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.modal-actions button {
    width: auto;
    padding: 10px 20px;
    font-size: 16px;
}

.btn-cancel {
    background-color: #e4e6eb;
    color: #4b4f56;
}

.btn-cancel:hover {
    background-color: #d8dadf;
}

.btn-submit {
    background-color: #007bff;
    color: white;
}

.btn-submit:hover {
    background-color: #0056b3;
}

.success {
    margin: 10px 0;
    color: #28a745;
    font-size: 14px;
}
.info {
  margin: 10px 0;
  color: #0f766e;
  font-size: 14px;
}
</style>