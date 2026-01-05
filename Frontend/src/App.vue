<!-- App.vue -->

<template>
    <div id="app">
        <Navbar />

        <router-view />

    </div>
</template>

<script>
import Navbar from './components/navbar.vue'

export default {
    name: 'App',
    components: {
        Navbar
    }
}
</script>

<style>
/* Global styles can go here */
</style>