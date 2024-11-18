<script setup>
import { RouterView } from 'vue-router';
import NavTop from './components/Nav/NavTop.vue';
</script>

<template>
  <!-- Conditionally render the Navbar for User pages only -->
  <NavTop v-if="$route.meta.showNavTop" />
  
  <!-- Content will be rendered here -->
   <v-app>
    <RouterView />
   </v-app>

</template>

<style scoped></style>
