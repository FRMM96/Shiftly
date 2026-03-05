<script setup>
import { ref } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'

// Mock Data matching the image exactly
const user = ref({
  name: 'Alex Johnson',
  role: 'Logistics Lead',
  avatar: 'https://i.pravatar.cc/150?u=alex_johnson'
})

const currentDate = 'Oct 24, 2023'

// Calendar Data Construction
const calendarDays = ref([
  // Previous Month
  { date: 24, isMuted: true }, { date: 25, isMuted: true }, { date: 26, isMuted: true }, 
  { date: 27, isMuted: true }, { date: 28, isMuted: true }, { date: 29, isMuted: true }, { date: 30, isMuted: true },
  
  // Current Month
  { date: 1 }, 
  { date: 2, shift: { time: '08:00 - 16:30', type: 'Day Shift' } }, 
  { date: 3 }, 
  { date: 4, shift: { time: '08:00 - 16:30', type: 'Day Shift' } }, 
  { date: 5 }, { date: 6 }, { date: 7 },
  
  { date: 8 }, { date: 9 }, 
  { date: 10, shift: { time: '08:00 - 16:30', type: 'Day Shift' } }, 
  { date: 11, isSelected: true, shift: { time: '08:00 - 16:30', type: 'Day Shift' } }, 
  { date: 12 }, 
  { date: 13, isHoliday: true, holidayName: 'Holiday' }, 
  { date: 14 },
  
  { date: 15 }, { date: 16 }, { date: 17 }, { date: 18 }, { date: 19 }, { date: 20 }, { date: 21 }
])

// Selected Shift Details
const selectedShift = ref({
  date: 'Wednesday, Oct 11, 2023',
  type: 'Day Shift',
  hours: '8.5 Hours',
  location: 'Radix HQ - North Wing',
  team: 'Logistics & Operations B',
  clockInWindow: '07:45 - 08:15'
})
</script>

<template>
  <WorkerLayout>
    <div class="main-column">
        
        <header class="top-header">
          <h1 class="page-title">My Schedule</h1>
          
          <div class="header-right">
            <button class="icon-btn notification-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span class="dot"></span>
            </button>
            <button class="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
            <div class="date-display">{{ currentDate }}</div>
          </div>
        </header>

        <main class="content-area">
          
          <div class="schedule-layout">
            
            <div class="calendar-card">
              <div class="calendar-header">
                <div class="month-selector">
                  <h2>October 2023</h2>
                  <div class="arrows">
                    <button class="nav-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                    <button class="nav-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                  </div>
                </div>
                <div class="view-toggle">
                  <button class="active">Month</button>
                  <button>Week</button>
                </div>
              </div>

              <div class="calendar-grid">
                <div class="weekday-row">
                  <div class="weekday">SUN</div>
                  <div class="weekday">MON</div>
                  <div class="weekday">TUE</div>
                  <div class="weekday">WED</div>
                  <div class="weekday">THU</div>
                  <div class="weekday">FRI</div>
                  <div class="weekday">SAT</div>
                </div>

                <div class="days-grid">
                  <div 
                    v-for="(day, index) in calendarDays" 
                    :key="index"
                    class="day-cell"
                    :class="{ 
                      'muted-cell': day.isMuted, 
                      'selected-cell': day.isSelected 
                    }"
                  >
                    <span class="date-number">{{ day.date }}</span>
                    
                    <div v-if="day.shift" class="shift-pill" :class="{ 'selected-pill': day.isSelected }">
                      <span>{{ day.shift.time }}</span>
                      <span>{{ day.shift.type }}</span>
                    </div>

                    <div v-if="day.isHoliday" class="holiday-pill">
                      {{ day.holidayName }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="sidebar-cards">
              
              <div class="detail-card">
                <div class="card-title-row">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0047FF" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  <h3>Shift Details</h3>
                </div>

                <div class="detail-section">
                  <span class="label">SELECTED DATE</span>
                  <p class="value-strong">{{ selectedShift.date }}</p>
                </div>

                <div class="detail-row-2">
                  <div class="detail-block">
                    <span class="label">SHIFT TYPE</span>
                    <p class="value">{{ selectedShift.type }}</p>
                  </div>
                  <div class="detail-block">
                    <span class="label">HOURS</span>
                    <p class="value value-blue">{{ selectedShift.hours }}</p>
                  </div>
                </div>

                <div class="detail-section">
                  <span class="label">LOCATION</span>
                  <p class="value location-value">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {{ selectedShift.location }}
                  </p>
                </div>

                <div class="detail-section">
                  <span class="label">TEAM</span>
                  <p class="value">{{ selectedShift.team }}</p>
                </div>

                <p class="clock-in-window">Clock-in window: {{ selectedShift.clockInWindow }}</p>
              </div>

              <div class="detail-card actions-card">
                <div class="card-title-row">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0047FF" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <h3>Shift Actions</h3>
                </div>

                <div class="action-buttons-list">
                  <button class="action-btn btn-sick">
                    <div class="btn-left">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="12" y1="13" x2="12" y2="19"></line><line x1="9" y1="16" x2="15" y2="16"></line></svg>
                      Report Sick
                    </div>
                    <svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                  
                  <button class="action-btn btn-timeoff">
                    <div class="btn-left">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line><line x1="12" y1="11" x2="12" y2="17"></line></svg>
                      Request Time Off
                    </div>
                    <svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                  
                  <button class="action-btn btn-swap">
                    <div class="btn-left">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
                      Swap Shift
                    </div>
                    <svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div class="bottom-banner">
            <div class="banner-left">
              <div class="banner-icon-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="banner-text">
                <span class="banner-label">NEXT UPCOMING SHIFT</span>
                <h3>Tomorrow, 08:00 AM</h3>
              </div>
            </div>

            <div class="banner-right">
              <div class="banner-text right-align">
                <span class="banner-label">OCTOBER HOURS TOTAL</span>
                <h3>156.5 / 160.0 hrs</h3>
              </div>
              <button class="btn-clock-in">CLOCK IN EARLY</button>
            </div>
          </div>

        </main>
      </div>
  </WorkerLayout>
</template>

< style scoped>
/* --- Color Palette & Variables --- */
:root {
  --bg-outer: #F1F5F9;
  --bg-inner: #FFFFFF;
  --bg-main: #F8FAFC;
  --bg-hover: #F1F5F9;
  
  --primary: #0047FF;
  --primary-hover: #003BE0;
  
  --text-dark: #0F172A;
  --text-muted: #64748B;
  --border: #E2E8F0;
  
  --shift-bg: #DBEAFE;
  --shift-text: #1D4ED8;
  --shift-bg-selected: #0047FF;
  --shift-text-selected: #FFFFFF;
  
  --holiday-bg: #FEF3C7;
  --holiday-text: #D97706;
}

/* --- Main Content Column --- */
.main-column {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
  overflow-y: auto;
}

/* --- Top Header --- */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background-color: var(--bg-inner);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
}

