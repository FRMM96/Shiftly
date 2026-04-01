<script setup>
import { computed, onMounted, ref } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import StatusBadge from '../../components/shared/StatusBadge.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import TabBar from '../../components/shared/TabBar.vue'
import LoadMoreButton from '../../components/shared/LoadMoreButton.vue'
import { useRouter } from 'vue-router'
import { useShiftStore } from '../../stores/shiftStore'
import { storeToRefs } from 'pinia'

const shiftStore = useShiftStore()
const { loading } = storeToRefs(shiftStore)

onMounted(() => {
  shiftStore.fetchMarketplace().catch(() => {})
})

// --- State ---
const applying = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

const activeTab = ref('available')

// --- Filters ---
const filterDate = ref('')
const filterRole = ref('')
const filterMinPay = ref('')
const showDateFilter = ref(false)
const showRoleFilter = ref(false)
const showPayFilter = ref(false)

const uniqueRoles = computed(() => {
  const roles = new Set(shiftStore.shifts.map(s => s.roleName || s.role).filter(Boolean))
  return [...roles]
})

const clearFilters = () => {
  filterDate.value = ''
  filterRole.value = ''
  filterMinPay.value = ''
}

const hasActiveFilters = computed(() => filterDate.value || filterRole.value || filterMinPay.value)

// --- Data bound to store with fallback ---
const openShifts = computed(() => {
  if (activeTab.value !== 'available') {
    return []
  }

  let filtered = shiftStore.shifts

  if (filterDate.value) {
    filtered = filtered.filter(s => s.date === filterDate.value)
  }
  if (filterRole.value) {
    filtered = filtered.filter(s => (s.roleName || s.role) === filterRole.value)
  }
  if (filterMinPay.value) {
    const min = parseFloat(filterMinPay.value)
    if (!isNaN(min)) {
      filtered = filtered.filter(s => {
        const pay = parseFloat(String(s.pay).replace(/[^0-9.]/g, ''))
        return !isNaN(pay) && pay >= min
      })
    }
  }

  return filtered.map((s, index) => {
    const bgImages = [
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400&h=200',
      'https://images.unsplash.com/photo-1478860409688-df42af707b62?auto=format&fit=crop&q=80&w=400&h=200',
      'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=400&h=200'
    ]
    return {
      id: s.id,
      badgeText: s.priority === 'URGENT' ? 'URGENT' : s.priority === 'LOW' ? 'LOW PRIORITY' : 'AVAILABLE',
      badgeType: s.priority === 'URGENT' ? 'success' : 'info',
      pay: s.pay || 'TBD',
      title: s.role || s.roleName,
      company: s.business,
      time: `${s.startTime || 'TBD'} - ${s.endTime || 'TBD'}`,
      date: s.date,
      mapImage: bgImages[index % bgImages.length],
      location: s.business
    }
  })
})

const handleApply = async (shift) => {
  if (!confirm(`Apply for ${shift.title} at ${shift.company}?`)) return
  applying.value = true
  try {
    await shiftStore.fetchMarketplace()
  } catch (e) {
    error.value = e.message || 'Failed to load marketplace shifts'
  } finally {
    loading.value = false
  }
}

async function handleApply(shiftId) {
  try {
    await shiftStore.applyToShift(shiftId)
    alert('Application sent successfully.')
  } catch (e) {
    alert(e.message || 'Failed to apply')
  }
}

onMounted(loadMarketplace)

const filteredShifts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return shiftStore.marketplaceShifts

  return shiftStore.marketplaceShifts.filter(shift =>
    (shift.roleName || shift.role || '').toLowerCase().includes(q) ||
    (shift.business || '').toLowerCase().includes(q) ||
    (shift.location || '').toLowerCase().includes(q)
  )
})
</script>

