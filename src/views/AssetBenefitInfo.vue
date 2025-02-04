<template>
  <LoadingOverlay :isLoading="isLoading" />
  <div v-if="!dataInfo" class="flex justify-center h-[50vh] w-full mt-5">
    ไม่พบข้อมูล
  </div>
  <div v-else-if="dataInfo" class="main-container">
    <!-- ด้านซ้าย: พื้นที่สำหรับภาพ -->
    <div class="left flex justify-center align-center">
      <div v-if="dataInfo.filePath" class="image-box">
        <img
          v-if="dataInfo.filePath[0].includes('image')"
          :src="`${baseUrl}/${dataInfo.filePath[0]}`"
          class="yes"
          alt="Infographic or Activity"
        />

        <iframe
          v-else
          :src="`${baseUrl}/${dataInfo.filePath[0]}#toolbar=0`"
          class="yes max-w-full rounded-xl mx-auto"
          frameborder="0"
          width="100%"
          height="100%"
        >
        </iframe>
      </div>
    </div>

    <!-- ด้านขวา: พื้นที่สำหรับ Text Box และข้อมูลติดต่อ -->
    <div v-if="dataInfo.information && dataInfo.servicesSubType" class="right">
      <div class="text-box">
        <p class="text-header">{{ dataInfo.servicesSubType }}</p>
        <p class="long-text">
          {{ dataInfo.information }}
        </p>
      </div>

      <!-- เรียกใช้ AssetAwareInfo -->
      <AssetAwareInfo />
    </div>
  </div>
</template>

<script>
import AssetAwareInfo from "../components/AssetAwareInfo.vue";
import imagePath from "../assets/images/800x500 test.jpeg";
import api from "@/stores/axios-config";
import { useErrorStore } from "@/stores/errorStore";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

const baseURL = import.meta.env.VITE_BASE_URL;

export default {
  name: "AwareAssetInfo",
  components: {
    AssetAwareInfo,
  },
  data() {
    return {
      isLoading: false,
      baseUrl: baseURL,
      imageSrc: imagePath,
      dataInfo: {},
    };
  },

  methods: {
    async fetchData() {
      this.isLoading = true;
      try {
        const res = await api.get(
          `/getsServices/การใช้ประโยชน์ผลงานทรัพย์สินทางปัญญา/all`
        );
        if (res.data) {
          this.dataInfo = res.data.result[0];
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error("Error fetching data:", error);
        throw error;
      }
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.left,
.right {
  width: 48%;
  /* กำหนดให้ทั้งสองคอลัมน์มีความกว้างเท่ากัน */
  box-sizing: border-box;
}

.image-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* ให้พื้นที่สำหรับรูปภาพเต็มที่ในคอลัมน์ซ้าย */
  height: 70vh;
  /* กำหนดความสูงเป็น 500px */
  text-align: center;
  overflow: hidden;
  /* ตัดส่วนเกินของรูปที่ไม่อยู่ในกรอบ */
}

.image-box img {
  width: 800px;
  /* กำหนดความกว้างเป็น 800px */
  height: 100%;
  /* กำหนดความสูงเป็น 500px */
  object-fit: contain;
  /* ทำให้รูปภาพเต็มกรอบโดยไม่เสียสัดส่วน */
}

.text-box {
  margin-bottom: 20px;
}

.text-header {
  font-weight: bold;
  margin-bottom: 10px;
}

.text-box textarea {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  resize: none;
}

.yes {
  width: 100%;
}
</style>
