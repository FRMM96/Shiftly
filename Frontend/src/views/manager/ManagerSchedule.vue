<script setup>
import { ref } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'

// --- Mock Data ---
// Recreating the exact visual state of the calendar in the image
const calendarDays = ref([
  { date: null }, { date: null }, { date: null }, 
  { date: 1, hasLine: true }, { date: 2 }, { date: 3 }, { date: 4 },
  { 
    date: 5, 
    isSelected: true, 
    pills: [
      { text: 'Morning 4/4', type: 'green' },
      { text: 'Afternoon 3/3', type: 'blue' }
    ] 
  }, 
  { date: 6 }, { date: 7 }, { date: 8 }, { date: 9 }, { date: 10 }, { date: 11 },
  { date: 12 }, { date: 13 }, { date: 14 }, { date: 15 }, { date: 16 }, { date: 17 }, { date: 18 },
  { date: 19 }, { date: 20 }, { date: 21 }, { date: 22 }, { date: 23 }, { date: 24 }, { date: 25 }
])

const morningStaff = ref([
  { id: 1, name: 'Marcus Cooper', role: 'Lead Operations', initials: 'MC', color: '#2E7D32' },
  { id: 2, name: 'Sarah Jenkins', role: 'Logistics Coordinator', initials: 'SJ', color: '#E0E0E0', textDark: true },
  { id: 3, name: 'David Chen', role: 'Support Specialist', initials: 'DC', color: '#37474F' }
])

const afternoonStaff = ref([
  { id: 4, name: 'Elena Rodriguez', role: 'Operations Associate', initials: 'ER', color: '#2E7D32' },
  { id: 5, name: 'Liam Taylor', role: 'Support Specialist', initials: 'LT', color: '#E0E0E0', textDark: true }
])
</script>

<template>
  <ManagerLayout>
        
        <div class="calendar-toolbar">
          <div class="month-nav">
            <h1>October 2023</h1>
            <div class="date-controls">
              <button class="icon-btn-sm"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
              <button class="today-btn">Today</button>
              <button class="icon-btn-sm"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
            </div>
          </div>
          
          <div class="toolbar-actions">
            <button class="btn btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              Filter
            </button>
            <button class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create Shift
            </button>
          </div>
        </div>

        <div class="calendar-container">
          <div class="weekdays">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>
          <div class="days-grid">
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index"
              class="day-cell"
              :class="{ 'selected': day.isSelected, 'empty': !day.date }"
            >
              <span v-if="day.date" class="date-num">{{ day.date }}</span>
              <div v-if="day.hasLine" class="event-line"></div>
              
              <div v-if="day.pills" class="pill-container">
                <div v-for="(pill, pIndex) in day.pills" :key="pIndex" class="shift-pill" :class="pill.type">
                  {{ pill.text }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="coverage-section">
          <div class="coverage-header">
            <h2>Daily Coverage <span class="date-subtitle">— Thursday, October 5</span></h2>
            <a href="#" class="manage-link">Manage All Shifts</a>
          </div>

          <div class="coverage-cards-grid">
            
            <div class="coverage-card">
              <div class="shift-card-header">
                <div class="shift-title">
                  <div class="shift-icon sun"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></div>
                  <div>
                    <h3>Morning Shift</h3>
                    <p>08:00 AM - 12:00 PM</p>
                  </div>
                </div>
                <span class="status-badge success">Fully Staffed</span>
              </div>
              
              <div class="staff-list">
                <div v-for="staff in morningStaff" :key="staff.id" class="staff-row">
                  <div class="staff-avatar" :style="{ backgroundColor: staff.color, color: staff.textDark ? '#000' : '#fff' }"></div>
                  <div class="staff-info">
                    <strong>{{ staff.name }}</strong>
                    <span>{{ staff.role }}</span>
                  </div>
                  <button class="options-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="coverage-card">
              <div class="shift-card-header">
                <div class="shift-title">
                  <div class="shift-icon cloud"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg></div>
                  <div>
                    <h3>Afternoon Shift</h3>
                    <p>12:00 PM - 04:00 PM</p>
                  </div>
                </div>
                <span class="status-badge in-progress">In Progress</span>
              </div>
              
              <div class="staff-list">
                <div v-for="staff in afternoonStaff" :key="staff.id" class="staff-row">
                  <div class="staff-avatar" :style="{ backgroundColor: staff.color, color: staff.textDark ? '#000' : '#fff' }"></div>
                  <div class="staff-info">
                    <strong>{{ staff.name }}</strong>
                    <span>{{ staff.role }}</span>
                  </div>
                  <button class="options-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </button>
                </div>
                
                <button class="btn-dashed">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Assign Staff
                </button>
              </div>
            </div>

          </div>
        </div>

  </ManagerLayout>
</template>

<style scoped>
/* --- Variables & Reset --- */
:root {
  --primary: #0052CC; /* Main Blue */
  --primary-hover: #0043A6;
  --bg-main: #FFFFFF;
  --bg-sidebar: #FFFFFF;
  --bg-app: #FAFAFB;
  
  --text-dark: #111827;
  --text-muted: #6B7280;
  --border-light: #F3F4F6;
  --border: #E5E7EB;
  
  /* Status Colors */
  --green-light: #D1FAE5;
  --green-text: #059669;
  --blue-light: #DBEAFE;
  --blue-text: #2563EB;
}

/* --- Calendar Header --- */
.calendar-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.month-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.month-nav h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}

