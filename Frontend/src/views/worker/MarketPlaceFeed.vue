<script setup>
import { computed } from 'vue'
import WorkerLayout from '../../components/worker/WorkerLayout.vue'
import BaseButton from '../../components/shared/BaseButton.vue'
import MarketplaceCard from '../../components/shared/MarketplaceCard.vue' 
import { useShiftStore } from '../../stores/shiftStore'
import { useUserStore } from '../../stores/userStore'

const shiftStore = useShiftStore()
const userStore = useUserStore()

// 1. ACTION: Handle the logic when user clicks Apply
const handleApply = (shift) => {
    // A. Check if user is logged in
    if (!userStore.user) {
        alert("Please log in to apply!")
        return
    }

    // B. Confirm intent
    if (confirm(`Apply for ${shift.role} at ${shift.business}?`)) {
        // C. Call the store
        shiftStore.applyToShift(shift.id, userStore.user)
        alert("Application Sent! You can track status in 'My Shifts'.")
    }
}
</script>

<template>
    <WorkerLayout>
        
        <div class="page-container">
            
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
                
                <MarketplaceCard 
                    v-for="shift in shiftStore.openShifts" 
                    :key="shift.id" 
                    :shift="shift"
                >
                    <template #actions>
                        <BaseButton 
                            variant="primary" 
                            size="sm" 
                            @click="handleApply(shift)"
                        >
                            Quick Apply
                        </BaseButton>
                    </template>
                </MarketplaceCard>

                <div v-if="shiftStore.openShifts.length === 0" class="empty-state">
                    <p>No gigs available right now. Check back later! 😴</p>
                </div>

            </div>
        </div>

    </WorkerLayout>
</template>

<style scoped>
/* Page Layout */
.page-container {
    padding: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
}

/* Header Typography */
.feed-header {
    margin-bottom: 1.5rem;
}
.feed-header h1 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
}
.feed-header p {
    color: #64748b;
    margin-top: 5px;
}

/* Filter Scroll Row */
.filters {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    overflow-x: auto;
    padding-bottom: 5px;
    /* Hide scrollbar for clean look */
    scrollbar-width: none; 
}
.filters::-webkit-scrollbar { display: none; }

.filter-pill {
    border: 1px solid #e2e8f0;
    background: white;
    padding: 8px 16px;
    border-radius: 50px;
    font-weight: 600;
    color: #64748b;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-pill:hover {
    background: #f1f5f9;
}

.filter-pill.active {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
}

/* List Container */
.gig-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 3rem;
    color: #94a3b8;
    background: #f8fafc;
    border-radius: 12px;
    border: 2px dashed #e2e8f0;
}
</style>