.icon-btn:hover { color: var(--text-dark); }

.notification-btn .dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #EF4444;
  border-radius: 50%;
  border: 2px solid var(--bg-inner);
}

.date-display {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);
  padding-left: 1rem;
  border-left: 1px solid var(--border);
}

/* --- Content Area --- */
.content-area {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
}

.schedule-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

/* --- Calendar Card --- */
.calendar-card {
  background-color: var(--bg-inner);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.month-selector h2 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0;
}

.arrows { display: flex; gap: 0.25rem; }

.nav-arrow {
  background: none;
  border: none;
  color: var(--text-dark);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
}

.view-toggle {
  display: flex;
  background-color: var(--bg-main);
  border-radius: 8px;
  padding: 0.25rem;
}

.view-toggle button {
  background: none;
  border: none;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  border-radius: 6px;
  cursor: pointer;
}

.view-toggle button.active {
  background-color: var(--primary);
  color: #FFFFFF;
}

/* Calendar Grid implementation */
.calendar-grid {
  display: flex;
  flex-direction: column;
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 1rem;
}

.weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 0.05em;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: var(--border); /* Creates the grid lines */
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.day-cell {
  background-color: var(--bg-inner);
  min-height: 100px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.day-cell.muted-cell {
  background-color: #FAFAFA;
}

.day-cell.muted-cell .date-number {
  color: #CBD5E1;
}

.date-number {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-dark);
}

.shift-pill {
  background-color: var(--shift-bg);
  color: var(--shift-text);
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.selected-pill {
  background-color: var(--shift-bg-selected);
  color: var(--shift-text-selected);
}

.holiday-pill {
  background-color: var(--holiday-bg);
  color: var(--holiday-text);
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

/* --- Sidebar Cards (Right Side) --- */
.sidebar-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-card {
  background-color: var(--bg-inner);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 1.75rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.card-title-row h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
}

.detail-section { margin-bottom: 1.25rem; }

.detail-row-2 {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.25rem;
}

.label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.value-strong {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.value-blue { color: var(--primary); }

.location-value {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.location-value svg { color: var(--text-muted); }

.clock-in-window {
  font-size: 0.8rem;
  font-style: italic;
  color: var(--text-muted);
  margin: 1rem 0 0 0;
}

/* Actions Card */
.action-buttons-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.action-btn:hover { opacity: 0.85; }

.btn-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-sick { background-color: #FEF2F2; color: #DC2626; }
.btn-timeoff { background-color: #EFF6FF; color: #2563EB; }
.btn-swap { background-color: #F8FAFC; color: #475569; border: 1px solid var(--border); }

/* --- Bottom Banner --- */
.bottom-banner {
  background-color: var(--primary);
  border-radius: 16px;
  padding: 1.5rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFFFFF;
  margin-top: auto;
  box-shadow: 0 4px 15px rgba(0, 71, 255, 0.25);
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.banner-icon-bg {
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  opacity: 0.8;
  display: block;
  margin-bottom: 0.25rem;
}

.banner-text h3 {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
}

.banner-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.right-align { text-align: right; border-right: 1px solid rgba(255, 255, 255, 0.3); padding-right: 2rem; }

.btn-clock-in {
  background-color: #FFFFFF;
  color: var(--primary);
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s;
}

.btn-clock-in:active { transform: scale(0.98); }

/* --- Responsive Adjustments --- */
@media (max-width: 1100px) {
  .schedule-layout {
    grid-template-columns: 1fr;
  }
  .bottom-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .banner-right {
    width: 100%;
    justify-content: space-between;
  }
  .right-align {
    text-align: left;
    border-right: none;
    padding-right: 0;
  }
}
