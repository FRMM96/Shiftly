<script setup>
import { ref, computed, onMounted } from 'vue'
import { format, isSameDay } from 'date-fns' 
import { useRouter, useRoute } from 'vue-router'

// 1. Components
import WorkerLayout from '../../components/worker/WorkerLayout.vue'
import WorkerCalendar from '../../components/worker/WorkerCalendar.vue'
import MarketplaceCard from '../../components/shared/MarketplaceCard.vue'
import WorkerDayDetailModal from '../../components/worker/WorkerDayDetailModal.vue'
import ShiftCard from '../../components/shared/ShiftCard.vue'
import BaseButton from '../../components/shared/BaseButton.vue'

// 2. Stores
import { useShiftStore } from '../../stores/shiftStore'
import { useScheduleStore } from '../../stores/scheduleStore'

const router = useRouter()
const route = useRoute()
const shiftStore = useShiftStore()
const scheduleStore = useScheduleStore()

onMounted(() => {
  scheduleStore.fetchMySchedule()
})

const activeTab = computed({
    get: () => route.query.tab || 'schedule',
    set: (val) => router.replace({ query: { tab: val } })
})
const isModalOpen = ref(false)
const selectedDate = ref(null)
const selectedDayShifts = ref([])

const timeOffForm = ref({ date: '', type: 'timeoff', reason: '', startTime: '', endTime: '' })

const timeOptions = []
for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 60; j += 30) {
    const hour = i.toString().padStart(2, '0')
    const min = j.toString().padStart(2, '0')
    timeOptions.push(`${hour}:${min}`)
  }
}

const todayDateFormatted = computed(() => format(new Date(), 'EEEE, MMMM do, yyyy'))

// 3. Stats Logic
const upcomingShifts = computed(() => {
    return (scheduleStore.mySchedule || []).filter(s => s.status === 'active')
})

const timeOffShifts = computed(() => {
    return (scheduleStore.mySchedule || []).filter(s => s.status === 'sick' || s.status === 'request_off')
})

