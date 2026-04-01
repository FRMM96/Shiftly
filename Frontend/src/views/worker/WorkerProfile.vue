<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import WorkerLayout from '../../components/layouts/WorkerLayout.vue'
import { useUserStore } from '../../stores/userStore'
import { useWorkerStore } from '../../stores/workerStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => {
  const u = userStore.user
  if (!u) return {
    name: 'Loading...', role: '', employeeId: '', email: '', phone: '', department: '', joinDate: '', location: '', avatar: ''
  }
  return {
    name: u.username || u.name || 'Worker',
    role: u.role === 'EMPLOYEE' ? 'Worker' : u.role,
    employeeId: u.id ? u.id.substring(0, 8).toUpperCase() : 'N/A',
    email: u.email,
    phone: u.phone || '',
    department: u.department || 'General',
    joinDate: new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    location: u.location || 'Not set',
    avatar: `https://i.pravatar.cc/150?u=${u.id}`
  }
})

const { workerStats } = storeToRefs(useWorkerStore())

const isEditing = ref(false)
const form = ref({})

watch(
  () => user.value,
  (u) => {
    form.value = {
      name: u?.username || u?.name || '',
      email: u?.email || '',
      phone: u?.phone || '',
      department: u?.department || '',
      location: u?.location || '',
      cv: u?.cv || null
    }
  },
  { immediate: true }
)

const handleEdit = () => { isEditing.value = true }

const handleCancel = () => {
  form.value = {
    name: user.value?.username || user.value?.name || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    department: user.value?.department || '',
    location: user.value?.location || '',
    cv: user.value?.cv || null
  }
  isEditing.value = false
}

const handleSave = async () => {
  try {
    const { default: api } = await import('../../services/api')
    await api.patch('/profile', {
      phone: form.value.phone,
      department: form.value.department,
      location: form.value.location
    })
    // Re-fetch user to update store
    await userStore.fetchMe()
  } catch (e) {
    console.error('Failed to save profile:', e)
  }
  isEditing.value = false
}

const handleCvUpload = (e) => {
  const file = e.target.files[0]
  if (file) form.value.cv = file.name
}

const doLogout = () => {
  userStore.logout?.()
  router.push('/login')
}
</script>

<template>
  <WorkerLayout>
    <div class="profile-container">
      
      <div class="card profile-header-card">
        <div class="avatar-wrapper">
          <img :src="user.avatar" alt="Profile Picture" class="avatar-img" />
          <div class="status-indicator"></div>
        </div>
        
        <h1 class="user-name">{{ user.name }}</h1>
        <p class="user-role">{{ user.role }}</p>
        <p class="user-id">Employee ID: {{ user.employeeId }}</p>

        <div class="profile-actions">
          <button v-if="!isEditing" class="btn btn-primary" @click="handleEdit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Edit Profile
          </button>
          <template v-else>
            <button class="btn btn-outline" @click="handleCancel">Cancel</button>
            <button class="btn btn-primary" @click="handleSave">Save Changes</button>
          </template>
          
          <button v-if="!isEditing" class="btn btn-outline-danger" @click="doLogout">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Log Out
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Total Hours</span>
          </div>
          <div class="stat-value">{{ workerStats.hours }} <span class="stat-unit">hrs</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Tasks Completed</span>
          </div>
          <div class="stat-value">{{ workerStats.tasks }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Performance Rating</span>
          </div>
          <div class="stat-value">{{ workerStats.rating }}</div>
        </div>
      </div>

      <div class="card info-card">
        <div class="card-header">
          <h2>Personal Information</h2>
          <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        
        <div class="card-body">
          <div class="info-row">
            <div class="info-label">Email Address</div>
            <div class="info-value">
              <span v-if="!isEditing">{{ user.email }}</span>
              <input v-else v-model="form.email" class="form-input" type="email" />
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Phone Number</div>
            <div class="info-value">
              <span v-if="!isEditing">{{ user.phone }}</span>
              <input v-else v-model="form.phone" class="form-input" type="tel" />
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">Department</div>
            <div class="info-value">
              <span v-if="!isEditing">{{ user.department }}</span>
              <input v-else v-model="form.department" class="form-input" type="text" />
            </div>
          </div>

          <div class="info-row" v-if="!isEditing">
            <div class="info-label">Join Date</div>
            <div class="info-value">{{ user.joinDate }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">Location</div>
            <div class="info-value">
              <span v-if="!isEditing">{{ user.location }}</span>
              <input v-else v-model="form.location" class="form-input" type="text" />
            </div>
          </div>
        </div>
      </div>

      <div class="card info-card">
        <div class="card-header">
          <h2>Resume & CV</h2>
          <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div class="card-body p-0">
          <div class="upload-zone" @click="$refs.cvInput.click()">
            <input type="file" ref="cvInput" @change="handleCvUpload" hidden accept=".pdf,.doc,.docx" />
            <div class="upload-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <h3 class="upload-title">{{ form.cv || 'Click or drag file to upload' }}</h3>
            <p class="upload-subtitle">PDF, DOCX up to 10MB</p>
            <button class="btn btn-secondary btn-sm mt-3">Select File</button>
          </div>
        </div>
      </div>

      <div class="settings-row">
        <div class="settings-icon blue-bg">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </div>
        <div class="settings-info">
          <h4>Notification Preferences</h4>
          <p>Manage how you receive alerts</p>
        </div>
        <router-link to="/worker/notifications" class="settings-link">Manage</router-link>
      </div>

      <div class="settings-row">
        <div class="settings-icon blue-bg">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <div class="settings-info">
          <h4>Security & Password</h4>
          <p>Last changed 3 months ago</p>
        </div>
        <router-link to="/change-password" class="settings-link">Update</router-link>
      </div>

    </div>
  </WorkerLayout>
</template>

<style scoped>
/* Base Variables & Container */
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 0 3rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #111827;
}

.card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  margin-bottom: 1.25rem;
}

