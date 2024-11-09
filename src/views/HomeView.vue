<script setup>

</script>

<template>
  <PieChart :chart-data="data" :options="options" />
</template>

<script>
import { defineComponent } from 'vue'
import { PieChart } from 'vue-chart-3'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement)

export default defineComponent({
  name: 'PieChart',
  components: { PieChart },
  data() {
    return {
      data: {
        labels: ['Category A', 'Category B', 'Category C'],
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            data: [40, 30, 30],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    }
  },
})
</script>

<style scoped>
/* Optional styles for customizing the chart container */
</style>
