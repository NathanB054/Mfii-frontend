<template>
  <div>
    <canvas ref="pieChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '@/stores/axios-config';

Chart.register(...registerables);

export default {
  name: 'PieChart',
  setup() {
    const pieChart = ref(null);

    // Define a single base color
    const baseColor = '#E38A1B'; // PMS 127 (เหลืองอ่อน)

    // Generate color shades
    const generateShades = (baseColor) => {
      return [
        `${baseColor}FF`, // 100% opacity
        `${baseColor}CC`, // 80% opacity
        `${baseColor}99`, // 60% opacity
        `${baseColor}66`, // 40% opacity
        `${baseColor}33`  // 20% opacity
      ];
    };

    const fetchResearchData = async () => {
      try {
        const response = await api.get('/getIPFirstPage');
        const data = response.data.result;

        // Process the data to get labels and counts
        const labels = data.map(item => item.ipType);
        const counts = data.map(item => item.count);

        // Create Chart
        if (pieChart.value) {
          const ctx = pieChart.value.getContext('2d');
          new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: counts,
                backgroundColor: generateShades(baseColor),
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    font: {
                      size: 12
                    }
                  }
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching research data:', error);
      }
    };

    onMounted(() => {
      fetchResearchData();
    });

    return {
      pieChart
    };
  }
};
</script>