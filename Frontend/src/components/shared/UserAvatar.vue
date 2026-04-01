<script setup>
import { computed } from 'vue'

const props = defineProps({
  imageUrl: { type: String, default: '' },
  name: { type: String, default: '' },
  username: { type: String, default: '' },
  // 'green' | 'yellow' | 'gray' | '' (no dot)
  statusColor: { type: String, default: '' },
  size: { type: String, default: 'md' } // 'sm' | 'md' | 'lg'
})

const displayName = computed(() => props.username || props.name || '')

const initials = computed(() => {
  if (!displayName.value) return '?'
  return displayName.value
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
})
</script>

<template>
  <div class="avatar-root" :class="`size-${size}`">
    <img v-if="imageUrl" :src="imageUrl" :alt="displayName || 'Avatar'" class="avatar-img" />
    <div v-else class="avatar-placeholder">{{ initials }}</div>
    <span v-if="statusColor" class="status-dot" :class="`dot-${statusColor}`"></span>
  </div>
</template>

<style scoped>
.avatar-root {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

/* Sizes */
.size-sm  { width: 36px;  height: 36px; }
.size-md  { width: 48px;  height: 48px; }
.size-lg  { width: 80px;  height: 80px; }

.avatar-img,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 700;
  font-size: 0.85em;
  border: 1px solid var(--border);
}

/* Status dot */
.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.dot-green  { background-color: var(--dot-green); }
.dot-yellow { background-color: var(--dot-yellow); }
.dot-gray   { background-color: var(--dot-gray); }
</style>
