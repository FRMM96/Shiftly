<script setup>
import { ref, computed } from 'vue'
import { format, isSameDay } from 'date-fns' 
import { useRouter } from 'vue-router'

// 1. Components
import WorkerLayout from '../../components/worker/WorkerLayout.vue'
import WorkerCalendar from '../../components/worker/WorkerCalendar.vue'
import MarketplaceCard from '../../components/shared/MarketplaceCard.vue'
import WorkerDayDetailModal from '../../components/worker/WorkerDayDetailModal.vue'

// 2. Stores
import { useShiftStore } from '../../stores/shiftStore'
import { useScheduleStore } from '../../stores/scheduleStore'

const router = useRouter()
const shiftStore = useShiftStore()
const scheduleStore = useScheduleStore()

const activeTab = ref('schedule')
const isModalOpen = ref(false)
const selectedDate = ref(null)
const selectedDayShifts = ref([])

// 3. Stats Logic
const stats = computed(() => {
    // Safety check: Ensure arrays exist before filtering
    const schedule = scheduleStore.mySchedule || []
    const apps = shiftStore.myApplications || []

    return {
        upcoming: schedule.filter(s => s.status === 'active').length,
        pending: apps.length,
        sick: schedule.filter(s => s.status === 'sick').length
    }
})

// 4. Click Handler (Updated to Open Modal)
const onDateClick = ({ dateObj }) => {
    selectedDate.value = dateObj
    
    // Find shifts for this day in my schedule
    selectedDayShifts.value = (scheduleStore.mySchedule || []).filter(s => 
        isSameDay(new Date(s.date), dateObj)
    )

    isModalOpen.value = true
}

// Handle Request Time Off from Modal
const handleRequestTimeOff = (dateObj) => {
    const dateStr = format(dateObj, 'yyyy-MM-dd')
     if (confirm(`Request time off for ${dateStr}?`)) {
        scheduleStore.requestTimeOff(dateStr, "Personal Time")
        // Refresh modal data
        onDateClick({ dateObj }) 
    }
}
</script>

<template>
    <!-- Use WorkerLayout which mirrors ManagerLayout -->
    <WorkerLayout>
        <div class="content-wrapper">

            <header class="header">
                <h1>Dashboard</h1>
                <button @click="router.push('/worker/marketplace')" class="btn-create">
                    🔍 Find Work
                </button>
            </header>

            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-label">Upcoming Shifts</span>
                    <span class="stat-number">{{ stats.upcoming }}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Pending Requests</span>
                    <span class="stat-number">{{ stats.pending }}</span>
                </div>
                <!-- Alert Card style for Sick Days if > 0 -->
                <div class="stat-card" :class="{ 'alert-card': stats.sick > 0 }">
                    <span class="stat-label">Sick Days</span>
                    <span class="stat-number">{{ stats.sick }}</span>
                </div>
            </div>

            <!-- Overview Section (Mirrors Manager 'Overview') -->
            <section class="section-area">
                <div class="section-header">
                    <!-- Tabs or Title -->
                    <div class="tabs-header">
                        <button class="tab-btn" :class="{ active: activeTab === 'schedule' }" @click="activeTab = 'schedule'">
                            📅 Schedule
                        </button>
                        <button class="tab-btn" :class="{ active: activeTab === 'applications' }" @click="activeTab = 'applications'">
                            ⏳ Applications
                        </button>
                    </div>
                </div>

                <div v-if="activeTab === 'schedule'" class="tab-content">
                    <WorkerCalendar :schedule="scheduleStore.mySchedule || []" @dateClick="onDateClick" />
                </div>

                <div v-else class="tab-content">
                    <div v-if="stats.pending === 0" class="empty-state">
                        No active applications found.
                    </div>
                    <div v-else class="list-grid">
                        <MarketplaceCard v-for="shift in shiftStore.myApplications" :key="shift.id" :shift="shift" />
                    </div>
                </div>

                <!-- NEW MODAL -->
                <WorkerDayDetailModal 
                    :isOpen="isModalOpen" 
                    :date="selectedDate" 
                    :shifts="selectedDayShifts"
                    @close="isModalOpen = false"
                    @requestTimeOff="handleRequestTimeOff"
                />

            </section>

        </div>
    </WorkerLayout>
</template>

<style scoped>
/* Copied from ManagerHome to ensure parity */

.content-wrapper {
    padding: 2rem;
    /* Removed max-width to match Manager full width flow */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.header h1 { /* Explicit h1 styling if not global */
    font-size: 2rem; /* Adjusted to match Manager usually */
    font-weight: 700;
    color: #0f172a;
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

/* --- Section Area --- */
.section-area {
    /* No min-height, let content dictate */
}

.section-header {
    /* Container for tabs */
    border-bottom: 1px solid #e2e8f0;
    background: white;
    border-top-left-radius: 12px; 
    border-top-right-radius: 12px;
}

.tabs-header {
    display: flex;
    padding: 0 1.5rem;
}

.tab-btn {
    background: none;
    border: none;
    padding: 1.5rem 1rem;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
    font-size: 1rem;
}

.tab-btn:hover {
    color: #0f172a;
}

.tab-btn.active {
    color: #0f172a;
    border-bottom-color: #0f172a;
}

.tab-content {
    background: white;
    padding: 1.5rem; /* Match Manager calendar padding context if needed */
    border: 1px solid #e2e8f0;
    border-top: none;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

.empty-state {
    text-align: center;
    padding: 4rem;
    color: #94a3b8;
    font-style: italic;
}

.list-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>