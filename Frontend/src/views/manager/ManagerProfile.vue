


<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import ConfirmModal from '../../components/shared/ConfirmModal.vue'
import { useUserStore } from '../../stores/userStore'
import api from '../../services/api'

const router = useRouter()
const userStore = useUserStore()

const editForm = ref({
  department: '',
  location: '',
  phone: ''
})

const user = computed(() => {
  const u = userStore.user
  if (!u) return { name: '', role: '', location: '', avatar: '', company: '', department: '', employeeId: '', joinDate: '' }
  return {
    name: u.username || 'Manager',
    role: u.role === 'BOSS' ? 'Manager' : u.role,
    location: u.location || 'Not set',
    avatar: `https://i.pravatar.cc/150?u=${u.id}`,
    company: u.company?.name || 'N/A',
    department: u.department || 'General',
    phone: u.phone || '',
    employeeId: u.id ? u.id.substring(0, 8).toUpperCase() : 'N/A',
    joinDate: new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
})

const isEditing = ref(false)

const startEditing = () => {
  editForm.value.department = userStore.user?.department || ''
  editForm.value.location = userStore.user?.location || ''
  editForm.value.phone = userStore.user?.phone || ''
  isEditing.value = true
}

const settings = ref({
  emailAlerts: true,
  systemStatus: true,
  directMessages: false
})

const saving = ref(false)
const showModal = ref(false)
const modalSuccess = ref(false)
const modalMessage = ref('')

const handleSave = async () => {
  saving.value = true
  try {
    const res = await api.patch('/profile', {
      department: editForm.value.department,
      location: editForm.value.location,
      phone: editForm.value.phone
    })
    userStore.user = { ...userStore.user, ...res.data.user }
    isEditing.value = false
    modalSuccess.value = true
    modalMessage.value = 'Changes saved successfully!'
  } catch (e) {
    modalSuccess.value = false
    modalMessage.value = e?.response?.data?.message || 'Failed to save changes.'
  } finally {
    saving.value = false
    showModal.value = true
  }
}

const handleChangePassword = () => {
  router.push('/change-password')
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <ManagerLayout>
    <div class="main-content">
      
      <div class="card profile-header">
        <div class="avatar-container">
          <img :src="user.avatar" :alt="user.name" class="large-avatar" />
          <button class="edit-avatar-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
        </div>
      </div>

      <div class="settings-grid">

        <div class="card settings-card">
          <div class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0052CC" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
            <h2>Company Details</h2>
          </div>
          
          <div class="details-list">
            <div class="detail-row">
              <span class="detail-label">Company Name</span>
              <span class="detail-value">{{ user.company }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Department</span>
              <input v-if="isEditing" v-model="editForm.department" class="edit-input" placeholder="Department" />
              <span v-else class="detail-value">{{ user.department }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location</span>
              <input v-if="isEditing" v-model="editForm.location" class="edit-input" placeholder="Location" />
              <span v-else class="detail-value">{{ user.location }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone</span>
              <input v-if="isEditing" v-model="editForm.phone" class="edit-input" placeholder="Phone" />
              <span v-else class="detail-value">{{ user.phone || 'Not set' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Employee ID</span>
              <span class="detail-value">{{ user.employeeId }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Join Date</span>
              <span class="detail-value">{{ user.joinDate }}</span>
            </div>
          </div>
        </div>

      </div>

      <div class="actions-grid">
        <button v-if="isEditing" class="btn btn-primary" @click="handleSave" :disabled="saving">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        <button v-else class="btn btn-primary" @click="startEditing">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Edit Profile
        </button>
        <button class="btn btn-outline" @click="handleChangePassword">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line></svg>
          Change Password
        </button>
      </div>

      <div class="logout-section">
        <button class="btn btn-danger" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Log Out from Radix Manager
        </button>
        <p class="login-info">Signed in as {{ userStore.user?.email }}</p>
      </div>

    </div>
  </ManagerLayout>

  <ConfirmModal
    :is-open="showModal"
    :title="modalSuccess ? 'Saved!' : 'Error'"
    :message="modalMessage"
    :type="modalSuccess ? 'success' : 'danger'"
    @close="showModal = false"
  />
</template>

<style scoped>
/* --- Design Variables --- */

/* --- Main Content --- */
.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  flex-grow: 1;
  width: 100%;
}

.card {
  background-color: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

/* --- Profile Header --- */
.profile-header {
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar-container {
  position: relative;
  margin-bottom: 1.25rem;
}

.large-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  border: 2px solid #FFFFFF;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: var(--primary);
  color: #FFFFFF;
  border: 2px solid #FFFFFF;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-avatar-btn:hover {
  background-color: var(--primary-hover);
}

.user-name {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
}

.user-role {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0 0 0.5rem 0;
}

.user-location {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
}

/* --- Settings Grid --- */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.settings-card {
  padding: 1.75rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.card-title h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

/* Details List */
.details-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.detail-value {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-dark);
}

.edit-input {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  outline: none;
  width: 140px;
  text-align: right;
}
.edit-input:focus { border-color: var(--primary); }

/* Toggles List */
.toggles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-info strong {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.toggle-info p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Custom CSS Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #E5E7EB;
  transition: .3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

input:checked + .slider {
  background-color: var(--primary);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* --- Action Buttons --- */
.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-primary {
  background-color: var(--primary);
  color: #FFFFFF;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-outline {
  background-color: var(--bg-card);
  border-color: var(--border);
  color: var(--text-dark);
}

.btn-outline:hover {
  background-color: #F9FAFB;
}

/* --- Logout Section --- */
.logout-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.btn-danger {
  width: 100%;
  background-color: var(--danger-bg);
  border-color: var(--danger-border);
  color: var(--danger-text);
}

.btn-danger:hover {
  background-color: #FEE2E2;
}

.login-info {
  font-size: 0.75rem;
  color: #9CA3AF;
  margin: 0;
}

/* --- Responsive Adjustments --- */
@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
