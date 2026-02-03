<script setup>
import ManagerSidebar from './ManagerSidebar.vue'
</script>

<template>
    <div class="manager-layout">
        <ManagerSidebar />
        <main class="main-content">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.manager-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #334155;
}

.main-content {
    margin-left: 250px;
    /* Push content to right of sidebar */
    flex: 1;
    width: calc(100% - 250px);
}
</style>