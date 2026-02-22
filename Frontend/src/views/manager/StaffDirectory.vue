<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseButton from '../../components/shared/BaseButton.vue' 
import ManagerLayout from '../../components/manager/ManagerLayout.vue'
import { apiFetch } from '../../lib/api'

const staffList = ref([])
const loading = ref(false)
const error = ref('')

async function fetchStaff() {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/users')
    staffList.value = res.users.map(u => ({
      id: u.id,
      name: u.username,
      role: u.role,
      email: u.email,
      status: 'active',
      avatar: (u.username || u.email || '?').charAt(0).toUpperCase(),
    }))
  } catch (e) {
    error.value = e.message || 'Failed to load staff'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStaff)

// --- Search & Filter ---
const searchQuery = ref('')
const filteredStaff = computed(() => {
  return staffList.value.filter(person => 
    person.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    person.role.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    person.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <ManagerLayout>
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Staff Directory</h1>
          <p class="page-subtitle">These are real users (accounts) from the backend database.</p>
        </div>
        <BaseButton variant="primary" @click="fetchStaff">Refresh</BaseButton>
      </header>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-else-if="loading">Loading…</p>

      <div class="toolbar">
        <div class="search-wrapper">
          <input v-model="searchQuery" placeholder="Search staff..." />
        </div>
      </div>

      <div class="grid">
        <div v-for="person in filteredStaff" :key="person.id" class="card">
          <div class="avatar">{{ person.avatar }}</div>
          <div class="info">
            <div class="name">{{ person.name }}</div>
            <div class="meta">{{ person.role }} • {{ person.email }}</div>
          </div>
        </div>
      </div>
    </div>
  </ManagerLayout>
</template>


<style scoped>
/* Page Layout */
.page-container {
  padding: 2rem;
  /* Removed max-width restriction so it fills the layout nicely, or keep 1200px if you prefer centered content */
  width: 100%; 
}

/* ... Keep all your other existing CSS exactly the same ... */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0; }
.page-subtitle { color: #64748b; margin-top: 5px; }

/* Toolbar */
.toolbar { margin-bottom: 2rem; }
.search-wrapper {
  position: relative;
  max-width: 400px;
}
.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

/* Staff Grid */
.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Staff Card */
.staff-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.staff-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
  position: relative;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  background-color: #f1f5f9;
  color: #0f172a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
}

.person-info { flex: 1; }
.person-name { font-size: 1.1rem; font-weight: 700; margin: 0; color: #0f172a; }
.person-role { font-size: 0.9rem; color: #64748b; }

/* Status Dot */
.status-indicator {
  width: 10px; height: 10px; border-radius: 50%;
  position: absolute; top: 0; right: 0;
}
.status-indicator.active { background-color: #10b981; }
.status-indicator.sick { background-color: #ef4444; box-shadow: 0 0 0 2px #fef2f2; }
.status-indicator.inactive { background-color: #cbd5e1; }

/* Details */
.card-details {
  margin-bottom: 1.5rem;
  flex: 1; /* Pushes actions to bottom */
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-size: 0.9rem;
  margin-bottom: 8px;
}
.icon { opacity: 0.5; }

/* Actions */
.card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
}

.icon-btn-delete {
  background: none; border: none; cursor: pointer; opacity: 0.4;
  padding: 8px; border-radius: 4px; transition: all 0.2s;
}
.icon-btn-delete:hover { opacity: 1; background-color: #fef2f2; }

.error { color: #b00020; }
.grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill,minmax(240px,1fr)); }
.card { display:flex; gap:12px; padding:12px; border:1px solid #eee; border-radius:12px; background:#fff; }
.avatar { width:40px; height:40px; border-radius:999px; display:flex; align-items:center; justify-content:center; background:#eef; font-weight:700; }
.name { font-weight:700; }
.meta { font-size: 13px; opacity: .8; }
.toolbar input { width:100%; padding:10px; border:1px solid #ddd; border-radius:10px; }

</style>