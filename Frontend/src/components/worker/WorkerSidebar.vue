<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// Helper to check active state
// We use 'starts with' for the dashboard so it stays active if you add sub-routes later
const isActive = (path) => {
    if (path === '/worker' && route.path === '/worker') return true
    if (path !== '/worker' && route.path.startsWith(path)) return true
    return false
}
</script>

<template>
    <aside class="sidebar">
        <div class="logo">Shiftly <span class="badge">Worker</span></div>

        <nav class="nav-links">
            
            <router-link to="/worker" class="nav-item" :class="{ active: isActive('/worker') }">
                📅 Dashboard
            </router-link>

            <router-link to="/worker/marketplace" class="nav-item" :class="{ active: isActive('/worker/marketplace') }">
                🔍 Find Work
            </router-link>

            <router-link to="/worker/profile" class="nav-item" :class="{ active: isActive('/worker/profile') }">
                👤 Profile
            </router-link>

        </nav>
    </aside>
</template>

<style scoped>
.sidebar {
    width: 260px;
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    height: 100vh; /* Fixed height */
    position: fixed; /* Keeps it stuck to the left */
    top: 0;
    left: 0;
    z-index: 50;
}

.logo {
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 2rem;
    color: #0f172a;
    display: flex;
    align-items: center;
}

.badge {
    background: #0f172a;
    color: #38bdf8;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 8px;
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
    font-weight: 600;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
}

.nav-item:hover,
.nav-item.active {
    background-color: #f1f5f9;
    color: #0f172a;
}
</style>