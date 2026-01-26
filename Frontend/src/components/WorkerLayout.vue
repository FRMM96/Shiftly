<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const isActive = (path) => route.path === path
</script>

<template>
  <div class="worker-layout">
    
    <header class="top-bar">
      <div class="logo">Shiftly</div>
      <div class="user-avatar">J</div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <nav class="bottom-nav">
      <router-link to="/home" class="nav-item" :class="{ active: isActive('/home') }">
        <span class="icon">📅</span>
        <span class="label">My Shifts</span>
      </router-link>

      <router-link to="/worker/marketplace" class="nav-item" :class="{ active: isActive('/worker/marketplace') }">
        <span class="icon">🔍</span>
        <span class="label">Find Work</span>
      </router-link>

      <router-link to="/worker/earnings" class="nav-item" :class="{ active: isActive('/worker/earnings') }">
        <span class="icon">💰</span>
        <span class="label">Earnings</span>
      </router-link>

      <router-link to="/worker/profile" class="nav-item" :class="{ active: isActive('/worker/profile') }">
        <span class="icon">👤</span>
        <span class="label">Profile</span>
      </router-link>
    </nav>

  </div>
</template>

<style scoped>
.worker-layout {
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding-bottom: 80px; /* Space for bottom nav */
}

/* Top Bar */
.top-bar {
  background: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

.logo { font-weight: 800; font-size: 1.25rem; color: #111; }
.user-avatar {
  width: 32px; height: 32px; background: #111; color: white;
  border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;
}

/* Main Content */
.main-content { padding: 1rem; max-width: 600px; margin: 0 auto; }

/* Bottom Nav */
.bottom-nav {
  position: fixed;
  bottom: 0; left: 0; width: 100%;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  z-index: 100;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.03);
}

.nav-item {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #9ca3af;
  font-size: 0.75rem;
  gap: 4px;
}

.nav-item .icon { font-size: 1.5rem; }

.nav-item.active { color: #111; font-weight: 600; }
</style>