<script setup>
defineProps({
  text: { type: String, default: 'Load More' },
  isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="load-more-wrapper">
    <button class="load-more-btn" :disabled="isLoading" @click="emit('click')">
      <span v-if="isLoading">Loading...</span>
      <template v-else>
        {{ text }}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </template>
    </button>
  </div>
</template>

<style scoped>
.load-more-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.75rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-body);
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover {
  background: #F8FAFC;
  border-color: #D1D5DB;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
