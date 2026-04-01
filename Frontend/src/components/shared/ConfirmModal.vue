<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  // 'success' | 'danger' | 'info'
  type: { type: String, default: 'success' }
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-box">
        <div class="modal-inner">
          <div class="modal-icon" :class="`icon-${type}`">
            <!-- Success -->
            <svg v-if="type === 'success'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <!-- Danger / Error -->
            <svg v-else-if="type === 'danger'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <!-- Info -->
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
        </div>
        <button class="btn-close" @click="emit('close')">Got it</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  max-width: 380px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-inner {
  margin-bottom: 1.5rem;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.icon-success { background: var(--green-bg); color: var(--green-border); }
.icon-danger  { background: var(--danger-bg); color: var(--danger-text); }
.icon-info    { background: var(--info-bg); color: var(--info-text); }

.modal-box h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--text-dark);
}

.modal-box p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.btn-close {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-close:hover { background-color: var(--primary-hover); }
</style>
