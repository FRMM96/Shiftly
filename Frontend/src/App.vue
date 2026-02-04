<!-- App.vue -->

<template>
  <div id="app">
    <Navbar v-if="!shouldHideNavbar" />

    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/shared/navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  computed: {
    shouldHideNavbar() {
      // Check if the current URL starts with /manager or /worker
      return (
        this.$route.path.startsWith("/manager") ||
        this.$route.path.startsWith("/worker")
      );
    },
  },
};
</script>

<style>
/* Global styles can go here */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
