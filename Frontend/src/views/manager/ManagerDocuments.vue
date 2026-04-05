<script setup>
import { ref, onMounted } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import PageHeader from '../../components/shared/PageHeader.vue'
import { useDocumentStore } from '../../stores/documentStore'
import api from '../../services/api'

const store = useDocumentStore()

const categories = ['All', 'Contracts', 'Certifications', 'Policies', 'General']
const activeCategory = ref('All')
const uploadCategory = ref('General')
const dragOver = ref(false)
const fileInput = ref(null)
const confirmDeleteId = ref(null)

onMounted(() => store.fetchDocuments())

function filterByCategory(cat) {
  activeCategory.value = cat
  store.fetchDocuments(cat === 'All' ? undefined : cat)
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFiles(files) {
  if (!files?.length) return
  for (const file of files) {
    await store.uploadDocument(file, uploadCategory.value)
  }
}

function onFileSelect(e) {
  handleFiles(e.target.files)
  e.target.value = ''
}

function onDrop(e) {
  dragOver.value = false
  handleFiles(e.dataTransfer.files)
}

async function confirmDelete(id) {
  confirmDeleteId.value = id
}

async function doDelete() {
  if (!confirmDeleteId.value) return
  await store.deleteDocument(confirmDeleteId.value)
  confirmDeleteId.value = null
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
  <ManagerLayout>
    <PageHeader title="Documents" subtitle="Manage contracts, certifications, and company policies." />

    <!-- Upload zone -->
    <div
      class="upload-zone"
      :class="{ 'upload-zone--active': dragOver }"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <input ref="fileInput" type="file" hidden multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" @change="onFileSelect" />
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p>Drag & drop files here or <span class="upload-link">browse</span></p>
      <span class="upload-hint">PDF, PNG, JPG, DOCX — max 10 MB</span>
    </div>

    <!-- Category selector for uploads -->
    <div class="upload-category">
      <label>Upload to category:</label>
      <select v-model="uploadCategory">
        <option v-for="c in categories.filter(c => c !== 'All')" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

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
      <p>Upload contracts, certifications, and policies for your team.</p>
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
          <button class="btn-icon btn-icon--danger" title="Delete" @click="confirmDelete(doc.id)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="confirmDeleteId" class="modal-overlay" @click.self="confirmDeleteId = null">
        <div class="modal">
          <h3>Delete document?</h3>
          <p>This action cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn btn--secondary" @click="confirmDeleteId = null">Cancel</button>
            <button class="btn btn--danger" @click="doDelete">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </ManagerLayout>
</template>

<style scoped>
.upload-zone {
  background: var(--bg-card);
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  color: var(--text-muted);
}
.upload-zone:hover,
.upload-zone--active {
  border-color: var(--primary, #3B82F6);
  background: rgba(59,130,246,0.04);
}
.upload-zone svg { margin-bottom: 0.5rem; }
.upload-zone p { margin: 0.5rem 0 0.25rem; font-size: 0.95rem; }
.upload-link { color: var(--primary, #3B82F6); font-weight: 600; }
.upload-hint { font-size: 0.8rem; }

.upload-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.upload-category select {
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-dark);
  font-size: 0.85rem;
}

.category-tabs {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
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
.doc-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }

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
.btn-icon--danger:hover { color: #EF4444; border-color: #EF4444; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: var(--bg-card, #fff);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 360px;
  width: 90%;
}
.modal h3 { margin: 0 0 0.5rem; color: var(--text-dark); }
.modal p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem; }
.modal-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }

.btn {
  padding: 0.45rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border);
}
.btn--secondary { background: var(--bg-card); color: var(--text-dark); }
.btn--danger { background: #EF4444; color: #fff; border-color: #EF4444; }

@media (max-width: 600px) {
  .doc-row { flex-wrap: wrap; }
  .doc-actions { width: 100%; justify-content: flex-end; margin-top: 0.5rem; }
}
</style>
