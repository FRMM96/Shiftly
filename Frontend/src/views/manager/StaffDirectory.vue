<script setup>
import { ref } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'

// --- Mock Data ---
const currentUser = ref({
  avatar: 'https://i.pravatar.cc/150?u=manager_admin'
})

const staffList = ref([
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Senior DevOps Engineer',
    department: 'Engineering',
    team: 'Platform Team',
    email: 's.chen@radix.io',
    status: 'Approved',
    statusType: 'success',
    dotColor: 'bg-green',
    avatar: 'https://i.pravatar.cc/150?u=sarah_chen',
    initials: 'SC'
  },
  {
    id: 2,
    name: 'Marcus Thompson',
    role: 'Lead Product Designer',
    department: 'Design',
    team: 'UX Strategy',
    email: 'm.thompson@radix.io',
    status: 'Pending Review',
    statusType: 'info',
    dotColor: 'bg-yellow',
    avatar: 'https://i.pravatar.cc/150?u=marcus_thompson',
    initials: 'MT'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Frontend Developer',
    department: 'Engineering',
    team: 'UI Core Team',
    email: 'e.rodriguez@radix.io',
    status: 'Approved',
    statusType: 'success',
    dotColor: 'bg-green',
    avatar: 'https://i.pravatar.cc/150?u=elena_rodriguez',
    initials: 'ER'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Solutions Architect',
    department: 'Sales Engineering',
    team: '',
    email: 'd.kim@radix.io',
    status: 'Inactive',
    statusType: 'neutral',
    dotColor: 'bg-gray',
    avatar: 'https://i.pravatar.cc/150?u=david_kim',
    initials: 'DK'
  },
  {
    id: 5,
    name: 'Jordan Taylor',
    role: 'Backend Engineer',
    department: 'Engineering',
    team: 'Data Systems',
    email: 'j.taylor@radix.io',
    status: 'Approved',
    statusType: 'success',
    dotColor: 'bg-green',
    avatar: null, // No avatar to show initial placeholder
    initials: 'JT'
  },
  {
    id: 6,
    name: 'Aisha Khan',
    role: 'Growth Marketing Manager',
    department: 'Marketing',
    team: 'Retention',
    email: 'a.khan@radix.io',
    status: 'Approved',
    statusType: 'success',
    dotColor: 'bg-green',
    avatar: 'https://i.pravatar.cc/150?u=aisha_khan',
    initials: 'AK'
  }
])

const searchQuery = ref('')
</script>

<template>
  <ManagerLayout>
        
        <div class="page-header">
          <div class="header-title">
            <h1>Staff Directory</h1>
            <p>Manage and monitor 124 active personnel across departments.</p>
          </div>
          <button class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Add New Worker
          </button>
        </div>

        <div class="filter-section">
          <div class="main-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" v-model="searchQuery" placeholder="Search by name, role, or department..." />
          </div>
          
          <div class="filter-controls">
            <div class="dropdown-btn">
              All Departments
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
            <div class="filter-pill">
              Engineering
              <button class="remove-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
            
            <div class="dropdown-btn">
              Marketing
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
            <div class="dropdown-btn">
              Status: Active
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            <button class="clear-filters-btn">Clear all filters</button>
          </div>
        </div>

        <div class="staff-grid">
          <div v-for="staff in staffList" :key="staff.id" class="staff-card">
            
            <div class="card-header">
              <div class="avatar-wrapper">
                <img v-if="staff.avatar" :src="staff.avatar" :alt="staff.name" class="staff-avatar" />
                <div v-else class="avatar-placeholder">{{ staff.initials }}</div>
                <span class="status-dot" :class="staff.dotColor"></span>
              </div>
              
              <div class="staff-header-info">
                <h3>{{ staff.name }}</h3>
                <p>{{ staff.role }}</p>
              </div>

              <button class="options-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
              </button>
            </div>

            <div class="card-body">
              <div class="detail-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>{{ staff.department }} <template v-if="staff.team">• {{ staff.team }}</template></span>
              </div>
              <div class="detail-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>{{ staff.email }}</span>
              </div>
            </div>

            <div class="card-footer">
              <span class="status-badge" :class="`badge-${staff.statusType}`">{{ staff.status }}</span>
              <span class="initials-badge">{{ staff.initials }}</span>
            </div>
            
          </div>
        </div>

        <div class="pagination-section">
          <span class="showing-text">Showing 1 to 6 of 124 results</span>
          
          <div class="pagination-controls">
            <button class="page-btn nav-arr"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <span class="page-dots">...</span>
            <button class="page-btn">21</button>
            <button class="page-btn nav-arr"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
          </div>
        </div>

  </ManagerLayout>
