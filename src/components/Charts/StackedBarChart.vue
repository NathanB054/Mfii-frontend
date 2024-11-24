<template>
  <div class="chart-container">
    <canvas ref="stackedBarChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '@/stores/axios-config';
import { prototype } from 'postcss/lib/previous-map';

Chart.register(...registerables);

export default {
  name: 'StackedBarChart',
  setup() {
    const stackedBarChart = ref(null);

    const colors = {
      patent: '#2B3349',
      pettyPatent: '#294A8F',
      designPatent: '#9FB7E3',
      copyright: '#D8D0E7',
      copyrightSoftware: '#214E63',
      researchResult: '#407D7F',
      prototype: '#7BA3AC'
    };

    const fetchAndCreateChart = async () => {
      try {
        const response = await api.get('/getsResearch/all/all/all/all');
        const data = response.data.result;

        // Group by major
        const majors = [...new Set(data.map(item => item.major))];

        const datasets = [
          {
            label: 'สิทธิบัตรการประดิษฐ์',
            data: majors.map(major => 
              data.filter(item => 
                item.major === major && 
                item.intelProp === 'สิทธิบัตรการประดิษฐ์'
              ).length
            ),
            backgroundColor: colors.patent
          },
          {
            label: 'อนุสิทธิบัตร',
            data: majors.map(major => 
              data.filter(item => 
                item.major === major && 
                item.intelProp === 'อนุสิทธิบัตร'
              ).length
            ),
            backgroundColor: colors.pettyPatent
          },
          {
            label: 'สิทธิบัตรออกแบบ',
            data: majors.map(major => 
              data.filter(item => 
                item.major === major && 
                item.intelProp === 'สิทธิบัตรออกแบบ'
              ).length
            ),
            backgroundColor: colors.designPatent
          },
          {
            label: 'ลิขสิทธิ์',
            data: majors.map(major => 
              data.filter(item => 
                item.major === major && 
                item.intelProp === 'ลิขสิทธิ์'
              ).length
            ),
            backgroundColor: colors.copyright
          },
          {
            label: 'ลิขสิทธิ์-โปรแกรมคอมพิวเตอร์',
            data: majors.map(major => 
              data.filter(item => 
                item.major === major && 
                item.intelProp === 'ลิขสิทธิ์-โปรแกรมคอมพิวเตอร์'
              ).length
            ),
            backgroundColor: colors.copyrightSoftware
          },
          {
            label: 'ผลงานวิจัย',
            data: majors.map(major => 
              data.filter(item => 
                item.major === major && 
                item.intelProp === 'ผลงานวิจัย'
              ).length
            ),
            backgroundColor: colors.researchResult
          },
          {
            label: 'ต้นแบบ',
            data: majors.map(major => 
              data.filter(item => 
                item.major === major && 
                item.intelProp === 'ต้นแบบ'
              ).length
            ),
            backgroundColor: colors.prototype
          }
        ];

        if (stackedBarChart.value) {
          new Chart(stackedBarChart.value, {
            type: 'bar',
            data: {
              labels: majors,
              datasets: datasets
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                  ticks: {
                    font: { size: 12 }
                  }
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: { precision: 0 }
                }
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    font: { size: 12 },
                    padding: 20
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.dataset.label}: ${context.raw} รายการ`;
                    }
                  }
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(() => {
      fetchAndCreateChart();
    });

    return {
      stackedBarChart
    };
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 60vh;
  width: 100%;
  padding: 20px;
}
</style>