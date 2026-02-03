<script setup>
import { ref, computed } from 'vue'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, isSameMonth
} from 'date-fns'

const props = defineProps({
  schedule: { type: Array, required: true }
})

const emit = defineEmits(['dateClick'])

const currentMonth = ref(new Date())

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
})

const getShiftForDay = (dateObj) => {
  const dateStr = format(dateObj, 'yyyy-MM-dd')
  return props.schedule.find(s => s.date === dateStr)
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
      <div v-for="dayObj in calendarDays" :key="dayObj" class="day-cell"
        :class="{ 'dimmed': !isSameMonth(dayObj, currentMonth) }"
        @click="emit('dateClick', { dateObj: dayObj, data: getShiftForDay(dayObj) })">

        <span class="day-number">{{ format(dayObj, 'd') }}</span>

        <div v-if="getShiftForDay(dayObj)" class="shift-content">
          <div v-if="getShiftForDay(dayObj).status === 'active'" class="shift-pill active">
            <span class="time">{{ getShiftForDay(dayObj).time }}</span>
            <span class="role">{{ getShiftForDay(dayObj).role }}</span>
          </div>
          <div v-if="getShiftForDay(dayObj).status === 'sick'" class="shift-pill sick">
            <span>🤒 Sick Leave</span>
          </div>
          <div v-if="getShiftForDay(dayObj).status === 'request_off'" class="shift-pill open">
            <span>⏳ Time Off Req</span>
          </div>
        </div>

        <div v-else class="add-indicator">+</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 600px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.month-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1f2937;
  text-transform: capitalize;
}

.nav-btn {
  background: #f3f4f6;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  color: #4b5563;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: #e5e7eb;
}

.weekday-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 0;
  background: #f9fafb;
}

.weekday-label {
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex-grow: 1;
}

.day-cell {
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  padding: 8px;
  position: relative;
  cursor: pointer;
  transition: background 0.1s;
  background: white;
  min-height: 100px;
}

.day-cell:nth-child(7n) {
  border-right: none;
}

.day-cell:hover {
  background-color: #f8fafc;
}

.dimmed {
  background-color: #f9fafb;
  color: #d1d5db;
}

.day-number {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  display: block;
}

/* Shift Pills */
.shift-pill {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 3px solid transparent;
}

.shift-pill.active {
  background: #ecfdf5;
  color: #065f46;
  border-left-color: #10b981;
}

.shift-pill.sick {
  background: #fef2f2;
  color: #991b1b;
  border-left-color: #ef4444;
}

.shift-pill.open {
  background: #fff7ed;
  color: #9a3412;
  border-left-color: #f97316;
}

.time {
  font-size: 0.7rem;
  opacity: 0.8;
}

.role {
  font-size: 0.8rem;
}

.add-indicator {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  color: #e5e7eb;
}

.day-cell:hover .add-indicator {
  display: block;
}
</style>