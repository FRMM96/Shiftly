<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import api from '../../services/api'

const router = useRouter()
const activeTab = ref('pending')
const applications = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    // Fetch marketplace shifts to get the user's applications
    const res = await api.get('/marketplace/shifts')
    const shifts = res.data.shifts || []
    // Collect all applications from shifts where user has applied
    const allApps = []
    for (const shift of shifts) {
      if (Array.isArray(shift.applications)) {
        for (const app of shift.applications) {
          allApps.push({
            id: app.id,
            title: shift.roleName || 'Shift',
            business: shift.business,
            date: new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            refId: app.id.substring(0, 6).toUpperCase(),
            status: app.status,
            shiftId: shift.id
          })
        }
      }
    }
    applications.value = allApps
  } catch (e) {
    console.error('Failed to load applications:', e)
  } finally {
    loading.value = false
  }
})

const pendingApps = computed(() =>
  applications.value.filter(a => a.status === 'PENDING').map(a => ({
    ...a,
    statusLabel: 'PENDING REVIEW',
    statusType: 'warning-light',
    iconType: 'clock'
  }))
)

const approvedApps = computed(() =>
  applications.value.filter(a => a.status === 'ACCEPTED').map(a => ({
    ...a,
    statusLabel: 'APPROVED',
    statusType: 'success',
    iconType: 'check'
  }))
)

const deniedApps = computed(() =>
  applications.value.filter(a => a.status === 'REJECTED').map(a => ({
    ...a,
    statusLabel: 'DENIED',
    statusType: 'danger',
    iconType: 'cross'
  }))
)

const goToMarketplace = () => router.push('/worker/marketplace')
</script>

<template>
  <WorkerLayout>
    <div class="main-column">
        
        <header class="top-header">
          <div class="header-left">
            <div class="app-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
            <h1>My Applications</h1>
          </div>
          
          <div class="header-right">
            <div class="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search applications" />
            </div>
            
            <button class="icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            </button>
            <button class="icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <img src="https://i.pravatar.cc/150?u=baudix_worker" alt="User" class="avatar" />
          </div>
        </header>

        <main class="content-area">
          <div class="tabs-container">
            <button class="tab" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">Pending ({{ pendingApps.length }})</button>
            <button class="tab" :class="{ active: activeTab === 'approved' }" @click="activeTab = 'approved'">Approved ({{ approvedApps.length }})</button>
            <button class="tab" :class="{ active: activeTab === 'denied' }" @click="activeTab = 'denied'">Denied ({{ deniedApps.length }})</button>
          </div>

          <div v-if="activeTab === 'pending'" class="section-container">
            <div class="section-header">
              <h3>Recent Applications</h3>
              <a class="new-app-link" @click.prevent="goToMarketplace" style="cursor:pointer">
                New Application
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </a>
            </div>

            <div v-if="pendingApps.length === 0">No pending applications at the moment.</div>
            <div v-else class="card-list">
              <div v-for="app in pendingApps" :key="app.id" class="app-card solid-border">
                <div class="card-left">
                  <div class="icon-wrapper" :class="'bg-' + app.statusType">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div class="app-details">
                    <h4>{{ app.title }}</h4>
                    <p>Applied on {{ app.date }} <span class="dot">•</span> Ref: {{ app.refId }}</p>
                  </div>
                </div>
                <div class="card-right">
                  <span class="status-badge" :class="'badge-' + app.statusType">{{ app.statusLabel || app.status }}</span>
                  <svg class="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'approved'" class="section-container">
            <div class="section-header">
              <h3>Approved Applications</h3>
            </div>
            
            <div v-if="approvedApps.length === 0">No approved applications yet.</div>
            <div v-else class="card-list">
              <div v-for="app in approvedApps" :key="app.id" class="app-card dashed-border">
                <div class="card-left">
                  <div class="icon-wrapper" :class="'bg-' + app.statusType">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div class="app-details">
                    <h4>{{ app.title }}</h4>
                    <p>Approved on {{ app.date }} <span class="dot">•</span> Ref: {{ app.refId }}</p>
                  </div>
                </div>
                <div class="card-right">
                  <span class="status-badge" :class="'badge-' + app.statusType">{{ app.statusLabel || app.status }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'denied'" class="section-container">
            <div class="section-header muted-header">
              <h3>RECENTLY DENIED</h3>
            </div>

            <div v-if="deniedApps.length === 0">No denied applications.</div>
            <div v-else class="card-list">
              <div v-for="app in deniedApps" :key="app.id" class="app-card dashed-border">
                <div class="card-left">
                  <div class="icon-wrapper" :class="'bg-' + app.statusType">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </div>
                  <div class="app-details">
                    <h4>{{ app.title }}</h4>
                    <p>Denied on {{ app.date }} <span class="dot">•</span> Ref: {{ app.refId }}</p>
                  </div>
                </div>
                <div class="card-right">
                  <span class="status-badge" :class="'badge-' + app.statusType">{{ app.statusLabel || app.status }}</span>
                </div>
              </div>
            </div>
          </div>

        </main>
    </div>
  </WorkerLayout>
</template>

<style scoped>
/* --- Color Palette & Variables --- */

/* --- Layout Wrappers --- */
.page-wrapper {
  min-height: 100vh;
  background-color: var(--bg-outer);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  max-width: 1200px;
  height: 90vh; /* Fixed height to match a "portal" window */
  min-height: 800px;
  background-color: var(--bg-inner);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  display: flex;
  overflow: hidden;
}

/* --- Sidebar --- */
.sidebar {
  width: 260px;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  background-color: var(--bg-inner);
  flex-shrink: 0;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-logo svg {
  width: 36px;
  height: 36px;
}

.brand-info h2 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 0.15rem 0;
}

.brand-info p {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item svg {
  color: var(--text-muted);
}

.nav-item:hover {
  background-color: var(--bg-hover);
  color: var(--text-dark);
}

.nav-item.active {
  background-color: var(--bg-active-nav);
  color: var(--primary);
}

.nav-item.active svg {
  color: var(--primary);
}

/* --- Main Content Column --- */
.main-column {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-inner);
  overflow-y: auto;
}

/* --- Top Header --- */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background-color: var(--bg-inner);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--bg-active-nav);
  color: var(--primary);
  border-radius: 8px;
}

.header-left h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 12px;
  color: #9CA3AF;
}

.search-box input {
  background-color: var(--bg-outer);
  border: none;
  padding: 0.6rem 1rem 0.6rem 2.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 240px;
  color: var(--text-dark);
}

.search-box input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 71, 255, 0.2);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  background-color: var(--bg-inner);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: var(--bg-hover);
  color: var(--text-dark);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

/* --- Content Area --- */
.content-area {
  padding: 2.5rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* Tabs */
.tabs-container {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
}

.tab {
  background: none;
  border: none;
  padding: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  bottom: -1px;
}

.tab:hover {
  color: var(--text-dark);
}

.tab.active {
  color: var(--primary);
  font-weight: 600;
  border-bottom: 2px solid var(--primary);
}

/* Section Styling */
.section-container {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.new-app-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}

.new-app-link:hover {
  text-decoration: underline;
}

.muted-header h3 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94A3B8;
  font-weight: 700;
}

/* Card Lists */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
}
.card h2 { margin: 0 0 1rem; }
.list { display: flex; flex-direction: column; gap: 0.75rem; }
.item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}
</style>