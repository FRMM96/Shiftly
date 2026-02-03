<!-- App.vue -->

<template>
    <div id="app">
        <Navbar v-if="!isManagerRoute"/>

        <router-view />

    </div>
</template>

<script>
import Navbar from './components/shared/navbar.vue'

export default {
    name: 'App',
    components: {
        Navbar
    }, 
    computed: {
        isManagerRoute(){
            // Check if the current URL starts with /manager
            return this.$route.path.startsWith('/manager')
        }
    }
}
</script>

<style>
/* Global styles can go here */
body { margin: 0; padding: 0; box-sizing: border-box; }
</style>