<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import WorkerLayout from '../../components/worker/WorkerLayout.vue'
import BaseButton from '../../components/shared/BaseButton.vue'
import { useUserStore } from '../../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user || {})

const displayName = computed(() => user.value.name || user.value.username || 'Unknown')
const displayEmail = computed(() => user.value.email || '—')
const displayRole = computed(() => user.value.role || '—')
const skillsSafe = computed(() => Array.isArray(user.value.skills) ? user.value.skills : [])

const initials = computed(() => {
  const n = String(displayName.value || '').trim()
  if (!n) return 'U'
  const parts = n.split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase()).join('') || 'U'
})

const isEditing = ref(false)
const newSkill = ref('')

const form = ref({
  name: '',
  email: '',
  phone: '',
  bio: '',
  cv: null
})

watch(
  () => userStore.user,
  (u) => {
    form.value = {
      name: u?.name || u?.username || '',
      email: u?.email || '',
      phone: u?.phone || '',
      bio: u?.bio || '',
      cv: u?.cv || null
    }
  },
  { immediate: true }
)

const availableSkills = ref(['Bartender', 'Waiter', 'Chef', 'Dishwasher', 'Barista', 'Runner'])

const handleEdit = () => { isEditing.value = true }

const handleCancel = () => {
  form.value = {
    name: user.value?.name || user.value?.username || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    bio: user.value?.bio || '',
    cv: user.value?.cv || null
  }
  isEditing.value = false
}

const handleSave = () => {
  // NOTE: This only updates local UI unless you add a backend endpoint for profile update.
  userStore.updateProfile(form.value)
  isEditing.value = false
  alert("Profile Updated Successfully!")
}

const toggleSkill = (skill) => {
  userStore.toggleSkill(skill)
}

const addCustomSkill = () => {
  const val = newSkill.value.trim()
  if (val && !availableSkills.value.includes(val)) {
    availableSkills.value.push(val)
    userStore.toggleSkill(val)
  }
  newSkill.value = ''
}

const handleCvUpload = (e) => {
  const file = e.target.files[0]
  if (file) form.value.cv = file.name
}

const doLogout = () => {
  userStore.logout()
  router.push('/home')
}
</script>

