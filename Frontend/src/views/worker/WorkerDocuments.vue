<script setup>
import { ref, onMounted } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import PageHeader from '../../components/shared/PageHeader.vue'
import { useDocumentStore } from '../../stores/documentStore'
import api from '../../services/api'

const store = useDocumentStore()

const categories = ['All', 'Contracts', 'Certifications', 'Policies', 'General']
const activeCategory = ref('All')

onMounted(() => store.fetchDocuments())

function filterByCategory(cat) {
  activeCategory.value = cat
  store.fetchDocuments(cat === 'All' ? undefined : cat)
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function downloadDoc(doc) {
  const res = await api.get(`/documents/${doc.id}/download`, { responseType: 'blob' })
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = doc.name
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <WorkerLayout>
    <PageHeader title="My Documents" subtitle="View contracts, certifications, and company policies." />

    <!-- Category filter tabs -->
    <div class="category-tabs">
      <button
        v-for="cat in categories" :key="cat"
        :class="['tab', { 'tab--active': activeCategory === cat }]"
        @click="filterByCategory(cat)"
      >{{ cat }}</button>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="loading-state">Loading documents...</div>

    <!-- Error -->
    <div v-if="store.error" class="error-state">{{ store.error }}</div>

    <!-- Empty state -->
    <div v-if="!store.loading && !store.documents.length" class="documents-empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      <h3>No documents yet</h3>
      <p>Documents shared by your manager will appear here.</p>
    </div>

    <!-- Document list -->
    <div v-if="store.documents.length" class="doc-list">
      <div v-for="doc in store.documents" :key="doc.id" class="doc-row">
        <div class="doc-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div class="doc-info">
          <span class="doc-name">{{ doc.name }}</span>
          <span class="doc-meta">{{ formatSize(doc.size) }} &middot; {{ doc.category }} &middot; {{ formatDate(doc.createdAt) }}</span>
        </div>
        <div class="doc-actions">
          <button class="btn-icon" title="Download" @click="downloadDoc(doc)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </button>
        </div>
      </div>
    </div>
  </WorkerLayout>
</template>

<style scoped>
.category-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.tab {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  font-size: 0.85rem;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.15s;
}
.tab:hover { border-color: var(--primary, #3B82F6); color: var(--text-dark); }
.tab--active { background: var(--primary, #3B82F6); color: #fff; border-color: var(--primary, #3B82F6); }

.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
  font-size: 0.9rem;
}
.loading-state { color: var(--text-muted); }
.error-state { color: #EF4444; }

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

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.doc-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.75rem 1rem;
}
.doc-icon { color: var(--text-muted); flex-shrink: 0; }
.doc-info { flex: 1; min-width: 0; }
.doc-name { display: block; font-weight: 600; font-size: 0.9rem; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.doc-meta { font-size: 0.78rem; color: var(--text-muted); }
.doc-actions { flex-shrink: 0; }

.btn-icon {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.35rem;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.15s;
}
.btn-icon:hover { color: var(--text-dark); border-color: var(--text-muted); }

@media (max-width: 600px) {
  .doc-row { flex-wrap: wrap; }
  .doc-actions { width: 100%; justify-content: flex-end; margin-top: 0.5rem; }
}
</style>
