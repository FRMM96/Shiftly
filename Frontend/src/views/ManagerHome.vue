<script setup>
import { ref, computed } from 'vue' // Added computed
import { isSameDay } from 'date-fns'
import { useRouter } from 'vue-router'

// --- Imports ---
import ManagerLayout from '../components/ManagerLayout.vue'
import ShiftCalendar from '../components/ShiftCalendar.vue'
import DayDetailModal from '../components/DayDetailModal.vue'
import ShiftCard from '../components/ShiftCard.vue'
import BaseButton from '../components/BaseButton.vue'
import { useShiftStore } from '../stores/shiftStore' // <--- 1. Import Store

const router = useRouter()
const store = useShiftStore() // <--- 2. Init Store

// --- State ---
const isModalOpen = ref(false)
const selectedDate = ref(null)
const selectedDayShifts = ref([])

// --- Stats (Computed from Store) ---
// Now these numbers will actually update when you add a shift!
const stats = computed(() => {
    return {
        workingNow: 4, // Still mock for now
        scheduledToday: store.shifts.filter(s => isSameDay(new Date(s.date), new Date())).length,
        openShifts: store.openShifts.length
    }
})

// --- Actions ---
const handleCreateShift = () => {
    router.push('/manager/create-shift')
}

const resolveSickIssue = (shiftId) => {
    // Look in the store, not local refs
    const shift = store.shifts.find(s => s.id === shiftId)
    if (shift) {
        if (confirm(`Publish ${shift.role} shift to Shiftly Marketplace?`)) {
            shift.status = 'open'
            shift.name = 'Open Slot'
            // No need to update stats manually, the computed prop handles it
        }
    }
}

const handleDaySelect = (day) => {
    selectedDate.value = day
    // Filter from STORE shifts
    selectedDayShifts.value = store.shifts.filter(s => isSameDay(new Date(s.date), day))
    isModalOpen.value = true
}

const handleAddShift = (newShiftData) => {
    // This is for the modal "Quick Add" (optional, if you keep it)
    store.addShift({
        ...newShiftData,
        pay: '150 kr/h' // default
    })
    handleDaySelect(selectedDate.value) // Refresh modal
}

const handleDeleteShift = (id) => {
    if (confirm('Are you sure you want to delete this shift?')) {
        // You would need a delete action in your store, for now:
        const index = store.shifts.findIndex(s => s.id === id)
        if (index !== -1) store.shifts.splice(index, 1)

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

        <section v-if="store.shifts.some(s => s.status === 'sick')" class="section-area">
            <h2 class="section-title text-danger">⚠️ Requires Attention</h2>
            <div class="issues-list">
                <ShiftCard v-for="shift in store.shifts.filter(s => s.status === 'sick')" :key="shift.id" :shift="shift">
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

            <ShiftCalendar :shifts="store.shifts" @selectDay="handleDaySelect" />

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
    padding: 2rem;
    /* Add padding here for the main content */
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

.dot.active {
    background: #10b981;
}

.dot.sick {
    background: #ef4444;
}

.dot.open {
    background: #f59e0b;
}
</style>