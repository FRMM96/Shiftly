<script setup>
import { ref, computed } from 'vue'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  addDays 
} from 'date-fns'

const props = defineProps({
  schedule: { 
    type: Array,
    required: true
  }
})

const emit = defineEmits(['dateClick'])

const currentMonth = ref(new Date())
const today = new Date()

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value), { weekStartsOn: 1 })
  // Force 42 days (6 weeks * 7 days) to keep height consistent
  const end = addDays(start, 41)
  return eachDayOfInterval({ start, end })
})

const getShiftsForDay = (dateObj) => {
  return props.schedule.filter(s => isSameDay(new Date(s.date), dateObj))
}

const nextMonth = () => currentMonth.value = addMonths(currentMonth.value, 1)
const prevMonth = () => currentMonth.value = subMonths(currentMonth.value, 1)
</script>

<template>
  <div class="calendar-wrapper">
    
    <header class="calendar-header">
      <button @click="prevMonth" class="nav-btn">←</button>
      <h2 class="month-title">{{ format(currentMonth, 'MMMM yyyy') }}</h2>
      <button @click="nextMonth" class="nav-btn">→</button>
    </header>

    <div class="weekday-grid">
      <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="weekday-label">
        {{ day }}
      </div>
    </div>

    <div class="days-grid">
      <div 
        v-for="day in calendarDays" 
        :key="day" 
        class="day-cell"
        :class="{ 'dimmed': !isSameMonth(day, currentMonth) }"
        @click="$emit('dateClick', { dateObj: day })"
      >
        <div class="day-cell-header">
           <span class="day-number" :class="{ 'today-number': isSameDay(day, today) }">{{ format(day, 'd') }}</span>
           <span v-if="isSameDay(day, today)" class="today-label">TODAY</span>
        </div>

        <div class="shifts-container">
          <div 
            v-for="shift in getShiftsForDay(day)" 
            :key="shift.id" 
            class="shift-pill"
            :class="shift.status" 
          >
            <!-- Status Dot -->
            <span class="dot"></span>
            
            <!-- Content -->
            <span class="time">{{ shift.time || 'All Day' }}</span>
            <span class="name" v-if="shift.role">{{ shift.role }}</span>
            <span class="name" v-else-if="shift.status === 'sick'">Sick</span>
            <span class="name" v-else-if="shift.status === 'request_off'">Time Off</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.calendar-wrapper {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.month-title {
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: capitalize;
  color: #1f2937;
}

.nav-btn {
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  color: #4b5563;
}

.nav-btn:hover { background: #e5e7eb; }

/* Grid Layouts */
.weekday-grid, .days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.days-grid {
  grid-template-rows: repeat(6, 120px); /* KEEP STRICT STABILITY */
}

.weekday-label {
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  padding-bottom: 0.5rem;
  font-size: 0.9rem;
}

.day-cell {
  height: 120px; /* Strict fixed height */
  overflow: hidden;
  border-top: 1px solid #f3f4f6;
  border-right: 1px solid #f3f4f6;
  padding: 8px;
  position: relative;
  cursor: pointer;
  background: white;
  transition: background-color 0.2s;
}
.day-cell:hover{
  background-color: #f8fafc;
}

/* Remove right border for last column */
.day-cell:nth-child(7n) { border-right: none; }

.dimmed {
  background-color: #f9fafb;
  color: #d1d5db;
}

.day-cell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.day-number {
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #374151;
}

.today-number {
  background-color: #1a0f0f; /* Dark brown/black matching the screenshot */
  color: white;
}

.today-label {
  font-size: 0.70rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.5px;
}

/* Shift Pill Styles */
.shifts-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shift-pill {
  font-size: 0.75rem;
  padding: 4px 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Status Colors (Matches Manager) */
.shift-pill.active {
  background-color: #ecfdf5; 
  color: #065f46;
  border-color: #a7f3d0;
}
.shift-pill.active .dot { background: #10b981; }

.shift-pill.sick {
  background-color: #fef2f2; 
  color: #991b1b;
  border-color: #fecaca;
}
.shift-pill.sick .dot { background: #ef4444; }

.shift-pill.request_off, .shift-pill.open { 
  background-color: #fffbeb; 
  color: #92400e;
  border-color: #fde68a;
  border-style: dashed; 
}
.shift-pill.request_off .dot, .shift-pill.open .dot { background: #f59e0b; }

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>