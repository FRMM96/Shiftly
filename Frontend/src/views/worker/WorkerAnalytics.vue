<script setup>
import { onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import PageHeader from '../../components/shared/PageHeader.vue'
import { useAnalyticsStore } from '../../stores/analyticsStore'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const store = useAnalyticsStore()

onMounted(async () => {
  await Promise.all([
    store.fetchWorkerSummary(),
    store.fetchHoursByWeek(),
  ]).catch(() => {})
})

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
  <WorkerLayout>
    <PageHeader title="My Analytics" subtitle="Track your hours, earnings, and performance." />

    <div v-if="store.loading && !store.workerSummary" class="loading-state">Loading analytics...</div>

    <div class="analytics-grid" v-else>

      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-label">Hours This Month</div>
          <div class="kpi-value">{{ store.workerSummary?.hoursThisMonth ?? '—' }}</div>
          <div class="kpi-sub">Total worked</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Upcoming Hours</div>
          <div class="kpi-value">{{ store.workerSummary?.upcomingHours ?? '—' }}</div>
          <div class="kpi-sub">Scheduled</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Pay Estimate</div>
          <div class="kpi-value">{{ store.workerSummary ? store.workerSummary.payEstimate.toLocaleString() + ' SEK' : '—' }}</div>
          <div class="kpi-sub">This period</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Application Success</div>
          <div class="kpi-value">{{ store.workerSummary ? store.workerSummary.successRate + '%' : '—' }}</div>
          <div class="kpi-sub">Acceptance rate</div>
        </div>
      </div>

      <div class="charts-row" v-if="store.hoursByWeek.length">
        <div class="chart-card">
          <h3>Your Hours by Week</h3>
          <Bar :data="barData" :options="barOptions" />
        </div>
      </div>

    </div>
  </WorkerLayout>
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
  grid-template-columns: 1fr;
  gap: 1rem;
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}
.chart-card h3 { font-size: 0.95rem; font-weight: 700; color: var(--text-dark); margin-bottom: 1rem; }

@media (max-width: 900px) { .kpi-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .kpi-row { grid-template-columns: 1fr; } }
</style>
