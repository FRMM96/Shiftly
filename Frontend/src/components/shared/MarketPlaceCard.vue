<script setup>
defineProps({
    shift: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="marketplace-card">

        <div class="card-image" :style="{ backgroundImage: `url(${shift.image})` }">
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
    height: 140px;
    background-size: cover;
    background-position: center;
    position: relative;
}

.pay-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: white;
    color: #166534;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
    padding: 1.25rem;
}

.header {
    margin-bottom: 12px;
}

.role {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #0f172a;
}

.business {
    font-size: 0.9rem;
    color: #64748b;
}

.meta {
    display: flex;
    gap: 15px;
    font-size: 0.9rem;
    color: #475569;
    margin-bottom: 1.5rem;
    background: #f8fafc;
    padding: 10px;
    border-radius: 8px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.actions {
    display: flex;
    justify-content: flex-end;
}
</style>