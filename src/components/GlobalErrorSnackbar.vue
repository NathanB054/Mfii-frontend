<template>
  <v-snackbar
    v-model="errorStore.isVisible"
    :color="errorStore.color"
    location="middle"
    :timeout="errorStore.timeout"
  >
    <div class="d-flex align-center">
      <v-icon 
        :icon="errorStore.icon" 
        class="mr-2"
      ></v-icon>
      {{ errorStore.message }}
    </div>

    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="errorStore.hide()"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useErrorStore } from '@/stores/errorStore'

const errorStore = useErrorStore()
</script>