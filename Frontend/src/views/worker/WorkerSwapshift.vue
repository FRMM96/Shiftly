<script setup>
import { ref } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'

// --- Mock Data ---
const currentShift = ref({
  date: 'Monday, Oct 24',
  time: '08:00 AM - 04:00 PM',
  role: 'Senior Nurse',
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300' // Hospital corridor placeholder
})

const colleagues = ref([
  {
    id: 1,
    name: 'Sarah Jenkins',
    availability: 'Requesting: Oct 24 (Evening)',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    urgent: false
  },
  {
    id: 2,
    name: 'Marcus Thorne',
    availability: 'Available: Oct 24 (Full Day)',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    urgent: false
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    availability: 'Available: Flexible Swap',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    urgent: false
  },
  {
    id: 4,
    name: 'Sam Wilson',
    availability: 'Wants Oct 24, Offering Oct 26',
    avatar: 'https://i.pravatar.cc/150?u=sam',
    urgent: true
  }
])

const handleProposeSwap = (colleague) => {
  alert(`Proposing swap with ${colleague.name}...`)
}
</script>

<template>
  <WorkerLayout>
    <div class="main-content">
      
      <div class="page-header">
        <h1 class="page-title">Swap Shift</h1>
        <p class="page-subtitle">Trade your shift with a colleague quickly and easily.</p>
        
        <div class="tabs">
          <button class="tab-btn active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Open Requests
          </button>
          <button class="tab-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            My History
          </button>
        </div>
      </div>

      <section class="section">
        <h2 class="section-title">Your Current Shift</h2>
        
        <div class="current-shift-card">
          <div class="shift-info">
            <span class="badge badge-light-blue">ASSIGNED</span>
            
            <h3 class="shift-date">{{ currentShift.date }}</h3>
            
            <div class="shift-meta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>{{ currentShift.time }}</span>
            </div>
            
            <div class="shift-meta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              <span>Role: <strong>{{ currentShift.role }}</strong></span>
            </div>

            <button class="btn btn-secondary mt-3">View Details</button>
          </div>
          
          <div class="shift-image">
            <img :src="currentShift.image" alt="Shift Location" />
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Available Colleagues</h2>
          <a href="#" class="filter-link">Filter by Role</a>
        </div>

        <div class="colleagues-list">
          <div 
            v-for="colleague in colleagues" 
            :key="colleague.id" 
            class="colleague-card"
            :class="{ 'urgent-border': colleague.urgent }"
          >
            <div class="colleague-info">
              <img :src="colleague.avatar" :alt="colleague.name" class="avatar" />
              <div>
                <div class="name-row">
                  <h4 class="colleague-name">{{ colleague.name }}</h4>
                  <span v-if="colleague.urgent" class="badge badge-urgent">URGENT</span>
                </div>
                <p class="colleague-availability">{{ colleague.availability }}</p>
              </div>
            </div>
            <button class="btn btn-primary" @click="handleProposeSwap(colleague)">
              Propose Swap
            </button>
          </div>
        </div>

        <button class="btn btn-dashed mt-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Post Your Own Request
        </button>
      </section>

      <section class="info-section">
        <div class="info-box">
          <svg class="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <div class="info-content">
            <h4>How it works</h4>
            <p>Once you propose a swap, the colleague will receive a notification. Once they accept, the schedule will be updated automatically and your manager will be notified.</p>
          </div>
        </div>
      </section>

    </div>
  </WorkerLayout>
</template>

<style scoped>
/* --- Design Variables --- */
:root {
  --primary: #0B57D0; /* Deep blue */
  --primary-hover: #0842A0;
  --primary-light: #E8F0FE;
  
  --bg-main: #FAFAFB; /* Very light grey body background */
  --bg-card: #FFFFFF;
  
  --text-dark: #111827;
  --text-muted: #6B7280;
  --border: #E5E7EB;
}

/* --- Main Content --- */
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.page-header {
  margin-bottom: 3rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0 0 1.5rem 0;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.75rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background-color: var(--primary);
  color: #FFFFFF;
}

.tab-btn:not(.active) {
  background-color: #E2E8F0;
  color: #475569;
}

.tab-btn:not(.active):hover {
  background-color: #CBD5E1;
}

/* --- Sections --- */
.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

.filter-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.filter-link:hover {
  text-decoration: underline;
}

/* --- Current Shift Card --- */
.current-shift-card {
  display: flex;
  background-color: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.shift-info {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.badge-light-blue {
  background-color: #E0E7FF;
  color: #4338CA;
}

.badge-urgent {
  background-color: var(--primary-light);
  color: var(--primary);
  padding: 0.25rem 0.5rem;
}

.shift-date {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: var(--text-dark);
}

.shift-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.shift-meta strong {
  color: var(--text-dark);
}

.shift-image {
  width: 35%;
  min-width: 250px;
  padding: 1.5rem;
  background-color: var(--bg-card); /* Keep white background behind the image padding */
}

.shift-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* --- Colleagues List --- */
.colleagues-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.colleague-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
}

.urgent-border {
  border-left: 4px solid var(--primary);
}

.colleague-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.colleague-info .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.colleague-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
}

.colleague-availability {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

/* --- Info Section --- */
.info-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background-color: #F1F5F9;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #E2E8F0;
}

.info-icon {
  color: var(--primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.info-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-dark);
}

.info-content p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* --- Buttons --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
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

.btn-secondary {
  background-color: #F1F5F9;
  color: var(--text-dark);
}

.btn-secondary:hover {
  background-color: #E2E8F0;
}

.btn-dashed {
  width: 100%;
  background-color: transparent;
  border: 1.5px dashed #CBD5E1;
  color: #475569;
  padding: 1rem;
}

.btn-dashed:hover {
  background-color: #F8FAFC;
  border-color: var(--primary);
  color: var(--primary);
}

.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }

/* --- Responsive Adjustments --- */
@media (max-width: 768px) {
  .current-shift-card {
    flex-direction: column-reverse;
  }
  .shift-image {
    width: 100%;
    height: 180px;
    padding: 1rem;
  }
  .colleague-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .btn-primary {
    width: 100%;
  }
}
</style>