<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShiftStore } from '../stores/shiftStore'
import ManagerLayout from '../components/ManagerLayout.vue'
import BaseButton from '../components/BaseButton.vue' // Using your standard button

const router = useRouter()
const store = useShiftStore()

// --- Time Options ---
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = ['00', '15', '30', '45'] // 15 min intervals are easier to choose

const form = ref({
    role: '',
    date: '',
    // Default Start: 09:00
    startHour: '09',
    startMinute: '00',
    // Default End: 17:00
    endHour: '17',
    endMinute: '00',
    pay: ''
})

const handleSubmit = () => {
    // 1. Combine the separate time parts into HH:MM strings
    const startTime = `${form.value.startHour}:${form.value.startMinute}`
    const endTime = `${form.value.endHour}:${form.value.endMinute}`
    // 1. Add to global store
    store.addShift({
        role: form.value.role,
        date: form.value.date,
        startTime: form.value.startTime,
        endTime: form.value.endTime,
        pay: form.value.pay + ' kr/h',
        status: 'open',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=60'
    })

    // 2. Redirect back to Dashboard
    alert('Shift Published to Marketplace!')
    router.push('/manager')
}
</script>

<template>
   <ManagerLayout>
        <div class="page-container">
            <header class="page-header">
                <h1 class="page-title">Post New Shift</h1>
                <p class="page-subtitle">Fill in the details to publish a gig to the marketplace.</p>
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
                        <BaseButton type="submit" variant="primary" block size="lg">Publish Shift</BaseButton>
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
    /* Limits width for readability */
    margin: 0 auto;
}

/* Header Styles matching other views */
.page-header {
    margin-bottom: 2rem;
}

.page-title {
    font-size: 1.8rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 5px 0;
}

.page-subtitle {
    color: #64748b;
    font-size: 1rem;
}

/* Form Card Styling */
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

/* Standard Input Styling */
.input {
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #0f172a;
    background-color: white;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;
    /* Ensures padding doesn't break width */
}

.input:focus {
    outline: none;
    border-color: #0f172a;
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.form-actions {
    margin-top: 1rem;
}

/* NEW STYLES FOR TIME PICKER */
.time-picker {
    display: flex;
    align-items: center;
    gap: 5px;
}

.time-select {
    text-align: center;
    appearance: none;
    /* Removes default arrow on some browsers for cleaner look */
    cursor: pointer;
}

.colon {
    font-weight: bold;
    color: #334155;
}
</style>