/* --- Profile Header Card --- */
.profile-header-card {
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.avatar-img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #E5E7EB;
}

.status-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  background-color: #10B981;
  border: 3px solid #ffffff;
  border-radius: 50%;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.user-role {
  color: #2563EB;
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0 0 0.25rem 0;
}

.user-id {
  color: #6B7280;
  font-size: 0.85rem;
  margin: 0 0 1.5rem 0;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* --- Stats Grid --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.25rem;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6B7280;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.stat-icon {
  color: #2563EB;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.stat-unit {
  font-size: 1rem;
  font-weight: 500;
  color: #6B7280;
}

/* --- Information Cards --- */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.card-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.info-icon {
  color: #9CA3AF;
}

.card-body {
  padding: 1.5rem;
}
.p-0 { padding: 0 !important; }

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
}
.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  width: 35%;
  color: #6B7280;
  font-weight: 400;
}

.info-value {
  width: 65%;
  color: #111827;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #111827;
}
.form-input:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

/* --- Resume Upload Box --- */
.upload-zone {
  margin: 1.5rem;
  border: 2px dashed #E5E7EB;
  border-radius: 8px;
  padding: 2.5rem 2rem;
  text-align: center;
  background-color: #F8FAFC;
  cursor: pointer;
  transition: border-color 0.2s;
}
.upload-zone:hover {
  border-color: #2563EB;
}

.upload-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #EFF6FF;
  color: #2563EB;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.upload-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.upload-subtitle {
  font-size: 0.8rem;
  color: #6B7280;
  margin: 0;
}

.mt-3 { margin-top: 1rem; }

/* --- Settings Rows --- */
.settings-row {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
}

.settings-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
  flex-shrink: 0;
}

.settings-icon.blue-bg {
  background-color: #EFF6FF;
  color: #2563EB;
}

.settings-info {
  flex-grow: 1;
}

.settings-info h4 {
  margin: 0 0 0.15rem 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.settings-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #6B7280;
}

.settings-link {
  color: #2563EB;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}
.settings-link:hover {
  text-decoration: underline;
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
  border: 1px solid transparent;
}

.btn-sm {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
}

.btn-primary {
  background-color: #2563EB;
  color: #ffffff;
}
.btn-primary:hover {
  background-color: #1D4ED8;
}

.btn-outline {
  background-color: #ffffff;
  border-color: #E5E7EB;
  color: #374151;
}
.btn-outline:hover {
  background-color: #F9FAFB;
}

.btn-outline-danger {
  background-color: #ffffff;
  border-color: #E5E7EB;
  color: #DC2626;
}
.btn-outline-danger:hover {
  background-color: #FEF2F2;
  border-color: #FECACA;
}

.btn-secondary {
  background-color: #EFF6FF;
  color: #2563EB;
}
.btn-secondary:hover {
  background-color: #DBEAFE;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .info-label, .info-value {
    width: 100%;
  }
}
</style>