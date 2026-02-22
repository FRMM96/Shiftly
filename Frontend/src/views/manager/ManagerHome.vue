<script setup>
import { ref, computed, onMounted } from 'vue' // Added computed
import { isSameDay } from 'date-fns'
import { useRouter } from 'vue-router'
import { useShiftStore } from '../../stores/shiftStore' // <--- 1. Import Store
// --- Imports ---
import ManagerLayout from "../../components/manager/ManagerLayout.vue";
import ShiftCalendar from "../../components/manager/ShiftCalendar.vue";
import DayDetailModal from "../../components/manager/DayDetailModal.vue";
import WorkingNowModal from "../../components/manager/WorkingNowModal.vue"; // Added modal
import IssuesOpenModal from "../../components/manager/IssuesOpenModal.vue"; // Added Issues/Open modal
import ShiftCard from "../../components/shared/ShiftCard.vue";
import BaseButton from "../../components/shared/BaseButton.vue";

const router = useRouter();
const store = useShiftStore(); // <--- 2. Init Store

onMounted(() => {
    store.fetchManagerShifts()
})

// --- State ---
const isModalOpen = ref(false);
const isWorkingNowModalOpen = ref(false); // <--- State for Working Now modal
const isIssuesOpenModalOpen = ref(false); // <--- State for Issues/Open modal
const selectedDate = ref(null);
const selectedDayShifts = ref([]);

// --- Stats (Computed from Store) ---
// Now these numbers will actually update when you add a shift!
const activeShiftsNow = computed(() => {
  const now = new Date();
  
  return store.shifts.filter(shift => {
    // Only count active or assigned shifts
    if (shift.status !== 'active') return false;
    
    // Safety check for date
    if (!shift.date) return false;

    let sTime = null;
    let eTime = null;

    if (shift.startTime && shift.endTime) {
      sTime = shift.startTime;
      eTime = shift.endTime;
    } else if (shift.time) {
      const parts = shift.time.split(' - ');
      if (parts.length === 2) {
        sTime = parts[0];
        eTime = parts[1];
      }
    }

    if (!sTime || !eTime) return false;

    const startBaseStr = `${shift.date}T${sTime}:00`;
    const endBaseStr = `${shift.date}T${eTime}:00`;
    
    const startDate = new Date(startBaseStr);
    const endDate = new Date(endBaseStr);

    // Handle overnight shifts
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    // Now check if current time is within the shift block
    return now >= startDate && now <= endDate;
  });
});

const stats = computed(() => {
  return {
    workingNow: activeShiftsNow.value.length, // <--- Correctly compute working now
    scheduledToday: store.shifts.filter((s) =>
      isSameDay(new Date(s.date), new Date()),
    ).length,
    issuesAndOpen: store.shifts.filter(s => s.status === 'sick' || s.status === 'open').length,
  };
});

// --- Actions ---
const handleCreateShift = () => {
  router.push("/manager/shift");
};

const resolveSickIssue = (shiftId) => {
    // Look in the store, not local refs
    const shift = store.shifts.find(s => s.id === shiftId)
    if (shift) {
        if (confirm(`Publish ${shift.role} shift to Shiftly Marketplace?`)) {
            store.publishShift(shiftId)
        }
    }
  }
};

const handleDaySelect = (day) => {
  selectedDate.value = day;
  // Filter from STORE shifts
  selectedDayShifts.value = store.shifts.filter((s) =>
    isSameDay(new Date(s.date), day),
  );
  isModalOpen.value = true;
};

const handleAddShift = (newShiftData) => {
  // 1. Get the date string from the currently selected date
  // We need to format the Date object into 'YYYY-MM-DD' so the store and calendar recognize it
  const dateObj = new Date(selectedDate.value);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  // 2. Add to store with the Date included
  store.addShift({
    ...newShiftData,
    date: formattedDate, // <--- CRITICAL FIX: The calendar needs this!
    pay: "150 kr/h",
    status: "active", // <--- CRITICAL FIX: Added quotes around 'active'
    image: "https://ui-avatars.com/api/?name=" + newShiftData.name,
  });

  // 3. Refresh the modal list immediately
  handleDaySelect(selectedDate.value);
};

