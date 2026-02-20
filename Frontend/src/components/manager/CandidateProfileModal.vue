<script setup>
import BaseButton from '../shared/BaseButton.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  candidate: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'hire', 'reject'])

</script>

<template>
  <div v-if="isOpen && candidate" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">
      <header class="modal-header">
        <h2 class="modal-title">Candidate Profile</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </header>

      <div class="modal-content">
        <!-- Candidate Overview Header -->
        <div class="profile-header">
            <div class="avatar-xl">{{ candidate.avatar }}</div>
            <div class="profile-title">
                <h3 class="name">{{ candidate.name }}</h3>
                <div class="trust-signals">
                    <span class="rating">⭐ {{ candidate.rating }}</span>
                    <span class="dot">•</span>
                    <span class="jobs">{{ candidate.completedShifts }} shifts completed</span>
                </div>
                <div class="applied-time">Applied {{ candidate.appliedTime }}</div>
            </div>
        </div>

        <hr class="divider" />

        <!-- Mock Stats Section -->
        <section class="profile-section">
            <h4 class="section-title">Performance Stats</h4>
            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-value">98%</span>
                    <span class="stat-label">On-Time</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">0</span>
                    <span class="stat-label">No-Shows</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">4.9/5</span>
                    <span class="stat-label">Communication</span>
                </div>
            </div>
        </section>

        <!-- Mock Documents Section -->
        <section class="profile-section">
            <h4 class="section-title">Documents</h4>
            <div class="document-list">
                <div class="document-item">
                    <div class="doc-icon">📄</div>
                    <div class="doc-info">
                        <span class="doc-name">Curriculum_Vitae.pdf</span>
                        <a href="#" class="doc-link">View CV</a>
                    </div>
                </div>
                <div class="document-item">
                    <div class="doc-icon">✉️</div>
                    <div class="doc-info">
                        <span class="doc-name">Cover Letter</span>
                        <div class="cover-letter-preview">
                            "Hi, I'm really interested in this shift. I have 2 years of experience in this role and am very reliable..."
                            <a href="#" class="doc-link inline-link">Read full</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
      </div>

      <footer class="modal-footer">
          <BaseButton variant="secondary" block @click="$emit('reject', candidate.id)">Not Hire</BaseButton>
          <BaseButton variant="primary" block @click="$emit('hire', candidate)">Hire Candidate</BaseButton>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
}

.modal-panel {
  background: white;
  width: 500px;
  max-width: 100%;
  height: 100%;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  color: #94a3b8;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.profile-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.avatar-xl {
    width: 80px;
    height: 80px;
    background: #0f172a;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 700;
}

.profile-title {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.name {
    margin: 0;
    font-size: 1.5rem;
    color: #0f172a;
}

.trust-signals {
    font-size: 0.95rem;
    color: #64748b;
    display: flex;
    gap: 8px;
    align-items: center;
}

.rating {
    color: #0f172a;
    font-weight: 600;
}

.applied-time {
    font-size: 0.85rem;
    color: #94a3b8;
    margin-top: 4px;
}

.divider {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 0;
}

/* Sections */
.profile-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.section-title {
    margin: 0;
    font-size: 1.1rem;
    color: #334155;
}

/* Stats */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.stat-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
}

.stat-label {
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Documents */
.document-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.document-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
}

.doc-icon {
    font-size: 1.5rem;
}

.doc-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.doc-name {
    font-weight: 600;
    color: #0f172a;
}

.doc-link {
    font-size: 0.85rem;
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
}

.doc-link:hover {
    text-decoration: underline;
}

.cover-letter-preview {
    font-size: 0.9rem;
    color: #475569;
    font-style: italic;
    background: white;
    padding: 10px;
    border-radius: 6px;
    border: 1px dashed #cbd5e1;
    margin-top: 4px;
}

.inline-link {
    display: inline-block;
    margin-left: 5px;
    font-style: normal;
}

/* Footer */
.modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 1rem;
    background: white;
}
</style>
