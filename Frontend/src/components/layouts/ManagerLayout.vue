


<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()

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
        <router-link to="/manager/applicants" class="nav-item" active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Applicants
        </router-link>
        <router-link to="/manager/profile" class="nav-item" active-class="active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Profile
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
:root { --primary:#0052CC; --primary-hover:#0043A6; --bg-main:#F4F7F9; --bg-card:#FFFFFF; --bg-sidebar:#FFFFFF; --text-dark:#111827; --text-muted:#6B7280; --border:#E5E7EB; }
.manager-layout { min-height:100vh; display:flex; background-color:var(--bg-main); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; color:var(--text-dark); }
.sidebar { width:250px; background-color:var(--bg-sidebar); border-right:1px solid var(--border); display:flex; flex-direction:column; flex-shrink:0; position:sticky; top:0; height:100vh; }
.sidebar-header { padding:1.5rem; display:flex; align-items:center; gap:.75rem; border-bottom:1px solid var(--border); }
.sidebar-header h2 { font-size:1.1rem; font-weight:700; margin:0; }
.menu-label { padding:1.5rem 1.5rem .5rem; font-size:.7rem; font-weight:700; color:#9CA3AF; letter-spacing:.05em; }
.sidebar-nav { display:flex; flex-direction:column; padding:0 1rem; gap:.25rem; flex-grow:1; }
.nav-item { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem; border-radius:8px; text-decoration:none; color:var(--text-muted); font-size:.95rem; font-weight:500; transition:all .2s; }
.nav-item:hover { background-color:#F9FAFB; color:var(--text-dark); }
.nav-item.active { background-color:var(--primary); color:#fff; }
.system-health { margin:1.5rem; padding:1rem; background-color:#F8FAFC; border-radius:8px; border:1px solid var(--border); }
.health-label { display:block; font-size:.8rem; font-weight:700; margin-bottom:.5rem; }
.health-bar { height:6px; background-color:#E5E7EB; border-radius:3px; margin-bottom:.5rem; overflow:hidden; }
.health-fill { width:98%; height:100%; background-color:#10B981; }
.health-status { font-size:.75rem; color:var(--text-muted); }
.main-wrapper { flex:1; min-width:0; }
.top-header { display:flex; justify-content:space-between; align-items:center; padding:1rem 1.5rem; border-bottom:1px solid var(--border); background:#fff; position:sticky; top:0; z-index:10; }
.search-bar { display:flex; align-items:center; gap:.5rem; background:#F9FAFB; border:1px solid var(--border); border-radius:10px; padding:.65rem .85rem; width:min(420px,100%); }
.search-bar input { border:none; outline:none; background:transparent; width:100%; }
.header-actions { display:flex; align-items:center; gap:1rem; }
.user-profile { display:flex; align-items:center; gap:.75rem; }
.user-text { display:flex; flex-direction:column; align-items:flex-end; }
.user-text span { color:var(--text-muted); font-size:.82rem; }
.avatar { width:40px; height:40px; border-radius:999px; }
.content-area { padding:1.5rem; }
</style>
