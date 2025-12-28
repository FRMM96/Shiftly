import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/login.vue' 
import Home from './views/Home.vue' // 1. Import the new page
const routes = [
  {
    path: '/login', // <-- The URL for your page
    name: 'login',
    component: Login// <-- The component to show
  },
  {
    path: '/home',      // 2. Define the URL
    name: 'Home',
    component: Home
  }
  // ... other routes might be here
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router  