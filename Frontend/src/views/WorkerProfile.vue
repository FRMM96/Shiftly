<script setup>
import { ref } from 'vue'
import WorkerLayout from '../components/WorkerLayout.vue'
import BaseButton from '../components/BaseButton.vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()

// Local state for the form (initially copies the store data)
const form = ref({
    name: userStore.user.name,
    email: userStore.user.email,
    bio: userStore.user.bio
})

const availableSkills = ['Bartender', 'Waiter', 'Chef', 'Dishwasher', 'Barista', 'Runner']

const handleSave = () => {
    userStore.updateProfile(form.value)
    alert("Profile Updated Successfully!")
}

const toggleSkill = (skill) => {
    userStore.toggleSkill(skill)
}
</script>

<template>
    <WorkerLayout>
        <div class="page-header">
            <h1>My Profile</h1>
        </div>

        <div class="profile-card">
            <div class="avatar-section">
                <img :src="userStore.user.avatar" class="avatar-large" alt="Profile" />
                <button class="edit-photo-btn">📷</button>
            </div>

            <div class="form-group">
                <label>Full Name</label>
                <input v-model="form.name" class="input" placeholder="Your Name" />
            </div>

            <div class="form-group">
                <label>Bio / Experience</label>
                <textarea v-model="form.bio" class="input textarea" rows="3"></textarea>
            </div>
        </div>

        <div class="section-title">
            <h3>My Skills</h3>
            <p>Select the roles you want to work.</p>
        </div>

        <div class="skills-grid">
            <div v-for="skill in availableSkills" :key="skill" class="skill-pill"
                :class="{ active: userStore.user.skills.includes(skill) }" @click="toggleSkill(skill)">
                <span class="check-icon" v-if="userStore.user.skills.includes(skill)">✓</span>
                {{ skill }}
            </div>
        </div>

        <div class="actions">
            <BaseButton variant="primary" block size="lg" @click="handleSave">
                Save Changes
            </BaseButton>

            <BaseButton variant="ghost" block size="sm" class="logout-btn">
                Log Out
            </BaseButton>
        </div>

    </WorkerLayout>
</template>

<style scoped>
.page-header {
    margin-bottom: 1.5rem;
}

.page-header h1 {
    font-size: 1.8rem;
    font-weight: 800;
    color: #0f172a;
}

/* Profile Card */
.profile-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    border: 1px solid #f3f4f6;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.avatar-section {
    display: flex;
    justify-content: center;
    position: relative;
    margin-bottom: 1rem;
}

.avatar-large {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #f8fafc;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.edit-photo-btn {
    position: absolute;
    bottom: 0;
    right: 35%;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Forms */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #64748b;
}

.input {
    padding: 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
}

.input:focus {
    border-color: #0f172a;
    outline: none;
}

.textarea {
    resize: vertical;
}

/* Skills */
.section-title {
    margin-bottom: 1rem;
}

.section-title h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
}

.section-title p {
    color: #94a3b8;
    font-size: 0.9rem;
    margin: 0;
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 2.5rem;
}

.skill-pill {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 10px 18px;
    border-radius: 50px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
}

.skill-pill.active {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
    padding-left: 14px;
    /* Adjust for check icon */
}

/* Actions */
.actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 2rem;
}

.logout-btn {
    color: #ef4444;
}
</style>