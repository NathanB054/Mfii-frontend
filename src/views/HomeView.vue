<template>
  <main>
    <div class="flex justify-center items-center mt-5">
      <div class="w-[90%] bg-gray-200">
        <Carousel />
      </div>
    </div>
    <div>
      <quickmenu />
    </div>
    <div>
      <div v-if="user">
        <p>Welcome back, {{ user.firstName }} {{ user.lastName }}</p>
      </div>
      <div v-else>
        <p>User data is not available.</p>
      </div>
    </div>
  </main>
</template>

<script>
import Carousel from '../components/carousel.vue';
import quickmenu from '@/components/quickmenu.vue';
import { computed } from 'vue';
import { useAuthStore } from "@/stores/auth";

export default {
  components: {
    Carousel,
    quickmenu,
  },

  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user); // Access the user data
    // Return variables to make them accessible in the template
    return { user };
  },
};
</script>

<style scoped>
@import "../styles/index.css";
</style>