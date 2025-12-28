<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
    router.push('/login')
}
</script>

<template>
    <div class="landing-container">
        <nav class="sticky-nav">
            <div class="nav-content">
                <div class="logo">Shiftly</div>
                <button @click="goToLogin" class="nav-login-btn"> LOG IN</button>
                <button @click="goToLogin" class="nav-create-btn"> CREATE ACCOUNT</button>
            </div>
        </nav>
        <section class="hero-split">
            <div class="split-side manager-side">
                <div class="content-wrapper">
                    <h1 class="hero-title">Stop worrying about empty shifts.</h1>
                    <ol class="hero-bullets">
                        <li>⚡ <strong>Fill Shifts Fast:</strong> Cover sick calls in under 60 seconds.</li> <br>
                        <li>📅 <strong>Smart Rosters:</strong> Manage your entire team in one view.</li> <br>
                        <li>⭐ <strong>Verified Staff:</strong> Hire rated professionals you can trust.</li> <br>
                    </ol>
                    <button @click="goToLogin" class="btn btn-manager"> Manager LOG IN </button>
                </div>
            </div>

            <div class="split-side worker-side">
                <div class="content-wrapper">
                    <h1 class="hero-title text-dark">Work on your terms.</h1>
                    <ol class="hero-bullets text-dark">
                        <li>💸 <strong>Instant Pay:</strong> High-paying gigs sent to your phone.</li> <br>
                        <li>⏰ <strong>Total Freedom:</strong> No minimum hours, work when you want.</li> <br>
                        <li>🚀 <strong>Instant Booking:</strong> No interviews, just click and work.</li> <br>
                    </ol>
                    <button @click="goToLogin" class="btn btn-worker"> Staff LOG IN</button>
                </div>
            </div>
        </section>

        <section class="trust-bar">
            <p>Trusted by <strong>500+ Businesses</strong> to fill <strong>10,000+ Shifts</strong> this month.</p>
            <div class="trust-icons">
                <span>🍽️ Restaurants</span>
                <span>☕ Cafes</span>
                <span>🏷️ Retail</span>
            </div>
        </section>

        <section class="how-it-works">
            <h2 class="section-title">The 3-Step Shift Solution</h2>
            <div class="steps-grid">
                <div class="step-card">
                    <div class="icon-circle red-icon">📅</div>
                    <h3>1. The Gap Opens</h3>
                    <p>A staff member reports sick, or Manager post an open shift.</p>
                </div>
                <div class="arrow">➜</div>
                <div class="step-card">
                    <div class="icon-circle blue-icon">📲</div>
                    <h3>2. Shiftly Alerts</h3>
                    <p>We show and notify available workers nearby.</p>
                </div>
                <div class="arrow">➜</div>
                <div class="step-card">
                    <div class="icon-circle green-icon">🤝</div>
                    <h3>3. Shift Filled</h3>
                    <p>A worker accepts instantly. Your roster is updated.</p>
                </div>
            </div>
        </section>

        <section class="value-trio">
            <div class="value-card">
                <h3>For Business Owners</h3>
                <ul>
                    <li>✅ Instant sick-call coverage</li>
                    <li>✅ Single view of all staff</li>
                    <li>✅ Verified worker ratings</li>
                </ul>
            </div>
            <div class="value-card">
                <h3>For Current Staff</h3>
                <ul>
                    <li>✅ Know when you're working</li>
                    <li>✅ Report sickness easily</li>
                    <li>✅ Swap shifts with team</li>
                </ul>
            </div>
            <div class="value-card highlight">
                <h3>For Shift Seekers</h3>
                <ul>
                    <li>✅ Instant paying gigs</li>
                    <li>✅ No minimum commitment</li>
                    <li>✅ Fast, transparent pay</li>
                </ul>
            </div>
        </section>

        <footer class="footer">
            <div class="footer-content">
                <div class="logo">Shiftly</div>
                <div class="footer-links">
                    <a @click="goToLogin">Log In</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                </div>
            </div>
        </footer>

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