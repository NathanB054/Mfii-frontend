<script setup>
import { RouterView } from 'vue-router';
import NavTop from './components/Nav/NavTop.vue';
import CookieConsent from './components/CookieConsent.vue';
import NavFooter from './components/Nav/NavFooter.vue';
</script>

<template>
  <!-- Conditionally render the Navbar for User pages only -->
  <NavTop v-if="$route.meta.showNavTop" />
  
  <!-- Content will be rendered here -->
   <v-app>
    <RouterView />
    <cookie-consent />
   </v-app>

    <RouterView />


   <!-- Footer -->
   <NavFooter/>
</template>

<style scoped></style>
