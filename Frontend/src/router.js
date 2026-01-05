import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/login.vue' 
import SignUp from './views/signUp.vue'
import Home from './views/Home.vue'
import Calendar from './views/calendar.vue'

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
  }

]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router  