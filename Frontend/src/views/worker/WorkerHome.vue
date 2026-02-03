<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { useRouter } from 'vue-router'

// 1. Components
import WorkerLayout from '../../components/worker/WorkerLayout.vue'
import WorkerCalendar from '../../components/worker/WorkerCalendar.vue'
import MarketplaceCard from '../../components/shared/MarketplaceCard.vue'

// 2. Stores
import { useShiftStore } from '../../stores/shiftStore'
import { useScheduleStore } from '../../stores/scheduleStore'

const router = useRouter()
const shiftStore = useShiftStore()
const scheduleStore = useScheduleStore()

const activeTab = ref('schedule')

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

// 4. Click Handler
const onDateClick = ({ dateObj, data }) => {
    const dateStr = format(dateObj, 'yyyy-MM-dd')

    if (data) {
        // If clicking an existing shift
        alert(`Shift Details:\nRole: ${data.role || 'N/A'}\nTime: ${data.time || 'All Day'}\nStatus: ${data.status}`)
    } else {
        // If clicking an empty day
        if (confirm(`Request time off for ${dateStr}?`)) {
            scheduleStore.requestTimeOff(dateStr, "Personal Time")
        }
    }
}
</script>

<template>
    <WorkerLayout>
        <div class="content-wrapper">

            <header class="header">
                <h1>My Dashboard</h1>
                <button @click="router.push('/worker/marketplace')" class="btn-primary">
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
                <div class="stat-card">
                    <span class="stat-label">Sick Days</span>
                    <span class="stat-number" :class="{ 'text-danger': stats.sick > 0 }">
                        {{ stats.sick }}
                    </span>
                </div>
            </div>

            <section class="section-area">

                <div class="tabs-header">
                    <button class="tab-btn" :class="{ active: activeTab === 'schedule' }"
                        @click="activeTab = 'schedule'">
                        📅 Schedule
                    </button>
                    <button class="tab-btn" :class="{ active: activeTab === 'applications' }"
                        @click="activeTab = 'applications'">
                        ⏳ Applications
                    </button>
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

            </section>

        </div>
    </WorkerLayout>
</template>

<style scoped>
/* PAGE CONTAINER */
.content-wrapper {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

/* HEADER */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.header h1 {
    font-size: 1.8rem;
    color: #0f172a;
    margin: 0;
    font-weight: 800;
}

.btn-primary {
    background-color: #0f172a;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-primary:hover {
    background-color: #1e293b;
}

/* STATS GRID */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.stat-label {
    display: block;
    color: #64748b;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
}

.stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: #0f172a;
}

.text-danger {
    color: #ef4444;
}

/* MAIN CARD (Calendar/List Container) */
.section-area {
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    /* Ensures calendar stays inside rounded corners */
    min-height: 600px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* TABS */
.tabs-header {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 1.5rem;
    background: #fff;
}

.tab-btn {
    background: none;
    border: none;
    padding: 1.5rem 1rem;
    /* Bigger click area */
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
}

.tab-btn:hover {
    color: #0f172a;
}

.tab-btn.active {
    color: #0f172a;
    border-bottom-color: #0f172a;
}

/* CONTENT AREA */
.tab-content {
    flex-grow: 1;
    padding: 1.5rem;
    background: #fff;
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

/* RESPONSIVE */
@media (max-width: 768px) {
    .content-wrapper {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}
</style>