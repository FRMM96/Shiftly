<script setup>
import { ref, onMounted } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import { useShiftStore } from '../../stores/shiftStore'

const shiftStore = useShiftStore()
const loading = ref(false)
const error = ref('')
const rows = ref([])

async function load() {
  loading.value = true
  error.value = ''
  try {
    await shiftStore.fetchManagerShifts()
    const open = shiftStore.openShifts || []

    const all = []
    for (const shift of open) {
      const applicants = await shiftStore.fetchApplicants(shift.id).catch(() => [])
      all.push({
        shift,
        applicants
      })
    }
    rows.value = all
  } catch (e) {
    error.value = e.message || 'Failed to load applicants'
  } finally {
    loading.value = false
  }
}

async function assign(shiftId, applicationId) {
  try {
    await shiftStore.assignApplicant(shiftId, applicationId)
    await load()
    alert('Applicant assigned')
  } catch (e) {
    alert(e.message || 'Failed to assign applicant')
  }
}

onMounted(load)
</script>

<template>
  <ManagerLayout>
    <h1>Applicant Review</h1>

    <div v-if="loading">Loading…</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="rows.length === 0">No open shifts with applicants in this company.</div>

    <div v-else>
      <div v-for="row in rows" :key="row.shift.id" class="card">
        <h3>{{ row.shift.roleName || row.shift.role }} — {{ row.shift.business }}</h3>
        <p>{{ row.shift.date }} • {{ row.shift.startTime }} - {{ row.shift.endTime }}</p>

        <div v-if="row.applicants.length === 0">No applicants yet.</div>

        <div v-else v-for="app in row.applicants" :key="app.id" class="app-row">
          <div>
            <strong>{{ app.user?.username }}</strong>
            <div>{{ app.user?.email }}</div>
            <div>Status: {{ app.status }}</div>
          </div>
          <button @click="assign(row.shift.id, app.id)">Assign</button>
        </div>
      </div>
    </div>
  </ManagerLayout>
</template>

<style scoped>

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.page-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
}

/* Tabs */
.tabs-container {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid var(--border);
  margin-top: 2rem;
  margin-bottom: 2.5rem;
}

.tab {
  background: none;
  border: none;
  padding: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  bottom: -1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab:hover {
  color: var(--text-dark);
}

.tab.active {
  color: var(--primary);
  font-weight: 600;
  border-bottom: 2px solid var(--primary);
}

.tab-badge {
  background-color: var(--primary);
  color: #FFFFFF;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

/* Section Header */
.attention-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.attention-header h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

/* --- Shift Group Cards --- */
.shifts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.shift-group-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.shift-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F8FAFC;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.shift-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.shift-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-blue { background-color: #EFF6FF; color: #2563EB; }
.icon-green { background-color: #DCFCE3; color: #16A34A; }

.shift-info h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.shift-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.dot { margin: 0 0.25rem; color: #9CA3AF; }

.shift-header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.urgency-badge {
  background-color: var(--urgency-bg);
  color: var(--urgency-text);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
}

.applicant-count {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-dark);
}

/* Applicants List */
.applicants-list {
  display: flex;
  flex-direction: column;
}

.applicant-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.applicant-row:last-child {
  border-bottom: none;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.applicant-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.applicant-details h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.applicant-meta {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-dark);
  font-weight: 600;
}

.applicant-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary);
  color: #FFFFFF;
  border: 1px solid var(--primary);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.btn-outline {
  background-color: #FFFFFF;
  border: 1px solid var(--border);
  color: var(--text-dark);
}

.btn-outline:hover {
  background-color: #F8FAFC;
}

/* Load More Button */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

.btn-load-more {
  background-color: #FFFFFF;
  border: 1px solid var(--border);
  color: var(--text-dark);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.btn-load-more:hover {
  background-color: #F8FAFC;
}

/* --- Responsive Adjustments --- */

@media (max-width: 768px) {
  .shift-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .shift-header-right { width: 100%; justify-content: space-between; }
  
  .applicant-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .applicant-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
}

/* --- Modal --- */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff; border-radius: 16px; padding: 2rem;
  max-width: 380px; width: 90%; text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-icon {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.25rem;
}
.success-icon { background: #DCFCE3; color: #16A34A; }
.error-icon { background: #FEE2E2; color: #DC2626; }
.modal-box h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; }
.modal-box p { color: #6B7280; font-size: 0.95rem; margin: 0 0 1.5rem; }
.modal-close-btn { width: 100%; }
</style>