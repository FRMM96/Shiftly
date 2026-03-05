<script setup>
import { computed } from 'vue'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()

const user = computed(() => ({
  name: userStore.user?.username || 'Alex'
}))
</script>

<template>
  <div class="app-layout">
    <header class="top-nav">
      <div class="nav-brand">
        <svg class="brand-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="#2563EB"/>
        </svg>
        <span class="brand-text">Radix Worker</span>
      </div>
      
      <nav class="nav-links">
        <router-link to="/worker" class="nav-link" exact-active-class="active">Dashboard</router-link>
        <router-link to="/worker/marketplace" class="nav-link" active-class="active">Find Shifts</router-link>
        <router-link to="/worker/documents" class="nav-link" active-class="active">Documents</router-link>
      </nav>

      <div class="nav-actions">
        <button class="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span class="notification-dot"></span>
        </button>
        <button class="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
        <router-link to="/worker/profile" class="avatar">
           <img src="https://i.pravatar.cc/150?u=alex_worker" alt="User Profile" />
        </router-link>
      </div>
    </header>

    <div class="main-body">
      <aside class="sidebar">
        <div class="sidebar-menu">
          <h3 class="menu-label">MAIN MENU</h3>
          <router-link to="/worker" class="menu-item" exact-active-class="active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </router-link>
          <router-link to="/worker/calendar" class="menu-item" active-class="active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            My Schedule
          </router-link>
          <router-link to="/worker/applications" class="menu-item" active-class="active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Applications
          </router-link>
          <router-link to="/worker/timeoff" class="menu-item" active-class="active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Time Off
          </router-link>
        </div>

        <div class="profile-strength">
          <h4>PROFILE STRENGTH</h4>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill"></div>
          </div>
          <p>85% complete. Add a profile bio to stand out.</p>
        </div>
      </aside>

      <main class="content">
        <slot />
      </main>
    </div>

    <footer class="app-footer">
      <div class="footer-left">
        <div class="help-icon">?</div>
        <span>Need help with your shifts? <a href="#" class="support-link">Contact Support</a></span>
      </div>
      <div class="footer-right">
        <a href="#">Terms of Service</a>
        <a href="#">Privacy Policy</a>
        <div class="footer-icons">
          <div class="icon-box light">L</div>
          <div class="icon-box dark">D</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* --- Base Theme & Reset --- */
:root {
  --bg-color: #f8fafc;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --card-bg: #ffffff;
  --border: #e2e8f0;
}

.app-layout {
  min-height: 100vh;
  background-color: var(--bg-color);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-main);
  display: flex;
  flex-direction: column;
}

/* --- Top Navigation --- */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  width: 28px;
  height: 28px;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.nav-links {
  display: flex;
  gap: 2.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.95rem;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.notification-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
}

.avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

/* --- Main Layout Grid --- */
.main-body {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 3rem;
  gap: 4rem;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

/* --- Sidebar --- */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: #f1f5f9;
  color: var(--text-main);
}

.menu-item.active {
  background-color: var(--primary);
  color: white;
}

.profile-strength {
  background-color: #eff6ff;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 3rem;
}

.profile-strength h4 {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 0.75rem 0;
}

.progress-bar-bg {
  height: 6px;
  background-color: #dbeafe;
  border-radius: 3px;
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.progress-bar-fill {
  width: 85%;
  height: 100%;
  background-color: var(--primary);
  border-radius: 3px;
}

.profile-strength p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

/* --- Main Content Area --- */
.content {
  flex-grow: 1;
  max-width: 950px;
}

/* --- Footer --- */
.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  margin-top: auto;
  border-top: 1px solid var(--border);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.help-icon {
  width: 24px;
  height: 24px;
  background-color: #94a3b8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.support-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.footer-right a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-icons {
  display: flex;
  gap: 0.5rem;
}

.icon-box {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.icon-box.light { background-color: #e2e8f0; color: #64748b; }
.icon-box.dark { background-color: #334155; color: white; }

/* Responsive adjustments */
@media (max-width: 1024px) {
  .main-body { flex-direction: column; padding: 2rem; }
  .sidebar { width: 100%; flex-direction: row; gap: 2rem; }
  .sidebar-menu { flex-direction: row; flex-wrap: wrap; }
  .profile-strength { margin-top: 0; flex: 1; }
}
</style>
