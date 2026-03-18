<script setup>
import { computed, onMounted } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import { useShiftStore } from '../../stores/shiftStore'

const shiftStore = useShiftStore()

onMounted(() => {
  shiftStore.fetchMyApplications().catch(() => {})
})

const pendingApps = computed(() => shiftStore.applications.filter(a => a.status === 'PENDING'))
const approvedApps = computed(() => shiftStore.applications.filter(a => a.status === 'ACCEPTED'))
const deniedApps = computed(() => shiftStore.applications.filter(a => a.status === 'REJECTED'))
</script>

<template>
  <WorkerLayout>
    <div class="page">
      <div class="top">
        <h1>My Applications</h1>
      </div>

      <div class="stats">
        <div>Pending ({{ pendingApps.length }})</div>
        <div>Approved ({{ approvedApps.length }})</div>
        <div>Denied ({{ deniedApps.length }})</div>
      </div>

      <section class="card">
        <h2>Pending</h2>
        <div v-if="pendingApps.length === 0">No pending applications.</div>
        <div v-else class="list">
          <div v-for="app in pendingApps" :key="app.id" class="item">
            <strong>{{ app.shift?.roleName }}</strong>
            <div>{{ app.shift?.business }}</div>
            <div>{{ app.shift?.date }} • {{ app.shift?.startTime }} - {{ app.shift?.endTime }}</div>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Approved</h2>
        <div v-if="approvedApps.length === 0">No approved applications.</div>
        <div v-else class="list">
          <div v-for="app in approvedApps" :key="app.id" class="item">
            <strong>{{ app.shift?.roleName }}</strong>
            <div>{{ app.shift?.business }}</div>
            <div>{{ app.shift?.date }} • {{ app.shift?.startTime }} - {{ app.shift?.endTime }}</div>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Denied</h2>
        <div v-if="deniedApps.length === 0">No denied applications.</div>
        <div v-else class="list">
          <div v-for="app in deniedApps" :key="app.id" class="item">
            <strong>{{ app.shift?.roleName }}</strong>
            <div>{{ app.shift?.business }}</div>
            <div>{{ app.shift?.date }} • {{ app.shift?.startTime }} - {{ app.shift?.endTime }}</div>
          </div>
        </div>
      </section>
    </div>
  </WorkerLayout>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1.25rem; }
.top h1 { margin: 0; font-size: 2rem; font-weight: 800; }
.stats { display: flex; gap: 1rem; color: #334155; font-weight: 700; }
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem;
}
.card h2 { margin: 0 0 1rem; }
.list { display: flex; flex-direction: column; gap: 0.75rem; }
.item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}
</style>