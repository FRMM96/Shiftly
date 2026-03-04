<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
    router.push('/login')
}

const goToSignup = () => {
    router.push('/signup')
}
</script>

<template>
    <div class="landing-container">
     
        <nav class="sticky-nav">
            <div class="nav-content">
                <div class="logo">Shiftly</div>
                <button @click="goToLogin" class="nav-login-btn"> LOG IN</button>
                <button @click="goToSignup" class="nav-create-btn"> CREATE ACCOUNT</button>
            </div>
        </nav>

        <div class="hero-section">
            <div class="hero-content">
                <h1>Get Shifts. Get Paid.<br />No hassle.</h1>
                <p>Shiftly makes it easy to manage schedules and pick up extra shifts.</p>
                <div class="hero-buttons">
                    <button @click="goToLogin" class="primary-btn">LOG IN</button>
                    <button @click="goToSignup" class="secondary-btn">CREATE ACCOUNT</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* --- Global --- */
.landing-container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
}

h1,
h2,
h3 {
    margin: 0;
}

p {
    line-height: 1.5;
}

/* --- 🟢 NEW: Sticky Navigation --- */
.sticky-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: rgba(255, 255, 255, 0.95);
    /* Nearly opaque white */
    backdrop-filter: blur(10px);
    /* Modern blur effect */
    z-index: 1000;
    /* Stays on top of everything */
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
}

.nav-content {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-weight: 800;
    font-size: 1.5rem;
    letter-spacing: -1px;
    color: #111;
    cursor: pointer;
}

.nav-login-btn {
    background: transparent;
    border: 2px solid #111;
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.nav-login-btn:hover {
    background: #111;
    color: white;
}

.nav-create-btn {
    background: transparent;
    border: 2px solid #111;
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.nav-create-btn:hover {
    background: #111;
    color: white;
}

/* --- Section 1: Split Hero --- */
.hero-split {
    display: flex;
    min-height: 85vh;
    /* Takes up most of the screen */
}

.split-side {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    text-align: center;
}

.manager-side {
    background-color: #1f2937;
    /* Dark Charcoal */
    color: white;
}

.worker-side {
    background-color: #ccfd52;
    /* Lime Green */
    color: #1f2937;
}

.content-wrapper {
    max-width: 400px;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    line-height: 1.1;
}

.hero-sub {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.btn {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.2s;
}

.btn:hover {
    transform: scale(1.05);
}

.btn-manager {
    background-color: white;
    color: #1f2937;
}

.btn-worker {
    background-color: #1f2937;
    color: white;
}

/* --- Section 2: Trust Bar --- */
.trust-bar {
    background-color: #f3f4f6;
    padding: 1.5rem;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
}

.trust-icons {
    margin-top: 10px;
    font-size: 0.9rem;
    color: #666;
    display: flex;
    justify-content: center;
    gap: 20px;
}

/* --- Section 3: How It Works --- */
.how-it-works {
    padding: 4rem 2rem;
    background-color: white;
    text-align: center;
}

.section-title {
    font-size: 2rem;
    margin-bottom: 3rem;
}

.steps-grid {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
}

.step-card {
    flex: 1;
    padding: 1rem;
}

.icon-circle {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    background: #f9fafb;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
}

.arrow {
    font-size: 2rem;
    color: #ccc;
    margin-top: 2rem;
}

/* --- Section 4: Value Trio --- */
.value-trio {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 4rem 2rem;
    background-color: #f9fafb;
}

.value-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    flex: 1;
    max-width: 300px;
}

.value-card h3 {
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 1rem;
}

.value-card ul {
    list-style: none;
    padding: 0;
    text-align: left;
}

.value-card li {
    margin-bottom: 0.8rem;
}

/* --- Footer --- */
.footer {
    background-color: #111;
    color: white;
    padding: 2rem;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    max-width: 1000px;
    margin: 0 auto;
}

.logo {
    font-weight: bold;
    font-size: 1.2rem;
}

.footer-links a {
    color: #888;
    margin-left: 20px;
    text-decoration: none;
    cursor: pointer;
}

.footer-links a:hover {
    color: white;
}

/* --- Mobile Responsiveness --- */
@media (max-width: 768px) {
    .hero-split {
        flex-direction: column;
    }

    .steps-grid {
        flex-direction: column;
        align-items: center;
    }

    .arrow {
        transform: rotate(90deg);
        margin: 10px 0;
    }

    .value-trio {
        flex-direction: column;
        align-items: center;
    }
}
</style>