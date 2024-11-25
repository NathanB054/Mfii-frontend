<template>
    <admin-layout>
      <!-- Content for admin page goes here -->
      <v-container class="font-noto-sans-thai">
        
        <UserStatistics />
        <ResearchStatistics />
  
      </v-container>
    </admin-layout>
  </template>
  
  <script>
  import AdminLayout from "@/layouts/admin.vue";
  import UserStatistics from '@/views/UserStatistics.vue'
  import ResearchStatistics from '@/views/ResearchStatistics.vue' 
  import { useAuthStore } from "@/stores/auth";
  import { onMounted } from "vue";
  const authStore = useAuthStore();
  export default {
    name: "Index Admin Page",
    components: {
      AdminLayout,
      UserStatistics,
      ResearchStatistics,
    },
    setup() {
    onMounted(() => {
      if (!authStore.user) {
        authStore.fetchUser(); 
      }
    });
  },
  };
  
  </script>
  
  <style scoped></style>