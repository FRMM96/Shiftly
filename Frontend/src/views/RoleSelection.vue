<script setup>
// This is a static UI, so the script section is mostly empty.
// If you wanted to make the buttons interactive, you would add logic here.
</script>

<template>
  <div class="main-container">
    <header class="header">
      <div class="logo-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="#2563EB"/>
        </svg>
        <span class="logo-text">Radix</span>
      </div>
      <div class="user-info">
        <span class="help-link">Need help?</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="#E5E7EB">
          <circle cx="16" cy="16" r="16"/>
        </svg>
      </div>
    </header>

    <main class="main-content">
      <h1 class="page-title">Welcome to Radix</h1>
      <p class="page-subtitle">Choose how you'd like to use the platform to get started. You can always change this later.</p>

      <div class="cards-wrapper">
        <div class="welcome-card">
          <div class="card-image-placeholder worker-image">
            <span>Worker Scene</span>
          </div>
          <div class="card-body">
            <div class="icon-container worker-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#2563EB"><path d="M12 2L1 12L12 22L23 12L12 2Z"/></svg>
            </div>
            <h2 class="card-heading">Are you looking for work?</h2>
            <p class="card-description">Find local opportunities, manage your flexible schedule, and get paid securely for your skills.</p>
            <button class="primary-button">I am a Worker</button>
          </div>
        </div>

        <div class="welcome-card">
          <div class="card-image-placeholder manager-image">
            <span>Manager Scene</span>
          </div>
          <div class="card-body">
            <div class="icon-container manager-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#2563EB"><path d="M12 2L22 12L12 22L2 12L12 2Z"/></svg>
            </div>
            <h2 class="card-heading">Are you looking to hire?</h2>
            <p class="card-description">Post jobs, find qualified local talent, and manage your team efficiently with professional tools.</p>
            <button class="primary-button">I am a Manager</button>
          </div>
        </div>
      </div>

      <div class="role-switch-info">
        <div class="info-icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#374151"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></svg>
        </div>
        <p class="info-text">You can switch between roles later in your profile settings.</p>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-links">
        <a href="#" class="footer-link">PRIVACY POLICY</a>
        <a href="#" class="footer-link">TERMS OF SERVICE</a>
      </div>
      <p class="copyright-text">© 2024 Radix Platform. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
/* CSS Variables for colors based on image */

/* Base Reset to isolate styles for this demo */
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Main Layout */
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--main-text-color);
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--card-bg);
  border-bottom: 1px solid #e5e7eb;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* The diamond-shaped logo created with CSS transform and background */
.logo-icon-diamond {
  width: 24px;
  height: 24px;
  background-color: var(--primary-blue);
  transform: rotate(45deg);
  border-radius: 4px; /* A bit rounded */
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.help-link {
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
}

.help-link:hover {
  color: #111827;
  text-decoration: underline;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  background-color: #E5E7EB;
  border-radius: 50%;
}

/* Main Content Area */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  margin-top: 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  text-align: center;
  color: #111827;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.6;
}

/* Cards Section */
.cards-wrapper {
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 1000px;
  width: 100%;
  margin-bottom: 2.5rem;
}

/* Reusable Welcome Card component styles */
.welcome-card {
  flex: 1;
  max-width: 450px;
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden; /* Round top corners of image */
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Base style for image placeholders */
.card-image-placeholder {
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  color: #9CA3AF;
  text-transform: uppercase;
  background-size: cover;
  background-position: center;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

/* Base64-encoded image placeholders to be replaced with your actual asset paths */
.worker-image {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QAANMAn3P3QAAAABJRU5ErkJggg=="); /* Placeholder Grey */
}

.manager-image {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPgPAAANBAMB5+95AAAAAABJRU5ErkJggg=="); /* Placeholder Grey */
}

.card-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  justify-content: space-between;
}

/* Placeholder icons - to be replaced with real assets */
.icon-placeholder-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-blue);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.25rem;
}

.card-heading {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-top: 0;
  margin-bottom: 0.75rem;
}

.card-description {
  font-size: 0.9375rem;
  color: #6b7280;
  margin-top: 0;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.primary-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.primary-button:hover {
  background-color: #1d4ed8;
}

/* Role Switch Information Bar */
.role-switch-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #e5e7eb;
  padding: 0.75rem 1.25rem;
  border-radius: 20px;
  margin-bottom: 3rem;
}

.info-icon-circle-small {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  color: #374151;
  font-weight: bold;
}

.info-text {
  font-size: 0.8125rem;
  color: #374151;
  margin: 0;
}

/* Footer Styles */
.footer {
  padding: 2rem 1rem;
  background-color: var(--card-bg);
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  font-size: 0.75rem;
  color: var(--link-color);
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.footer-link:hover {
  text-decoration: underline;
}

.copyright-text {
  font-size: 0.75rem;
  color: var(--footer-text-color);
  margin: 0;
}
</style>