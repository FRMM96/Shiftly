<script setup>
defineProps({
    isOpen: Boolean,
    title: String
})
defineEmits(['close'])
</script>

<template>
    <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-panel">
            <header class="modal-header">
                <h2 class="modal-title">{{ title }}</h2>
                <button class="close-btn" @click="$emit('close')">×</button>
            </header>

            <div class="modal-content">
                <slot></slot>
            </div>

            <footer class="modal-footer" v-if="$slots.footer">
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<style scoped>
/* Reuse the modal styles from your previous DayDetailsModal, 
   but keep them generic (no specific shift styling) */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-panel {
    background: white;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #94a3b8;
}

.modal-content {
    padding: 1.5rem;
    overflow-y: auto;
}

.modal-footer {
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>