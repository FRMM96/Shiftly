<script setup>
import { ref } from 'vue'
import { isSameDay } from 'date-fns'

// --- Imports ---
import ManagerLayout from '../components/ManagerLayout.vue' // <--- NEW IMPORT
import ShiftCalendar from '../components/ShiftCalendar.vue'
import DayDetailModal from '../components/DayDetailModal.vue'
import ShiftCard from '../components/ShiftCard.vue' 
import BaseButton from '../components/BaseButton.vue' 

// --- 1. Smart Mock Data Generator ---
const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0')

const getDate = (day) => `${year}-${month}-${String(day).padStart(2, '0')}`

const isModalOpen = ref(false)
const selectedDate = ref(null)
const selectedDayShifts = ref([])

// --- 2. State ---
const stats = ref({
    workingNow: 4,
    scheduledToday: 8,
    openShifts: 1
})

const shifts = ref([
    { id: 1, name: 'Sarah J.', role: 'Chef', time: '09:00 - 17:00', date: getDate(today.getDate()), status: 'active' },
    { id: 2, name: 'Mike T.', role: 'Waiter', time: '10:00 - 18:00', date: getDate(today.getDate()), status: 'active' },
    { id: 3, name: 'Jenny L.', role: 'Bartender', time: '18:00 - 02:00', date: getDate(today.getDate()), status: 'sick' },
    { id: 4, name: 'Tom H.', role: 'Chef', time: '09:00 - 17:00', date: getDate(today.getDate() + 1), status: 'active' },
    { id: 5, name: 'Open Slot', role: 'Dishwasher', time: '18:00 - 23:00', date: getDate(today.getDate() + 2), status: 'open' },
    { id: 6, name: 'Sarah J.', role: 'Chef', time: '09:00 - 17:00', date: getDate(today.getDate() + 5), status: 'active' },
])

// --- 3. Actions ---
const handleCreateShift = () => {
    alert("Open Modal: Create New Shift")
}

const resolveSickIssue = (shiftId) => {
    const shift = shifts.value.find(s => s.id === shiftId)
    if (shift) {
        if (confirm(`Publish ${shift.role} shift to Shiftly Marketplace?`)) {
            shift.status = 'open'
            shift.name = 'Open Slot'
            stats.value.openShifts++
        }
    }
}

const handleDaySelect = (day) => {
    selectedDate.value = day
    selectedDayShifts.value = shifts.value.filter(s => isSameDay(new Date(s.date), day))
    isModalOpen.value = true
}

const handleAddShift = (newShiftData) => {
    const year = selectedDate.value.getFullYear()
    const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.value.getDate()).padStart(2, '0')

    shifts.value.push({
        id: Date.now(),
        ...newShiftData,
        date: `${year}-${month}-${day}`
    })
    handleDaySelect(selectedDate.value)
}

const handleDeleteShift = (id) => {
    if (confirm('Are you sure you want to delete this shift?')) {
        shifts.value = shifts.value.filter(s => s.id !== id)
        handleDaySelect(selectedDate.value)
    }
}

const handlePublishShift = (id) => {
    resolveSickIssue(id)
    handleDaySelect(selectedDate.value)
}
</script>

<template>
  <ManagerLayout>
    
    <div class="content-wrapper">

        <header class="header">
            <h1>Dashboard</h1>
            <button @click="handleCreateShift" class="btn-create">+ New Shift</button>
        </header>

        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-label">Working Now</span>
                <span class="stat-number">{{ stats.workingNow }}</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Scheduled Today</span>
                <span class="stat-number">{{ stats.scheduledToday }}</span>
            </div>
            <div class="stat-card alert-card">
                <span class="stat-label">Issues / Open</span>
                <span class="stat-number">{{ stats.openShifts }}</span>
            </div>
        </div>

        <section v-if="shifts.some(s => s.status === 'sick')" class="section-area">
            <h2 class="section-title text-danger">⚠️ Requires Attention</h2>

            <div class="issues-list">
                <ShiftCard v-for="shift in shifts.filter(s => s.status === 'sick')" :key="shift.id" :shift="shift">
                    <template #actions>
                        <BaseButton variant="danger" size="sm" @click="resolveSickIssue(shift.id)">
                            Find Replacement
                        </BaseButton>
                    </template>
                </ShiftCard>
            </div>
        </section>

        <section class="section-area">
            <div class="section-header">
                <h2 class="section-title">Overview</h2>
                <div class="legend">
                    <span class="dot active"></span> Active
                    <span class="dot sick"></span> Sick
                    <span class="dot open"></span> Open
                </div>
            </div>

            <ShiftCalendar :shifts="shifts" @selectDay="handleDaySelect" />

            <DayDetailModal :isOpen="isModalOpen" :date="selectedDate" :shifts="selectedDayShifts"
                @close="isModalOpen = false" @addShift="handleAddShift" @deleteShift="handleDeleteShift"
                @publishShift="handlePublishShift" />

        </section>

    </div>
    
  </ManagerLayout>
</template>

<style scoped>
/* 🟢 CLEANUP: Removed all sidebar/layout styles since ManagerLayout handles them */

.content-wrapper {
  padding: 2rem; /* Add padding here for the main content */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.btn-create {
    background-color: #0f172a;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
}

/* --- Stats Grid --- */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2.5rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-label {
    display: block;
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #0f172a;
}

.alert-card .stat-number {
    color: #ef4444;
}

/* --- Issues Section --- */
.text-danger {
    color: #ef4444;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.issues-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

/* --- Calendar Section --- */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
}

.legend {
    display: flex;
    gap: 15px;
    font-size: 0.85rem;
    color: #64748b;
}

.dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
}

.dot.active { background: #10b981; }
.dot.sick { background: #ef4444; }
.dot.open { background: #f59e0b; }
</style>