.date-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.icon-btn-sm {
  background: #FFFFFF;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
}
.icon-btn-sm:hover { background: #F9FAFB; }

.today-btn {
  background: #FFFFFF;
  border: none;
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-dark);
}
.today-btn:hover { background: #F9FAFB; }

.toolbar-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-primary { background-color: var(--primary); color: #FFFFFF; }
.btn-primary:hover { background-color: var(--primary-hover); }

.btn-outline { background-color: #FFFFFF; border-color: var(--border); color: var(--text-dark); }
.btn-outline:hover { background-color: #F9FAFB; }

/* --- Custom Calendar Grid --- */
.calendar-container {
  background: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 3rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--border);
}

.weekdays span {
  text-align: center;
  padding: 1rem 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #9CA3AF;
  letter-spacing: 0.05em;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* Trick to create 1px borders between grid items */
  background-color: var(--border-light);
  gap: 1px; 
}

.day-cell {
  background-color: #FFFFFF;
  min-height: 120px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.day-cell.empty { background-color: #FFFFFF; }

.date-num {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.event-line {
  width: 24px;
  height: 4px;
  background-color: var(--primary);
  border-radius: 2px;
  margin-top: 0.25rem;
}

.pill-container {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.shift-pill {
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

.shift-pill.green { background-color: var(--green-light); color: var(--green-text); }
.shift-pill.blue { background-color: var(--blue-light); color: var(--blue-text); }

.day-cell.selected {
  position: relative;
  z-index: 2;
  box-shadow: inset 0 0 0 3px var(--primary);
  background-color: #F8FAFF;
}

/* --- Daily Coverage Section --- */
.coverage-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.coverage-header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}

.date-subtitle {
  font-weight: 400;
  color: var(--text-muted);
}

.manage-link {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
}
.manage-link:hover { text-decoration: underline; }

.coverage-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.coverage-card {
  background-color: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.shift-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

.shift-title {
  display: flex;
  gap: 1rem;
}

.shift-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shift-icon.sun { background-color: #FFF7ED; color: #EA580C; }
.shift-icon.cloud { background-color: #EFF6FF; color: #2563EB; }

.shift-title h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.shift-title p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-badge.success { background-color: var(--green-light); color: var(--green-text); }
.status-badge.in-progress { background-color: var(--blue-light); color: var(--blue-text); }

/* Staff List */
.staff-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.staff-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.staff-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.staff-info {
  flex-grow: 1;
}

.staff-info strong {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.staff-info span {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.options-btn {
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0.5rem;
}
.options-btn:hover { color: var(--text-dark); }

.btn-dashed {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem;
  background-color: transparent;
  border: 1px dashed var(--border);
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}
.btn-dashed:hover {
  background-color: #F9FAFB;
  color: var(--text-dark);
  border-color: #CBD5E1;
}

/* --- Responsive Adjustments --- */
@media (max-width: 1024px) {
  .coverage-cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .calendar-toolbar { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .day-cell { min-height: 80px; padding: 0.4rem; }
  .shift-pill { font-size: 0.6rem; padding: 0.2rem; }
}
</style>