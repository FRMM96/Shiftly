<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import TabBar from '../../components/shared/TabBar.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import { useScheduleStore } from '../../stores/scheduleStore'
import { useUserStore } from '../../stores/userStore'
import api from '../../services/api'

const scheduleStore = useScheduleStore()
const userStore = useUserStore()
const activeTab = ref('propose')
const colleagues = ref([])
const swapHistory = ref([])
const loading = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

// Swap proposal state
const selectedMyShift = ref(null)
const selectedColleague = ref(null)
const colleagueShifts = ref([])
const selectedColleagueShift = ref(null)
const loadingColleagueShifts = ref(false)
const proposing = ref(false)

const myShifts = computed(() => {
  return scheduleStore.mySchedule.map(s => ({
    id: s.id,
    label: `${s.roleName || 'Shift'} — ${new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${s.startTime} - ${s.endTime})`,
    date: s.date,
    roleName: s.roleName,
    startTime: s.startTime,
    endTime: s.endTime
  }))
})

onMounted(async () => {
  await scheduleStore.fetchMySchedule().catch(() => {})
  // Fetch company colleagues (exclude self)
  try {
    const res = await api.get('/users?role=EMPLOYEE')
    const currentUserId = userStore.user?.id
    colleagues.value = (res.data.users || res.data || [])
      .filter(u => u.id !== currentUserId)
      .map(u => ({
        id: u.id,
        name: u.username,
        avatar: `https://i.pravatar.cc/150?u=${u.id}`
      }))
  } catch (e) {
    console.error('Failed to load colleagues:', e)
  }
  // Fetch swap history
  try {
    const res = await api.get('/swaps')
    swapHistory.value = (res.data.swaps || []).map(sw => ({
      id: sw.id,
      status: sw.status,
      requester: sw.requester?.username || 'Unknown',
      target: sw.targetWorker?.username || 'Unknown',
      createdAt: new Date(sw.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }))
  } catch (e) {
    console.error('Failed to load swap history:', e)
  }
})

const selectColleague = async (colleague) => {
  selectedColleague.value = colleague
  selectedColleagueShift.value = null
  colleagueShifts.value = []
  loadingColleagueShifts.value = true
  try {
    const res = await api.get(`/shifts/user/${colleague.id}`)
    colleagueShifts.value = (res.data.shifts || []).map(s => ({
      id: s.id,
      label: `${s.roleName || 'Shift'} — ${new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${s.startTime} - ${s.endTime})`
    }))
  } catch (e) {
    console.error('Failed to load colleague shifts:', e)
  } finally {
    loadingColleagueShifts.value = false
  }
}

const canPropose = computed(() => {
  return selectedMyShift.value && selectedColleague.value && selectedColleagueShift.value && !proposing.value
})

const handleProposeSwap = async () => {
  if (!canPropose.value) return
  proposing.value = true
  try {
    await api.post('/swaps', {
      requesterShiftId: selectedMyShift.value,
      targetWorkerId: selectedColleague.value.id,
      targetShiftId: selectedColleagueShift.value
    })
    modalSuccess.value = true
    modalMessage.value = `Swap request sent to ${selectedColleague.value.name}. They'll be notified to accept or decline.`
    // Reset selections
    selectedMyShift.value = null
    selectedColleague.value = null
    selectedColleagueShift.value = null
    colleagueShifts.value = []
    // Refresh history
    const res = await api.get('/swaps')
    swapHistory.value = (res.data.swaps || []).map(sw => ({
      id: sw.id,
      status: sw.status,
      requester: sw.requester?.username || 'Unknown',
      target: sw.targetWorker?.username || 'Unknown',
      createdAt: new Date(sw.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }))
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = e?.response?.data?.message || 'Failed to propose swap.'
  } finally {
    proposing.value = false
    showModal.value = true
  }
}
</script>

<template>
  <WorkerLayout>
    <div class="main-content">

      <div class="page-header">
        <h1 class="page-title">Swap Shift</h1>
        <p class="page-subtitle">Trade your shift with a colleague quickly and easily.</p>

        <TabBar
          :tabs="[
            { value: 'propose', label: 'Propose Swap' },
            { value: 'history', label: 'My History' }
          ]"
          :model-value="activeTab"
          @update:model-value="activeTab = $event"
          style="margin-top: 1rem;"
        />
      </div>

      <!-- PROPOSE TAB -->
      <template v-if="activeTab === 'propose'">
        <!-- Step 1: Select your shift -->
        <section class="section">
          <h2 class="section-title">1. Select Your Shift</h2>
          <div v-if="myShifts.length" class="shift-select-list">
            <div
              v-for="shift in myShifts"
              :key="shift.id"
              class="shift-select-card"
              :class="{ 'selected': selectedMyShift === shift.id }"
              @click="selectedMyShift = shift.id"
            >
              <span class="badge badge-light-blue">ASSIGNED</span>
              <p class="shift-select-label">{{ shift.label }}</p>
            </div>
          </div>
          <p v-else style="color:var(--text-muted);font-size:0.9rem;">No upcoming shifts to swap.</p>
        </section>

        <!-- Step 2: Pick a colleague -->
        <section v-if="selectedMyShift" class="section">
          <h2 class="section-title">2. Pick a Colleague</h2>
          <div class="colleagues-list">
            <div
              v-for="colleague in colleagues"
              :key="colleague.id"
              class="colleague-card"
              :class="{ 'selected': selectedColleague?.id === colleague.id }"
              @click="selectColleague(colleague)"
            >
              <div class="colleague-info">
                <img :src="colleague.avatar" :alt="colleague.name" class="avatar" />
                <div>
                  <h4 class="colleague-name">{{ colleague.name }}</h4>
                  <p class="colleague-availability" v-if="selectedColleague?.id === colleague.id">Selected</p>
                  <p class="colleague-availability" v-else>Tap to select</p>
                </div>
              </div>
            </div>
          </div>
          <p v-if="!colleagues.length" style="color:var(--text-muted);font-size:0.9rem;">No colleagues found.</p>
        </section>

        <!-- Step 3: Select colleague's shift -->
        <section v-if="selectedColleague" class="section">
          <h2 class="section-title">3. Select {{ selectedColleague.name }}'s Shift</h2>
          <p v-if="loadingColleagueShifts" style="color:var(--text-muted);font-size:0.9rem;">Loading shifts...</p>
          <div v-else-if="colleagueShifts.length" class="shift-select-list">
            <div
              v-for="shift in colleagueShifts"
              :key="shift.id"
              class="shift-select-card"
              :class="{ 'selected': selectedColleagueShift === shift.id }"
              @click="selectedColleagueShift = shift.id"
            >
              <p class="shift-select-label">{{ shift.label }}</p>
            </div>
          </div>
          <p v-else style="color:var(--text-muted);font-size:0.9rem;">{{ selectedColleague.name }} has no upcoming shifts.</p>
        </section>

        <!-- Submit -->
        <section v-if="selectedMyShift" class="section">
          <button
            class="btn btn-primary btn-full"
            :disabled="!canPropose"
            @click="handleProposeSwap"
          >
            {{ proposing ? 'Sending...' : 'Propose Swap' }}
          </button>
        </section>

        <section class="info-section">
          <div class="info-box">
            <svg class="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <div class="info-content">
              <h4>How it works</h4>
              <p>Select one of your shifts, pick a colleague, then choose which of their shifts you'd like to swap for. Once proposed, your colleague and manager will be notified.</p>
            </div>
          </div>
        </section>
      </template>

      <!-- HISTORY TAB -->
      <template v-if="activeTab === 'history'">
        <section class="section">
          <div v-if="swapHistory.length" class="colleagues-list">
            <div v-for="sw in swapHistory" :key="sw.id" class="colleague-card">
              <div class="colleague-info">
                <div>
                  <h4 class="colleague-name">{{ sw.requester }} &harr; {{ sw.target }}</h4>
                  <p class="colleague-availability">{{ sw.createdAt }}</p>
                </div>
              </div>
              <span
                class="badge"
                :class="{
                  'badge-light-blue': sw.status === 'PENDING',
                  'badge-success': sw.status === 'ACCEPTED',
                  'badge-danger': sw.status === 'REJECTED' || sw.status === 'CANCELLED'
                }"
              >{{ sw.status }}</span>
            </div>
          </div>
          <p v-else style="color:var(--text-muted);font-size:0.9rem;">No swap history yet.</p>
        </section>
      </template>

    </div>
  </WorkerLayout>

  <ConfirmModal
    :is-open="showModal"
    :title="modalSuccess ? 'Swap Proposed!' : 'Error'"
    :message="modalMessage"
    :type="modalSuccess ? 'success' : 'danger'"
    @close="showModal = false"
  />
