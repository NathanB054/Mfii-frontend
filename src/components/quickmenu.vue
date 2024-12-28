<template>
  <v-container class="bg-white rounded-md shadow-md p-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Quick Menu Section (Left Side) -->
      <div>
        <h2 class="text-lg md:text-xl font-bold mb-4 text-white bg-blue-700 p-3 rounded-md text-center uppercase shadow">
          Quick Menu
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <v-card

            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.to"
            class="p-6 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer rounded-lg flex flex-col items-center justify-center bg-gray-50 w-full h-full"
          >
            <v-icon
              size="50"
              :style="{ color: item.color }"
              class="mb-3 mt-3"
            >
              {{ item.icon }}
            </v-icon>
            <p class="text-base md:text-lg font-medium mb-3">{{ item.title }}</p>
          </v-card>
        </div>
      </div>
      
      <!-- Statistics Section (Right Side) -->
      <div>
        <h2 class="text-lg md:text-xl font-bold mb-4 text-white bg-blue-700 p-3 rounded-md text-center uppercase shadow">
          สถิติการยื่นคำขอฯ มหาวิทยาลัยแม่ฟ้าหลวง
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <v-card
            v-for="(stat, index) in stats"
            :key="index"
            class="p-6 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer rounded-lg flex flex-col items-center justify-center bg-gray-50 w-full h-full"
          >
            <v-icon
              size="50"
              :style="{ color: stat.color }"
              class="mb-3 mt-3"
            >
              {{ stat.icon }}
            </v-icon>
            <p class="font-bold text-sm md:text-base">{{ stat.title }}</p>
            <p class="text-lg md:text-xl font-extrabold mb-3">{{ stat.value }}</p>
          </v-card>
        </div>
      </div>
      
    </div>
  </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import api from '@/stores/axios-config';

const menuItems = [
  { title: 'การขอใช้บริการจัดอบรม/บรรยายหัวข้อทรัพย์สินทางปัญญา มฟล.', to: '/research-service', icon: 'mdi-book-open', color: '#1E88E5' },
  { title: 'การยื่นจดสิทธิบัตรการ ประดิษฐ์ / อนุสิทธิบัตร', to: '/patent', icon: 'mdi-lightbulb', color: '#43A047' },
  { title: 'การยื่นจดสิทธิบัตรการ ออกแบบผลิตภัณฑ์', to: '/design-patent', icon: 'mdi-format-paint', color: '#FB8C00' },
  { title: 'การยื่นคำขอแจ้งข้อมูล ลิขสิทธิ์', to: '/copyright', icon: 'mdi-library', color: '#8BC34A' },
  { title: 'การยื่นจด เครื่องหมายการค้า', to: '/trademark', icon: 'mdi-tag', color: '#FF5722' },
  { title: 'ระบบสืบค้นฐานข้อมูล ทรัพย์สินทางปัญญา มฟล.', to:'/services/ipp', icon: 'mdi-database-search', color: '#9C27B0' }
];

//  ref จะเก็บข้อมูลไว้ใน value property
const stats = ref([
  { title: 'สิทธิบัตรการประดิษฐ์', value: 0, icon: 'mdi-wrench-cog', color: '#1E88E5' },
  { title: 'อนุสิทธิบัตร', value: 0, icon: 'mdi-lightbulb', color: '#43A047' },
  { title: 'สิทธิบัตรการออกแบบ', value: 0, icon: 'mdi-format-paint', color: '#FB8C00' },
  { title: 'ลิขสิทธิ์', value: 0, icon: 'mdi-library', color: '#8BC34A' },
  { title: 'เครื่องหมายการค้า', value: 0, icon: 'mdi-tag', color: '#FF5722' }
]);

const fetchResearchData = async () => {
  try {
    const response = await api.get('/getsResearch/all/all/all/all');
    const data = response.data.result;
    
    // คำนวณจำนวนของแต่ละประเภท
    const counts = {
      'สิทธิบัตรการประดิษฐ์': 0,
      'อนุสิทธิบัตร': 0,
      'สิทธิบัตรออกแบบ': 0,
      'ลิขสิทธิ์': 0,
      'เครื่องหมายการค้า': 0
    };

    data.forEach(item => {
      if (counts[item.intelProp] !== undefined) {
        counts[item.intelProp]++;
      }
    });

    // อัปเดต stats
    stats.value[0].value = counts['สิทธิบัตรการประดิษฐ์'];
    stats.value[1].value = counts['อนุสิทธิบัตร'];
    stats.value[2].value = counts['สิทธิบัตรออกแบบ'];
    stats.value[3].value = counts['ลิขสิทธิ์'];
    stats.value[4].value = counts['เครื่องหมายการค้า'];
    
  } catch (error) {
    console.error('Error fetching research data:', error);
  }
};

onMounted(() => {
  fetchResearchData();
});
</script>


<style scoped>
.v-card {
  transition: all 0.3s ease-in-out;
}

.v-card:hover {
  background-color: #ebf8ff; /* Tailwind bg-blue-50 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Tailwind shadow-md */
  transform: scale(1.05);
}

h2 {
  text-align: center;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
