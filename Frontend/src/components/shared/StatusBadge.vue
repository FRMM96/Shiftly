<script setup>
import { computed } from 'vue'

const props = defineProps({
    status: {
        type: String,
        required: true,
        // expected values: 'active', 'sick', 'open', 'pending'
    }
})

const badgeClass = computed(() => {
    switch (props.status) {
        case 'active': return 'bg-green-100 text-green-800 border-green-200'
        case 'sick': return 'bg-red-100 text-red-800 border-red-200'
        case 'open': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dashed-border'
        case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
})

const label = computed(() => {
    switch (props.status) {
        case 'sick': return 'Needs Coverage'
        case 'open': return 'Marketplace Open'
        default: return props.status // Capitalize if needed
    }
})
</script>

<template>
    <span class="badge" :class="badgeClass">
        <span class="dot" :class="`bg-${status}`"></span>
        {{ label }}
    </span>
</template>

<style scoped>
.badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid transparent;
    white-space: nowrap;
}

.dashed-border {
    border-style: dashed;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
    /* Inherits text color */
}
</style>