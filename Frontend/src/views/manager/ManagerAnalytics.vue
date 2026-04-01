<script setup>
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import PageHeader from '../../components/shared/PageHeader.vue'
</script>

<template>
  <ManagerLayout>
    <PageHeader title="Analytics & Reports" subtitle="Track workforce performance and operational metrics." />

    <div class="analytics-grid">

      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-label">Total Hours Worked</div>
          <div class="kpi-value">—</div>
          <div class="kpi-sub">This month</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Shift Fill Rate</div>
          <div class="kpi-value">—</div>
          <div class="kpi-sub">Published vs filled</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Application Acceptance</div>
          <div class="kpi-value">—</div>
          <div class="kpi-sub">Acceptance rate</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Labour Cost</div>
          <div class="kpi-value">—</div>
          <div class="kpi-sub">This month (SEK)</div>
        </div>
      </div>

      <div class="chart-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="9" y2="15"></line><line x1="15" y1="12" x2="15" y2="15"></line></svg>
        <h3>Charts coming soon</h3>
        <p>Hours by week, overtime trends, and peak demand heatmaps will appear here.</p>
      </div>

    </div>
  </ManagerLayout>
</template>

<style scoped>
.analytics-grid { display: flex; flex-direction: column; gap: 1.5rem; }

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

.chart-placeholder {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}
.chart-placeholder h3 { margin: 1rem 0 0.5rem; color: var(--text-dark); }
.chart-placeholder p { font-size: 0.9rem; }

@media (max-width: 900px) { .kpi-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .kpi-row { grid-template-columns: 1fr; } }
</style>
