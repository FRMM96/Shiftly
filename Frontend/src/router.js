import { createRouter, createWebHistory } from 'vue-router'

// 1. PUBLIC VIEWS (Go up one level to 'views')
import Login from './views/login.vue' 
import SignUp from './views/signUp.vue'
import Home from './views/Home.vue'

// 2. MANAGER VIEWS (Inside 'views/manager/')
import ManagerHome from './views/manager/ManagerHome.vue'
import StaffDirectory from './views/manager/StaffDirectory.vue'
import ApplicantReview from './views/manager/ApplicantReview.vue'
import CreateShift from './views/manager/CreateShift.vue'
import ManagerCalendar from './views/manager/calendar.vue' 

// 3. WORKER VIEWS (Inside 'views/worker/')
import WorkerHome from './views/worker/WorkerHome.vue'
import MarketPlaceFeed from './views/worker/MarketPlaceFeed.vue'
import WorkerProfile from './views/worker/WorkerProfile.vue'

const routes = [
  // --- Public Routes ---
  {
    path: '/', 
    name: 'root',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },

  // --- Manager Routes ---
  {
    path: '/manager',
    name: 'ManagerHome',
    component: ManagerHome
  },
  {
    path: '/calendar', 
    name: 'ManagerCalendar',
    component: ManagerCalendar
  },
  {
    path: '/manager/staff',
    name: 'StaffDirectory',
    component: StaffDirectory
  },
  {
    path: '/manager/applicants',
    name: 'ApplicantReview',
    component: ApplicantReview
  },
  {
    path: '/manager/shift/:id?', 
    name: 'CreateShift',
    component: CreateShift
  },

  // --- Worker Routes ---
  {
    path: '/worker',
    name: 'WorkerHome',
    component: WorkerHome // The Dashboard
  },
  
  {
    path: '/worker/marketplace',
    name: 'Marketplace',
    component: MarketPlaceFeed
  },
  {
    path: '/worker/profile',
    name: 'WorkerProfile',
    component: WorkerProfile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router