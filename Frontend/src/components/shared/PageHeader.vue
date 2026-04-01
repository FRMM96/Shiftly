<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  backLabel: { type: String, default: '' }
})

const emit = defineEmits(['back'])
</script>

<template>
  <div class="page-header">
    <button v-if="backLabel" class="back-btn" @click="emit('back')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      {{ backLabel }}
    </button>
    <h1 class="page-title">{{ title }}</h1>
    <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 1.75rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  padding: 0;
  transition: color 0.2s;
}
.back-btn:hover { color: var(--primary); }

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}
</style>
