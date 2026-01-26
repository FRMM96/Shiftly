<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'

// --- Mock Data ---
const staffList = ref([
  { id: 1, name: 'Sarah Jenkins', role: 'Chef', phone: '+46 70 123 45 67', email: 'sarah@kitchen.com', status: 'active', avatar: 'S' },
  { id: 2, name: 'Mike Thompson', role: 'Waiter', phone: '+46 70 987 65 43', email: 'mike@floor.com', status: 'active', avatar: 'M' },
  { id: 3, name: 'Jenny Lindberg', role: 'Bartender', phone: '+46 70 555 12 34', email: 'jenny@bar.com', status: 'sick', avatar: 'J' }, // Linked to your Sick status logic
  { id: 4, name: 'Tom Hardy', role: 'Dishwasher', phone: '+46 70 111 22 33', email: 'tom@clean.com', status: 'inactive', avatar: 'T' },
])

// --- Search & Filter ---
const searchQuery = ref('')
const filteredStaff = computed(() => {
  return staffList.value.filter(person => 
    person.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    person.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// --- Actions ---
const handleAddStaff = () => {
  const name = prompt("Enter Staff Name:") // Simple prompt for now, connect to Modal later
  if (name) {
    staffList.value.push({
      id: Date.now(),
      name,
      role: 'New Hire',
      phone: '-',
      email: '-',
      status: 'active',
      avatar: name.charAt(0)
    })
  }
}

const handleDelete = (id) => {
  if(confirm("Remove this staff member?")) {
    staffList.value = staffList.value.filter(p => p.id !== id)
  }
}
</script>

<template>
  <div class="page-container">
    
    <header class="page-header">
      <div>
        <h1 class="page-title">Staff Directory</h1>
        <p class="page-subtitle">Manage your internal team and contact details.</p>
      </div>
      <BaseButton variant="primary" @click="handleAddStaff">+ Add New Staff</BaseButton>
    </header>

    <div class="toolbar">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input v-model="searchQuery" type="text" placeholder="Search by name or role..." class="search-input" />
      </div>
    </div>

    <div class="staff-grid">
      <div v-for="person in filteredStaff" :key="person.id" class="staff-card">
        
        <div class="card-top">
          <div class="avatar-circle">{{ person.avatar }}</div>
          <div class="person-info">
            <h3 class="person-name">{{ person.name }}</h3>
            <span class="person-role">{{ person.role }}</span>
          </div>
          <div class="status-indicator" :class="person.status"></div>
        </div>

        <div class="card-details">
          <div class="detail-row">
            <span class="icon">📞</span> {{ person.phone }}
          </div>
          <div class="detail-row">
            <span class="icon">✉️</span> {{ person.email }}
          </div>
        </div>

        <div class="card-actions">
          <BaseButton variant="secondary" size="sm" block>Edit Profile</BaseButton>
          <button class="icon-btn-delete" @click="handleDelete(person.id)">🗑️</button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* Page Layout */
.page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0; }
.page-subtitle { color: #64748b; margin-top: 5px; }

/* Toolbar */
.toolbar { margin-bottom: 2rem; }
.search-wrapper {
  position: relative;
  max-width: 400px;
}
.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

/* Staff Grid */
.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Staff Card */
.staff-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.staff-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
  position: relative;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  background-color: #f1f5f9;
  color: #0f172a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
}

.person-info { flex: 1; }
.person-name { font-size: 1.1rem; font-weight: 700; margin: 0; color: #0f172a; }
.person-role { font-size: 0.9rem; color: #64748b; }

/* Status Dot */
.status-indicator {
  width: 10px; height: 10px; border-radius: 50%;
  position: absolute; top: 0; right: 0;
}
.status-indicator.active { background-color: #10b981; }
.status-indicator.sick { background-color: #ef4444; box-shadow: 0 0 0 2px #fef2f2; }
.status-indicator.inactive { background-color: #cbd5e1; }

/* Details */
.card-details {
  margin-bottom: 1.5rem;
  flex: 1; /* Pushes actions to bottom */
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-size: 0.9rem;
  margin-bottom: 8px;
}
.icon { opacity: 0.5; }

/* Actions */
.card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
}

.icon-btn-delete {
  background: none; border: none; cursor: pointer; opacity: 0.4;
  padding: 8px; border-radius: 4px; transition: all 0.2s;
}
.icon-btn-delete:hover { opacity: 1; background-color: #fef2f2; }
</style>