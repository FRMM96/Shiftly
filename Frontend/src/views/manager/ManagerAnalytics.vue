<script setup>
import { onMounted, computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import PageHeader from '../../components/shared/PageHeader.vue'
import { useAnalyticsStore } from '../../stores/analyticsStore'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const store = useAnalyticsStore()

onMounted(async () => {
  await Promise.all([
    store.fetchManagerSummary(),
    store.fetchShiftsByStatus(),
    store.fetchHoursByWeek(),
  ]).catch(() => {})
})

const statusColors = {
  ACTIVE: '#3B82F6',
  OPEN: '#F59E0B',
  COMPLETED: '#10B981',
  CANCELED: '#EF4444',
}

const doughnutData = computed(() => {
  const s = store.shiftsByStatus
  if (!s) return { labels: [], datasets: [] }
  const labels = Object.keys(s)
  return {
    labels,
    datasets: [{
      data: labels.map(l => s[l]),
      backgroundColor: labels.map(l => statusColors[l] || '#9CA3AF'),
    }]
  }
})

const doughnutOptions = { responsive: true, plugins: { legend: { position: 'bottom' } } }

const barData = computed(() => {
  const weeks = store.hoursByWeek || []
  return {
    labels: weeks.map(w => w.week),
    datasets: [{
      label: 'Hours',
      data: weeks.map(w => w.hours),
      backgroundColor: '#3B82F6',
      borderRadius: 6,
    }]
  }
})

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, title: { display: true, text: 'Hours' } } }
}
</script>

<template>
  <ManagerLayout>
    <PageHeader title="Analytics & Reports" subtitle="Track workforce performance and operational metrics." />

    <div v-if="store.loading && !store.managerSummary" class="loading-state">Loading analytics...</div>

    <div class="analytics-grid" v-else>

      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-label">Total Shifts</div>
          <div class="kpi-value">{{ store.managerSummary?.totalShifts ?? '—' }}</div>
          <div class="kpi-sub">All time</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Shift Fill Rate</div>
          <div class="kpi-value">{{ store.managerSummary ? store.managerSummary.fillRate + '%' : '—' }}</div>
          <div class="kpi-sub">Published vs filled</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Hours Worked</div>
          <div class="kpi-value">{{ store.managerSummary?.totalHours ?? '—' }}</div>
          <div class="kpi-sub">This month</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Labour Cost</div>
          <div class="kpi-value">{{ store.managerSummary ? store.managerSummary.labourCost.toLocaleString() + ' SEK' : '—' }}</div>
          <div class="kpi-sub">This month</div>
        </div>
      </div>

      <div class="charts-row">
        <div class="chart-card" v-if="store.shiftsByStatus">
          <h3>Shifts by Status</h3>
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
        <div class="chart-card" v-if="store.hoursByWeek.length">
          <h3>Hours by Week</h3>
          <Bar :data="barData" :options="barOptions" />
        </div>
      </div>

      <div class="kpi-row kpi-row--secondary">
        <div class="kpi-card">
          <div class="kpi-label">Application Acceptance</div>
          <div class="kpi-value">{{ store.managerSummary ? store.managerSummary.acceptanceRate + '%' : '—' }}</div>
          <div class="kpi-sub">Acceptance rate</div>
        </div>
      </div>

    </div>
  </ManagerLayout>
</template>

<style scoped>
.analytics-grid { display: flex; flex-direction: column; gap: 1.5rem; }

.loading-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.kpi-row--secondary { grid-template-columns: repeat(2, 1fr); }

.kpi-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}

.kpi-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.03em; }
.kpi-value { font-size: 2rem; font-weight: 800; color: var(--text-dark); margin: 0.5rem 0 0.25rem; }
.kpi-sub { font-size: 0.8rem; color: var(--text-muted); }

.charts-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}
.chart-card h3 { font-size: 0.95rem; font-weight: 700; color: var(--text-dark); margin-bottom: 1rem; }

@media (max-width: 900px) {
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .charts-row { grid-template-columns: 1fr; }
}
@media (max-width: 600px) { .kpi-row { grid-template-columns: 1fr; } }
</style>
