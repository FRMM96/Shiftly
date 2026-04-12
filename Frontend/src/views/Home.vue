<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
    router.push('/login')
}

const goToSignup = () => {
    router.push('/signup')
}
</script>

<template>
  <div class="page-container">
    <!-- Navigation -->
    <header class="navbar">
      <div class="nav-brand">
        <div class="brand-icon">
          <!-- logo -->
        </div>
        <h2>Baudix</h2>
      </div>
      <div class="nav-actions">
        <button class="btn-text md-only" @click="goToLogin">Log In</button>
        <button class="btn-primary" @click="goToSignup">Sign Up</button>
      </div>
    </header>

    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-bg-accent"></div>
        <div class="hero-content">
          <div class="hero-badge">
            
            Next Gen Workforce Management
          </div>
          <h1 class="hero-title">
            The heartbeat of your <span class="highlight-text">workforce</span>
          </h1>
          <p class="hero-subtitle">
            Empower your team with real-time insights, automated scheduling, and seamless communication. Baudix is the all-in-one platform built for modern scale.
          </p>
          <div class="hero-buttons">
            <button class="btn-primary-large" @click="goToSignup">Start Free Trial</button>
            <button class="btn-outline-large" @click="goToLogin">Book a Demo</button>
          </div>
          
          <div class="hero-media">
            <div class="media-container">
              <div class="media-overlay"></div>
              <button class="play-button">
                <span class="material-symbols-outlined play-icon">play_arrow</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Grid -->
      <section class="features-section">
        <div class="features-container">
          <div class="features-header">
            <h2 class="features-title">Streamline Your Operations</h2>
            <p class="features-subtitle">Everything you need to manage people, time, and productivity in one intuitive space.</p>
          </div>
          
          <div class="features-grid">
            <!-- Feature 1 -->
            <div class="feature-card">
              <div class="feature-icon-wrapper">
                <span class="material-symbols-outlined">schedule</span>
              </div>
              <h3 class="feature-card-title">Real-time Tracking</h3>
              <p class="feature-card-text">Monitor workforce activity as it happens with live dashboards and instant status updates.</p>
            </div>
            <!-- Feature 2 -->
            <div class="feature-card">
              <div class="feature-icon-wrapper">
                <span class="material-symbols-outlined">calendar_today</span>
              </div>
              <h3 class="feature-card-title">Smart Scheduling</h3>
              <p class="feature-card-text">Automated AI-driven shifts based on demand forecasts and employee availability preferences.</p>
            </div>
            <!-- Feature 3 -->
            <div class="feature-card">
              <div class="feature-icon-wrapper">
                <span class="material-symbols-outlined">insights</span>
              </div>
              <h3 class="feature-card-title">Instant Insights</h3>
              <p class="feature-card-text">Data-driven decisions at your fingertips with custom reports and predictive analytics.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-glow-top-right"></div>
        <div class="cta-glow-bottom-left"></div>
        <div class="cta-container">
          <h2 class="cta-title">Ready to transform your workforce?</h2>
          <p class="cta-subtitle">Join 2,500+ companies using Baudix to optimize their daily operations and scale their impact.</p>
          <button class="btn-cta" @click="goToSignup">Get Started Now</button>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand-col">
          <div class="footer-brand">
            <span class="material-symbols-outlined">adjust</span>
            <h2>Baudix</h2>
          </div>
          <p class="footer-description">Leading the future of workforce optimization. Scalable, secure, and built for people.</p>
        </div>
        
        <div class="footer-links-grid">
          <div class="footer-col">
            <h4>Platform</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Integrations</a>
          </div>
          <div class="footer-col">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Guides</a>
            <a href="#">API Reference</a>
          </div>
          <div class="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">© 2026 Baudix Technologies Inc. All rights reserved.</p>
        <div class="social-links">
          <a href="#"><span class="material-symbols-outlined">share</span></a>
          <a href="#"><span class="material-symbols-outlined">public</span></a>
          <a href="#"><span class="material-symbols-outlined">alternate_email</span></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Reset and Variables */
