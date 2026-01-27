import { createApp } from 'vue'
import { createPinia } from 'pinia' // <--- Essential
import { createBootstrap } from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'

// CSS Imports
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js"

const app = createApp(App)

app.use(createPinia()) // <--- Must be before mount
app.use(createBootstrap()) // <--- Fixed syntax with ()
app.use(router)

app.mount('#app')