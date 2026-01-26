<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path) => route.path === path
</script>

<template>
    <aside class="sidebar">
        <div class="logo">Shiftly <span class="badge">Manager</span></div>

        <nav class="nav-links">
            <router-link to="/manager" class="nav-item" :class="{ active: isActive('/manager') }">
                Dashboard
            </router-link>

            <router-link to="/manager/staff" class="nav-item" :class="{ active: isActive('/manager/staff') }">
                Staff Directory
            </router-link>

            <router-link to="/manager/applicants" class="nav-item" :class="{ active: isActive('/manager/applicants') }">
                Applicants
            </router-link>
        </nav>
    </aside>
</template>

<style scoped>
.sidebar {
    width: 250px;
    background-color: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    position: fixed;
    height: 100vh;
    z-index: 100;
}

.logo {
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 2.5rem;
    color: #0f172a;
}

.badge {
    background: #0f172a;
    color: #ccfd52;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
}

.nav-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.nav-item {
    text-decoration: none;
    color: #64748b;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s;
    display: block;
}

.nav-item:hover,
.nav-item.active {
    background-color: #f1f5f9;
    color: #0f172a;
}
</style>