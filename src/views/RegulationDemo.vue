<template>
  <v-container>
    <v-row class="py-8">
      <v-col cols="12">
        <h1 class="text-center text-xl font-bold">ระเบียบต่างๆ</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(item, index) in regulations" :key="item._id" cols="12" md="4" class="mb-4">
        <v-card>
          <v-card-title>{{ item.regulationName }}</v-card-title>
          <!-- <v-card-subtitle>{{ item.description }}</v-card-subtitle> -->
          <v-card-actions>
            <v-btn color="primary" @click="downloadPdf(index)">ดาวน์โหลด PDF</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/stores/axios-config';
import { useErrorStore } from '@/stores/errorStore';
const baseURL = import.meta.env.VITE_BASE_URL;

export default {
  name: "regulation-page",
  props: ["id"],
  data() {
    return {
      regulations: null, // เก็บข้อมูลจาก API
    };
  },

  methods: {
    async fetchRegulations() {
      try {
        const response = await api.get("/getsRegulation");// เรียก API
        this.regulations = response.data.result; // สมมติว่า API ส่งข้อมูลในรูปแบบ array
        // console.log(this.regulations);
        // console.log(
        //   this.regulations.map(item => item.filePath)
        // );
      } catch (error) {
        console.error("Failed to fetch regulations:", error);
      }
    },
    downloadPdf(index) {
      const errorStore = useErrorStore();

      // ดึง object จาก array ด้วย index
      const regulation = this.regulations[index];

      if (regulation.filePath && regulation.filePath.length > 0) {
        // ค้นหาไฟล์ PDF
        const pdfPath = regulation.filePath.find(path => path.toLowerCase().endsWith('.pdf'));

        console.log(pdfPath);

        if (pdfPath) {
          // แก้ไข path เพื่อรองรับ backslash
          const sanitizedPath = pdfPath.replace(/\\/g, '/');
          window.open(`${baseURL}/${sanitizedPath}`, '_blank');
        } else {
          // หากไม่มีไฟล์ PDF
          errorStore.show("ไม่มีไฟล์ PDF", {
            color: 'warning',
            icon: 'mdi-alert-circle',
            timeout: 5000,
          });
        }
      } else {
        // กรณีไม่มี filePath หรือข้อมูลไม่สมบูรณ์
        errorStore.show("ไม่สามารถดาวน์โหลดได้", {
          color: 'error',
          icon: 'mdi-alert-circle',
          timeout: 5000,
        });
      }
    },
  },
  mounted() {
    this.fetchRegulations(); // เรียก API เมื่อ component ถูก mount
  },
};
</script>

<style scoped>
/* ใช้ Tailwind CSS และ Vuetify ในการออกแบบ */
</style>
