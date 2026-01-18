<script setup>
import { ref } from 'vue'
import ShiftCalendar from '../components/ShiftCalendar.vue'
import DayDetailModal from '../components/DayDetailModal.vue'
import { isSameDay } from 'date-fns' // Import this helper

// --- 1. Smart Mock Data Generator ---
// We create dates relative to "Today" so the calendar always shows data
const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0') // '01' to '12'
const isModalOpen = ref(false)
const selectedDate = ref(null)
const selectedDayShifts = ref([])

const getDate = (day) => `${year}-${month}-${String(day).padStart(2, '0')}`

// --- 2. State ---
const stats = ref({
    workingNow: 4,
    scheduledToday: 8,
    openShifts: 1
})

// The Master Shift List (Database simulation)
const shifts = ref([
    // Today's Shifts
    { id: 1, name: 'Sarah J.', role: 'Chef', time: '09:00 - 17:00', date: getDate(today.getDate()), status: 'active' },
    { id: 2, name: 'Mike T.', role: 'Waiter', time: '10:00 - 18:00', date: getDate(today.getDate()), status: 'active' },

    // The PROBLEM Shift (Sick)
    { id: 3, name: 'Jenny L.', role: 'Bartender', time: '18:00 - 02:00', date: getDate(today.getDate()), status: 'sick' },

    // Future Shifts
    { id: 4, name: 'Tom H.', role: 'Chef', time: '09:00 - 17:00', date: getDate(today.getDate() + 1), status: 'active' },
    { id: 5, name: 'Open Slot', role: 'Dishwasher', time: '18:00 - 23:00', date: getDate(today.getDate() + 2), status: 'open' },
    { id: 6, name: 'Sarah J.', role: 'Chef', time: '09:00 - 17:00', date: getDate(today.getDate() + 5), status: 'active' },
])

// --- 3. Actions ---
const handleCreateShift = () => {
    alert("Open Modal: Create New Shift")
}

// The Logic: Converting a "Sick" shift into an "Open Marketplace" shift
const resolveSickIssue = (shiftId) => {
    const shift = shifts.value.find(s => s.id === shiftId)
    if (shift) {
        if (confirm(`Publish ${shift.role} shift to Shiftly Marketplace?`)) {
            shift.status = 'open' // Changes color to Yellow/Dashed
            shift.name = 'Open Slot' // Removes the sick employee's name
            stats.value.openShifts++ // Updates stats
        }
    }
}
// 1. Open the modal when a day is clicked
const handleDaySelect = (day) => {
    selectedDate.value = day
    // Filter shifts for this specific day
    selectedDayShifts.value = shifts.value.filter(s => isSameDay(new Date(s.date), day))
    isModalOpen.value = true
}

// 2. Add a new shift from the modal
const handleAddShift = (newShiftData) => {
    const year = selectedDate.value.getFullYear()
    const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.value.getDate()).padStart(2, '0')

    shifts.value.push({
        id: Date.now(), // simple random ID
        ...newShiftData,
        date: `${year}-${month}-${day}`
    })
    // Refresh the modal list
    handleDaySelect(selectedDate.value)
}

// 3. Delete a shift
const handleDeleteShift = (id) => {
    if (confirm('Are you sure you want to delete this shift?')) {
        shifts.value = shifts.value.filter(s => s.id !== id)
        handleDaySelect(selectedDate.value) // Refresh modal
    }
}

// 4. Publish (Find Replacement)
const handlePublishShift = (id) => {
    resolveSickIssue(id) // Reuse your existing logic!
    handleDaySelect(selectedDate.value) // Refresh modal
}
</script>

<template>
    <div class="manager-container">

        <aside class="sidebar">
            <div class="logo">Shiftly <span class="badge">Manager</span></div>

            <nav class="nav-links">
                <a href="#" class="nav-item active">Dashboard</a>
                <a href="#" class="nav-item">Roster</a>
                <a href="#" class="nav-item">Staff</a>
                <a href="#" class="nav-item">Payroll</a>
                <a href="#" class="nav-item">Settings</a>
            </nav>

            <div class="user-profile">
                <div class="avatar-circle">M</div>
                <div class="user-info">
                    <span class="name">Stockholm Bar</span>
                    <span class="role">Admin</span>
                </div>
            </div>
        </aside>

        <main class="content">

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
                <h2 class="section-title text-red">⚠️ Requires Attention</h2>
                <div class="issues-list">
                    <div v-for="shift in shifts.filter(s => s.status === 'sick')" :key="shift.id" class="issue-card">
                        <div class="issue-text">
                            <strong>{{ shift.name }}</strong> reported sick for the <strong>{{ shift.role }}</strong>
                            shift tonight.
                        </div>
                        <button @click="resolveSickIssue(shift.id)" class="btn-resolve">
                            Find Replacement
                        </button>
                    </div>
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

        </main>
    </div>
</template>

<style scoped>
/* --- Layout --- */
.manager-container {
    display: flex;
    min-height: 100vh;
    background-color: #f8fafc;
    /* Very light cool gray */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #334155;
}

/* --- Sidebar --- */
.sidebar {
    width: 250px;
    background-color: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    position: fixed;
    /* Keeps sidebar locked */
    height: 100vh;
}

.logo {
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 2.5rem;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
}

.badge {
    background: #0f172a;
    color: #ccfd52;
    /* Lime accent */
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
}

.nav-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
}

.nav-item {
    text-decoration: none;
    color: #64748b;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s;
}

.nav-item:hover,
.nav-item.active {
    background-color: #f1f5f9;
    color: #0f172a;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
}

.avatar-circle {
    width: 36px;
    height: 36px;
    background-color: #0f172a;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.user-info {
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
}

.role {
    color: #94a3b8;
    font-size: 0.75rem;
}

/* --- Main Content --- */
.content {
    margin-left: 250px;
    /* Offset for fixed sidebar */
    flex: 1;
    padding: 2rem;
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
.text-red {
    color: #ef4444;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.issue-card {
    background-color: #fef2f2;
    border: 1px solid #fee2e2;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.issue-text {
    color: #991b1b;
}

.btn-resolve {
    background-color: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
}

.btn-resolve:hover {
    background-color: #dc2626;
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