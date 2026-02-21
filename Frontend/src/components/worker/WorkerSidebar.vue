<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path) => route.path === path || (path !== '/worker' && route.path.startsWith(path))
</script>

<template>
    <aside class="sidebar">
        <div class="logo">Radix <span class="badge">Worker</span></div>

        <nav class="nav-links">
            <router-link to="/worker" class="nav-item" :class="{ active: isActive('/worker') }">
                Dashboard
            </router-link>

            <router-link to="/worker/marketplace" class="nav-item" :class="{ active: isActive('/worker/marketplace') }">
                Find Work
            </router-link>

            <router-link to="/worker/profile" class="nav-item" :class="{ active: isActive('/worker/profile') }">
                Profile
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
    color: #38bdf8;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    margin-left: 5px;
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