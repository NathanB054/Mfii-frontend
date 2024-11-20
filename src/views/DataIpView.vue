<template>
    <main>
        <div>
            <h1 class="piechart-title">
                ประเภทของ IP
            </h1>
        </div>
        <div class="piechart-container">
            <div class="pie-charts">
                <div class="pie-chart-wrapper">
                    <PieChart chart-type="patent"/>
                    <div class="chart-label">สิทธิบัตรการประดิษฐ์</div>
                </div>
                <div class="pie-chart-wrapper">
                    <PieChart chart-type="pettyPatent"/>
                    <div class="chart-label">อนุสิทธิบัตร</div>
                </div>
                <div class="pie-chart-wrapper">
                    <PieChart chart-type="designPatent"/>
                    <div class="chart-label">สิทธิบัตรการออกแบบผลิตภัณฑ์</div>
                </div>
                <div class="pie-chart-wrapper">
                    <PieChart chart-type="copyright"/>
                    <div class="chart-label">ลิขสิทธิ์</div>
                </div>
            </div>
        </div>

        <div>
            <h1 class="stackedbar-title">
                สถานะการขอรับความคุ้มครอง
            </h1>
        </div>
        <div class="stackedbar-container">
            <div class="stacked-bar-chart">
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
        // Return variables to make them accessible in the template
        return { user };
    },
};
</script>

<style scoped>
.piechart-container, .stackedbar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.piechart-title {
    text-align: start;
    font-size: 24px;
    color: #333;
    margin-top: 50px;
    margin-bottom: 30px;
    padding-left: 80px;
}

.stackedbar-title {
    text-align: start;
    font-size: 24px;
    color: #333;
    margin-top: 300px;
    padding-left: 80px;
}

.pie-charts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    width: 90%;
    justify-items: center;
}

.pie-chart-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 150px;
    /* Adjust the width as needed */
    height: 100px;
    /* Adjust the height as needed */
}

.chart-label {
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
    color: #333;
}

.stacked-bar-chart {
    margin-top: 30px;
    /* Increase the margin-top to avoid overlapping */
    width: 50%;
}
</style>