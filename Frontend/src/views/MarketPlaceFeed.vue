<script setup>
import { computed } from 'vue'
import WorkerLayout from '../components/WorkerLayout.vue' // Ensure this matches your filename
import BaseButton from '../components/BaseButton.vue'
import { useShiftStore } from '../stores/shiftStore'

// 1. Init the Store
const store = useShiftStore()

// 2. Compute 'gigs' from the Store
// We use .map() to transform the Store data into the format your Card expects
const gigs = computed(() => {
    return store.openShifts.map(shift => ({
        id: shift.id,
        business: shift.business,
        role: shift.role,
        // Combine start and end times for the display
        time: `${shift.startTime} - ${shift.endTime}`,
        // The store has "150 kr/h", map it to rate
        rate: shift.pay,
        // Placeholder for total pay (or you can calculate it if you parse the numbers)
        pay: 'Est. Total',
        date: shift.date,
        tags: ['New', 'Urgent'], // Default tags since the simple form doesn't have tags yet
        image: shift.image
    }))
})

// 3. Actions
const handleApply = (gig) => {
    if (confirm(`Apply for ${gig.role} at ${gig.business}?`)) {
        alert("Application Sent! The manager will review it shortly.")
        // In a real app, you would call: store.applyToShift(gig.id)
    }
}
</script>

<template>
    <WorkerLayout>

        <div class="feed-header">
            <h1>Find Work</h1>
            <p>Pick up extra shifts nearby.</p>
        </div>

        <div class="filters">
            <button class="filter-pill active">All</button>
            <button class="filter-pill">High Pay</button>
            <button class="filter-pill">This Week</button>
        </div>

        <div class="gig-list">
            <div v-for="gig in gigs" :key="gig.id" class="gig-card">

                <div class="gig-top">
                    <img :src="gig.image" class="gig-icon" alt="Job" />

                    <div class="gig-info">
                        <h3>{{ gig.role }}</h3>
                        <span class="business-name">{{ gig.business }}</span>
                    </div>
                    <div class="gig-pay">
                        <span class="total">{{ gig.rate }}</span>
                        <span class="rate">{{ gig.pay }}</span>
                    </div>
                </div>

                <div class="gig-details">
                    <span class="detail-badge">📅 {{ gig.date }}</span>
                    <span class="detail-badge">⏰ {{ gig.time }}</span>
                </div>

                <div class="gig-footer">
                    <div class="tags">
                        <span v-for="tag in gig.tags" :key="tag" class="tag">#{{ tag }}</span>
                    </div>
                    <BaseButton variant="primary" size="sm" @click="handleApply(gig)">Quick Apply</BaseButton>
                </div>

            </div>

            <div v-if="gigs.length === 0" class="empty-state">
                <p>No gigs available right now. Check back later! 😴</p>
            </div>
        </div>

    </WorkerLayout>
</template>

<style scoped>
.feed-header {
    margin-bottom: 1.5rem;
}

.feed-header h1 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
}

.feed-header p {
    color: #6b7280;
    margin-top: 5px;
}

/* Filters */
.filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 5px;
}

.filter-pill {
    border: 1px solid #e5e7eb;
    background: white;
    padding: 8px 16px;
    border-radius: 50px;
    font-weight: 600;
    color: #6b7280;
    white-space: nowrap;
    cursor: pointer;
}

.filter-pill.active {
    background: #111;
    color: white;
    border-color: #111;
}

/* Cards */
.gig-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.gig-card {
    background: white;
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    border: 1px solid #f3f4f6;
}

.gig-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.gig-icon {
    font-size: 2rem;
    background: #f9fafb;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    margin-right: 12px;
}

.gig-info {
    flex: 1;
}

.gig-info h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
}

.business-name {
    color: #6b7280;
    font-size: 0.9rem;
}

.gig-pay {
    text-align: right;
    display: flex;
    flex-direction: column;
}

.total {
    font-size: 1.2rem;
    font-weight: 800;
    color: #10b981;
}

.rate {
    font-size: 0.8rem;
    color: #6b7280;
}

.gig-details {
    display: flex;
    gap: 10px;
    margin-bottom: 1rem;
}

.detail-badge {
    background: #f3f4f6;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
}

.gig-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f3f4f6;
    padding-top: 1rem;
}

.tags {
    display: flex;
    gap: 8px;
}

.tag {
    font-size: 0.75rem;
    color: #9ca3af;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: #9ca3af;
}
</style>