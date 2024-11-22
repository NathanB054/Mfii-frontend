<template>
  <div>
    <canvas ref="pieChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

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

    // กำหนดสีพื้นฐานสำหรับแต่ละประเภท
    const baseColors = {
      patent: '#FF6B6B',       // สีแดง
      pettyPatent: '#4ECDC4',  // สีเขียว
      designPatent: '#45B7D1', // สีฟ้า
      copyright: '#96CEB4'     // สีเขียวอ่อน
    };

    // ฟังก์ชันสร้างเฉดสี
    const generateShades = (baseColor) => {
      return [
        `${baseColor}FF`, // 100% opacity
        `${baseColor}CC`, // 80% opacity
        `${baseColor}99`, // 60% opacity
        `${baseColor}66`, // 40% opacity
        `${baseColor}33`  // 20% opacity
      ];
    };

    onMounted(() => {
      const baseColor = baseColors[props.chartType];
      const shades = generateShades(baseColor);

      new Chart(pieChart.value, {
        type: 'pie',
        data: {
          labels: ['ยื่นคำขอ', 'อยู่ระหว่างตรวจสอบ', 'ได้รับการจดทะเบียน', 'ถูกปฏิเสธ', 'ยกเลิก/ถูกเพิกถอน'],
          datasets: [{
            data: [30, 25, 20, 15, 10], // ตัวอย่างข้อมูล
            backgroundColor: shades,
            borderColor: 'white',
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
    });

    return {
      pieChart
    };
  }
};
</script>