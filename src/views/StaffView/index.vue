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

export default {
    name: "staff-index-page",
    components: {
        StaffLayout,
        UserStatistics,
        ResearchStatistics,
    },
    data() {
        return {};
    },
};
</script>

<style scoped></style>