<template>
  <WorkerLayout>
    <div class="main-content">
      <TabBar
        :tabs="[
          { value: 'available', label: 'Available Shifts' },
          { value: 'applied', label: 'Applied' },
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'archived', label: 'Archived' }
        ]"
        v-model="activeTab"
        style="margin-bottom: 1.5rem;"
      />

      <div class="filters-bar">
        <div class="filters-left">
          <div class="filter-dropdown">
            <button class="filter-btn" @click="showDateFilter = !showDateFilter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {{ filterDate || 'Date: All' }}
              <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div v-if="showDateFilter" class="dropdown-menu">
              <input type="date" v-model="filterDate" class="filter-input" @change="showDateFilter = false" />
              <button v-if="filterDate" class="dropdown-clear" @click="filterDate = ''; showDateFilter = false">Clear</button>
            </div>
          </div>

          <div class="filter-dropdown">
            <button class="filter-btn" @click="showRoleFilter = !showRoleFilter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              {{ filterRole || 'Role: All' }}
              <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div v-if="showRoleFilter" class="dropdown-menu">
              <button class="dropdown-item" @click="filterRole = ''; showRoleFilter = false">All Roles</button>
              <button v-for="role in uniqueRoles" :key="role" class="dropdown-item" @click="filterRole = role; showRoleFilter = false">{{ role }}</button>
            </div>
          </div>

          <div class="filter-dropdown">
            <button class="filter-btn" @click="showPayFilter = !showPayFilter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              {{ filterMinPay ? `Min: ${filterMinPay}` : 'Pay Range' }}
              <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div v-if="showPayFilter" class="dropdown-menu">
              <input type="number" v-model="filterMinPay" placeholder="Min pay..." class="filter-input" />
              <button class="dropdown-clear" @click="filterMinPay = ''; showPayFilter = false">Clear</button>
            </div>
          </div>
        </div>
        <button v-if="hasActiveFilters" class="filter-btn more-filters" @click="clearFilters">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Clear Filters
        </button>
      </div>

      <div class="list-header">
        <h2>Open Shifts</h2>
        <span class="shift-count">Showing {{ openShifts.length }} available shift{{ openShifts.length !== 1 ? 's' : '' }}</span>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading available shifts...</p>
      </div>

      <div v-if="!loading && openShifts.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <h3>No shifts available right now</h3>
        <p>Check back later or adjust your filters.</p>
      </div>

      <div v-if="!loading && openShifts.length > 0" class="shift-list">
        <div v-for="shift in openShifts" :key="shift.id" class="shift-card">
          
          <div class="card-content">
            <div class="card-top-meta">
              <StatusBadge :text="shift.badgeText" :type="shift.badgeType" />
              <span class="pay-rate">{{ shift.pay }}</span>
            </div>
            
            <h3 class="job-title">{{ shift.title }}</h3>
            
            <div class="job-meta">
              <span class="company">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                {{ shift.company }}
              </span>
              <span class="dot-separator">•</span>
              <span class="time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {{ shift.time || shift.date }}
              </span>
            </div>

            <div class="card-actions">
              <button class="btn btn-primary" :disabled="applying" @click="handleApply(shift)">{{ applying ? 'Applying...' : 'Apply Now' }}</button>
              <router-link :to="`/worker/marketplace/${shift.id}`" class="btn btn-icon" title="More Info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </router-link>
            </div>
          </div>

            <div class="meta">
              <span>{{ shift.date }}</span>
              <span>{{ shift.startTime }} - {{ shift.endTime }}</span>
              <span v-if="shift.location">{{ shift.location }}</span>
            </div>

            <p v-if="shift.notes" class="notes">{{ shift.notes }}</p>
          </div>

  <ConfirmModal
    :is-open="showModal"
    :title="modalSuccess ? 'Applied!' : 'Error'"
    :message="modalMessage"
    :type="modalSuccess ? 'success' : 'danger'"
    @close="closeModal"
  />

</template>

<style scoped>

/* --- Main Content --- */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  width: 100%;
}

/* --- Tabs --- */
.tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
}

.tabs-left { display: flex; gap: 2rem; }

.tab {
  background: none;
  border: none;
  padding: 0.75rem 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  bottom: -1px;
}

.tab:hover { color: var(--text-main); }
.tab.active {
  color: var(--text-main);
  font-weight: 600;
  border-bottom: 2px solid var(--primary);
}

/* --- Filters --- */
.filters-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.filters-left { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn svg { color: #9CA3AF; }
.filter-btn .chevron { margin-left: 0.25rem; }

.filter-btn:hover { background-color: #F8FAFC; border-color: #D1D5DB; }

.filter-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 20;
  min-width: 180px;
  padding: 0.5rem;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 4px;
  color: var(--text-main);
}
.dropdown-item:hover { background-color: #F3F4F6; }

.filter-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.85rem;
  outline: none;
  box-sizing: border-box;
}

.dropdown-clear {
  display: block;
  width: 100%;
  padding: 0.4rem;
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}

.more-filters {
  background-color: #EFF6FF;
  border-color: #DBEAFE;
  color: var(--primary);
  font-weight: 600;
}

.header h1 {
  margin: 0 0 0.25rem;
  font-size: 2rem;
  font-weight: 800;
}

.header p {
  margin: 0;
  color: #64748b;
}

.search-bar input {
  width: 100%;
  max-width: 520px;
  padding: 0.9rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
}

.shift-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shift-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem 1.1rem;
}

.shift-main {
  flex: 1;
}

.shift-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.pay-rate {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--primary);
}

.business {
  margin: 0.35rem 0 0.5rem;
  color: #0f172a;
  font-weight: 600;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  color: #64748b;
  font-size: 0.92rem;
}

.notes {
  margin-top: 0.65rem;
  color: #475569;
}

.shift-actions {
  display: flex;
  align-items: center;
}

.apply-btn {
  border: none;
  border-radius: 10px;
  background: #0f172a;
  color: #fff;
  padding: 0.8rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.28rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.badge-global {
  background: #ede9fe;
  color: #6d28d9;
}

.badge-company {
  background: #dcfce7;
  color: #166534;
}

.error {
  color: #b91c1c;
}

.empty {
  color: #64748b;
}

@media (max-width: 700px) {
  .shift-card {
    flex-direction: column;
  }

  .shift-actions {
    justify-content: flex-start;
  }
}
.success-icon { background: #DCFCE3; color: #16A34A; }
.error-icon { background: #FEE2E2; color: #DC2626; }
.modal-box h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; }
.modal-box p { color: #6B7280; font-size: 0.95rem; margin: 0 0 1.5rem; }
.modal-close-btn { width: 100%; }

/* Loading & Empty States */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: #ffffff;
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
</style>