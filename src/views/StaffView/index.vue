<template>
    <v-app>
        <v-main>
            <staff-layout>
                <!-- Content for staff page goes here -->
                <v-container class="font-noto-sans-thai">
                    <UserStatistics />
                    <ResearchStatistics />
                </v-container>
            </staff-layout>
        </v-main>
    </v-app>
</template>

<script>
import StaffLayout from "@/layouts/staff.vue";
import UserStatistics from "@/views/UserStatistics.vue";
import ResearchStatistics from "@/views/ResearchStatistics.vue";
import { useAuthStore } from "@/stores/auth";
import { computed, onMounted } from "vue";
const authStore = useAuthStore();
export default {
    name: "staff-index-page",
    components: {
        StaffLayout,
        UserStatistics,
        ResearchStatistics,
    },
    data() {
        return {

        };
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