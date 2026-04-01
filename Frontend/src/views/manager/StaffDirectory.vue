<script setup>
import { ref, computed, onMounted } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import UserAvatar from '../../components/shared/UserAvatar.vue'
import { useStaffStore } from '../../stores/staffStore'
import { useUserStore } from '../../stores/userStore'
import { storeToRefs } from 'pinia'

const staffStore = useStaffStore()
const userStore = useUserStore()
const { staffList, searchQuery, selectedDepartment, selectedStatus, loading } = storeToRefs(staffStore)

const showInviteModal = ref(false)
const inviteCode = computed(() => userStore.user?.company?.inviteCode || 'N/A')
const copied = ref(false)

const copyInviteCode = () => {
  navigator.clipboard.writeText(inviteCode.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }).catch(() => {})
}

const currentPage = ref(1)
const perPage = 6

const filteredStaff = computed(() => {
  let list = staffList.value
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    )
  }
  if (selectedDepartment.value !== 'All') {
    list = list.filter(s => s.department === selectedDepartment.value)
  }
  if (selectedStatus.value !== 'All') {
    list = list.filter(s => s.status === selectedStatus.value)
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredStaff.value.length / perPage)))
const paginatedStaff = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredStaff.value.slice(start, start + perPage)
})
const showingFrom = computed(() => filteredStaff.value.length === 0 ? 0 : (currentPage.value - 1) * perPage + 1)
const showingTo = computed(() => Math.min(currentPage.value * perPage, filteredStaff.value.length))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const handleClear = () => {
  staffStore.clearFilters()
  currentPage.value = 1
}

onMounted(() => {
  staffStore.fetchEmployees().catch(() => {})
})
const filteredStaff = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return staffStore.staffList
  return staffStore.staffList.filter(s =>
    (s.name || '').toLowerCase().includes(q) ||
    (s.email || '').toLowerCase().includes(q)
  )
})

function openProfile(id) {
  router.push(`/manager/staff/${id}`)
}
</script>

<template>
  <ManagerLayout>
        
        <div class="page-header">
          <div class="header-title">
            <h1>Staff Directory</h1>
            <p>Manage and monitor {{ filteredStaff.length }} active personnel across departments.</p>
          </div>
          <button class="btn btn-primary" @click="showInviteModal = true">
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
              {{ selectedDepartment === 'All' ? 'All Departments' : selectedDepartment }}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            <div class="dropdown-btn">
              Status: {{ selectedStatus }}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            <button class="clear-filters-btn" @click="handleClear">Clear all filters</button>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading staff directory...</p>
        </div>

        <div v-if="!loading && filteredStaff.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <h3>No staff members found</h3>
          <p>There are no staff members matching your current filters.</p>
        </div>

        <div v-if="!loading && filteredStaff.length > 0" class="staff-grid">
          <div v-for="staff in paginatedStaff" :key="staff.id" class="staff-card">
            
            <div class="card-header">
              <UserAvatar
                :image-url="staff.avatar"
                :name="staff.name"
                :status-color="staff.dotColor.replace('bg-', '')"
                size="md"
              />
              
              <div class="staff-header-info">
                <h3>{{ staff.name }}</h3>
                <p>{{ staff.role }}</p>
              </div>

      <div v-if="staffStore.loading">Loading staff…</div>
      <div v-else-if="staffStore.error">{{ staffStore.error }}</div>
      <div v-else-if="filteredStaff.length === 0">No employees found.</div>

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

        <div v-if="filteredStaff.length > perPage" class="pagination-section">
          <span class="showing-text">Showing {{ showingFrom }} to {{ showingTo }} of {{ filteredStaff.length }} results</span>

          <div class="pagination-controls">
            <button class="page-btn nav-arr" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >{{ page }}</button>
            <button class="page-btn nav-arr" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
          </div>
        </div>
      </div>
    </div>
  </ManagerLayout>

  <div v-if="showInviteModal" class="modal-overlay" @click.self="showInviteModal = false">
    <div class="modal-box">
      <h3>Invite New Worker</h3>
      <p>Share this invite code with the worker. They'll use it during sign up to join your company.</p>
      <div class="invite-code-display">
        <code>{{ inviteCode }}</code>
        <button class="copy-btn" @click="copyInviteCode">
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <button class="btn btn-primary modal-close-btn" @click="showInviteModal = false">Done</button>
    </div>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1rem; }
h1 { margin: 0; font-size: 2rem; font-weight: 800; }
.search {
  width: 100%;
  max-width: 500px;
  padding: 0.9rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  margin-bottom: 0.75rem;
}
button {
  margin-top: 0.75rem;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  background: #0f172a;
  color: #fff;
  cursor: pointer;
}

/* Loading & Empty States */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-muted);
  font-weight: 500;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.8;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

/* Invite Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff; border-radius: 16px; padding: 2rem;
  max-width: 400px; width: 90%; text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-box h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; }
.modal-box p { color: #6B7280; font-size: 0.9rem; margin: 0 0 1.5rem; }
.invite-code-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: #F3F4F6;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
.invite-code-display code {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--primary);
}
.copy-btn {
  background-color: var(--primary);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}
.copy-btn:hover { opacity: 0.9; }
.modal-close-btn { width: 100%; margin-top: 0; }
</style>