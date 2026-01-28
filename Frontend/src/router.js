import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/login.vue' 
import SignUp from './views/signUp.vue'
import Home from './views/Home.vue'
import Calendar from './views/calendar.vue'
import ManagerHome from './views/ManagerHome.vue'
import StaffDirectory from './views/StaffDirectory.vue'
import ApplicantReview from './views/ApplicantReview.vue'
import MarketPlaceFeed from './views/MarketPlaceFeed.vue'
import CreateShift from './views/CreateShift.vue'
import WorkerProfile from './views/workerProfile.vue'

const routes = [
  {
    path: '/login', // <-- The URL for your page
    name: 'login',
    component: Login// <-- The component to show
  },
  
  {
    path: '/signup',
    name: '/signup',
    component: SignUp
  },

  {
    path: '/home',
    name: '/home',
    component: Home
  },
  {
    path: '/calendar',
    name: '/calendar',
    component: Calendar
  },
  {
    path: '/manager',
    name: '/ManagerHome',
    component: ManagerHome
  },
  {
    path: '/manager/staff',
    name: '/StaffDirectory',
    component: StaffDirectory
  },
  {
    path: '/manager/applicants',
    name: '/ApplicantReview',
    component: ApplicantReview
  },
  {
    path: '/worker/marketplace',
    name: 'Marketplace',
    component: MarketPlaceFeed
  },
  {
    path: '/manager/shift/:id?',
    name: 'CreateShift',
    component: CreateShift
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