


<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '../../stores/userStore'
import { useNotificationStore } from '../../stores/notificationStore'

const userStore = useUserStore()
const notificationStore = useNotificationStore()

onMounted(() => {
  notificationStore.fetchNotifications().catch(() => {})
})

onMounted(() => {
  if (userStore.token && !userStore.user) {
    userStore.fetchMe().catch(() => {})
  }
})

const currentUser = computed(() => ({
  name: userStore.user?.username || 'Manager',
  role: userStore.user?.company?.name || userStore.user?.role || 'BOSS',
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userStore.user?.username || 'Manager')}&background=0B1736&color=fff`
}))
</script>

<template>
  <div class="manager-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0052CC"/><circle cx="16" cy="16" r="6" fill="white"/><circle cx="8" cy="8" r="2" fill="white"/><circle cx="24" cy="8" r="2" fill="white"/><circle cx="8" cy="24" r="2" fill="white"/><circle cx="24" cy="24" r="2" fill="white"/><line x1="9" y1="9" x2="15" y2="15" stroke="white" stroke-width="2"/></svg>
        <h2>Radix Manager</h2>
      </div>

      <div class="menu-label">MAIN MENU</div>
      <nav class="sidebar-nav">
        <router-link to="/manager" class="nav-item" exact-active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Dashboard
        </router-link>
        <router-link to="/manager/shift" class="nav-item" active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
          Create Shift
        </router-link>
        <router-link to="/manager/staff" class="nav-item" active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Staff Directory
        </router-link>
        <router-link to="/manager/timeoff" class="nav-item" active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Time Off Requests
        </router-link>
        <router-link to="/manager/sick" class="nav-item" active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          Sick Reports
        </router-link>
        <router-link to="/manager/notifications" class="nav-item" active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          Notifications
        </router-link>
        <router-link to="/manager/analytics" class="nav-item" active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          Analytics & Reports
        </router-link>
      </nav>

      <div class="system-health">
        <span class="health-label">Company</span>
        <div class="health-bar"><div class="health-fill"></div></div>
        <span class="health-status">{{ userStore.user?.company?.name || 'No company loaded' }}</span>
      </div>
    </aside>

    <main class="main-wrapper">
      <header class="top-header">
        <div class="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search shifts, applicants..." />
        </div>

        <div class="header-actions">
          <router-link to="/manager/notifications" class="icon-btn notification-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span v-if="notificationStore.unreadCount > 0" class="dot"></span>
          </router-link>
          <button class="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
          
          <router-link to="/manager/profile" class="user-profile" style="text-decoration: none; color: inherit;">
            <div class="user-text">
              <strong>{{ currentUser.name }}</strong>
              <span>{{ currentUser.role }}</span>
            </div>
            <img :src="currentUser.avatar" alt="Avatar" class="avatar" />
          </router-link>
        </div>
      </header>

      <div class="content-area">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* --- Color Palette & Root Variables --- */

.manager-layout {
  min-height: 100vh;
  display: flex;
  background-color: var(--bg-main);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-dark);
}

/* --- Sidebar --- */
.sidebar {
  width: 250px;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.sidebar-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.menu-label {
  padding: 1.5rem 1.5rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #9CA3AF;
  letter-spacing: 0.05em;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  gap: 0.25rem;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #F9FAFB;
  color: var(--text-dark);
}

.nav-item.active {
  background-color: var(--primary);
  color: #FFFFFF;
}

.system-health {
  margin: 1.5rem;
  padding: 1rem;
  background-color: #F8FAFC;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.health-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.health-bar {
  height: 6px;
  background-color: #E5E7EB;
  border-radius: 3px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.health-fill {
  width: 98%;
  height: 100%;
  background-color: #10B981;
}

.health-status {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* --- Main Wrapper & Header --- */
.main-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #F3F4F6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: 300px;
  gap: 0.5rem;
}

.search-bar input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 0.9rem;
  color: var(--text-dark);
  outline: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  display: flex;
}

.icon-btn:hover { color: var(--text-dark); }

.dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #EF4444;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-left: 1px solid var(--border);
  padding-left: 1.5rem;
}

.user-text {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.user-text strong { font-size: 0.9rem; }
.user-text span { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em; }

.avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }

/* --- Content Area --- */
.content-area {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .manager-layout { flex-direction: column; }
  .sidebar { width: 100%; height: auto; position: static; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid var(--border); }
  .sidebar-header { border: none; padding: 0.5rem; }
  .sidebar-nav { flex-direction: row; overflow-x: auto; padding: 0.5rem; }
  .menu-label, .system-health { display: none; }
  .top-header { flex-direction: column-reverse; gap: 1rem; align-items: flex-start; }
  .search-bar { width: 100%; }
}
</style>
