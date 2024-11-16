<template>
    <v-container>
      <v-row class="relative d-flex justify-center align-center h-full">
        <!-- Left Side -->
        <v-col cols="12" md="5" class="border-r border-gray-300 d-flex justify-center align-center flex-column">
          <div class="text-subtitle-1 px-4 py-2 border border-orange-500 inline-block mb-4">Quick Menu</div>
          <v-row class="h-full justify-center">
            <v-col
              v-for="(route, index) in quickMenuRoutes"
              :key="index"
              cols="12"
              sm="4"
              class="d-flex justify-center align-center"
            >
              <v-card
                :to="route.to"
                class="rounded-lg bg-gray-100 w-full transition-all duration-200 hover:shadow-lg hover:bg-gray-200 cursor-pointer"
                height="140"
                variant="outlined"
              >
                <v-card-text class="d-flex flex-column items-center justify-center text-center h-full px-2">
                  <span class="text-red-700 font-medium text-sm">{{ route.name }}</span>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
  
        <!-- Divider for mobile -->
        <!-- <div class="hidden md:block absolute h-full w-px bg-gray-300 left-2/3 top-0"></div> -->
  
        <!-- Right Side -->
        <v-col cols="12" md="4" class="md:pl-8 d-flex justify-center align-center flex-column">
          <v-card 
            color="deep-orange" 
            class="mb-4 w-full"
          >
            <v-card-text class="text-center text-white font-medium py-4">
              สถิติการยื่นคำขอฯ มหาวิทยาลัยแม่ฟ้าหลวง
            </v-card-text>
          </v-card>
  
          <v-row class="mt-4 justify-center">
            <v-col
              v-for="(stat, index) in stats"
              :key="index"
              cols="6"
              class="d-flex justify-center align-center"
            >
              <v-card
                class="rounded-lg bg-gray-100 w-full"
                height="100"
                variant="outlined"
              >
                <v-card-text class="d-flex flex-column items-center justify-center text-center h-full">
                  <div class="text-sm md:text-base font-medium">{{ stat.name }}</div>
                  <div class="mt-2 text-gray-600 text-sm">({{ stat.count }})</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  const quickMenuRoutes = [
    {
      name: 'การขอใช้บริการวิจัย อบรม/บรรยาย/หรือ ทรัพย์สินทางปัญญา (สำหรับบุคลากร มทส.)',
      to: '/research-service',
    },
    {
      name: 'การยื่นจดสิทธิบัตรการ ประดิษฐ์ / อนุสิทธิบัตร',
      to: '/patent',
    },
    {
      name: 'การยื่นจดสิทธิบัตรการ ออกแบบผลิตภัณฑ์',
      to: '/design-patent',
    },
    {
      name: 'การยื่นคำขอแจ้งข้อมูล ลิขสิทธิ์',
      to: '/copyright',
    },
    {
      name: 'การยื่นจด เครื่องหมายการค้า',
      to: '/trademark',
    },
    {
      name: 'ระบบสืบค้นฐานข้อมูล ทรัพย์สินทางปัญญา มทส.',
      to: '/ip-search',
    },
  ]
  
  const stats = [
    {
      name: 'สิทธิบัตรการ ประดิษฐ์',
      count: 25
    },
    {
      name: 'อนุสิทธิบัตร',
      count: 30
    },
    {
      name: 'สิทธิบัตรการ ออกแบบ ผลิตภัณฑ์',
      count: 15
    },
    {
      name: 'ลิขสิทธิ์',
      count: 45
    },
    {
      name: 'เครื่องหมายการค้า',
      count: 20
    },
  ]
  </script>
  
  <style scoped>
  .v-card-text {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4; /* Add this line */
    -webkit-box-orient: vertical;
    box-orient: vertical; /* Add this line for compatibility */
    overflow: hidden;
  }
  </style>
  