</template>

<style scoped>

/* --- Main Content --- */
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.page-header {
  margin-bottom: 3rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0 0 1.5rem 0;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.75rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background-color: var(--primary);
  color: #FFFFFF;
}

.tab-btn:not(.active) {
  background-color: #E2E8F0;
  color: #475569;
}

.tab-btn:not(.active):hover {
  background-color: #CBD5E1;
}

/* --- Sections --- */
.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

.filter-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.filter-link:hover {
  text-decoration: underline;
}

/* --- Shift Select Cards --- */
.shift-select-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shift-select-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.shift-select-card:hover {
  border-color: var(--primary);
  background-color: #F8FAFC;
}

.shift-select-card.selected {
  border-color: var(--primary);
  background-color: #EEF2FF;
}

.shift-select-label {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-dark);
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.badge-light-blue {
  background-color: #E0E7FF;
  color: #4338CA;
}

.badge-success {
  background-color: #D1FAE5;
  color: #065F46;
}

.badge-danger {
  background-color: #FEE2E2;
  color: #991B1B;
}

/* --- Colleagues List --- */
.colleagues-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.colleague-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.colleague-card:hover {
  border-color: var(--primary);
}

.colleague-card.selected {
  border-color: var(--primary);
  background-color: #EEF2FF;
}

.colleague-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.colleague-info .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.colleague-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
}

.colleague-availability {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

/* --- Info Section --- */
.info-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background-color: #F1F5F9;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #E2E8F0;
}

.info-icon {
  color: var(--primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.info-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-dark);
}

.info-content p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* --- Buttons --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: var(--primary);
  color: #FFFFFF;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: #F1F5F9;
  color: var(--text-dark);
}

.btn-secondary:hover {
  background-color: #E2E8F0;
}

.btn-full {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
}

.btn-full:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }

/* --- Responsive Adjustments --- */
@media (max-width: 768px) {
  .colleague-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>