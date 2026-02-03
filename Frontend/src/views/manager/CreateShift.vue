<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useShiftStore } from '../../stores/shiftStore'
import ManagerLayout from '../../components/manager/ManagerLayout.vue'
import BaseButton from '../../components/shared/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const store = useShiftStore()

// 1. Check if we are editing (is there an ID in the URL?)
const isEditing = computed(() => !!route.params.id)
const shiftId = route.params.id

// Time Options for Dropdowns
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = ['00', '15', '30', '45']

// Form State
const form = ref({
    role: '',
    date: '',
    startHour: '09',
    startMinute: '00',
    endHour: '17',
    endMinute: '00',
    pay: ''
})

// 2. Load Data if Editing
onMounted(() => {
    if (isEditing.value) {
        const existingShift = store.getShiftById(shiftId)
        if (existingShift) {
            // Split "09:00" into "09" and "00"
            const [startH, startM] = existingShift.startTime.split(':')
            const [endH, endM] = existingShift.endTime.split(':')

            form.value = {
                role: existingShift.role,
                date: existingShift.date,
                startHour: startH,
                startMinute: startM,
                endHour: endH,
                endMinute: endM,
                // Remove ' kr/h' text to show just the number
                pay: parseInt(existingShift.pay)
            }
        }
    }
})

// 3. Handle Submit (Create or Update)
const handleSubmit = () => {
    const shiftData = {
        role: form.value.role,
        date: form.value.date,
        // Combine dropdowns into time strings
        startTime: `${form.value.startHour}:${form.value.startMinute}`,
        endTime: `${form.value.endHour}:${form.value.endMinute}`,
        pay: form.value.pay + ' kr/h',
        status: 'open'
    }

    if (isEditing.value) {
        // 🟢 UPDATE Existing
        store.updateShift({ id: Number(shiftId), ...shiftData })
        alert('Shift Updated!')
    } else {
        // 🟢 CREATE New
        store.addShift({
            ...shiftData,
            // Add a default image for new shifts
            image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=60'
        })
        alert('Shift Published!')
    }
    // Redirect back to Manager Dashboard
    router.push('/manager')
}

// 4. Handle Delete
const handleDelete = () => {
    if (confirm("Delete this shift permanently?")) {
        store.deleteShift(Number(shiftId))
        router.push('/manager')
    }
}
</script>

<template>
    <ManagerLayout>
        <div class="page-container">

            <header class="page-header">
                <h1 class="page-title">{{ isEditing ? 'Edit Shift' : 'Post New Shift' }}</h1>

                <BaseButton v-if="isEditing" variant="danger" size="sm" @click="handleDelete">
                    Delete Shift
                </BaseButton>
            </header>

            <div class="form-card">
                <form @submit.prevent="handleSubmit" class="shift-form">

                    <div class="form-group">
                        <label>Role Needed</label>
                        <select v-model="form.role" class="input" required>
                            <option disabled value="">Select Role</option>
                            <option>Bartender</option>
                            <option>Waiter</option>
                            <option>Chef</option>
                            <option>Dishwasher</option>
                            <option>Runner</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" v-model="form.date" class="input" required />
                    </div>

                    <div class="row">
                        <div class="form-group">
                            <label>Start Time (24h)</label>
                            <div class="time-picker">
                                <select v-model="form.startHour" class="input time-select">
                                    <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                                </select>
                                <span class="colon">:</span>
                                <select v-model="form.startMinute" class="input time-select">
                                    <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>End Time (24h)</label>
                            <div class="time-picker">
                                <select v-model="form.endHour" class="input time-select">
                                    <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                                </select>
                                <span class="colon">:</span>
                                <select v-model="form.endMinute" class="input time-select">
                                    <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Hourly Pay (kr)</label>
                        <input type="number" v-model="form.pay" placeholder="150" class="input" required />
                    </div>

                    <div class="form-actions">
                        <BaseButton type="submit" variant="primary" block size="lg">
                            {{ isEditing ? 'Save Changes' : 'Publish Shift' }}
                        </BaseButton>
                    </div>

                </form>
            </div>
        </div>
    </ManagerLayout>
</template>

<style scoped>
.page-container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

/* Header */
.page-header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.page-title {
    font-size: 1.8rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
}

/* Form Card */
.form-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.shift-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Inputs */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.row {
    display: flex;
    gap: 1.5rem;
}

.row .form-group {
    flex: 1;
}

label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #334155;
}

.input {
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #0f172a;
    background-color: white;
    width: 100%;
    box-sizing: border-box;
}

.input:focus {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.form-actions {
    margin-top: 1rem;
}

/* Time Picker Styles */
.time-picker {
    display: flex;
    align-items: center;
    gap: 5px;
}

.time-select {
    text-align: center;
    cursor: pointer;
}

.colon {
    font-weight: bold;
    color: #334155;
}
</style>