import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './stores/userStore'

import Login from './views/login.vue'
import SignUp from './views/signUp.vue'
import Home from './views/Home.vue'

import ManagerHome from './views/manager/ManagerHome.vue'
import StaffDirectory from './views/manager/StaffDirectory.vue'
import ApplicantReview from './views/manager/ApplicantReview.vue'
import CreateShift from './views/manager/CreateShift.vue'
import ManagerProfile from './views/manager/ManagerProfile.vue'
import ManagerSchedule from './views/manager/ManagerSchedule.vue'
import ApplicantDetails from './views/manager/ApplicantDetails.vue'
import DayDetailScreen from './views/manager/DayDetailScreen.vue'
import ManagerStaffProfile from './views/manager/ManagerStaffProfile.vue'

import WorkerHome from './views/worker/WorkerHome.vue'
import MarketPlaceFeed from './views/worker/MarketPlaceFeed.vue'
import WorkerProfile from './views/worker/WorkerProfile.vue'
import ShiftDetail from './views/worker/ShiftDetail.vue'
import WorkerApplication from './views/worker/WorkerApplication.vue'
import WorkerCalendar from './views/worker/WorkerCalendar.vue'
import WorkerSick from './views/worker/WorkerSick.vue'
import WorkerSwapshift from './views/worker/WorkerSwapshift.vue'
import Workertimeoff from './views/worker/Workertimeoff.vue'

const routes = [
  { path: '/', redirect: '/home' },

  { path: '/login', name: 'login', component: Login, meta: { public: true } },
  { path: '/signup', name: 'signup', component: SignUp, meta: { public: true } },
  { path: '/home', name: 'home', component: Home, meta: { public: true } },

  { path: '/manager', name: 'ManagerHome', component: ManagerHome, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/schedule', name: 'ManagerSchedule', component: ManagerSchedule, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/schedule/day/:date', name: 'DayDetailScreen', component: DayDetailScreen, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/staff', name: 'StaffDirectory', component: StaffDirectory, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/staff/:id', name: 'ManagerStaffProfile', component: ManagerStaffProfile, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/applicants', name: 'ApplicantReview', component: ApplicantReview, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/applicants/:id', name: 'ApplicantDetails', component: ApplicantDetails, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/shift/:id?', name: 'CreateShift', component: CreateShift, meta: { requiresAuth: true, role: 'BOSS' } },
  { path: '/manager/profile', name: 'ManagerProfile', component: ManagerProfile, meta: { requiresAuth: true, role: 'BOSS' } },

  { path: '/worker', name: 'WorkerHome', component: WorkerHome, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/marketplace', name: 'Marketplace', component: MarketPlaceFeed, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/marketplace/:id', name: 'ShiftDetail', component: ShiftDetail, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/applications', name: 'WorkerApplication', component: WorkerApplication, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/calendar', name: 'WorkerCalendar', component: WorkerCalendar, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/timeoff', name: 'Workertimeoff', component: Workertimeoff, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/sick', name: 'WorkerSick', component: WorkerSick, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/swapshift', name: 'WorkerSwapshift', component: WorkerSwapshift, meta: { requiresAuth: true, role: 'EMPLOYEE' } },
  { path: '/worker/profile', name: 'WorkerProfile', component: WorkerProfile, meta: { requiresAuth: true, role: 'EMPLOYEE' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (!userStore.user && userStore.token) {
    try {
      await userStore.fetchMe()
    } catch {
      userStore.logout()
    }
  }

  if (to.meta.public) return true

  if (to.meta.requiresAuth) {
    if (!userStore.token) return { name: 'login' }
    if (!userStore.user) {
      try {
        await userStore.fetchMe()
      } catch {
        return { name: 'login' }
      }
    }
    if (to.meta.role && userStore.user?.role !== to.meta.role) {
      return userStore.user?.role === 'BOSS'
        ? { name: 'ManagerHome' }
        : { name: 'WorkerHome' }
    }
  }

  return true
})

export default router