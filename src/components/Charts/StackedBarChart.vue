<template>
  <div class="chart-container">
    <canvas ref="stackedBarChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '@/stores/axios-config';

Chart.register(...registerables);

export default {
  name: 'StackedBarChart',
  setup() {
    const stackedBarChart = ref(null);

    const colors = {
      patent: '#F4E4B7',          // PMS 127 (เหลืองอ่อน)
      pettyPatent: '#F2C94C',     // PMS 129 (เหลืองเข้มสดใสกว่า)
      designPatent: '#EFB64C',    // PMS 130 (เหลืองทอง)
      copyrightSoftware: '#F68D2E', // PMS 144 (ส้มกลาง)
      copyrightOther: '#E38A1B',  // PMS 137 (ส้มเข้ม)
      trademark: '#F47D20'        // PMS 150 (ส้มสดใส)
    };

    const allMajors = [
      'สำนักวิชาศิลปศาสตร์',
      'สำนักวิชาวิทยาศาสตร์',
      'สำนักวิชาการจัดการ',
      'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์',
      'สำนักวิชาอุตสาหกรรมเกษตร',
      'สำนักวิชานิติศาสตร์',
      'สำนักวิชาวิทยาศาสตร์เครื่องสำอาง',
      'สำนักวิชาวิทยาศาสตร์สุขภาพ',
      'สำนักวิชาพยาบาลศาสตร์',
      'สำนักวิชาเวชศาสตร์ชะลอวัยและฟื้นฟูสุขภาพ',
      'สำนักวิชาแพทยศาสตร์',
      'สำนักวิชาทันตแพทยศาสตร์',
      'สำนักวิชานวัตกรรมสังคม',
      'สำนักวิชาจีนวิทยา',
      'สำนักวิชาการแพทย์บูรณาการ',
      'ศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี',
      'สถาบันชาและกาแฟ',
      'ศูนย์นวัตกรรมสมุนไพรครบวงจร',
      'ศูนย์ความเป็นเลิศทางด้านการวิจัยเชื้อรา',
      'ศูนย์ความเป็นเลิศด้านนวัตกรรมผลิตภัณฑ์ธรรมชาติ',
      'ศูนย์ภาษาและวัฒนธรรมจีนสิรินธร',
      'สถาบันนวัตกรรมการเรียนรู้',
      'โรงพยาบาลมหาวิทยาลัยแม่ฟ้าหลวง',
      'อื่นๆ'
    ];

    const fetchAndCreateChart = async () => {
      try {
        const response = await api.get('/countIP');
        const data = response.data.result;

        console.log('Fetched data:', data); // Log fetched data for debugging

        // Extract majors from the fetched data
        const fetchedMajors = [...new Set(data.map(item => item.beLongTo))];

        // Merge fetched majors with all possible majors
        const majors = [...new Set([...allMajors, ...fetchedMajors])];

        console.log('Majors:', majors); // Log majors for debugging

        const datasets = [
          {
            label: 'สิทธิบัตรการประดิษฐ์',
            data: majors.map(major => {
              const count = data.find(item => item.beLongTo === major)?.ipTypeCounts.find(ip => ip.ipType === 'สิทธิบัตรการประดิษฐ์')?.count || 0;
              console.log(`Count for สิทธิบัตรการประดิษฐ์ in ${major}:`, count);
              return count;
            }),
            backgroundColor: colors.patent
          },
          {
            label: 'อนุสิทธิบัตร',
            data: majors.map(major => {
              const count = data.find(item => item.beLongTo === major)?.ipTypeCounts.find(ip => ip.ipType === 'อนุสิทธิบัตร')?.count || 0;
              console.log(`Count for อนุสิทธิบัตร in ${major}:`, count);
              return count;
            }),
            backgroundColor: colors.pettyPatent
          },
          {
            label: 'สิทธิบัตรออกแบบผลิตภัณฑ์',
            data: majors.map(major => {
              const count = data.find(item => item.beLongTo === major)?.ipTypeCounts.find(ip => ip.ipType === 'สิทธิบัตรออกแบบผลิตภัณฑ์')?.count || 0;
              console.log(`Count for สิทธิบัตรออกแบบผลิตภัณฑ์ in ${major}:`, count);
              return count;
            }),
            backgroundColor: colors.designPatent
          },
          {
            label: 'ลิขสิทธิ์(โปรแกรมคอมพิวเตอร์)',
            data: majors.map(major => {
              const count = data.find(item => item.beLongTo === major)?.ipTypeCounts.find(ip => ip.ipType === 'ลิขสิทธิ์(โปรแกรมคอมพิวเตอร์)')?.count || 0;
              console.log(`Count for ลิขสิทธิ์(โปรแกรมคอมพิวเตอร์) in ${major}:`, count);
              return count;
            }),
            backgroundColor: colors.copyrightSoftware
          },
          {
            label: 'ลิขสิทธิ์อื่นๆ',
            data: majors.map(major => {
              const count = data.find(item => item.beLongTo === major)?.ipTypeCounts.find(ip => ip.ipType === 'ลิขสิทธิ์')?.count || 0;
              console.log(`Count for ลิขสิทธิ์ in ${major}:`, count);
              return count;
            }),
            backgroundColor: colors.copyrightOther
          },
          {
            label: 'เครื่องหมายการค้า',
            data: majors.map(major => {
              const count = data.find(item => item.beLongTo === major)?.ipTypeCounts.find(ip => ip.ipType === 'เครื่องหมายการค้า')?.count || 0;
              console.log(`Count for เครื่องหมายการค้า in ${major}:`, count);
              return count;
            }),
            backgroundColor: colors.trademark
          }
        ];

        console.log('Datasets:', datasets); // Log datasets for debugging

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
                    label: function (context) {
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
  height: 100vh;
  width: 100%;
  padding: 20px;
}
</style>