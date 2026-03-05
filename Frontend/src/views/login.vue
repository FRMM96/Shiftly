<template>
  <div class="login-wrapper">
    <div class="login-grid">
      <!-- Left Form Side -->
      <div class="login-form-side">
        <div class="login-header">
          <div class="brand-logo">
            <span class="material-symbols-outlined">adjust</span>
          </div>
          <h2>Radix</h2>
        </div>
        
        <div class="login-content">
          <div class="login-title-area">
            <h1>Welcome back</h1>
            <p>Log in to your Radix account to continue your work.</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="input-group">
              <label for="username">Email Address or Username</label>
              <div class="input-wrapper">
                <span class="material-symbols-outlined input-icon">mail</span>
                <input 
                  type="text" 
                  id="username" 
                  v-model="emailOrUsername" 
                  placeholder="name@company.com" 
                  required 
                />
              </div>
            </div>
            
            <div class="input-group">
              <div class="password-header">
                <label for="password">Password</label>
                <a href="#" @click.prevent="showForgotModal = true" class="forgot-link">Forgot password?</a>
              </div>
              <div class="input-wrapper">
                <span class="material-symbols-outlined input-icon">lock</span>
                <input 
                  :type="passwordVisible ? 'text' : 'password'" 
                  id="password" 
                  v-model="password" 
                  placeholder="••••••••" 
                  required 
                />
                <button type="button" class="password-toggle" @click="passwordVisible = !passwordVisible">
                  <span class="material-symbols-outlined">{{ passwordVisible ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <p v-if="error" class="error-msg">{{ error }}</p>

            <div class="remember-me">
              <label class="checkbox-label">
                <input type="checkbox" />
                <span>Remember me for 30 days</span>
              </label>
            </div>
            
            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
              <span v-if="!loading" class="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
          
          <div class="social-login">
            <p>Or continue with</p>
            <div class="social-buttons">
              <button type="button" class="btn-social">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDAScFijUmWReMKdONSkC8Va3JTjFVs6PGymXIl7TqKsKgfeCuAB67IV72s9WojV21TkDtLDr6H32U3YlQefH2ZRT22whGg1RLs6Ld7xZ2xk7rAN_5v8uDmtI8Nw1VGZyZje1x3O3me-CQSrW5fHN4OjdvnwoORF0we1eVMS7Q_YRuXSehzxZaT4fjfWg9MLgj9H2Cu2YJ3flEm5q7fOhE07aeDl5tMqXvIB_SvNYzT1M6YXTRnSGSD310SqWIo9NpanFe2c3neUk" alt="Google" />
                Google
              </button>
              <button type="button" class="btn-social">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7nyAZLixe1BLvf50APu-DomYWI7VagKV8DdS9aADQoRDQ9EFD-vbSS4ce4GlCHCFT1X_YvDR9_wV2O-s-1wT-VBuADk9qdlvu-r_pIxOojZI76crh7XyAAi09xc6Ejam1OQjPUe5cTauxNko9tc6gvpZ3xfCNUBwHJaKrSn5Ogp-cbn3JNj8HqXJgKi0zD7dGeEVfTAE3GoYU1qpdhP2s_ottnhsmaoEK4YzZUYsEgRakm8CmE1dBM28Ele7W0TgOc9mlb1uoWko" alt="GitHub" />
                GitHub
              </button>
            </div>
          </div>
          
          <p class="signup-prompt">
            Don't have an account? 
            <router-link to="/signup" class="signup-link">Create an account</router-link>
          </p>
        </div>
      </div>

      <!-- Right Marketing Side -->
      <div class="login-marketing-side">
        <div class="marketing-bg-overlay-1"></div>
        <div class="marketing-bg-overlay-2"></div>
        <div class="marketing-content">
          <div class="marketing-icon">
            <span class="material-symbols-outlined">security</span>
          </div>
          <h2>Secure Infrastructure for Modern Teams</h2>
          <p class="marketing-desc">
            Radix provides enterprise-grade security and blazing-fast performance. Manage your entire ecosystem with confidence.
          </p>
          
          <div class="marketing-stats">
            <div class="stat-item">
              <h3>99.9%</h3>
              <p>Uptime SLA</p>
            </div>
            <div class="stat-item">
              <h3>AES-256</h3>
              <p>Encryption</p>
            </div>
          </div>
          
          <div class="marketing-testimonial">
            <p class="testimonial-quote">"The security features on Radix are unparalleled. Switching was the best decision for our dev team."</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg6oD6SuAhuJxsQRc3j6xjAV7-HcftLlI_rHG1Jf17PJ5hCtnvT3ocG7fBbGrFA5_duWoCBAYGr8-w4KQjwEdUCc7nuuhDHFYA1vUblW7Xa59U3k4ur0rAYJ2pDb591Yvt1pupJ9UBHGUcTc2fXA52QpBWSQFCCBizvoFMpCbw0FMmxoUu-rLoYad4Gsqj6KL4ZBMXXh6OuLl3sIQ4pDiUsYnRMz8yqEtkijZ0G4I0tS8RDzutRIkxOodJoj26zFJVz1_fHhwyea0" alt="Sarah Jenkins" />
              </div>
              <div class="author-info">
                <h4>Sarah Jenkins</h4>
                <p>CTO at TechFlow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotModal" class="modal-overlay" @click.self="closeForgotModal">
      <div class="modal-content">
        <h2>Reset Password</h2>
        <p>Enter your email address to receive a new password.</p>
        <form @submit.prevent="handleForgotPassword">
          <div class="input-group">
            <input type="email" v-model="forgotEmail" placeholder="Email address" required class="modal-input" />
          </div>
          <p v-if="forgotError" class="error-msg">{{ forgotError }}</p>
          <p v-if="forgotSuccess" class="success-msg">{{ forgotSuccess }}</p>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeForgotModal" :disabled="forgotLoading">Cancel</button>
            <button type="submit" class="btn-action" :disabled="forgotLoading">{{ forgotLoading ? 'Sending...' : 'Send' }}</button>
          </div>
        </form>
        <p v-if="info" class="info-msg">{{ info }}</p>
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
      passwordVisible: false,
      loading: false,
      error: '',
      showForgotModal: false,
      forgotEmail: '',
      forgotLoading: false,
      forgotError: '',
      forgotSuccess: '',
      info: ''
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
/* Base Variables & Reset */
.login-wrapper {
  --primary: #1152d4;
  --primary-hover: #0e44b3;
  --bg-main: #f6f6f8;
  --text-main: #0f172a;
  --text-muted: #475569;
  --text-light: #94a3b8;
  --border-color: #e2e8f0;
  --white: #ffffff;
  
  font-family: 'Manrope', -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-main);
  padding: 1.5rem;
}

*, *::before, *::after {
  box-sizing: border-box;
}

a { text-decoration: none; }
button { font-family: inherit; border: none; cursor: pointer; background: none; }

/* Grid Layout */
.login-grid {
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr;
  background-color: var(--white);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(17, 82, 212, 0.05), 0 8px 10px -6px rgba(17, 82, 212, 0.01);
  border: 1px solid var(--border-color);
}

@media (min-width: 1024px) {
  .login-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* --- Left Form Side --- */
.login-form-side {
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .login-form-side {
    padding: 3rem;
  }
}

.login-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.brand-logo {
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-title-area {
  margin-bottom: 2rem;
}

.login-title-area h1 {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.login-title-area p {
  color: var(--text-muted);
  margin: 0;
}

/* Form Styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
}

.forgot-link:hover {
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--text-light);
  font-size: 1.25rem;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  height: 3rem;
  padding-left: 2.5rem;
  padding-right: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: #f8fafc;
  color: var(--text-main);
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
}

.input-wrapper input[type="password"] {
  padding-right: 3rem;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(17, 82, 212, 0.2);
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: var(--text-muted);
}

.remember-me {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #cbd5e1;
  cursor: pointer;
}

.checkbox-label span {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.checkbox-label:hover span {
  color: var(--text-main);
}

.btn-submit {
  width: 100%;
  height: 3.5rem;
  background-color: var(--primary);
  color: var(--white);
  font-weight: 700;
  font-size: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(17, 82, 212, 0.2);
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Messages */
.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
  margin: 0;
}

/* Social Login */
.social-login {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-login p {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-social {
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--white);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-main);
  transition: background-color 0.2s;
}

.btn-social:hover {
  background-color: #f8fafc;
}

.btn-social img {
  width: 1.25rem;
  height: 1.25rem;
}

.signup-prompt {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.signup-link {
  color: var(--primary);
  font-weight: 700;
}

.signup-link:hover {
  text-decoration: underline;
}

/* --- Right Marketing Side --- */
.login-marketing-side {
  display: none;
  position: relative;
  background-color: #0f172a;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .login-marketing-side {
    display: block;
  }
}

.marketing-bg-overlay-1 {
  position: absolute;
  inset: 0;
  background-color: rgba(17, 82, 212, 0.1);
  mix-blend-mode: multiply;
}

.marketing-bg-overlay-2 {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right, #1152d4, rgba(17, 82, 212, 0.8), #312e81);
  opacity: 0.9;
}

.marketing-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  color: var(--white);
  z-index: 10;
}

.marketing-icon {
  margin-bottom: 2rem;
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  width: fit-content;
}

.marketing-icon span {
  font-size: 2.25rem;
}

.marketing-content h2 {
  color: var(--white);
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
}

.marketing-desc {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.625;
  margin: 0 0 2rem 0;
}

.marketing-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item h3 {
  color: var(--white);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.stat-item p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
}

.marketing-testimonial {
  margin-top: auto;
  padding-top: 2.5rem;
}

.testimonial-quote {
  font-size: 0.875rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  margin: 0 0 0.75rem 0;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-left: 1rem;
}

.author-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.2);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h4 {
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 700;
  margin: 0;
}

.author-info p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.625rem;
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--white);
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: var(--text-main);
}

.modal-content p {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 1.5rem 0;
}

.modal-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
}

.modal-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(17, 82, 212, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.375rem;
}

.btn-cancel {
  background-color: #f1f5f9;
  color: var(--text-main);
}

.btn-cancel:hover {
  background-color: #e2e8f0;
}

.btn-action {
  background-color: var(--primary);
  color: var(--white);
}

.btn-action:hover {
  background-color: var(--primary-hover);
}

.success-msg {
  color: #10b981;
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
}

.info-msg {
  margin: 1rem 0 0 0;
  color: #0f766e;
  font-size: 0.875rem;
  text-align: center;
}
</style>