const handleDeleteShift = (id) => {
  if (confirm("Are you sure you want to delete this shift?")) {
    // You would need a delete action in your store, for now:
    const index = store.shifts.findIndex((s) => s.id === id);
    if (index !== -1) store.shifts.splice(index, 1);

    handleDaySelect(selectedDate.value);
  }
};

const handlePublishShift = (id) => {
  resolveSickIssue(id);
  handleDaySelect(selectedDate.value);
};
const handleUpdateShift = (updatedData) => {
  store.updateShift(updatedData);
  handleDaySelect(selectedDate.value); // Refresh Modal
};
</script>

<template>
  <ManagerLayout>
    <div class="content-wrapper">
      <header class="header">
        <h1>Dashboard</h1>
        <button @click="handleCreateShift" class="btn-create">
          + New Shift
        </button>
      </header>

      <div class="stats-grid">
        <div class="stat-card clickable-card" @click="isWorkingNowModalOpen = true">
          <span class="stat-label">Working Now</span>
          <span class="stat-number">{{ stats.workingNow }}</span>
          <span class="stat-hint">Click to view details</span>
        </div>
        <div class="stat-card clickable-card" @click="handleDaySelect(new Date())">
          <span class="stat-label">Scheduled Today</span>
          <span class="stat-number">{{ stats.scheduledToday }}</span>
          <span class="stat-hint">Click to view today's shifts</span>
        </div>
        <div class="stat-card alert-card clickable-card" @click="isIssuesOpenModalOpen = true">
          <span class="stat-label">Issues / Open</span>
          <span class="stat-number">{{ stats.issuesAndOpen }}</span>
          <span class="stat-hint">Click to view and solve</span>
        </div>
      </div>



      <section class="section-area">
        <div class="section-header">
          <h2 class="section-title">Overview</h2>
          <div class="legend">
            <span class="dot active"></span> Active
            <span class="dot sick"></span> Sick
            <span class="dot open"></span> Open
          </div>
        </div>


        <ShiftCalendar :shifts="store.shifts" @selectDay="handleDaySelect" />

        <DayDetailModal
          :isOpen="isModalOpen"
          :date="selectedDate"
          :shifts="selectedDayShifts"
          @close="isModalOpen = false"
          @addShift="handleAddShift"
          @deleteShift="handleDeleteShift"
          @updateShift="handleUpdateShift"
          @publishShift="handlePublishShift"
        />

        <WorkingNowModal
          :isOpen="isWorkingNowModalOpen"
          :activeShifts="activeShiftsNow"
          @close="isWorkingNowModalOpen = false"
          @editShift="(shift) => router.push(`/manager/shift/${shift.id}`)"
          @deleteShift="handleDeleteShift"
        />

        <IssuesOpenModal
          :isOpen="isIssuesOpenModalOpen"
          :shifts="store.shifts"
          :openShifts="store.openShifts"
          @close="isIssuesOpenModalOpen = false"
          @resolveSick="resolveSickIssue"
          @deleteShift="handleDeleteShift"
        />
      </section>
    </div>
  </ManagerLayout>
</template>

<style scoped>
/* 🟢 CLEANUP: Removed all sidebar/layout styles since ManagerLayout handles them */

.content-wrapper {
  padding: 2rem;
  /* Add padding here for the main content */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-create {
  background-color: #0f172a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

/* --- Stats Grid --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-label {
  display: block;
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
}

.alert-card .stat-number {
  color: #ef4444;
}

/* --- Issues Section --- */
.text-danger {
  color: #ef4444;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* --- Calendar Section --- */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.legend {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #64748b;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.dot.active {
  background: #10b981;
}

.dot.sick {
  background: #ef4444;
}

.dot.open {
  background: #f59e0b;
}

.badge-count {
  background: #f1f5f9;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.applicant-count {
  font-size: 0.85rem;
  color: #64748b;
  margin-right: auto;
  /* Pushes buttons to the right */
  font-style: italic;
}

.marketplace-actions-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.shift-extra-details {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 12px;
    background: #f8fafc;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
}

.detail-item {
    font-size: 0.85rem;
    color: #475569;
}

.detail-item strong {
    color: #0f172a;
    font-weight: 600;
}

.stat-card.clickable-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.stat-card.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e1;
}

.stat-hint {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 4px;
}
</style>
