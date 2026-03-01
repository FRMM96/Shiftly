<script setup>
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
    shift: {
        type: Object,
        required: true
    }
})

// Define a map of role to image URLs for placeholder purposes
const roleImages = {
    'Bartender': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    'Waiter': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    'Chef': 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
    'Barista': 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
    'Dishwasher': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    'Runner': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800'
}

const displayImage = computed(() => {
    if (props.shift.image) return props.shift.image;
    
    const roleKey = Object.keys(roleImages).find(r => 
        props.shift.role && props.shift.role.toLowerCase().includes(r.toLowerCase())
    );
    
    return roleKey 
        ? roleImages[roleKey]
        : 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800'; // Default restaurant image
})

const emit = defineEmits(['more-info'])

const handleMoreInfo = () => {
    emit('more-info', props.shift)
}
</script>

<template>
    <div class="marketplace-card">

        <div class="card-image" :style="{ backgroundImage: `url(${displayImage})` }">
            <span class="pay-badge">{{ shift.pay }}</span>
        </div>

        <div class="card-content">

            <div class="header">
                <h3 class="role">{{ shift.role }}</h3>
                <span class="business">{{ shift.business }}</span>
            </div>

            <div class="meta">
                <div class="meta-item">
                    <span>📅</span> {{ shift.date }}
                </div>
                <div class="meta-item">
                    <span>⏰</span> {{ shift.startTime }} - {{ shift.endTime }}
                </div>
            </div>

            <div class="actions">
                <BaseButton variant="secondary" outline size="sm" @click="handleMoreInfo" style="margin-right: 8px;">
                    More Info
                </BaseButton>
                <slot name="actions"></slot>
            </div>

        </div>
    </div>
</template>

<style scoped>
.marketplace-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.marketplace-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-image {
    height: 160px; /* Slightly taller for better image visibility */
    background-size: cover;
    background-position: center;
    position: relative;
    background-color: #f1f5f9; /* fallback background */
}

.pay-badge {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: white;
    color: #166534;
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 800;
    font-size: 0.95rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-content {
    padding: 1.25rem;
}

.header {
    margin-bottom: 12px;
}

.role {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
}

.business {
    font-size: 0.95rem;
    color: #64748b;
}

.meta {
    display: flex;
    flex-wrap: wrap; /* allow wrapping on small screens */
    gap: 15px;
    font-size: 0.9rem;
    color: #475569;
    margin-bottom: 1.5rem;
    background: #f8fafc;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #f1f5f9;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>