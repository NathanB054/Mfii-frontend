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
  props: {
    chartType: {
      type: String,
      required: true,
      validator: value => ['patent', 'pettyPatent', 'designPatent', 'copyright'].includes(value)
    }
  },
  setup(props) {
    const pieChart = ref(null);

    // Define base colors for each chart type
    const baseColors = {
      patent: '#F4E4B7',       // PMS 127 (เหลืองอ่อน)
      pettyPatent: '#F2C94C',  // PMS 129 (เหลืองเข้มสดใสกว่า)
      designPatent: '#EFAE33', // PMS 130 (เหลืองทอง)
      copyright: '#E38A1B'     // PMS 137 (ส้มเข้ม)
    };

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
        const response = await api.get('/getsResearch/all/all/all/all');
        const data = response.data.result;
        
        // Filter data based on chartType
        const filteredData = data.filter(item => {
          switch(props.chartType) {
            case 'patent':
              return item.intelProp === 'สิทธิบัตรการประดิษฐ์';
            case 'pettyPatent':
              return item.intelProp === 'อนุสิทธิบัตร';
            case 'designPatent': 
              return item.intelProp === 'สิทธิบัตรออกแบบ';
            case 'copyright':
              return item.intelProp === 'ลิขสิทธิ์' || item.intelProp === 'ลิขสิทธิ์-โปรแกรมคอมพิวเตอร์';
            default:
              return false;
          }
        });

        // Group data by techReadiness
        const techReadinessGroups = {
          'ระดับการทดลอง': 0,
          'ระดับต้นแบบ': 0,
          'ระดับถ่ายทอด': 0
        };

        filteredData.forEach(item => {
          if (techReadinessGroups[item.techReadiness] !== undefined) {
            techReadinessGroups[item.techReadiness]++;
          }
        });

        // Create Chart
        if (pieChart.value) {
          const ctx = pieChart.value.getContext('2d');
          new Chart(ctx, {
            type: 'pie',
            data: {
              labels: Object.keys(techReadinessGroups),
              datasets: [{
                data: Object.values(techReadinessGroups),
                backgroundColor: generateShades(baseColors[props.chartType]),
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