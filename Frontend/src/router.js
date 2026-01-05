import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/login.vue' 
import SignUp from './views/signUp.vue'

const routes = [
  {
    path: '/login', // <-- The URL for your page
    name: 'login',
    component: Login// <-- The component to show
  },
  // ... other routes might be here








{
  path: '/signup',
  name: '/signup',
  component: SignUp
}
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router