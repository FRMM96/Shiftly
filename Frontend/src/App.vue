<!-- App.vue -->

<template>
  <div id="app">
    <router-view />
    <AppToast />
  </div>
</template>

<script>
import AppToast from './components/shared/AppToast.vue'

export default {
  name: "App",
  components: { AppToast }
};
</script>

<style>
/* Global styles can go here */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  /* Prevent text selection on UI elements */
  user-select: none;
  -webkit-user-select: none;

  /* Disable tap highlight color on mobile */
  -webkit-tap-highlight-color: transparent;

  /* Prevent overscroll bounce (rubber-banding) */
  overscroll-behavior-y: none;
}

/* Re-enable text selection ONLY for inputs and textareas */
input, textarea {
  user-select: auto;
  -webkit-user-select: auto;
}
</style>
