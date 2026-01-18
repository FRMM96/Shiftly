import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/login.vue' 
import SignUp from './views/signUp.vue'
import Home from './views/Home.vue'
import Calendar from './views/calendar.vue'
import ManagerHome from './views/ManagerHome.vue'

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
    path: '/Home',
    name: '/Home',
    component: Home
  },
  {
    path: '/calendar',
    name: '/calendar',
    component: Calendar
  },
  {
    path: '/ManagerHome',
    name: '/ManagerHome',
    component: ManagerHome
  }

]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router  