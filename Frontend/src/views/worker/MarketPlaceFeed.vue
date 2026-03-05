<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import StatusBadge from '../../components/shared/StatusBadge.vue'
import { useRouter } from 'vue-router'
import { useShiftStore } from '../../stores/shiftStore'

const router = useRouter()
const shiftStore = useShiftStore()

onMounted(() => {
  shiftStore.fetchMarketplace().catch(() => {})
})

// --- State ---
const applying = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

// --- Data bound to store with fallback ---
const openShifts = computed(() => {
  if (shiftStore.shifts.length > 0) {
    return shiftStore.shifts.map((s, index) => {
      const bgImages = [
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400&h=200',
        'https://images.unsplash.com/photo-1478860409688-df42af707b62?auto=format&fit=crop&q=80&w=400&h=200',
        'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=400&h=200'
      ]
      return {
        id: s.id,
        badgeText: 'HIGH PRIORITY',
        badgeType: 'success',
        pay: s.pay || 'TBD',
        title: s.role || s.roleName,
        company: s.business,
        time: `${s.startTime || 'TBD'} - ${s.endTime || 'TBD'}`,
        date: s.date,
        mapImage: bgImages[index % bgImages.length],
        location: s.business
      }
    })
  }

  return [
    {
      id: 1,
      badgeText: 'HIGH PRIORITY',
      badgeType: 'success',
      pay: '$85.00 / hr',
      title: 'Lead Systems Administrator',
      company: 'Radix Logistics HQ',
      time: '8:00 AM - 5:00 PM',
      mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400&h=200',
      location: 'Financial District'
    },
    {
      id: 2,
      badgeText: 'QUICK APPLY',
      badgeType: 'info',
      pay: '$62.50 / hr',
      title: 'Frontend Security Auditor',
      company: 'CyberSecure Labs',
      time: '10:00 PM - 6:00 AM (Night)',
      mapImage: 'https://images.unsplash.com/photo-1478860409688-df42af707b62?auto=format&fit=crop&q=80&w=400&h=200',
      location: 'Remote / HQ'
    },
    {
      id: 3,
      badgeText: 'ONE-TIME SHIFT',
      badgeType: 'warning',
      pay: '$120.00 / hr',
      title: 'Incident Response Coordinator',
      company: 'National Data Center',
      date: 'Saturday, Oct 24',
      mapImage: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=400&h=200',
      location: 'Silicon Valley'
    }
  ]
})

const handleApply = async (shift) => {
  if (!confirm(`Apply for ${shift.title} at ${shift.company}?`)) return
  applying.value = true
  try {
    await shiftStore.applyToShift(shift.id)
    modalSuccess.value = true
    modalMessage.value = `Your application for "${shift.title}" has been submitted!`
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = e?.message || 'Failed to apply. Please try again.'
  } finally {
    applying.value = false
    showModal.value = true
  }
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <WorkerLayout>
    <div class="main-content">
      <div class="tabs-container">
        <div class="tabs-left">
          <button class="tab active">Available Shifts</button>
          <button class="tab">Applied</button>
          <button class="tab">Upcoming</button>
        </div>
        <button class="tab archived">Archived</button>
      </div>

      <div class="filters-bar">
        <div class="filters-left">
          <button class="filter-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Date: All
            <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button class="filter-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            Role: All
            <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button class="filter-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Pay Range
            <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button class="filter-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Distance
            <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>
        <button class="filter-btn more-filters">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          More Filters
        </button>
      </div>

      <div class="list-header">
        <h2>Open Shifts Near San Francisco</h2>
        <span class="shift-count">Showing 42 available shifts</span>
      </div>

      <div class="shift-list">
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
              <router-link :to="`/worker/shift/${shift.id}`" class="btn btn-icon" title="More Info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </router-link>
            </div>
          </div>

          <div class="card-map-wrapper">
            <img :src="shift.mapImage" alt="Map Location" class="map-img" />
            <div class="location-pin">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {{ shift.location }}
            </div>
          </div>

        </div>
      </div>

      <div class="load-more-container">
        <button class="btn btn-outline load-more-btn">
          Load more shifts
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>
    </div>
  </WorkerLayout>

  <!-- Apply Modal -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <div :class="modalSuccess ? 'modal-success' : 'modal-error'">
          <div class="modal-icon" :class="modalSuccess ? 'success-icon' : 'error-icon'">
            <svg v-if="modalSuccess" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h3>{{ modalSuccess ? 'Applied!' : 'Error' }}</h3>
          <p>{{ modalMessage }}</p>
        </div>
        <button class="btn btn-primary modal-close-btn" @click="closeModal">Got it</button>
      </div>
    </div>
  </Teleport>

</template>

<style scoped>
/* --- Base Theme & Reset --- */
:root {
  --primary: #0047FF;
  --primary-hover: #003BE0;
  --text-main: #111827;
  --text-muted: #6B7280;
  --bg-color: #F8FAFC;
  --border: #E5E7EB;
}

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

.more-filters {
  background-color: #EFF6FF;
  border-color: #DBEAFE;
  color: var(--primary);
  font-weight: 600;
}
.more-filters svg { color: var(--primary); }
.more-filters:hover { background-color: #DBEAFE; }

/* --- List Header --- */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.list-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.shift-count {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* --- Shift Cards --- */
.shift-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.shift-card {
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  gap: 2rem;
}

.card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-top-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}



.pay-rate {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--primary);
}

.job-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
}

.job-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.company, .time {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.job-meta svg { color: #9CA3AF; }
.dot-separator { font-size: 1.2rem; line-height: 1; }

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-primary { background-color: var(--primary); color: #ffffff; }
.btn-primary:hover { background-color: var(--primary-hover); }

.btn-icon {
  padding: 0.6rem;
  background-color: #F1F5F9;
  color: var(--text-muted);
}
.btn-icon:hover { background-color: #E2E8F0; color: var(--text-main); }

/* Card Map (Right Side) */
.card-map-wrapper {
  position: relative;
  width: 320px;
  height: 160px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85; /* Softens the image slightly to match the map aesthetic */
}

.location-pin {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background-color: #ffffff;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* --- Load More --- */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-outline {
  background-color: transparent;
  border-color: var(--border);
  color: var(--text-main);
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
}
.btn-outline:hover {
  background-color: #F8FAFC;
  border-color: #D1D5DB;
}

/* Responsive adjustments */
@media (max-width: 968px) {
  .shift-card { flex-direction: column; }
  .card-map-wrapper { width: 100%; height: 200px; }
}

/* --- Modal --- */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff; border-radius: 16px; padding: 2rem;
  max-width: 380px; width: 90%; text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-icon {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.25rem;
}
.success-icon { background: #DCFCE3; color: #16A34A; }
.error-icon { background: #FEE2E2; color: #DC2626; }
.modal-box h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; }
.modal-box p { color: #6B7280; font-size: 0.95rem; margin: 0 0 1.5rem; }
.modal-close-btn { width: 100%; }
</style>