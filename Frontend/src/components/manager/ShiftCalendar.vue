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
  isSameDay 
} from 'date-fns'

// 1. Props: The calendar receives shifts from the parent (ManagerHome)
const props = defineProps({
  shifts: {
    type: Array,
    required: true
  }
})

// 2. State: Track the currently visible month
const currentMonth = ref(new Date())

// 3. Computed: Generate the days to display (including padding days from prev/next month)
const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value), { weekStartsOn: 1 }) // Monday start
  const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 1 })
  
  return eachDayOfInterval({ start, end })
})

// 4. Navigation Functions
const nextMonth = () => currentMonth.value = addMonths(currentMonth.value, 1)
const prevMonth = () => currentMonth.value = subMonths(currentMonth.value, 1)

// 5. Helper: Get shifts for a specific day
const getShiftsForDay = (date) => {
  return props.shifts.filter(shift => isSameDay(new Date(shift.date), date))
}
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
        @click="$emit('selectDay',day)"
      >
        <span class="day-number">{{ format(day, 'd') }}</span>

        <div class="shifts-container">
          <div 
            v-for="shift in getShiftsForDay(day)" 
            :key="shift.id" 
            class="shift-pill"
            :class="shift.status" 
          >
            <span class="dot"></span>
            <span class="time">{{ shift.time }}</span>
            <span class="name">{{ shift.name }}</span>
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
}

.nav-btn {
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
}

.nav-btn:hover { background: #e5e7eb; }

/* Grid Layouts */
.weekday-grid, .days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 Columns for 7 Days */
  gap: 1px;
}

.weekday-label {
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  padding-bottom: 0.5rem;
  font-size: 0.9rem;
}

.day-cell {
  min-height: 120px; /* Tall cells for shifts */
  border-top: 1px solid #f3f4f6;
  border-right: 1px solid #f3f4f6;
  padding: 8px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}
.day-cell:hover{
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

/* Remove right border for last column */
.day-cell:nth-child(7n) { border-right: none; }

.dimmed {
  background-color: #f9fafb;
  color: #d1d5db;
}

.day-number {
  font-size: 0.85rem;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
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

/* Status Colors (Matches your ecosystem) */
.shift-pill.active {
  background-color: #ecfdf5; /* Light Green */
  color: #065f46;
  border-color: #a7f3d0;
}
.shift-pill.active .dot { background: #10b981; }

.shift-pill.sick {
  background-color: #fef2f2; /* Light Red */
  color: #991b1b;
  border-color: #fecaca;
}
.shift-pill.sick .dot { background: #ef4444; }

.shift-pill.open {
  background-color: #fffbeb; /* Light Yellow */
  color: #92400e;
  border-color: #fde68a;
  border-style: dashed; /* Visual cue for "Open" */
}
.shift-pill.open .dot { background: #f59e0b; }

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>