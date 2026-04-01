<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import api from '../../services/api'

const router = useRouter()
const todayStr = new Date().toISOString().slice(0, 10)

const startDate = ref(todayStr)
const endDate = ref(todayStr)
const leaveType = ref('')
const notes = ref('')
const submitting = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

const handleDragOver = (e) => { e.preventDefault() }
const handleDrop = (e) => { e.preventDefault() }

const submitRequest = async () => {
  if (!startDate.value || !endDate.value) {
    modalSuccess.value = false
    modalMessage.value = 'Please select start and end dates.'
    showModal.value = true
    return
  }

  const typeMap = { annual: 'ANNUAL', sick: 'SICK', personal: 'PERSONAL' }

  submitting.value = true
  try {
    await api.post('/timeoff', {
      startDate: startDate.value,
      endDate: endDate.value,
      type: typeMap[leaveType.value] || 'ANNUAL',
      notes: notes.value || null
    })
    modalSuccess.value = true
    modalMessage.value = 'Time off request submitted successfully! Your manager will review it.'
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = e?.response?.data?.message || 'Failed to submit request. Please try again.'
  } finally {
    submitting.value = false
    showModal.value = true
  }
}

const cancelRequest = () => {
  router.push('/worker')
}

const closeModal = () => {
  showModal.value = false
  if (modalSuccess.value) router.push('/worker')
}
</script>

<template>
  <WorkerLayout>
    <div class="main-content">
      
      <div class="page-header">
        <button class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          BACK TO FLOW
        </button>
        <h1 class="page-title">Request Time Off</h1>
        <p class="page-subtitle">Submit a formal leave request for approval by your manager.</p>
      </div>

      <div class="content-grid">
        
        <div class="left-col">
          <div class="card form-card">
            
            <div class="form-row">
              <div class="form-group">
                <label>Start Date</label>
                <div class="input-with-icon">
                  <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <input type="date" v-model="startDate" />
                </div>
              </div>
              <div class="form-group">
                <label>End Date</label>
                <div class="input-with-icon">
                  <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <input type="date" v-model="endDate" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Type of Leave</label>
              <div class="select-wrapper">
                <select v-model="leaveType">
                  <option value="" disabled selected hidden>Select reason for leave</option>
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                </select>
                <svg class="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            <div class="form-group">
              <label>Notes (Optional)</label>
              <textarea v-model="notes" placeholder="Provide additional context for your request..."></textarea>
            </div>

            <div class="form-group">
              <label>Attachments</label>
              <div class="upload-zone" @dragover="handleDragOver" @drop="handleDrop">
                <div class="upload-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <p>Drag files or <span class="text-blue">browse</span></p>
                <span class="upload-hint">PDF, JPG, PNG (Max 5MB)</span>
              </div>
            </div>

          </div>

          <div class="form-actions">
            <button class="btn btn-primary" @click="submitRequest">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Submit Request
            </button>
            <button class="btn btn-outline" @click="cancelRequest">Cancel</button>
          </div>
        </div>

        <div class="right-col">
          
          <div class="balance-card">
            <div class="watermark-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 8.5C15.5 8.5 13.5 8.5 12 10C10.5 11.5 8.5 15.5 8.5 15.5L10 17L14 13L15.5 14.5L14.75 15.25L16 16.5L17.5 15L16.75 14.25L17.5 13.5L13.5 9.5L15 8L16.5 9.5L17.25 8.75L15.5 8.5Z" fill="currentColor"/>
              </svg>
            </div>
            
            <div class="balance-header">
              <span class="label">TIME OFF</span>
              <h2>Request Time Off</h2>
            </div>

            <div class="balance-stats">
              <p style="color: var(--text-muted); font-size: 0.9rem;">Select dates and type below to submit your request. Your manager will review it promptly.</p>
            </div>
          </div>

          <div class="card coverage-card">
            <div class="card-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0052CC" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <h3>Team Coverage</h3>
            </div>
            <ul class="coverage-list">
              <li>
                <span class="dot dot-green"></span>
                <p>Check team calendar for coverage before requesting time off.</p>
              </li>
            </ul>
            <a href="#" class="calendar-link">
              View Full Team Calendar
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>

          <div class="card policy-card">
            <div class="policy-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <div class="policy-content">
              <h4>Policy Reminder</h4>
              <p>Requests for more than 3 days should be submitted at least 2 weeks in advance.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  </WorkerLayout>

  <ConfirmModal
    :is-open="showModal"
    :title="modalSuccess ? 'Request Submitted!' : 'Error'"
    :message="modalMessage"
    :type="modalSuccess ? 'success' : 'danger'"
    @close="closeModal"
  />
</template>

<style scoped>
/* --- Design Variables --- */

/* --- Main Content --- */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 2.5rem;
}

.back-link {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.25rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

/* --- Content Grid --- */
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  align-items: start;
}

/* --- Form Card (Left Column) --- */
.card {
  background-color: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.form-card {
  padding: 2rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-dark);
}

/* Inputs */
.input-with-icon, .select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #9CA3AF;
}

.select-icon {
  position: absolute;
  right: 12px;
  color: #9CA3AF;
  pointer-events: none;
}

input[type="text"], select, textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--text-body);
  background-color: var(--bg-card);
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

input[type="text"]:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.1);
}

.input-with-icon input {
  padding-left: 2.5rem; /* Space for icon */
}

select {
  appearance: none;
  cursor: pointer;
  color: var(--text-body);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

textarea::placeholder {
  color: #9CA3AF;
}

/* Upload Zone */
.upload-zone {
  border: 1.5px dashed #CBD5E1;
  border-radius: 8px;
  padding: 2.5rem;
  text-align: center;
  background-color: #F8FAFC;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-zone:hover {
  background-color: #F1F5F9;
  border-color: var(--primary);
}

.upload-icon {
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.upload-zone p {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  color: var(--text-body);
  font-weight: 500;
}

.text-blue {
  color: var(--primary);
  font-weight: 600;
}

.upload-hint {
  font-size: 0.75rem;
  color: #9CA3AF;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary);
  color: #FFFFFF;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.2);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-outline {
  background-color: var(--bg-card);
  color: var(--text-body);
  border: 1px solid var(--border);
}

.btn-outline:hover {
  background-color: #F1F5F9;
}

/* --- Right Column (Info Cards) --- */

/* Balance Card */
.balance-card {
  background-color: var(--primary);
  border-radius: 12px;
  padding: 1.75rem;
  color: #FFFFFF;
  position: relative;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 82, 204, 0.15);
}

.watermark-icon {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 150px;
  height: 150px;
  opacity: 0.1;
  pointer-events: none;
}

.balance-header {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.balance-header .label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  opacity: 0.8;
  display: block;
  margin-bottom: 0.25rem;
}

.balance-header h2 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}

.balance-stats {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.stat-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.stat-info span { opacity: 0.9; }
.stat-info strong { font-weight: 700; }

.progress-bar {
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 4px;
}

/* Coverage Card */
.coverage-card {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
}

.coverage-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.coverage-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.dot-orange { background-color: var(--dot-orange); }
.dot-green { background-color: var(--dot-green); }

.coverage-list p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-body);
  line-height: 1.4;
}

.calendar-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}

.calendar-link:hover {
  text-decoration: underline;
}

/* Policy Card */
.policy-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background-color: #F8FAFC;
}

.policy-icon {
  color: var(--primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.policy-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-dark);
}

.policy-content p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* --- Responsive --- */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>