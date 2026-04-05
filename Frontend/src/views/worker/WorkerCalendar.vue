<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import { useScheduleStore } from '../../stores/scheduleStore'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, addMonths, subMonths,
  isSameMonth, isSameDay, isToday
} from 'date-fns'

const router = useRouter()
const scheduleStore = useScheduleStore()
const { selectedShift, mySchedule, loading } = storeToRefs(scheduleStore)

const activeMonth = ref(new Date())
const selectedDate = ref(null)

const monthLabel = computed(() => format(activeMonth.value, 'MMMM yyyy'))

const calendarDays = computed(() => {
  const monthStart = startOfMonth(activeMonth.value)
  const monthEnd = endOfMonth(activeMonth.value)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  // Build a lookup: 'YYYY-MM-DD' -> shift
  const shiftMap = {}
  for (const s of mySchedule.value) {
    shiftMap[s.date] = s
  }

  return days.map(d => {
    const dateStr = format(d, 'yyyy-MM-dd')
    const shift = shiftMap[dateStr] || null
    return {
      dateObj: d,
      date: d.getDate(),
      dateStr,
      isMuted: !isSameMonth(d, activeMonth.value),
      isToday: isToday(d),
      isSelected: selectedDate.value ? isSameDay(d, selectedDate.value) : false,
      shift: shift ? { time: shift.time || '', type: shift.role || '' } : null
    }
  })
})

const totalHours = computed(() => {
  let total = 0
  for (const s of mySchedule.value) {
    if (s.time) {
      const parts = s.time.split(' - ')
      if (parts.length === 2) {
        const [startH, startM] = parts[0].split(':').map(Number)
        const [endH, endM] = parts[1].split(':').map(Number)
        total += (endH + endM / 60) - (startH + startM / 60)
      }
    }
  }
  return total.toFixed(1)
})

const nextShiftLabel = computed(() => {
  if (mySchedule.value.length === 0) return 'No upcoming shifts'
  const next = mySchedule.value[0]
  return `${next.date}, ${next.time || 'TBD'}`
})

const prevMonth = () => { activeMonth.value = subMonths(activeMonth.value, 1) }
const nextMonth = () => { activeMonth.value = addMonths(activeMonth.value, 1) }

const selectDay = (day) => {
  selectedDate.value = day.dateObj
  if (day.shift) {
    const matched = mySchedule.value.find(s => s.date === day.dateStr)
    scheduleStore.selectedShift = matched || null
  } else {
    scheduleStore.selectedShift = null
  }
}

onMounted(() => {
  scheduleStore.fetchMySchedule().catch(() => {})
})
</script>

<template>
  <WorkerLayout>
    <div class="main-column">

        <div class="content-area">
          
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading your schedule...</p>
          </div>

          <div v-if="!loading && mySchedule.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <h3>No shifts scheduled</h3>
            <p>You don't have any shifts scheduled for this period.</p>
          </div>

          <template v-if="!loading && mySchedule.length > 0">
          <div class="schedule-layout">
            
            <div class="calendar-card">
              <div class="calendar-header">
                <div class="month-selector">
                  <h2>{{ monthLabel }}</h2>
                  <div class="arrows">
                    <button class="nav-arrow" @click="prevMonth"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                    <button class="nav-arrow" @click="nextMonth"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
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
                      'selected-cell': day.isSelected,
                      'today-cell': day.isToday
                    }"
                    @click="selectDay(day)"
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

                <template v-if="selectedShift">
                <div class="detail-section">
                  <span class="label">SELECTED DATE</span>
                  <p class="value-strong">{{ selectedShift.date }}</p>
                </div>

                <div class="detail-row-2">
                  <div class="detail-block">
                    <span class="label">SHIFT TYPE</span>
                    <p class="value">{{ selectedShift.role }}</p>
                  </div>
                  <div class="detail-block">
                    <span class="label">HOURS</span>
                    <p class="value value-blue">{{ selectedShift.time }}</p>
                  </div>
                </div>

                <div class="detail-section">
                  <span class="label">BUSINESS</span>
                  <p class="value">{{ selectedShift.business }}</p>
                </div>
              </template>
              <template v-else>
                <p class="value" style="color: var(--text-muted);">Select a day on the calendar to view shift details.</p>
              </template>
              </div>

              <div class="detail-card actions-card">
                <div class="card-title-row">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0047FF" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <h3>Shift Actions</h3>
                </div>

                <div class="action-buttons-list">
                  <button class="action-btn btn-sick" @click="router.push({ path: '/worker/sick', query: selectedDate ? { date: format(selectedDate, 'yyyy-MM-dd') } : {} })">
                    <div class="btn-left">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="12" y1="13" x2="12" y2="19"></line><line x1="9" y1="16" x2="15" y2="16"></line></svg>
                      Report Sick
                    </div>
                    <svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>

                  <button class="action-btn btn-timeoff" @click="router.push({ path: '/worker/timeoff', query: selectedDate ? { date: format(selectedDate, 'yyyy-MM-dd') } : {} })">
                    <div class="btn-left">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line><line x1="12" y1="11" x2="12" y2="17"></line></svg>
                      Request Time Off
                    </div>
                    <svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>

                  <button class="action-btn btn-swap" @click="router.push('/worker/swapshift')">
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
                <h3>{{ nextShiftLabel }}</h3>
              </div>
            </div>

            <div class="banner-right">
              <div class="banner-text right-align">
                <span class="banner-label">{{ monthLabel.toUpperCase() }} HOURS TOTAL</span>
                <h3>{{ totalHours }} hrs</h3>
              </div>
              <button class="btn-clock-in">CLOCK IN EARLY</button>
            </div>
          </div>
          </template>
        </div>
      </div>
    </WorkerLayout>
</template>

<style scoped>
/* --- Color Palette & Variables --- */

/* --- Main Content Column --- */
.main-column {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
  overflow-y: auto;
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
  cursor: pointer;
  transition: background-color 0.15s;
}

.day-cell:hover {
  background-color: #F1F5F9;
}

.day-cell.today-cell .date-number {
  background-color: var(--primary);
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-cell.selected-cell {
  background-color: #EFF6FF;
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
  padding: 1rem;
}

/* Loading & Empty States */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: var(--bg-inner);
  border: 1px solid var(--border);
  border-radius: 12px;
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