</template>

<style scoped>

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.header-title h1 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.header-title p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: var(--primary);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(0, 82, 204, 0.2);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

/* Filter Section */
.filter-section {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.main-search {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  gap: 0.75rem;
}

.main-search input {
  border: none;
  width: 100%;
  font-size: 1rem;
  color: var(--text-dark);
  outline: none;
}

.filter-controls {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-body);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}
.dropdown-btn svg { color: var(--text-muted); }

.filter-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #EFF6FF;
  color: var(--primary);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.remove-pill {
  background: none;
  border: none;
  color: var(--primary);
  display: flex;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
}
.remove-pill:hover { opacity: 1; }

.clear-filters-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: auto;
}
.clear-filters-btn:hover { text-decoration: underline; }

/* --- Staff Grid --- */
.staff-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.staff-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.staff-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.04);
  border-color: #CBD5E1;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar-wrapper {
  position: relative;
}

.staff-avatar, .avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #F8FAFC;
}

.avatar-placeholder {
  background-color: #E0E7FF;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2.5px solid #FFFFFF;
}

.bg-green { background-color: var(--dot-green); }
.bg-yellow { background-color: var(--dot-yellow); }
.bg-gray { background-color: var(--dot-gray); }

.staff-header-info {
  flex-grow: 1;
  padding-top: 0.25rem;
}

.staff-header-info h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.15rem 0;
  color: var(--text-dark);
}

.staff-header-info p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.options-btn {
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0;
}
.options-btn:hover { color: var(--text-dark); }

/* Card Body */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-body);
}

.detail-row svg {
  color: #9CA3AF;
  flex-shrink: 0;
}

/* Card Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-light);
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
}

.badge-success { background-color: var(--success-bg); color: var(--success-text); }
.badge-info { background-color: var(--info-bg); color: var(--info-text); }
.badge-neutral { background-color: var(--neutral-bg); color: var(--neutral-text); }

.initials-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  background-color: #F1F5F9;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* --- Pagination --- */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
}

.showing-text {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(.active) {
  background-color: var(--border-light);
}

.page-btn.active {
  background-color: var(--primary);
  color: #FFFFFF;
}

.page-btn.nav-arr {
  border-color: var(--border);
  color: var(--text-muted);
}
.page-btn.nav-arr:hover {
  background-color: var(--border-light);
}

.page-dots {
  color: #9CA3AF;
  padding: 0 0.25rem;
}

/* --- Responsive Adjustments --- */
@media (max-width: 1200px) {
  .staff-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .app-layout { flex-direction: column; }
  .sidebar { width: 100%; height: auto; position: static; flex-direction: row; border-right: none; border-bottom: 1px solid var(--border); padding: 1rem 1.5rem; align-items: center; justify-content: space-between; }
  .sidebar-header { margin: 0; padding: 0; }
  .sidebar-nav, .storage-widget, .sidebar-divider { display: none; }
  
  .filter-controls { flex-direction: column; align-items: flex-start; }
  .clear-filters-btn { margin-left: 0; margin-top: 0.5rem; }
}

@media (max-width: 768px) {
  .staff-grid { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .pagination-section { flex-direction: column; gap: 1rem; }
}
</style>