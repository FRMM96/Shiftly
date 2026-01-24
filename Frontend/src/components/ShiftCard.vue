<script setup>
import StatusBadge from '../components/StatusBadge.vue'

const props = defineProps({
    shift: { type: Object, required: true },
    compact: { type: Boolean, default: false } // For small calendar views
})
</script>

<template>
    <div class="shift-card" :class="[shift.status, { 'is-compact': compact }]">

        <div class="card-header">
            <span class="time-pill">{{ shift.time }}</span>
            <StatusBadge v-if="!compact" :status="shift.status" />
        </div>

        <div class="card-body">
            <h3 class="role">{{ shift.role }}</h3>
            <div class="user-row" v-if="shift.name && shift.name !== 'Open Slot'">
                <div class="avatar-tiny">{{ shift.name.charAt(0) }}</div>
                <span class="name">{{ shift.name }}</span>
            </div>
            <span v-else class="name text-muted">Unassigned</span>
        </div>

        <div class="card-actions" v-if="$slots.actions && !compact">
            <slot name="actions"></slot>
        </div>

    </div>
</template>

<style scoped>
.shift-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #cbd5e1;
    /* Default Stripe */
    border-radius: 8px;
    padding: 12px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.shift-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Status Stripes */
.shift-card.active {
    border-left-color: #10b981;
}

.shift-card.sick {
    border-left-color: #ef4444;
    background: #fff1f2;
}

.shift-card.open {
    border-left-color: #f59e0b;
    border-style: dashed;
}

/* Compact Mode (for Calendar Month View) */
.is-compact {
    padding: 6px;
}

.is-compact .card-header {
    margin-bottom: 2px;
}

.is-compact .role {
    font-size: 0.8rem;
}

.is-compact .user-row {
    display: none;
}

/* Hide user details in tiny view */

/* Typography */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.time-pill {
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    background: #f8fafc;
    padding: 2px 6px;
    border-radius: 4px;
}

.role {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
}

.user-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
}

.name {
    font-size: 0.85rem;
    color: #475569;
}

.text-muted {
    color: #94a3b8;
    font-style: italic;
}

.avatar-tiny {
    width: 20px;
    height: 20px;
    background: #cbd5e1;
    color: white;
    border-radius: 50%;
    font-size: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-actions {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    gap: 8px;
}
</style>