<script setup>
import { computed, onMounted, ref } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import { useShiftStore } from '../../stores/shiftStore'

const shiftStore = useShiftStore()
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

async function loadMarketplace() {
  loading.value = true
  error.value = ''
  try {
    await shiftStore.fetchMarketplace()
  } catch (e) {
    error.value = e.message || 'Failed to load marketplace shifts'
  } finally {
    loading.value = false
  }
}

async function handleApply(shiftId) {
  try {
    await shiftStore.applyToShift(shiftId)
    alert('Application sent successfully.')
  } catch (e) {
    alert(e.message || 'Failed to apply')
  }
}

onMounted(loadMarketplace)

const filteredShifts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return shiftStore.marketplaceShifts

  return shiftStore.marketplaceShifts.filter(shift =>
    (shift.roleName || shift.role || '').toLowerCase().includes(q) ||
    (shift.business || '').toLowerCase().includes(q) ||
    (shift.location || '').toLowerCase().includes(q)
  )
})
</script>

<template>
  <WorkerLayout>
    <div class="page">
      <div class="header">
        <div>
          <h1>Open Shifts</h1>
          <p>Browse company and global shifts you can apply for.</p>
        </div>
      </div>

      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by role, business, or location..."
        />
      </div>

      <div v-if="loading">Loading shifts…</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="filteredShifts.length === 0" class="empty">
        No open shifts found.
      </div>

      <div v-else class="shift-list">
        <div
          v-for="shift in filteredShifts"
          :key="shift.id"
          class="shift-card"
        >
          <div class="shift-main">
            <div class="shift-top">
              <h3>{{ shift.roleName || shift.role }}</h3>
              <span
                class="badge"
                :class="shift.visibility === 'GLOBAL' ? 'badge-global' : 'badge-company'"
              >
                {{ shift.visibility === 'GLOBAL' ? 'Global' : 'Company' }}
              </span>
            </div>

            <p class="business">{{ shift.business }}</p>

            <div class="meta">
              <span>{{ shift.date }}</span>
              <span>{{ shift.startTime }} - {{ shift.endTime }}</span>
              <span v-if="shift.location">{{ shift.location }}</span>
            </div>

            <p v-if="shift.notes" class="notes">{{ shift.notes }}</p>
          </div>

          <div class="shift-actions">
            <button class="apply-btn" @click="handleApply(shift.id)">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  </WorkerLayout>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.header h1 {
  margin: 0 0 0.25rem;
  font-size: 2rem;
  font-weight: 800;
}

.header p {
  margin: 0;
  color: #64748b;
}

.search-bar input {
  width: 100%;
  max-width: 520px;
  padding: 0.9rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
}

.shift-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shift-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem 1.1rem;
}

.shift-main {
  flex: 1;
}

.shift-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.shift-top h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
}

.business {
  margin: 0.35rem 0 0.5rem;
  color: #0f172a;
  font-weight: 600;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  color: #64748b;
  font-size: 0.92rem;
}

.notes {
  margin-top: 0.65rem;
  color: #475569;
}

.shift-actions {
  display: flex;
  align-items: center;
}

.apply-btn {
  border: none;
  border-radius: 10px;
  background: #0f172a;
  color: #fff;
  padding: 0.8rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.28rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.badge-global {
  background: #ede9fe;
  color: #6d28d9;
}

.badge-company {
  background: #dcfce7;
  color: #166534;
}

.error {
  color: #b91c1c;
}

.empty {
  color: #64748b;
}

@media (max-width: 700px) {
  .shift-card {
    flex-direction: column;
  }

  .shift-actions {
    justify-content: flex-start;
  }
}
</style>