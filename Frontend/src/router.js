import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/login.vue' 

const routes = [
  {
    path: '/', // <-- The URL for your page
    name: 'login',
    component: Login// <-- The component to show
  }
  // ... other routes might be here
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router