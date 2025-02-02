<template>
  <v-container class="bg-white rounded-md shadow-md p-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Quick Menu Section (Left Side) -->
      <div>
        <h2
          class="text-lg md:text-lg font-bold mb-4 text-white bg-customPurple p-3 rounded-md text-center uppercase shadow"
        >
          Quick Menu
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <v-card
            v-for="(item, index) in menuItems"
            :key="index"
            :to="{ path: item.to, query: { data: item.data } }"
            class="quickMenu p-6 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer rounded-lg flex flex-col items-center justify-center bg-gray-50 w-full h-full"
          >
            <div
              class="flex flex-col items-center justify-center h-full w-full py-2"
            >
              <img
                :src="item.icon"
                alt="icon"
                class="mb-3 mt-3"
                style="width: 60px; height: 60px"
              />
              <p class="text-base md:text-lg mb-3">
                {{ item.title }}
              </p>
            </div>
          </v-card>
        </div>
      </div>

      <!-- Statistics Section (Right Side) -->
      <div>
        <h2
          class="text-lg md:text-lg font-bold mb-4 text-white bg-customPurple p-3 rounded-md text-center uppercase shadow"
        >
          สถิติการยื่นคำขอฯ มหาวิทยาลัยแม่ฟ้าหลวง
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <v-card
            v-for="(stat, index) in stats"
            :key="index"
            class="p-6 rounded-lg flex flex-col items-center justify-center bg-gray-50 w-full h-full"
          >
            <div
              class="flex flex-col items-center justify-center h-full w-full py-5"
            >
              <img
                :src="stat.icon"
                alt="icon"
                class="mb-3 mt-3"
                style="width: 60px; height: 60px"
              />
              <p class="text-base md:text-lg">{{ stat.title }}</p>
              <p class="text-base md:text-xl mb-3">{{ stat.value }}</p>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/stores/axios-config";
import trainingIcon from "@/assets/icons/training.png";
import intellectual from "@/assets/icons/intellectual.png";
import design from "@/assets/icons/design.png";
import copyright from "@/assets/icons/copyright.png";
import trademarks from "@/assets/icons/trademarks.png";
import research from "@/assets/icons/research.png";
import patent from "@/assets/icons/patent.png";

const menuItems = [
  {
    title: "การขอใช้บริการจัดอบรม/บรรยายหัวข้อทรัพย์สินทางปัญญา มฟล.",
    to: "/services/ipa",
    icon: trainingIcon,
    data: "การขอใช้บริการจัดอบรม/บรรยายหัวข้อทรัพย์สินทางปัญญา มฟล.",
  },
  {
    title: "การยื่นจดสิทธิบัตรการ ประดิษฐ์ / อนุสิทธิบัตร",
    to: "/services/ipa",
    icon: intellectual,
    data: "สิทธิบัตรการประดิษฐ์ หรือ อนุสิทธิบัตร",
  },
  {
    title: "การยื่นจดสิทธิบัตรการ ออกแบบผลิตภัณฑ์",
    to: "/services/ipa",
    icon: design,
    data: "สิทธิบัตรการออกแบบผลิตภัณฑ์",
  },
  {
    title: "การยื่นคำขอแจ้งข้อมูล ลิขสิทธิ์",
    to: "/services/ipa",
    icon: copyright,
    data: "ลิขสิทธิ์",
  },
  {
    title: "การยื่นจด เครื่องหมายการค้า",
    to: "/services/ipa",
    icon: trademarks,
    data: "เครื่องหมายการค้า",
  },
  {
    title: "ระบบสืบค้นฐานข้อมูล ทรัพย์สินทางปัญญา มฟล.",
    to: "/services/ipp",
    icon: research,
  },
];

//  ref จะเก็บข้อมูลไว้ใน value property
const stats = ref([
  {
    title: "สิทธิบัตรการประดิษฐ์",
    value: 0,
    icon: intellectual,
  },
  { title: "อนุสิทธิบัตร", value: 0, icon: patent },
  {
    title: "สิทธิบัตรการออกแบบ",
    value: 0,
    icon: design,
  },
  { title: "ลิขสิทธิ์", value: 0, icon: copyright },
  { title: "เครื่องหมายการค้า", value: 0, icon: trademarks },
]);

const fetchResearchData = async () => {
  try {
    const response = await api.get("/getIPFirstPage");
    const data = response.data.result;
    console.log(data);

    // Reset counts
    const counts = {
      สิทธิบัตรการประดิษฐ์: 0,
      อนุสิทธิบัตร: 0,
      สิทธิบัตรการออกแบบ: 0,
      ลิขสิทธิ์: 0,
      เครื่องหมายการค้า: 0,
    };

    // Map counts from response data
    data.forEach((item) => {
      if (counts[item.ipType] !== undefined) {
        counts[item.ipType] = item.count;
      }
    });

    // Update stats array with new counts
    stats.value = stats.value.map(stat => ({
      ...stat,
      value: counts[stat.title] || 0
    }));
  } catch (error) {
    console.error("Error fetching research data:", error);
  }
};

onMounted(() => {
  fetchResearchData();
});
</script>

<style scoped>
.quickMenu {
  transition: all 0.3s ease-in-out;
}

.quickMenu:hover {
  background-color: #ebf8ff;
  /* Tailwind bg-blue-50 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  /* Tailwind shadow-md */
  transform: scale(1.05);
}

h2 {
  text-align: center;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
