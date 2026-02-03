<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../../components/shared/BaseButton.vue'
import ManagerLayout from '../../components/manager/ManagerLayout.vue'
//import StatusBadge from '../components/StatusBadge.vue'

// --- Mock Data: Open Shifts ---
const openShifts = ref([
    { id: 101, role: 'Bartender', time: '18:00 - 02:00', date: 'Today', applicants: 3 },
    { id: 102, role: 'Dishwasher', time: '19:00 - 23:00', date: 'Tomorrow', applicants: 1 },
    { id: 103, role: 'Waiter', time: '12:00 - 16:00', date: 'Fri, 28 Jan', applicants: 5 },
])

// --- Mock Data: Candidates (Linked to Shift 101 initially) ---
const candidates = ref([
    { id: 1, name: 'Alex M.', rating: 4.9, completedShifts: 42, avatar: 'A', appliedTime: '10m ago' },
    { id: 2, name: 'Sarah K.', rating: 4.5, completedShifts: 12, avatar: 'S', appliedTime: '1h ago' },
    { id: 3, name: 'John D.', rating: 5.0, completedShifts: 8, avatar: 'J', appliedTime: '2h ago' },
])

const selectedShiftId = ref(101)

// --- Computed ---
const selectedShift = computed(() => openShifts.value.find(s => s.id === selectedShiftId.value))

// --- Actions ---
const selectShift = (id) => {
    selectedShiftId.value = id
    // In a real app, you would fetch candidates for this shift ID here
}

const handleHire = (candidate) => {
    if (confirm(`Hire ${candidate.name} for the ${selectedShift.value.role} shift?`)) {
        // 1. Remove shift from "Open" list
        openShifts.value = openShifts.value.filter(s => s.id !== selectedShiftId.value)

        // 2. Clear selection or select next
        if (openShifts.value.length > 0) {
            selectedShiftId.value = openShifts.value[0].id
        } else {
            selectedShiftId.value = null
        }

        alert(`Success! ${candidate.name} has been notified.`)
    }
}

const handleReject = (id) => {
    candidates.value = candidates.value.filter(c => c.id !== id)
}
</script>

<template>
    <ManagerLayout>
        <div class="page-container">

            <header class="page-header">
                <div>
                    <h1 class="page-title">Applicant Review</h1>
                    <p class="page-subtitle">Select an open shift to review candidates.</p>
                </div>
                <div class="stats-pill">
                    <strong>{{ openShifts.length }}</strong> Shifts Open
                </div>
            </header>

            <div class="review-grid">

                <aside class="shifts-column">
                    <h3 class="column-title">Open Shifts</h3>

                    <div v-if="openShifts.length === 0" class="empty-msg">No open shifts.</div>

                    <div v-for="shift in openShifts" :key="shift.id" class="shift-item"
                        :class="{ 'selected': shift.id === selectedShiftId }" @click="selectShift(shift.id)">
                        <div class="shift-header">
                            <span class="shift-role">{{ shift.role }}</span>
                            <span class="shift-date">{{ shift.date }}</span>

                        </div>
                        <div class="shift-meta">
                            <span>{{ shift.time }}</span>
                            <span class="applicant-count">{{ shift.applicants }} applicants</span>
                        </div>
                    </div>
                </aside>

                <main class="candidates-column">

                    <div v-if="selectedShift" class="candidates-header">
                        <h3>Candidates for <strong>{{ selectedShift.role }}</strong></h3>
                        <span class="time-badge">{{ selectedShift.time }}</span>
                    </div>

                    <div v-if="!selectedShift" class="empty-state">
                        Select a shift to see applicants.
                    </div>

                    <div v-else-if="candidates.length === 0" class="empty-state">
                        No applicants yet for this shift.
                    </div>

                    <div v-else class="candidates-list">
                        <div v-for="person in candidates" :key="person.id" class="candidate-card">

                            <div class="candidate-left">
                                <div class="avatar-lg">{{ person.avatar }}</div>
                                <div>
                                    <h4 class="candidate-name">{{ person.name }}</h4>
                                    <div class="trust-signals">
                                        <span class="rating">⭐ {{ person.rating }}</span>
                                        <span class="dot">•</span>
                                        <span class="jobs">{{ person.completedShifts }} shifts done</span>
                                    </div>
                                </div>
                            </div>

                            <div class="candidate-right">
                                <span class="applied-time">Applied {{ person.appliedTime }}</span>

                                <div class="action-buttons">
                                    <BaseButton variant="secondary" size="sm" @click="handleReject(person.id)">Not Hire
                                    </BaseButton>
                                    <BaseButton variant="primary" size="sm" @click="handleHire(person)">Hire
                                    </BaseButton>
                                </div>
                            </div>

                        </div>
                    </div>

                </main>

            </div>
        </div>
    </ManagerLayout>

</template>

<style scoped>
/* Layout Structure */
.page-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    height: calc(100vh - 60px);
    /* Fill screen minus header */
    display: flex;
    flex-direction: column;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-title {
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
}

.page-subtitle {
    color: #64748b;
    margin-top: 5px;
}

.stats-pill {
    background: #fefce8;
    color: #a16207;
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 0.9rem;
    border: 1px solid #fde047;
}

/* Two-Column Grid */
.review-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    /* Fixed sidebar, fluid main */
    gap: 2rem;
    flex: 1;
    overflow: hidden;
    /* Prevents full page scroll */
}

/* Left Column: Shifts */
.shifts-column {
    border-right: 1px solid #e2e8f0;
    padding-right: 1.5rem;
    overflow-y: auto;
}

.column-title {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #94a3b8;
    margin-bottom: 1rem;
}

.shift-item {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.shift-item:hover {
    border-color: #cbd5e1;
}

.shift-item.selected {
    border-color: #0f172a;
    background-color: #f8fafc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.shift-header {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 4px;
}

.shift-role {
    color: #0f172a;
}

.shift-date {
    color: #64748b;
    font-size: 0.9rem;
}

.shift-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #64748b;
}

.applicant-count {
    color: #d97706;
    font-weight: 600;
}

/* Right Column: Candidates */
.candidates-column {
    padding-left: 0.5rem;
    overflow-y: auto;
}

.candidates-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f1f5f9;
}

.candidates-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 400;
}

.time-badge {
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
}

.candidate-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s;
}

.candidate-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.candidate-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.avatar-lg {
    width: 56px;
    height: 56px;
    background: #0f172a;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
}

.candidate-name {
    margin: 0 0 4px 0;
    font-size: 1.1rem;
}

.trust-signals {
    font-size: 0.9rem;
    color: #64748b;
    display: flex;
    gap: 8px;
}

.rating {
    color: #0f172a;
    font-weight: 600;
}

.candidate-right {
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
}

.applied-time {
    font-size: 0.8rem;
    color: #94a3b8;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.empty-state {
    text-align: center;
    color: #94a3b8;
    margin-top: 3rem;
    font-style: italic;
}
</style>