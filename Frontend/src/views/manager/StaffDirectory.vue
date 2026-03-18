<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import { useStaffStore } from '../../stores/staffStore'

const router = useRouter()
const staffStore = useStaffStore()
const searchQuery = ref('')

onMounted(() => {
  staffStore.fetchStaff().catch(() => {})
})

const filteredStaff = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return staffStore.staffList
  return staffStore.staffList.filter(s =>
    (s.name || '').toLowerCase().includes(q) ||
    (s.email || '').toLowerCase().includes(q)
  )
})

function openProfile(id) {
  router.push(`/manager/staff/${id}`)
}
</script>

<template>
  <ManagerLayout>
    <div class="page">
      <h1>Staff Directory</h1>

      <input v-model="searchQuery" class="search" placeholder="Search by name or email..." />

      <div v-if="staffStore.loading">Loading staff…</div>
      <div v-else-if="staffStore.error">{{ staffStore.error }}</div>
      <div v-else-if="filteredStaff.length === 0">No employees found.</div>

      <div v-else class="grid">
        <div v-for="staff in filteredStaff" :key="staff.id" class="card">
          <div class="avatar">{{ staff.initials }}</div>
          <h3>{{ staff.name }}</h3>
          <p>{{ staff.email }}</p>
          <button @click="openProfile(staff.id)">View profile</button>
        </div>
      </div>
    </div>
  </ManagerLayout>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1rem; }
h1 { margin: 0; font-size: 2rem; font-weight: 800; }
.search {
  width: 100%;
  max-width: 500px;
  padding: 0.9rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  margin-bottom: 0.75rem;
}
button {
  margin-top: 0.75rem;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  background: #0f172a;
  color: #fff;
  cursor: pointer;
}
</style>