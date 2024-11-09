<script setup>
import { RouterView, useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import NavTop from './components/Nav/NavTop.vue';

const route = useRoute();

// Compute `showNavbar` to hide the navbar if the route starts with '/admin'
const showNavbar = computed(() => !route.path.startsWith('/admin'));

// Watch for route changes to re-evaluate `showNavbar` when navigating
watch(
  () => route.path,
  (newPath) => {
    showNavbar.value = !newPath.startsWith('/admin');
  }
);
</script>

<template>
  <!-- Conditionally render the Navbar for User pages only -->
  <NavTop v-if="showNavbar" />
  
  <!-- Content will be rendered here -->
  <RouterView />
</template>

<style scoped></style>
