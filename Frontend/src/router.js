import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/login.vue' 

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login', // <-- The URL for your page
    name: 'login',
    component: LoginView // <-- The component to show
  }
  // ... other routes might be here
]
