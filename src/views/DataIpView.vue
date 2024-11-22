<template>
    <main class="px-16 sm:px-6 lg:px-8">
        <div>
            <h1 class="text-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans text-gray-800 mt-12 mb-8">
                ประเภทของ IP
            </h1>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            <!-- Chart 1 -->
            <div class="w-full max-w-xs mx-auto p-4">
                <PieChart chart-type="patent" />
                <div class="text-center mt-2 text-sm text-gray-700">สิทธิบัตรการประดิษฐ์</div>
            </div>

            <!-- Chart 2 -->
            <div class="w-full max-w-xs mx-auto p-4">
                <PieChart chart-type="pettyPatent" />
                <div class="text-center mt-2 text-sm text-gray-700">อนุสิทธิบัตร</div>
            </div>

            <!-- Chart 3 -->
            <div class="w-full max-w-xs mx-auto p-4">
                <PieChart chart-type="designPatent" />
                <div class="text-center mt-2 text-sm text-gray-700">สิทธิบัตรการออกแบบผลิตภัณฑ์</div>
            </div>

            <!-- Chart 4 -->
            <div class="w-full max-w-xs mx-auto p-4">
                <PieChart chart-type="copyright" />
                <div class="text-center mt-2 text-sm text-gray-700">ลิขสิทธิ์</div>
            </div>
        </div>

        <!-- Protection Status Section -->
        <div>
            <h1 class="text-start text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans text-gray-800 mt-24">
                สถานะการขอรับความคุ้มครอง
            </h1>
        </div>

        <div class="flex justify-center mt-8">
            <div class="w-full max-w-4xl">
                <StackedBarChart />
            </div>
        </div>
    </main>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from "@/stores/auth";
import PieChart from '@/components/Charts/PieChart.vue';
import StackedBarChart from '@/components/Charts/StackedBarChart.vue';

export default {
    components: {
        PieChart,
        StackedBarChart,
    },

    setup() {
        const authStore = useAuthStore();
        const user = computed(() => authStore.user); // Access the user data
        return { user };
    },
};
</script>
