<script setup>
import { ref } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'

// Mock Data
const user = ref({
  avatar: 'https://i.pravatar.cc/150?u=radix_worker_1'
})

const reason = ref('')
const selectedDate = ref(5)

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const calendarDays = [
  null, null, null, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14
]

const handleBack = () => {
  console.log('Navigate back to shifts')
}

const submitReport = () => {
  if (confirm(`Submit sick report for Thursday, Oct 5?\n\nReason: ${reason.value || 'None provided'}`)) {
    console.log('Report submitted')
  }
}

const cancelReport = () => {
  console.log('Cancelled')
}
</script>

<template>
  <WorkerLayout>
    <div class="main-content">
      
      <div class="page-header">
        <button class="back-link" @click="handleBack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Shifts
        </button>
        <h1 class="page-title">Report Sick</h1>
        <p class="page-subtitle">Notify your manager of an unexpected illness</p>
      </div>

      <div class="report-grid">
        
        <div class="left-col">
          
          <div class="card calendar-card">
            <div class="card-header">
              <svg class="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <h2>Shift Date</h2>
            </div>

            <div class="calendar-wrapper">
              <div class="month-nav">
                <button class="nav-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                <h3>October 2023</h3>
                <button class="nav-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
              </div>

              <div class="calendar-grid">
                <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
                
                <div 
                  v-for="(day, index) in calendarDays" 
                  :key="index"
                  class="day-cell"
                  :class="{ 'active': day === selectedDate, 'empty': !day }"
                >
                  <span v-if="day">{{ day }}</span>
                </div>
              </div>
            </div>

            <div class="info-box blue-info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Reporting for: <strong>Thursday, Oct 5</strong></span>
            </div>
          </div>

          <div class="card shift-card">
            <div class="shift-info">
              <span class="label">ASSIGNED SHIFT</span>
              <h4>Morning Duty - Section B</h4>
              <p>08:00 AM - 04:00 PM</p>
            </div>
            <div class="shift-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
          </div>

        </div>

        <div class="right-col">
          <div class="card form-card">
            
            <div class="card-header">
              <svg class="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <h2>Reason <span class="optional-text">(Optional)</span></h2>
            </div>

            <textarea 
              v-model="reason" 
              class="reason-input" 
              placeholder="Briefly describe why you're unable to work your shift..."
            ></textarea>

            <div class="info-box warning-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <div class="warning-text">
                <strong>Important Notice</strong>
                <p>Submitting this report will notify your shift manager immediately. This action cannot be undone from the portal.</p>
              </div>
            </div>

            <button class="btn btn-primary" @click="submitReport">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Submit Sick Report
            </button>
            
            <button class="btn btn-outline" @click="cancelReport">
              Cancel
            </button>

          </div>
        </div>

      </div>
    </div>
  </WorkerLayout>
</template>

<style scoped>
/* --- Design Variables --- */
:root {
  --bg-main: #F4F7F9;
  --card-bg: #FFFFFF;
  --primary: #0B57D0; /* Deep primary blue */
  --primary-hover: #0842A0;
  --primary-light: #E8F0FE;
  
  --text-dark: #111827;
  --text-muted: #6B7280;
  --border: #E5E7EB;
  
  --warning-bg: #FFF8E1;
  --warning-border: #FDE68A;
  --warning-text: #B45309;
}

/* --- Main Content --- */
.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  flex-grow: 1;
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.25rem;
}
.back-link:hover { text-decoration: underline; }

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

/* --- Grid Layout --- */
.report-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

/* --- Cards --- */
.card {
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

.card-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.header-icon {
  color: var(--primary);
}

.optional-text {
  font-weight: 400;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* --- Calendar Card --- */
.month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.month-nav h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
}

.nav-arrow {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
}
.nav-arrow:hover { color: var(--text-dark); }

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 1.5rem;
}

.weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 50%;
  color: var(--text-dark);
}

.day-cell.active {
  background-color: var(--primary);
  color: #FFFFFF;
}

/* Info Boxes */
.info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.blue-info {
  background-color: var(--primary-light);
  color: var(--primary);
  border: 1px solid #D2E3FC;
  align-items: center;
}

.warning-info {
  background-color: var(--warning-bg);
  border: 1px solid var(--warning-border);
  color: var(--warning-text);
  margin-bottom: 1.5rem;
}

.warning-text strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #92400E;
}

.warning-text p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #92400E;
}

/* --- Shift Info Card --- */
.shift-card {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
}

.shift-info .label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.shift-info h4 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.shift-info p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.shift-icon {
  color: #9CA3AF;
}

/* --- Form Card (Right Column) --- */
.form-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reason-input {
  width: 100%;
  flex-grow: 1;
  min-height: 140px;
  background-color: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--text-dark);
  resize: none;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
}

.reason-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-light);
}

.reason-input::placeholder {
  color: #9CA3AF;
}

/* --- Buttons --- */
.btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary);
  color: #FFFFFF;
  border: none;
  margin-bottom: 0.75rem;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-outline {
  background-color: transparent;
  color: var(--text-dark);
  border: 1px solid var(--border);
}

.btn-outline:hover {
  background-color: var(--bg-main);
}



/* --- Responsive Adjustments --- */
@media (max-width: 768px) {
  .report-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>