const stats = computed(() => {
    // Safety check: Ensure arrays exist before filtering
    const schedule = scheduleStore.mySchedule || []
    const apps = shiftStore.myApplications || []

    return {
        upcoming: upcomingShifts.value.length,
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
const handleRequestTimeOff = ({ date, reason, time }) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const displayTime = time ? ` from ${time}` : ' (All Day)'
    if (confirm(`Request time off for ${dateStr}${displayTime}?`)) {
        scheduleStore.requestTimeOff(dateStr, reason, time)
        // Refresh modal data
        onDateClick({ dateObj: date }) 
    }
}

const handleMarkSick = (dateObj) => {
    // We get a Date object, convert to string, unless it already is string
    const dateObjInstance = typeof dateObj === 'string' ? new Date(dateObj) : dateObj
    const dateStr = format(dateObjInstance, 'yyyy-MM-dd')
    if (confirm(`Are you sure you want to call in sick for ${dateStr}?`)) {
        scheduleStore.markSick(dateStr)
        // Refresh modal data if it's open
        if (isModalOpen.value) {
           onDateClick({ dateObj: dateObjInstance }) 
        }
    }
}

const handleUpdateTimeOff = (updatedData) => {
    scheduleStore.updateTimeOff(updatedData.id, updatedData)
    onDateClick({ dateObj: updatedData.date })
}

const handleDeleteTimeOff = (id) => {
    scheduleStore.deleteTimeOff(id)
    onDateClick({ dateObj: selectedDate.value })
}

const submitTimeOffForm = () => {
    if (!timeOffForm.value.date) return alert('Please select a date.')
    
    let timeStr = null
    if (timeOffForm.value.startTime && timeOffForm.value.endTime) {
        timeStr = `${timeOffForm.value.startTime} - ${timeOffForm.value.endTime}`
    } else if (timeOffForm.value.startTime) {
        timeStr = `${timeOffForm.value.startTime}`
    }

    if (timeOffForm.value.type === 'sick') {
        if (confirm(`Call in sick for ${timeOffForm.value.date}?`)) {
            scheduleStore.markSick(timeOffForm.value.date)
            timeOffForm.value = { date: '', type: 'timeoff', reason: '', startTime: '', endTime: '' }
        }
    } else {
        if (confirm(`Request time off for ${timeOffForm.value.date}?`)) {
            scheduleStore.requestTimeOff(timeOffForm.value.date, timeOffForm.value.reason, timeStr)
            timeOffForm.value = { date: '', type: 'timeoff', reason: '', startTime: '', endTime: '' }
        }
    }
}
</script>

<template>
    <!-- Use WorkerLayout which mirrors ManagerLayout -->
    <WorkerLayout>
        <div class="content-wrapper">

            <header class="header">
                <div>
                    <h1>Dashboard</h1>
                    <p class="date-subtitle">{{ todayDateFormatted }}</p>
                </div>
                <button @click="router.push('/worker/marketplace')" class="btn-create">
                    🔍 Find Work
                </button>
            </header>

            <div class="stats-grid">
                <div class="stat-card clickable-stat" @click="activeTab = 'upcoming'">
                    <span class="stat-label">Upcoming Shifts</span>
                    <span class="stat-number">{{ stats.upcoming }}</span>
                </div>
                <div class="stat-card clickable-stat" @click="activeTab = 'applications'">
                    <span class="stat-label">Pending Requests</span>
                    <span class="stat-number">{{ stats.pending }}</span>
                </div>
                <!-- Alert Card style for Sick Days if > 0 -->
                <div class="stat-card clickable-stat" :class="{ 'alert-card': stats.sick > 0 }" @click="activeTab = 'timeoff'">
                    <span class="stat-label">Sick Days</span>
                    <span class="stat-number">{{ stats.sick }}</span>
                </div>
            </div>

            <!-- Overview Section -->
            <section class="section-area">
                <div v-if="activeTab === 'schedule'" class="tab-content">
                    <WorkerCalendar :schedule="scheduleStore.mySchedule || []" @dateClick="onDateClick" />
                </div>

                <div v-else-if="activeTab === 'upcoming'" class="tab-content">
                    <div v-if="stats.upcoming === 0" class="empty-state">
                        No upcoming shifts found.
                    </div>
                    <div v-else class="list-grid">
                        <ShiftCard v-for="shift in upcomingShifts" :key="shift.id" :shift="shift">
                            <template #actions>
                                <div class="flex-actions mt-2" style="display: flex; gap: 1rem;">
                                    <BaseButton variant="danger" outline size="sm" @click="handleMarkSick(new Date(shift.date))" style="flex: 1;">
                                        Call in Sick
                                    </BaseButton>
                                    <BaseButton variant="secondary" outline size="sm" @click="onDateClick({ dateObj: new Date(shift.date) })" style="flex: 1;">
                                        Request Time Off
                                    </BaseButton>
                                </div>
                            </template>
                        </ShiftCard>
                    </div>
                </div>

                <div v-else-if="activeTab === 'applications'" class="tab-content">
                    <div v-if="stats.pending === 0" class="empty-state">
                        No active applications found.
                    </div>
                    <div v-else class="list-grid">
                        <MarketplaceCard v-for="shift in shiftStore.myApplications" :key="shift.id" :shift="shift">
                            <template #actions>
                                <span class="status-badge" :class="shift.applicationStatus">
                                    {{ shift.applicationStatus }}
                                </span>
                            </template>
                        </MarketplaceCard>
                    </div>
                </div>

                <div v-else-if="activeTab === 'timeoff'" class="tab-content">
                    <div class="timeoff-form-container">
                        <h3 class="mb-3">Submit New Request</h3>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Type</label>
                                <select v-model="timeOffForm.type" class="form-control">
                                    <option value="timeoff">Request Time Off</option>
                                    <option value="sick">Call In Sick</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" v-model="timeOffForm.date" class="form-control" />
                            </div>
                            <div class="form-group" v-if="timeOffForm.type === 'timeoff'">
                                <label>Time (Optional)</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <select v-model="timeOffForm.startTime" class="form-control" style="flex: 1;">
                                        <option value="">Start</option>
                                        <option v-for="time in timeOptions" :key="'start-'+time" :value="time">{{ time }}</option>
                                    </select>
                                    <select v-model="timeOffForm.endTime" class="form-control" style="flex: 1;">
                                        <option value="">End</option>
                                        <option v-for="time in timeOptions" :key="'end-'+time" :value="time">{{ time }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group" v-if="timeOffForm.type === 'timeoff'">
                                <label>Reason</label>
                                <input type="text" v-model="timeOffForm.reason" placeholder="Brief reason" class="form-control" />
                            </div>
                            <div class="form-group submit-group" style="display:flex; align-items:flex-end;">
                                <BaseButton style="width:100%" @click="submitTimeOffForm" :disabled="!timeOffForm.date">
                                    Submit Request
                                </BaseButton>
                            </div>
                        </div>
                    </div>

                    <h3 class="mt-4 mb-3">My Sick Days & Time Off</h3>
                    <div v-if="timeOffShifts.length === 0" class="empty-state">
                        No sick days or time off requested.
                    </div>
                    <div v-else class="list-grid">
                        <ShiftCard v-for="shift in timeOffShifts" :key="shift.id" :shift="shift">
                            <template #actions>
                                <span class="status-badge" :class="shift.status">
                                    {{ shift.status === 'sick' ? 'Sick' : 'Time Off' }}
                                </span>
                            </template>
                        </ShiftCard>
                    </div>
                </div>

                <!-- NEW MODAL -->
                <WorkerDayDetailModal 
                    :isOpen="isModalOpen" 
                    :date="selectedDate" 
                    :shifts="selectedDayShifts"
                    @close="isModalOpen = false"
                    @requestTimeOff="handleRequestTimeOff"
                    @markSick="handleMarkSick"
                    @updateTimeOff="handleUpdateTimeOff"
                    @deleteTimeOff="handleDeleteTimeOff"
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
    margin: 0;
}

.date-subtitle {
    color: #64748b;
    margin: 4px 0 0 0;
    font-size: 1rem;
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
    transition: transform 0.2s, box-shadow 0.2s;
}

.clickable-stat {
    cursor: pointer;
}
.clickable-stat:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    border-radius: 12px;
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

/* Status Badges */
.status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: capitalize;
}

.status-badge.pending {
    background-color: #fef3c7;
    color: #d97706;
}

.status-badge.approved {
    background-color: #dcfce3;
    color: #16a34a;
}

.status-badge.sick {
    background-color: #fee2e2;
    color: #dc2626;
}

.status-badge.request_off {
    background-color: #ffedd5;
    color: #ea580c;
}

/* Time Off Form */
.timeoff-form-container {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid #e2e8f0;
}

.form-grid {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.form-group {
    flex: 1;
    min-width: 150px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
}

.form-control {
    padding: 0.6rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.95rem;
    outline: none;
}

.form-control:focus {
    border-color: #38bdf8;
    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.mb-3 { margin-bottom: 1rem; }
.mt-4 { margin-top: 1.5rem; }
</style>