<script setup>
import WorkerSidebar from './WorkerSidebar.vue'
</script>

<template>
  <div class="worker-layout">
    <WorkerSidebar />

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.worker-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  /* We don't need overflow:hidden here anymore if we handle scroll inside main-content */
}

.main-content {
  /* 👇 CRITICAL FIX: Push content to the right */
  margin-left: 260px;

  /* Ensure it takes the remaining width */
  width: calc(100% - 260px);

  /* Allow internal scrolling */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Mobile Responsiveness: If screen is small, remove margin & hide sidebar (optional logic) */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>