<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import { useShiftStore } from '../../stores/shiftStore'

const route = useRoute()
const router = useRouter()
const shiftStore = useShiftStore()

// --- State ---
const applying = ref(false)
const applySuccess = ref(false)
const applyError = ref('')
const showModal = ref(false)

// Try to load real shift from store; fallback to mock if not found
const job = computed(() => {
  const id = route.params.id
  const found = id ? shiftStore.getShiftById(id) : null
  if (found) {
    return {
      id: found.id,
      title: found.roleName || found.role,
      badge: 'URGENT FILL',
      company: found.business,
      distance: 'Nearby',
      heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      role: found.roleName || found.role,
      payRate: found.pay || 'TBD',
      date: found.date,
      time: `${found.startTime || 'TBD'} - ${found.endTime || 'TBD'}`,
      requirements: found.requirements || ['See shift description for requirements.'],
      address: '245 SE Division St., Portland',
      arrivalInstructions: 'Please arrive 15 minutes early and check in with the shift lead.',
      estimatedEarnings: found.pay || 'TBD',
      deadline: 'Apply before this shift is filled'
    }
  }
  // Shift not found in store
  return {
    title: 'Shift Not Found',
    badge: '',
    company: '—',
    distance: '',
    heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    role: '—',
    payRate: '—',
    date: '—',
    time: '—',
    requirements: ['No details available for this shift.'],
    address: '—',
    arrivalInstructions: 'Contact your manager for arrival details.',
    estimatedEarnings: '—',
    deadline: ''
  }
})

onMounted(() => {
  // Pre-fetch marketplace if store is empty
  if (shiftStore.shifts.length === 0) {
    shiftStore.fetchMarketplace().catch(() => {})
  }
})

const handleApply = async () => {
  applying.value = true
  applyError.value = ''
  try {
    if (job.value.id) {
      await shiftStore.applyToShift(job.value.id)
    }
    applySuccess.value = true
    showModal.value = true
  } catch (e) {
    applyError.value = e?.message || 'Failed to apply. Please try again.'
    showModal.value = true
  } finally {
    applying.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  if (applySuccess.value) {
    router.push('/worker/marketplace')
  }
}
</script>

<template>
  <WorkerLayout>
    
    <header class="top-bar">
      <div class="top-bar-left">
        <span class="bar-title">Job Details</span>
      </div>
      <div class="top-bar-right">
        <button class="icon-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        </button>
        <button class="icon-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        </button>
      </div>
    </header>

    <main class="main-content">
      
      <section class="hero-section" :style="{ backgroundImage: `url(${job.heroImage})` }">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <span class="badge">{{ job.badge }}</span>
          <h1 class="job-title">{{ job.title }}</h1>
          <div class="job-meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {{ job.company }} • {{ job.distance }}
          </div>
        </div>
      </section>

      <div class="content-grid">
        
        <div class="left-col">
          
          <div class="card">
            <div class="card-header">
              <svg class="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <h2>Shift Information</h2>
            </div>
            
            <div class="info-list">
              <div class="info-row">
                <div class="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  Role
                </div>
                <div class="info-value">{{ job.role }}</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                  Pay Rate
                </div>
                <div class="info-value highlight-blue">{{ job.payRate }}</div>
              </div>

              <div class="info-row">
                <div class="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Date
                </div>
                <div class="info-value">{{ job.date }}</div>
              </div>

              <div class="info-row">
                <div class="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Time
                </div>
                <div class="info-value">{{ job.time }}</div>
              </div>
            </div>
          </div>

          <div class="card mt-4">
            <h2 class="card-title">Requirements</h2>
            <ul class="requirements-list">
              <li v-for="(req, index) in job.requirements" :key="index">
                <svg class="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>{{ req }}</span>
              </li>
            </ul>
          </div>

        </div>

        <div class="right-col">
          
          <div class="card map-card">
            <div class="map-graphic">
              <div class="map-bg"></div>
              <div class="map-pin-container">
                <svg class="giant-pin" viewBox="0 0 24 24" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#ffffff"></circle></svg>
              </div>
            </div>
            
            <div class="address-box">
              {{ job.address }}
            </div>

            <div class="arrival-info">
              <h3>Arrival Instructions</h3>
              <p>{{ job.arrivalInstructions }}</p>
            </div>
          </div>

          <div class="card mt-4 earnings-card">
            <div class="earnings-label">ESTIMATED EARNINGS</div>
            <div class="earnings-amount">{{ job.estimatedEarnings }}</div>
            
            <button
              class="btn btn-primary"
              :disabled="applying || applySuccess"
              @click="handleApply"
            >
              <svg v-if="!applying" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              <span v-if="applying">Applying...</span>
              <span v-else-if="applySuccess">Applied ✓</span>
              <span v-else>Apply for Shift</span>
            </button>

            <div class="deadline-text">{{ job.deadline }}</div>
          </div>

        </div>

      </div>
    </main>

    <!-- Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box">
          <div v-if="applySuccess" class="modal-success">
            <div class="modal-icon success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3>Application Sent!</h3>
            <p>Your application has been submitted. Managers will review it shortly.</p>
          </div>
          <div v-else class="modal-error">
            <div class="modal-icon error-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3>Application Failed</h3>
            <p>{{ applyError }}</p>
          </div>
          <button class="btn btn-primary modal-close-btn" @click="closeModal">Got it</button>
        </div>
      </div>
    </Teleport>

  </WorkerLayout>
</template>

<style scoped>
/* --- Base Styling --- */

/* --- Top Action Bar --- */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
  border-radius: 8px;
}