.page-container {
  --primary: #1152d4;
  --primary-hover: #0e44b3;
  --bg-light: #f6f6f8;
  --text-main: #0f172a; /* slate-900 */
  --text-muted: #475569; /* slate-600 */
  --text-light: #94a3b8; /* slate-400 */
  --border-color: #e2e8f0; /* slate-200 */
  --white: #ffffff;
  
  font-family: 'Manrope', sans-serif;
  color: var(--text-main);
  background-color: var(--bg-light);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--text-main);
  line-height: 1.2;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  font-family: inherit;
  border: none;
  cursor: pointer;
  background: none;
}

/* Material Icons */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Typography elements */
.highlight-text {
  color: var(--primary);
}

/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 50;
}

@media (min-width: 768px) {
  .navbar {
    padding: 1rem 5rem;
  }
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
}

.brand-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon .material-symbols-outlined {
  font-size: 2.25rem;
  font-weight: 700;
}

.nav-brand h2 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.nav-actions {
  display: flex;
  gap: 0.75rem;
}

.md-only {
  display: none;
}

@media (min-width: 768px) {
  .md-only {
    display: flex;
  }
}

/* Buttons */
.btn-text {
  min-width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: #f1f5f9;
  color: var(--text-main);
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.2s;
  padding: 0 1rem;
}

.btn-text:hover {
  background-color: #e2e8f0;
}

.btn-primary {
  display: flex;
  min-width: 100px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: var(--primary);
  color: var(--white);
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 4px 6px -1px rgba(17, 82, 212, 0.2), 0 2px 4px -1px rgba(17, 82, 212, 0.1);
  transition: all 0.2s;
  padding: 0 1rem;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary-large {
  display: flex;
  min-width: 200px;
  height: 3.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-color: var(--primary);
  color: var(--white);
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: 0 20px 25px -5px rgba(17, 82, 212, 0.3), 0 10px 10px -5px rgba(17, 82, 212, 0.1);
  transition: all 0.2s;
  padding: 0 2rem;
}

.btn-primary-large:hover {
  transform: scale(1.02);
}

.btn-outline-large {
  display: flex;
  min-width: 200px;
  height: 3.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  border: 2px solid var(--border-color);
  background-color: var(--white);
  color: var(--text-main);
  font-size: 1.125rem;
  font-weight: 700;
  transition: all 0.2s;
  padding: 0 2rem;
}

.btn-outline-large:hover {
  background-color: #f8fafc;
}

.btn-cta {
  display: flex;
  min-width: 240px;
  height: 3.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-color: var(--white);
  color: var(--primary);
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: all 0.2s;
  padding: 0 2.5rem;
}

.btn-cta:hover {
  transform: scale(1.05);
  background-color: #f8fafc;
}

/* Main Content */
.main-content {
  flex: 1;
}

/* Hero Section */
.hero-section {
  position: relative;
  overflow: hidden;
  padding: 4rem 1.5rem;
}

@media (min-width: 768px) {
  .hero-section {
    padding: 7rem 5rem;
  }
}

.hero-bg-accent {
  position: absolute;
  inset: 0;
  z-index: -10;
  opacity: 0.1;
  background: radial-gradient(circle at 50% 50%, #1152d4 0%, transparent 50%);
}

.hero-content {
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: rgba(17, 82, 212, 0.1);
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-icon {
  font-size: 0.875rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.025em;
  max-width: 56rem;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 4.5rem;
  }
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 1.125rem;
  font-weight: 500;
  max-width: 42rem;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .hero-subtitle {
    font-size: 1.25rem;
  }
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
  justify-content: center;
}

@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
    width: auto;
  }
}

.hero-media {
  margin-top: 4rem;
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-color);
}

