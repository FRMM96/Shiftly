<template>
    <div class="calendar-page">
        <div class="header">
            <h1>Calendar</h1>

            <div class="controls">
                <button @click="prevWeek">Previous Week</button>
                <button @click="goToThisWeek">This Week</button>
                <button @click="nextWeek">Next Week</button>
            </div>
        </div>

        <DayPilotCalendar :config="calendarConfig" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import { DayPilotCalendar } from "@daypilot/daypilot-lite-vue";

function getCurrentWeekStartISO() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    now.setDate(now.getDate() + diffToMonday);
    return now.toISOString().split("T")[0];
}

const calendarConfig = ref({
    viewType: "Week",
    weekStarts: 1,
    startDate: getCurrentWeekStartISO(),
    events: [],

    // disable interactions (display-only)
    eventClickHandling: "Disabled",
    timeRangeSelectedHandling: "Disabled",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
});

function prevWeek() {
    const d = new Date(calendarConfig.value.startDate);
    d.setDate(d.getDate() - 7);
    calendarConfig.value.startDate = d.toISOString().split("T")[0];
}

function nextWeek() {
    const d = new Date(calendarConfig.value.startDate);
    d.setDate(d.getDate() + 7);
    calendarConfig.value.startDate = d.toISOString().split("T")[0];
}

function goToThisWeek() {
    calendarConfig.value.startDate = getCurrentWeekStartISO();
}
</script>

<style scoped>
.calendar-page {
    padding: 16px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;
}

.controls {
    display: flex;
    gap: 8px;
}

button {
    padding: 8px 10px;
    border: 1px solid #ccc;
    background: white;
    border-radius: 8px;
    cursor: pointer;
}

button:hover {
    opacity: 0.9;
}
</style>