.bar-title {
  font-weight: 600;
  font-size: 1rem;
}

.top-bar-right {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: #F1F5F9;
  border: 1px solid transparent;
  color: #475569;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: #E2E8F0;
}

/* --- Main Content Layout --- */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* --- Hero Section --- */
.hero-section {
  position: relative;
  height: 240px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  color: #ffffff;
}

.badge {
  display: inline-block;
  background-color: #2563EB;
  color: #ffffff;
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.job-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.job-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #F3F4F6;
}

/* --- Grid Layout --- */
.content-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1.5rem;
}

/* --- Cards --- */
.card {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.mt-4 {
  margin-top: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.card-header h2, .card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.card-title {
  margin-bottom: 1.5rem;
}

/* --- Info List (Left Column) --- */
.info-list {
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid #F1F5F9;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-row:first-child {
  padding-top: 0;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
}

.info-label svg {
  color: #9CA3AF;
}

.info-value {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-main);
  text-align: right;
}

.highlight-blue {
  color: var(--primary-light);
  font-size: 1.05rem;
}

/* --- Requirements List --- */
.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.requirements-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.5;
}

.check-icon {
  color: var(--primary-light);
  flex-shrink: 0;
  margin-top: 2px;
}

/* --- Map Card (Right Column) --- */
.map-card {
  padding: 1rem;
}

.map-graphic {
  width: 100%;
  height: 160px;
  background-color: #E2E8F0;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
}

/* Simulated map background */
.map-bg {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(#CBD5E1 15%, transparent 16%),
    radial-gradient(#CBD5E1 15%, transparent 16%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  opacity: 0.5;
}

/* CSS Shape to mimic a park/greenery on map */
.map-bg::after {
  content: '';
  position: absolute;
  top: 30%;
  left: 20%;
  width: 60%;
  height: 40%;
  background: #BBF7D0;
  border-radius: 50% 30% 60% 40%;
  opacity: 0.7;
}

.map-pin-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}

.giant-pin {
  width: 48px;
  height: 48px;
}

.address-box {
  background-color: #F8FAFC;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
  text-align: center;
  border: 1px solid #E2E8F0;
  margin-bottom: 1.5rem;
}

.arrival-info h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.arrival-info p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

/* --- Earnings & Apply Card --- */
.earnings-card {
  text-align: center;
  padding: 2rem 1.5rem;
}

.earnings-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #9CA3AF;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.earnings-amount {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.btn-primary {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--primary);
  color: #ffffff;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
}

.btn-primary:hover {
  background-color: #1e3a8a;
}

.deadline-text {
  font-size: 0.65rem;
  color: #9CA3AF;
  letter-spacing: 0.05em;
}

/* --- Responsive --- */
@media (max-width: 860px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .hero-section {
    height: 200px;
  }
}

/* --- Modal --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  max-width: 380px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}
.success-icon { background: #DCFCE3; color: #16A34A; }
.error-icon { background: #FEE2E2; color: #DC2626; }
.modal-box h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; }
.modal-box p { color: #6B7280; font-size: 0.95rem; margin: 0 0 1.5rem; }
.modal-close-btn { width: 100%; }
</style>
