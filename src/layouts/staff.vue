<template>
  <v-app>
    <!-- sidebar -->
    <v-navigation-drawer app style="position: fixed; height: 100vh; overflow-y: auto;" class="!bg-slate-100">
      <div class="d-flex justify-center mt-4 mb-4">
        <a href="/staff">
          <img src="../assets/images/mfu_logo.png" width="240px"></img>
        </a>
      </div>
      <div class="flex justify-center">
        <h1 style="font-size: 3rem; font-weight: bold;">Staff</h1>
      </div>
      <v-list dense class="text-white">
        <v-list-item to="/">
          <v-icon class="mr-2">mdi-home</v-icon>
          <v-list-item-title class="inline">Home page</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/staff">
          <v-icon class="mr-2">mdi-view-dashboard</v-icon>
          <v-list-item-title class="inline">แดชบอร์ด</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/staff/newPost">
          <v-icon class="mr-2">mdi-plus-box</v-icon>
          <v-list-item-title class="inline">สร้างโพสข่าวสาร</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/staff/ResearchManagement">
          <v-icon class="mr-2">mdi mdi-clipboard-edit</v-icon>
          <v-list-item-title class="inline">จัดการผลงานวิจัย</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/staff/SearchManagement">
          <v-icon class="mr-2">mdi-text-box-search</v-icon>
          <v-list-item-title class="inline">จัดการสืบค้นข้อมูล</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/staff/RegulationManagement">
          <v-icon class="mr-2">mdi-book-open-page-variant</v-icon>
          <v-list-item-title class="inline">จัดการระเบียบ</v-list-item-title>
        </v-list-item>
        
        <!-- <v-list> -->
          <router-link to="/staff/GroupManagement">
            <v-list-item link>
              <v-icon class="mr-2">mdi-file-alert</v-icon>
              <v-list-item-title class="inline">จัดการทรัพย์สินทางปัญญา</v-list-item-title>
            </v-list-item>

            <!-- <v-list-item link>
              <v-icon class="mr-2">mdi-file-star-four-points</v-icon>
              <v-list-item-title class="inline">การใช้ประโยชน์</v-list-item-title>
            </v-list-item>

            <v-list-item link>
              <v-icon class="mr-2">mdi-file-upload</v-icon>
              <v-list-item-title class="inline">งานยกระดับ</v-list-item-title>
            </v-list-item> -->
          </router-link>
        <!-- </v-list> -->

        <v-list-item link to="/staff/CoverageManagement">
          <v-icon class="mr-2">mdi-book-open-page-variant</v-icon>
          <v-list-item-title class="inline">จัดการการขอรับความคุ้มครอง</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/staff/MessageReply">
          <v-icon class="mr-2">mdi mdi-forum</v-icon>
          <v-list-item-title class="inline">ข้อความและการตอบกลับ</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="user.role === 'admin'" to="/admin">
          <v-icon class="mr-2">mdi-hand-pointing-right</v-icon>
          <v-list-item-title class="inline">หน้าหลัก Admin</v-list-item-title>
        </v-list-item>

      </v-list>

      <!-- logout -->
      <template #append>
        <div class="pa-4 d-flex justify-center">
          <v-btn class="primary--text" rounded @click="logout()">
            <v-icon class="primary--text mr-2">mdi-logout</v-icon>Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- navbar -->
    <v-app-bar app class="bg-red-400 rounded-b-pill">
      <v-toolbar-title class="px-4">MFii Staff Panel</v-toolbar-title>
      <v-divider class="border-opacity-100 mx-3 my-2" vertical></v-divider>

      <v-col cols="auto">
        <v-avatar size="36px">
          <v-img alt="Avatar" src="../assets/mfii_logo_avatar.jpg"></v-img>
        </v-avatar>
      </v-col>

      <v-col class="hidden-xs-only" cols="auto">
        <div class="d-flex flex-column mr-2">
          <span class="title">{{ user.email }}</span>
          <span class="subtitle text-xs">{{ user.role }}</span>
        </div>
      </v-col>
    </v-app-bar>

    <v-main>
      <!-- Main content goes here -->
      <!-- This is where your admin page content will be displayed -->
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "StaffLayout",
  data: () => ({
    messages: [
      {
        avatar: "https://avatars0.githubusercontent.com/u/9064066?v=4&s=460",
        name: "John Leider",
      },
    ],
    user: [],
  }),

  // async created() {
  //   // get user info from pinia store/user.js
  //   const userStore = useUserStore();
  //   try {
  //     if (!userStore.user) {
  //       await userStore.fetchUser();
  //     }
  //     if (userStore.user) {
  //       this.user = userStore.user.resutl;
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // },

  methods: {
    logout() {
      this.user = null;
      localStorage.removeItem('token');
      window.location.reload();
    },
  }
};
</script>

<style scoped>
/* .v-list-item:hover,
.v-list-item:focus {
  color: black;
} */
.v-list-item {
  color: black;
}
</style>
