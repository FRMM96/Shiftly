<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShiftStore } from '../stores/shiftStore'
import ManagerLayout from '../components/ManagerLayout.vue'
import BaseButton from '../components/BaseButton.vue' // Using your standard button

const router = useRouter()
const store = useShiftStore()

const form = ref({
    role: '',
    date: '',
    startTime: '',
    endTime: '',
    pay: ''
})

const handleSubmit = () => {
    // 1. Add to global store
    store.addShift({
        role: form.value.role,
        date: form.value.date,
        startTime: form.value.startTime,
        endTime: form.value.endTime,
        pay: form.value.pay + ' kr/h'
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
                            <label>Start Time</label>
                            <input type="time" v-model="form.startTime" class="input" required />
                        </div>
                        <div class="form-group">
                            <label>End Time</label>
                            <input type="time" v-model="form.endTime" class="input" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Hourly Pay (kr)</label>
                        <input type="number" v-model="form.pay" placeholder="150" class="input" required />
                    </div>

                    <div class="form-actions">
                        <BaseButton type="submit" variant="primary" block size="lg">
                            Publish Shift
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
</style>