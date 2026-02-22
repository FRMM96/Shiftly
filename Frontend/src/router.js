import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './stores/userStore'

// --- Public Views ---
import Login from './views/login.vue' 
import SignUp from './views/signUp.vue'
import Home from './views/Home.vue'

// --- Manager Views ---
import ManagerHome from './views/manager/ManagerHome.vue'
import StaffDirectory from './views/manager/StaffDirectory.vue'
import ApplicantReview from './views/manager/ApplicantReview.vue'
import CreateShift from './views/manager/CreateShift.vue'
import ManagerCalendar from './views/manager/calendar.vue' 

// --- Worker Views ---
import WorkerHome from './views/worker/WorkerHome.vue'
import MarketPlaceFeed from './views/worker/MarketPlaceFeed.vue'
import WorkerProfile from './views/worker/WorkerProfile.vue'

const routes = [
  { path: '/', name: 'root', redirect: '/home' },

  // Public
  { path: '/login', name: 'login', component: Login, meta: { public: true } },
  { path: '/signup', name: 'signup', component: SignUp, meta: { public: true } },
  { path: '/home', name: 'home', component: Home, meta: { public: true } },

  // Manager (requires auth + role)
  { path: '/manager', name: 'ManagerHome', component: ManagerHome, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/calendar', name: 'ManagerCalendar', component: ManagerCalendar, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/staff', name: 'StaffDirectory', component: StaffDirectory, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/applicants', name: 'ApplicantReview', component: ApplicantReview, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/shift/:id?', name: 'CreateShift', component: CreateShift, meta: { requiresAuth: true, role: 'BOSS' } },

  // Worker
  { path: '/worker', name: 'WorkerHome', component: WorkerHome, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/marketplace', name: 'Marketplace', component: MarketPlaceFeed, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/profile', name: 'WorkerProfile', component: WorkerProfile, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  // Hydrate session on refresh
  if (!userStore.user && userStore.token) {
    try { await userStore.fetchMe() } catch { userStore.logout() }
  }

  if (to.meta.public) return true

  if (to.meta.requiresAuth) {
    if (!userStore.token) return { name: 'login' }
    if (!userStore.user) {
      try { await userStore.fetchMe() } catch { return { name: 'login' } }
    }
    if (to.meta.role && userStore.user?.role !== to.meta.role) {
      // send them to their dashboard
      return userStore.user?.role === 'BOSS' ? { name: 'ManagerHome' } : { name: 'WorkerHome' }
    }
  }

  return true
})

export default router