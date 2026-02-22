
<template>
  <ManagerLayout>
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Applicant Review</h1>
          <p class="page-subtitle">Select an open shift to review candidates (real accounts).</p>
        </div>
        <div class="stats-pill">
          <strong>{{ openShifts.length }}</strong> Shifts Open
        </div>
      </header>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="review-grid">
        <aside class="shifts-column">
          <h3>Open Shifts</h3>
          <div v-if="openShifts.length === 0" class="muted">No open shifts right now.</div>

          <button
            v-for="s in openShifts"
            :key="s.id"
            class="shift-btn"
            :class="{ active: s.id === selectedShiftId }"
            @click="selectShift(s.id)"
          >
            <div class="shift-title">{{ s.role }}</div>
            <div class="shift-meta">{{ s.date }} • {{ s.startTime }} - {{ s.endTime }}</div>
          </button>
        </aside>

        <section class="candidates-column">
          <h3 v-if="selectedShift">Applicants for {{ selectedShift.role }}</h3>

          <div v-if="loadingApplicants">Loading applicants…</div>
          <div v-else-if="!selectedShift" class="muted">Select a shift.</div>
          <div v-else-if="applicants.length === 0" class="muted">No applicants yet.</div>

          <div v-for="app in applicants" :key="app.id" class="candidate-card">
            <div class="avatar">{{ (app.user.username || '?').charAt(0).toUpperCase() }}</div>
            <div class="info">
              <div class="name">{{ app.user.username }}</div>
              <div class="meta">{{ app.user.email }} • {{ new Date(app.appliedAt).toLocaleString() }}</div>
              <div class="meta">Status: {{ app.status }}</div>
            </div>
            <div class="actions">
              <BaseButton variant="primary" @click="handleHire(app)" :disabled="app.status !== 'PENDING'">Hire</BaseButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  </ManagerLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BaseButton from '../../components/shared/BaseButton.vue'
import ManagerLayout from '../../components/manager/ManagerLayout.vue'
import { useShiftStore } from '../../stores/shiftStore'

const store = useShiftStore()

const openShifts = computed(() => store.shifts.filter(s => s.status === 'OPEN'))

const selectedShiftId = ref(null)
const applicants = ref([])
const loadingApplicants = ref(false)
const error = ref('')

const selectedShift = computed(() => openShifts.value.find(s => s.id === selectedShiftId.value))

async function loadOpenShifts() {
  await store.fetchManagerShifts()
  if (!selectedShiftId.value && openShifts.value.length > 0) selectedShiftId.value = openShifts.value[0].id
}

async function loadApplicants() {
  if (!selectedShiftId.value) return
  loadingApplicants.value = true
  error.value = ''
  try {
    applicants.value = await store.fetchApplicants(selectedShiftId.value)
  } catch (e) {
    error.value = e.message || 'Failed to load applicants'
  } finally {
    loadingApplicants.value = false
  }
}

function selectShift(id) {
  selectedShiftId.value = id
}

async function handleHire(app) {
  if (!selectedShift.value) return
  if (confirm(`Hire ${app.user.username} for the ${selectedShift.value.role} shift?`)) {
    try {
      await store.assignApplicant(selectedShiftId.value, app.id)
      await loadOpenShifts()
      await loadApplicants()
      alert('Success! The worker has been assigned.')
    } catch (e) {
      alert(e.message || 'Failed to assign')
    }
  }
}

onMounted(async () => {
  await loadOpenShifts()
  await loadApplicants()
})

watch(selectedShiftId, loadApplicants)
</script>

<style scoped>
/* Layout Structure */
.page-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    height: calc(100vh - 60px);
    /* Fill screen minus header */
    display: flex;
    flex-direction: column;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-title {
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
}

.page-subtitle {
    color: #64748b;
    margin-top: 5px;
}

.stats-pill {
    background: #fefce8;
    color: #a16207;
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 0.9rem;
    border: 1px solid #fde047;
}

/* Two-Column Grid */
.review-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    /* Fixed sidebar, fluid main */
    gap: 2rem;
    flex: 1;
    overflow: hidden;
    /* Prevents full page scroll */
}

/* Left Column: Shifts */
.shifts-column {
    border-right: 1px solid #e2e8f0;
    padding-right: 1.5rem;
    overflow-y: auto;
}

.column-title {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #94a3b8;
    margin-bottom: 1rem;
}

.shift-item {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.shift-item:hover {
    border-color: #cbd5e1;
}

.shift-item.selected {
    border-color: #0f172a;
    background-color: #f8fafc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.shift-header {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 4px;
}

.shift-role {
    color: #0f172a;
}

.shift-date {
    color: #64748b;
    font-size: 0.9rem;
}

.shift-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #64748b;
}

.applicant-count {
    color: #d97706;
    font-weight: 600;
}

/* Right Column: Candidates */
.candidates-column {
    padding-left: 0.5rem;
    overflow-y: auto;
}

.candidates-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f1f5f9;
}

.candidates-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 400;
}

.time-badge {
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
}

.candidate-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s;
}

.candidate-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.candidate-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.avatar-lg {
    width: 56px;
    height: 56px;
    background: #0f172a;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
}

.candidate-name {
    margin: 0 0 4px 0;
    font-size: 1.1rem;
}

.trust-signals {
    font-size: 0.9rem;
    color: #64748b;
    display: flex;
    gap: 8px;
}

.rating {
    color: #0f172a;
    font-weight: 600;
}

.candidate-right {
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
}

.applied-time {
    font-size: 0.8rem;
    color: #94a3b8;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.empty-state {
    text-align: center;
    color: #94a3b8;
    margin-top: 3rem;
    font-style: italic;
}

.error { color:#b00020; }
.review-grid { display:grid; grid-template-columns: 280px 1fr; gap:16px; }
.shift-btn { width:100%; text-align:left; padding:12px; border:1px solid #eee; border-radius:12px; background:#fff; margin-bottom:10px; }
.shift-btn.active { outline: 2px solid #6b46c1; }
.shift-title { font-weight:700; }
.shift-meta, .muted { font-size: 13px; opacity:.8; }
.candidate-card { display:flex; gap:12px; padding:12px; border:1px solid #eee; border-radius:12px; background:#fff; margin-bottom:10px; align-items:center; }
.avatar { width:40px; height:40px; border-radius:999px; display:flex; align-items:center; justify-content:center; background:#eef; font-weight:700; }
.actions { margin-left:auto; }
</style>