.media-container {
  aspect-ratio: 16 / 9;
  background-color: var(--border-color);
  background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCO-VeYhcZM8GAWtBSienAgF8MBS-ko18rV_D0pDT8MyDA8sQGR2v98QvS0ACmSEdJtFD2aKI5JGhzIgR3qxpZlhYTAYPaXqb1rPDf8cE6xA0xy9yUdoS_RD_6P_sEGvq_KabAkEG_oyIPmB-QgwWOL6IVPBpIlamyMCppbemzZLkVC_ITn8lrnu4inCGwwsOLg9FEYAWkzxAs-fV31e0tYe1nJbd0wBXkSJowyd_OOzq7fKkwBjIGebbTycYEtUHsEqR6Ksg-i6Pc");
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.1);
  transition: opacity 0.3s;
}

.media-container:hover .media-overlay {
  opacity: 0;
}

.play-button {
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 50%;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.play-button:hover {
  background-color: var(--white);
  transform: scale(1.1);
}

.play-icon {
  font-size: 2.5rem;
}

/* Features Section */
.features-section {
  padding: 5rem 1.5rem;
  background-color: var(--white);
}

@media (min-width: 768px) {
  .features-section {
    padding: 5rem 5rem;
  }
}

.features-container {
  max-width: 72rem;
  margin: 0 auto;
}

.features-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 4rem;
  text-align: center;
}

@media (min-width: 768px) {
  .features-header {
    text-align: left;
  }
}

.features-title {
  font-size: 1.875rem;
  font-weight: 800;
  line-height: 1.1;
}

@media (min-width: 768px) {
  .features-title {
    font-size: 2.25rem;
  }
}

.features-subtitle {
  color: var(--text-muted);
  font-size: 1.125rem;
  max-width: 42rem;
}

@media (min-width: 768px) {
  .features-subtitle {
    margin: 0;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid #f1f5f9;
  background-color: #f8fafc;
  transition: all 0.3s;
}

.feature-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-0.25rem);
}

.feature-icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: rgba(17, 82, 212, 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.feature-card-text {
  color: var(--text-muted);
  line-height: 1.625;
}

/* CTA Section */
.cta-section {
  padding: 5rem 1.5rem;
  background-color: var(--primary);
  overflow: hidden;
  position: relative;
}

@media (min-width: 768px) {
  .cta-section {
    padding: 5rem 5rem;
  }
}

.cta-glow-top-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 16rem;
  height: 16rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  margin-right: -8rem;
  margin-top: -8rem;
  filter: blur(48px);
}

.cta-glow-bottom-left {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 16rem;
  height: 16rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
  margin-left: -8rem;
  margin-bottom: -8rem;
  filter: blur(48px);
}

.cta-container {
  max-width: 56rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  position: relative;
  z-index: 10;
}

.cta-title {
  color: var(--white);
  font-size: 1.875rem;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

@media (min-width: 768px) {
  .cta-title {
    font-size: 3rem;
  }
}

.cta-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.125rem;
  font-weight: 500;
  max-width: 36rem;
}

@media (min-width: 768px) {
  .cta-subtitle {
    font-size: 1.25rem;
  }
}

/* Footer Section */
.footer {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 4rem 1.5rem;
  background-color: var(--bg-light);
  border-top: 1px solid var(--border-color);
}

@media (min-width: 768px) {
  .footer {
    padding: 4rem 5rem;
  }
}

.footer-container {
  max-width: 72rem;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .footer-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.footer-brand-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 20rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
}

.footer-brand .material-symbols-outlined {
  font-size: 1.875rem;
  font-weight: 700;
}

.footer-brand h2 {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.footer-description {
  color: var(--text-muted);
  font-size: 0.875rem;
  line-height: 1.625;
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
}

@media (min-width: 640px) {
  .footer-links-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-col h4 {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.footer-col a {
  color: var(--text-muted);
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: var(--primary);
}

.footer-bottom {
  max-width: 72rem;
  margin: 0 auto;
  width: 100%;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
  }
}

.copyright {
  color: var(--text-light);
  font-size: 0.875rem;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.social-links a {
  color: var(--text-light);
  transition: color 0.2s;
}

.social-links a:hover {
  color: var(--primary);
}
</style>