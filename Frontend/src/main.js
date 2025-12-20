// main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <-- IMPORTANT: Import the router

const app = createApp(App)

app.use(router) // <-- CRITICAL: Tell the app to use the router

app.mount('#app')

