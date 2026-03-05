<script setup>
import { ref } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'

// --- Mock Data ---
const stats = ref({
  totalHours: '192.5',
  laborCost: '$4,280',
  onBreak: '3',
  openRoles: '2'
})

const morningShift = ref([
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'SUPERVISOR',
    location: 'Site Area A • Floor 4',
    time: '08:00 - 16:00',
    status: 'active',
    statusColor: 'bg-green-500',
    avatar: 'https://i.pravatar.cc/150?u=alex_rivera',
    showIcons: true
  },
  {
    id: 2,
    name: 'Jordan Smith',
    role: 'ENGINEER',
    location: 'Compliance Check • Section 2',
    time: '08:00 - 16:00',
    status: 'break',
    statusText: 'On Break',
    statusColor: 'bg-orange-500',
    avatar: 'https://i.pravatar.cc/150?u=jordan_smith',
    showIcons: false
  },
  {
    id: 3,
    name: 'Sarah Connor',
    role: 'LOGISTICS',
    location: 'Receiving Dock • North',
    time: '09:00 - 17:00',
    status: 'active',
    statusColor: 'bg-green-500',
    avatar: 'https://i.pravatar.cc/150?u=sarah_connor',
    showIcons: true
  }
])

const eveningShift = ref([
  {
    id: 4,
    name: 'Marcus Wu',
    role: 'SECURITY',
    location: 'Main Entrance • Night Watch',
    time: '16:00 - 00:00',
    status: 'not_started',
    statusText: 'NOT STARTED',
    statusColor: 'bg-gray-400',
    avatar: 'https://i.pravatar.cc/150?u=marcus_wu',
    showIcons: false
  }
])
</script>

