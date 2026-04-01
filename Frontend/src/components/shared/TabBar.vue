<script setup>
/**
 * TabBar — pill-style tab switcher
 *
 * Each tab can be a plain String or an Object:
 *   { value: String, label: String, badge?: String|Number }
 *
 * Supports v-model (modelValue / @update:modelValue).
 */
defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const getLabel = (tab) => (typeof tab === 'string' ? tab : tab.label)
const getValue = (tab) => (typeof tab === 'string' ? tab : tab.value)
const getBadge = (tab) => (typeof tab === 'object' && tab.badge != null ? tab.badge : null)
</script>

<template>
  <div class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="getValue(tab)"
      class="tab-btn"
      :class="{ active: modelValue === getValue(tab) }"
      @click="emit('update:modelValue', getValue(tab))"
    >
      {{ getLabel(tab) }}
      <span v-if="getBadge(tab) !== null" class="tab-badge">{{ getBadge(tab) }}</span>
    </button>
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover { background: #F9FAFB; }

.tab-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  padding: 0 0.35rem;
  line-height: 1;
}

.tab-btn:not(.active) .tab-badge {
  background: var(--neutral-bg);
  color: var(--text-muted);
}
</style>