<template>
  <WorkerLayout>
    <div
      class="page-header"
      style="display:flex; justify-content:space-between; align-items:center; max-width:800px; margin:0 auto 1.5rem auto;"
    >
      <h1>My Profile</h1>

      <BaseButton v-if="!isEditing" variant="primary" size="sm" @click="handleEdit">
        Edit Profile
      </BaseButton>

      <div v-else style="display:flex; gap:8px;">
        <BaseButton variant="secondary" outline size="sm" @click="handleCancel">Cancel</BaseButton>
        <BaseButton variant="primary" size="sm" @click="handleSave">Save</BaseButton>
      </div>
    </div>

    <div class="profile-card">
      <div class="avatar-section">
        <div class="avatar-large initials">{{ initials }}</div>
      </div>

      <!-- View Mode -->
      <div v-if="!isEditing" class="view-mode">
        <div class="info-row">
          <span class="info-label">Username / Name</span>
          <span class="info-value">{{ displayName }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">{{ displayEmail }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">Role</span>
          <span class="info-value">{{ displayRole }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">Phone</span>
          <span class="info-value">{{ user.phone || 'Not provided' }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">Bio / Experience</span>
          <span class="info-value">{{ user.bio || 'No bio provided' }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">CV / Resume</span>
          <span class="info-value">
            <span v-if="user.cv" class="cv-badge">📄 {{ user.cv }}</span>
            <span v-else>No CV uploaded</span>
          </span>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="edit-mode">
        <div class="form-group border-bottom">
          <label>Full Name</label>
          <input v-model="form.name" class="input" placeholder="Your Name" />
        </div>

        <div class="form-group border-bottom">
          <label>Email</label>
          <input type="email" v-model="form.email" class="input" placeholder="your.email@example.com" />
        </div>

        <div class="form-group border-bottom">
          <label>Phone</label>
          <input type="tel" v-model="form.phone" class="input" placeholder="+46..." />
        </div>

        <div class="form-group border-bottom">
          <label>Bio / Experience</label>
          <textarea v-model="form.bio" class="input textarea" rows="3" placeholder="Tell us about your experience..."></textarea>
        </div>

        <div class="form-group border-bottom">
          <label>CV / Resume</label>
          <div style="display:flex; align-items:center; gap:10px;">
            <input type="file" @change="handleCvUpload" ref="cvInput" style="display:none;" accept=".pdf,.doc,.docx" />
            <BaseButton variant="secondary" outline size="sm" @click="$refs.cvInput.click()">
              Upload CV
            </BaseButton>
            <span v-if="form.cv" class="cv-badge">📄 {{ form.cv }}</span>
            <span v-else class="info-value" style="font-size:0.9em; color:#94a3b8;">No file selected</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section-title">
      <h3>My Skills</h3>
      <p>Select the roles you are experienced in.</p>
    </div>

    <div class="skills-section">
      <div class="skills-grid">
        <div
          v-for="skill in availableSkills"
          :key="skill"
          class="skill-pill"
          :class="{ active: skillsSafe.includes(skill) }"
          @click="toggleSkill(skill)"
        >
          <span class="check-icon" v-if="skillsSafe.includes(skill)">✓</span>
          {{ skill }}
        </div>
      </div>

      <div class="add-skill-row mt-3">
        <input
          v-model="newSkill"
          @keyup.enter="addCustomSkill"
          placeholder="E.g. Sommelier, Mixologist..."
          class="input skill-input"
        />
        <BaseButton variant="secondary" outline size="sm" @click="addCustomSkill">
          Add Skill
        </BaseButton>
      </div>
    </div>

    <div class="actions">
      <BaseButton variant="ghost" block size="sm" class="logout-btn" @click="doLogout">
        Log Out
      </BaseButton>
    </div>
  </WorkerLayout>
</template>

<style scoped>
.page-header { margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0; }

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  max-width: 800px;
  margin: 0 auto 2rem auto;
}

.avatar-section {
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 2rem;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #f8fafc;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight: 900;
  font-size: 2rem;
  color: #0f172a;
  background: #e2e8f0;
}

.view-mode { display: flex; flex-direction: column; gap: 1.25rem; }

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}
.info-row:last-child { border-bottom: none; padding-bottom: 0; }

.info-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value { font-size: 1.05rem; color: #0f172a; }

.cv-badge {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #0f172a;
}

.edit-mode { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.border-bottom { padding-bottom: 1rem; }

label { font-size: 0.85rem; font-weight: 600; color: #475569; }

.input {
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f8fafc;
}
.input:focus {
  border-color: #38bdf8;
  background: white;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
  outline: none;
}
.textarea { resize: vertical; min-height: 100px; }

.section-title { max-width: 800px; margin: 0 auto 1.5rem auto; }
.skills-section { max-width: 800px; margin: 0 auto; }
.section-title h3 { font-size: 1.25rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #0f172a; }
.section-title p { color: #64748b; font-size: 0.95rem; margin: 0; }

.skills-grid { display: flex; flex-wrap: wrap; gap: 12px; }
.skill-pill {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}
.skill-pill:hover { border-color: #cbd5e1; background: #f8fafc; }
.skill-pill.active { background: #0f172a; color: white; border-color: #0f172a; }

.add-skill-row { display: flex; gap: 10px; margin-top: 1.5rem; align-items: center; }
.skill-input { flex: 1; max-width: 250px; padding: 10px 14px; }

.actions { max-width: 800px; margin: 3rem auto 0 auto; text-align: center; }
.logout-btn { color: #ef4444; }
.logout-btn:hover { background: #fef2f2; }
</style>