<template>
  <ManagerLayout>
    <div class="main-content">
      <div class="page-header">
        <div class="nav-left">
        <div class="date-header">
          <div class="calendar-icon-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h1 class="date-title">Tuesday, Oct 24</h1>
        </div>
        <nav class="nav-tabs">
          <a href="#" class="nav-tab active">Roster</a>
          <a href="#" class="nav-tab">Roles</a>
          <a href="#" class="nav-tab">Schedule</a>
        </nav>
      </div>

      <div class="nav-right">
        <div class="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search staff..." />
        </div>
        <button class="icon-btn border-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </button>
        <button class="icon-btn border-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
      </div>
      </div>
      
      <div class="card stats-card">
        <div class="stats-tabs">
          <button class="stat-tab active">All Workers (24)</button>
          <button class="stat-tab">Morning Shift (12)</button>
          <button class="stat-tab">Evening Shift (12)</button>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">TOTAL HOURS</span>
            <span class="stat-value">{{ stats.totalHours }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">LABOR COST</span>
            <span class="stat-value">{{ stats.laborCost }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">ON BREAK</span>
            <span class="stat-value text-green">{{ stats.onBreak }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">OPEN ROLES</span>
            <span class="stat-value text-blue">{{ stats.openRoles }}</span>
          </div>
        </div>
      </div>

      <section class="shift-section">
        <div class="section-header">
          <div class="section-title-wrapper">
            <svg class="sun-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <h2>Morning Shift</h2>
            <span class="shift-time-range">08:00 - 16:00</span>
          </div>
          <a href="#" class="manage-link">Manage Shift</a>
        </div>

        <div class="worker-list">
          <div v-for="worker in morningShift" :key="worker.id" class="card worker-card">
            
            <div class="worker-left">
              <div class="avatar-wrapper">
                <img :src="worker.avatar" :alt="worker.name" class="avatar" />
                <span class="status-dot" :class="worker.statusColor"></span>
              </div>
              <div class="worker-info">
                <div class="name-role-row">
                  <h3>{{ worker.name }}</h3>
                  <span class="role-badge">{{ worker.role }}</span>
                </div>
                <p class="worker-location">{{ worker.location }}</p>
              </div>
            </div>

            <div class="worker-right">
              <div class="shift-time">{{ worker.time }}</div>
              
              <div v-if="worker.showIcons" class="action-icons">
                <button class="action-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></button>
                <button class="action-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></button>
              </div>
              <div v-else class="status-text" :class="{'text-orange': worker.status === 'break'}">
                {{ worker.statusText }}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section class="shift-section">
        <div class="section-header">
          <div class="section-title-wrapper">
            <svg class="moon-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <h2>Evening Shift</h2>
            <span class="shift-time-range">16:00 - 00:00</span>
          </div>
          <a href="#" class="manage-link">Manage Shift</a>
        </div>

        <div class="worker-list">
          <div v-for="worker in eveningShift" :key="worker.id" class="card worker-card">
            
            <div class="worker-left">
              <div class="avatar-wrapper">
                <img :src="worker.avatar" :alt="worker.name" class="avatar" />
                <span class="status-dot" :class="worker.statusColor"></span>
              </div>
              <div class="worker-info">
                <div class="name-role-row">
                  <h3>{{ worker.name }}</h3>
                  <span class="role-badge">{{ worker.role }}</span>
                </div>
                <p class="worker-location">{{ worker.location }}</p>
              </div>
            </div>

            <div class="worker-right">
              <div class="shift-time">{{ worker.time }}</div>
              <div class="status-text text-gray uppercase">{{ worker.statusText }}</div>
            </div>

          </div>

          <div class="card vacant-card">
            <div class="worker-left">
              <div class="vacant-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              </div>
              <div class="worker-info">
                <h3 class="text-blue">Maintenance Specialist</h3>
                <p class="text-blue opacity-80">Position Vacant • Urgent Need</p>
              </div>
            </div>
            
            <div class="worker-right">
              <button class="btn btn-primary">Assign Staff</button>
            </div>
          </div>

        </div>
      </section>

    </div>
  </ManagerLayout>
</template>

<style scoped>
/* --- Variables --- */
:root {
  --primary: #2563EB;
  --primary-hover: #1D4ED8;
  --primary-light: #EFF6FF;
  --primary-border: #BFDBFE;
  
  --bg-main: #F8FAFC;
  --bg-card: #FFFFFF;
  
  --text-dark: #0F172A;
  --text-body: #334155;
  --text-muted: #64748B;
  
  --border: #E2E8F0;
  
  --color-green: #10B981;
  --color-orange: #F59E0B;
  --color-gray: #9CA3AF;
}

/* --- Page Header --- */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.date-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.calendar-icon-bg {
  background-color: var(--primary-light);
  color: var(--primary);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
}

.nav-tabs {
  display: flex;
  gap: 2rem;
}

.nav-tab {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-tab:hover {
  color: var(--text-dark);
}

.nav-tab.active {
  color: var(--text-dark);
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--bg-main);
  border: 1px solid var(--border);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: 250px;
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

.icon-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s;
}

.border-btn {
  border: 1px solid var(--border);
  background-color: var(--bg-card);
}

.border-btn:hover {
  background-color: var(--bg-main);
  color: var(--text-dark);
}

/* --- Main Content --- */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.card {
  background-color: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

/* --- Stats Card --- */
.stats-card {
  margin-bottom: 2.5rem;
  overflow: hidden;
}

.stats-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  padding: 0 1.5rem;
}

.stat-tab {
  background: none;
  border: none;
  padding: 1.25rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  bottom: -1px;
}

.stat-tab:hover {
  color: var(--text-dark);
}

.stat-tab.active {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 1.5rem;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-dark);
}

.text-green { color: var(--color-green); }
.text-blue { color: var(--primary); }
.text-orange { color: var(--color-orange); }
.text-gray { color: var(--text-muted); }
.uppercase { text-transform: uppercase; font-size: 0.75rem !important; font-weight: 700 !important; letter-spacing: 0.05em;}

/* --- Shift Sections --- */
.shift-section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sun-icon { color: var(--color-orange); }
.moon-icon { color: var(--primary); }

.section-title-wrapper h2 {
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-dark);
}

.shift-time-range {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
}

.manage-link {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}
.manage-link:hover { text-decoration: underline; }

/* Worker Cards */
.worker-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.worker-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
}

.worker-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--bg-card);
}

.bg-green-500 { background-color: var(--color-green); }
.bg-orange-500 { background-color: var(--color-orange); }
.bg-gray-400 { background-color: var(--color-gray); }

.name-role-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.name-role-row h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
}

.role-badge {
  background-color: var(--primary-light);
  color: var(--primary);
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.worker-location {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.worker-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.shift-time {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-dark);
}

.action-icons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0;
  display: flex;
  transition: color 0.2s;
}

.action-btn:hover { color: var(--text-dark); }

.status-text {
  font-size: 0.8rem;
  font-weight: 700;
}

/* --- Vacant Card --- */
.vacant-card {
  background-color: var(--primary-light);
  border: 1px dashed var(--primary-border);
}

.vacant-icon-wrapper {
  width: 44px;
  height: 44px;
  background-color: #DBEAFE;
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vacant-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.vacant-card p {
  font-size: 0.85rem;
  margin: 0;
}

.opacity-80 { opacity: 0.8; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: var(--primary);
  color: #FFFFFF;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .nav-tabs {
    display: none; /* Hide on mobile for simplicity */
  }

  .nav-right {
    width: 100%;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .worker-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .worker-right {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>