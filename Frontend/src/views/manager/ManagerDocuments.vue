<script setup>
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import PageHeader from '../../components/shared/PageHeader.vue'
</script>

<template>
  <ManagerLayout>
    <PageHeader title="Documents" subtitle="Manage contracts, certifications, and company policies." />

    <div class="documents-empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      <h3>No documents yet</h3>
      <p>Upload contracts, certifications, and policies for your team.</p>
    </div>
  </ManagerLayout>
</template>

<style scoped>
.documents-empty {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
}
.documents-empty h3 { margin: 1rem 0 0.5rem; color: var(--text-dark); }
.documents-empty p { font-size: 0.9rem; }
</style>
