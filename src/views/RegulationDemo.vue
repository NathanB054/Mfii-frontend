<template>
    <v-container>
      <v-row class="py-8">
        <v-col cols="12">
          <h1 class="text-center text-xl font-bold">ระเบียบต่างๆ</h1>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col v-for="item in regulations" :key="item.id" cols="12" md="4" class="mb-4">
          <v-card>
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>{{ item.description }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="primary" @click="downloadPDF(item)">ดาวน์โหลด PDF</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        regulations: [
          { id: 1, title: "ระเบียบการจัดการ", description: "รายละเอียดของระเบียบการจัดการ" },
          { id: 2, title: "ระเบียบการเงิน", description: "รายละเอียดของระเบียบการเงิน" },
          { id: 3, title: "ระเบียบการศึกษา", description: "รายละเอียดของระเบียบการศึกษา" },
        ]
      };
    },
    methods: {
      downloadPDF(item) {
        const doc = new jsPDF();
        doc.text(20, 30, `ชื่อระเบียบ: ${item.title}`);
        doc.text(20, 40, `รายละเอียด: ${item.description}`);
        doc.save(`${item.title}.pdf`);
      }
    }
  };
  </script>
  
  <style scoped>
  /* ใช้ Tailwind CSS และ Vuetify ในการออกแบบ */
  </style>
  