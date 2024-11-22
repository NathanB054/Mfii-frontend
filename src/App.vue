<script setup>
import { RouterView } from 'vue-router';
import NavTop from './components/Nav/NavTop.vue';
import CookieConsent from './components/CookieConsent.vue';
import NavFooter from './components/Nav/NavFooter.vue';
import GlobalErrorSnackbar from './components/GlobalErrorSnackbar.vue';
</script>

<template>


   <!-- Content will be rendered here -->
   <v-app>
      <GlobalErrorSnackbar />
      <!-- Conditionally render the Navbar for User pages only -->
      <NavTop v-if="$route.meta.showNavTop" />

      <RouterView />
      <cookie-consent />

      <!-- Footer -->
      <NavFooter />
   </v-app>

</template>

<style scoped></style>
