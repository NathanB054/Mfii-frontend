<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import NavSearch from "./NavSearch.vue";

const isOpen = ref(false);
const activeDropdown = ref(null);
const activeNestedDropdown = ref(null);
const activeNestedNestedDropdown = ref(null);
const mobileActiveDropdown = ref(null);
const mobileActiveNestedDropdown = ref(null);
const mobileActiveNestedNestedDropdown = ref(null);
const route = useRoute();
const authStore = useAuthStore();

const mobileSections = [
  {
    name: "บริการของเรา",
    items: [
      { label: "งานสร้างความตระหนักทรัพย์สินทางปัญญา", to: "/services/aai" },
      { label: "การขอรับความคุ้มครองทรัพย์สินทางปัญญา", to: "/services/ipa" },
      { label: "การใช้ประโยชน์ผลงานทรัพย์สินทางปัญญา", to: "/services/abi" },
      { label: "การยกระดับงานวิจัยและนวัตกรรม", to: "/services/upi" },
      {
        label: "ระบบสืบค้นฐานข้อมูลทรัพย์สินทางปัญญา มฟล",
        to: "/services/ipp",
      },
    ],
    isActive: (route) => route.path.startsWith("/service"),
  },
  {
    name: "ผลงานพร้อมถ่ายทอด",
    to: "/innovation",
    isActive: (route) => route.path === "/innovation",
  },
  // {
  //     name: 'ข้อมูลแนะนำ',
  //     items: [
  //         {
  //             label: 'ข้อมูลทรัพย์สินทางปัญญา มฟล. ',
  //             items: [
  //                 { label: 'ระเบียบข้อบังคับ มฟล.', to: '/info1/sub1' },
  //                 { label: 'จัดสรรผลประโยชน์', to: '/info1/sub2' },
  //             ],
  //         },
  //         {
  //             label: 'ดาวน์โหลดเอกสาร ',
  //             items: [
  //                 { label: 'แบบฟอร์มขอยื่นจด', to: '/info2/sub1' },
  //                 { label: 'เอกสารการอบรม', to: '/info2/sub2' },
  //             ],
  //         },
  //         {
  //             label: 'ลิ้งค์หน่วยงานที่เกี่ยวข้อง',
  //             items: [
  //                 { label: 'ภายใน', items: [
  //                     { label: 'MRii', to: '/info2/sub1' },
  //                     { label: 'MFii', to: '/info2/sub1' },
  //                     { label: 'Research', to: '/info2/sub1' },

  //                 ] },
  //                 { label: 'ภายนอก', items: [
  //                     { label: 'DIP', to: '/info2/sub3', external: true },
  //                     { label: 'WIPO', to: '/info2/sub3', external: true },
  //                     { label: 'อวท.', to: '/info2/sub3', external: true }

  //                 ] },
  //             ],
  //         },
  //     ],
  //     isActive: (route) => route.path.startsWith('/info'),
  // },
  {
    name: "ฐานข้อมูล IP มฟล",
    to: "/database",
    isActive: (route) => route.path === "/database",
  },
  {
    name: "ระเบียบทรัพย์สินทางปัญญา",
    to: "/regulation",
    isActive: (route) => route.path === "/regulation",
  },
  {
    name: "เกี่ยวกับเรา",
    items: [
      {
        label: "โครงสร้างองค์กร",
        to: "https://mfii.mfu.ac.th/mfii-about/mfii-structure.html",
        external: true,
      },
      {
        label: "บุคลากร",
        to: "https://mfii.mfu.ac.th/mfii-ip-staff.html",
        external: true,
      },
      { label: "ติดต่อเรา", to: "/contact", external: false },
      {
        label: "ลิ้งค์หน่วยงานที่เกี่ยวข้อง",
        items: [
          {
            label: "ภายใน",
            items: [
              { label: "MRii", to: "/info2/sub1" },
              { label: "MFii", to: "/info2/sub2" },
              { label: "Research", to: "/info2/sub3" },
            ],
          },
          {
            label: "ภายนอก",
            items: [
              { label: "DIP", to: "https://www.wipo.int/portal/en/", external: true },
              { label: "WIPO", to: "https://www.ipthailand.go.th/th/", external: true },
            ],
          },
        ],
      },
    ],
    isActive: (route) => route.path.startsWith("/about"),
  },
];

const toggleDropdown = (dropdown) => {
  // Close nested dropdown when main dropdown is toggled
  if (activeDropdown.value === dropdown) {
    activeDropdown.value = null;
    activeNestedDropdown.value = null;
  } else {
    activeDropdown.value = dropdown;
    activeNestedDropdown.value = null;
  }
};
const toggleNestedDropdown = (section, dropdown) => {
  const key = `${section}-${dropdown}`;
  activeNestedDropdown.value = activeNestedDropdown.value === key ? null : key;
};

const toggleNestedNestedDropdown = (section, nestedsection, dropdown) => {
  const key = `${nestedsection}-${section}-${dropdown}`;
  activeNestedNestedDropdown.value =
    activeNestedNestedDropdown.value === key ? null : key;
};

const closeDesktopDropdown = () => {
  activeDropdown.value = null;
  activeNestedDropdown.value = null;
  activeNestedNestedDropdown.value = null;
};

const toggleMobileMenu = (event) => {
  event.stopPropagation();
  isOpen.value = !isOpen.value;
};

const toggleMobileDropdown = (dropdown, event) => {
  event.stopPropagation();
  // Reset nested dropdown when parent dropdown is toggled
  mobileActiveNestedDropdown.value = null;
  mobileActiveDropdown.value =
    mobileActiveDropdown.value === dropdown ? null : dropdown;
};

const toggleMobileNestedDropdown = (section, dropdown, event) => {
  event.stopPropagation();
  const key = `${section}-${dropdown}`;
  mobileActiveNestedDropdown.value =
    mobileActiveNestedDropdown.value === key ? null : key;
};
const toggleMobileNestedNestedDropdown = (
  section,
  nestedsection,
  dropdown,
  event
) => {
  event.stopPropagation();
  const key = `${nestedsection}-${section}-${dropdown}`;
  mobileActiveNestedNestedDropdown.value =
    mobileActiveNestedNestedDropdown.value === key ? null : key;
};

// New method to close mobile menu
const closeMobileMenu = () => {
  isOpen.value = false;
  mobileActiveDropdown.value = null;
  mobileActiveNestedDropdown.value = null;
  mobileActiveNestedNestedDropdown.value = null;
};

const handleClickOutside = (event) => {
  const navElement = event.target.closest("nav");
  const dropdownButtons = document.querySelectorAll(".desktop-dropdown-button");
  const isClickOnButton = Array.from(dropdownButtons).some((button) =>
    button.contains(event.target)
  );
  const dropdownContent = event.target.closest(".desktop-dropdown-content");
  const mobileMenuButton = event.target.closest(
    'button[aria-label="Toggle menu"]'
  );

  if (!navElement || (!isClickOnButton && !dropdownContent)) {
    activeDropdown.value = null;
    activeNestedDropdown.value = null; // Close nested dropdown
    activeNestedNestedDropdown.value = null; // Close nested nested dropdown
  }

  if (!navElement && !mobileMenuButton) {
    closeMobileMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

onMounted(async () => {
  try {
    if (authStore.token && !authStore.user) {
      await authStore.fetchUser();
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
});

// logout then reload
const handleLogout = async () => {
  try {
    await authStore.logout();
    nextTick(() => {
      window.location.reload();
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>

<template>
  <div class="title-bar w-full h-40 flex items-center justify-between">
    <!-- Start of content -->
    <div class="start-content flex items-center">
      <RouterLink to="/">
        <img
          src="@/assets/images/mfu_logo.png"
          class="logo-img"
          alt="mfu logo"
          width="150px"
        />
      </RouterLink>
      <div class="text-title ml-4">
        <h1 class="text-2xl font-bold">
          ฝ่ายจัดการทรัพย์สินทางปัญญา มหาวิทยาลัยแม่ฟ้าหลวง
        </h1>
        <h1 class="text-2xl font-bold">
          MFU Intellectual Property Management and Technology Transfer
        </h1>
      </div>
    </div>

    <!-- End content -->
    <div class="end-content items-center mr-10">
      <NavSearch />
      <div
        v-if="authStore.user"
        class="user flex items-center justify-center mt-4"
      >
        <p class="mr-2">
          Welcome, {{ authStore.user.firstName }} {{ authStore.user.lastName }}
        </p>
        <div>
          <v-menu transition="menu slide-x-transition">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon size="48px" class="hover:bg-gray-200">
                <v-avatar size="48px">
                  <v-icon
                    v-if="!authStore.user.img"
                    icon="mdi-account-circle"
                    size="58px"
                  ></v-icon>
                  <v-img
                    v-else
                    alt="John"
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    cover
                  ></v-img>
                </v-avatar>
              </v-btn>
            </template>
            <v-list class="font-noto-sans-thai">
              <router-link v-if="authStore.user.role === 'admin'" to="/admin">
                <v-list-item>
                  <v-list-item-title> Admin Page</v-list-item-title>
                </v-list-item>
              </router-link>
              <router-link
                v-if="
                  authStore.user.role === 'staff' ||
                  authStore.user.role === 'admin'
                "
                to="/staff"
              >
                <v-list-item>
                  <v-list-item-title>Staff Page</v-list-item-title>
                </v-list-item>
              </router-link>
              <router-link v-if="authStore.user.role === 'user'" to="/profile">
                <v-list-item>
                  <v-list-item-title>แก้ไขข้อมูลส่วนตัว</v-list-item-title>
                </v-list-item>
              </router-link>

              <router-link v-if="authStore.user.role === 'user'" to="/message">
                <v-list-item>
                  <v-list-item-title>ข้อความ</v-list-item-title>
                </v-list-item>
              </router-link>
              <v-list-item @click="handleLogout">
                <v-list-item-title>
                  <v-icon icon="mdi-logout" />
                  ออกจากระบบ
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <div v-else class="flex items-center justify-center mt-4">
        <v-btn
          class="reg bg-black text-white rounded-xl border w-32 h-14 btn-nav mr-1"
          :to="{ name: 'Register' }"
          >สมัครสมาชิก</v-btn
        >
        <v-btn
          class="log text-black rounded-xl border border-black w-32 h-14 btn-nav ml-1"
          :to="{ name: 'Login' }"
          >เข้าสู่ระบบ</v-btn
        >
      </div>
    </div>
  </div>

  <!-- ========================================================================================== -->

  <header class="sticky top-0 z-50 bg-customPurple shadow-md">
    <nav class="max-w-screen-xl mx-auto shadow-md md:px-6">
      <!-- Desktop Menu -->
      <div class="hidden md:flex justify-center h-16 items-center">
        <ul class="flex items-center w-full justify-between max-w-screen-xl">
          <!-- Home -->
          <div
            class="hover:bg-gray-400 rounded-md transition-colors duration-300"
            :class="{ 'bg-gray-400': route.path === '/' }"
          >
            <button
              class="text-white hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center"
              :class="{ 'text-gray-900': route.path === '/' }"
            >
              <li>
                <RouterLink
                  to="/"
                  class="text-nav px-3 py-2 text-sm font-bold"
                  @click="closeDesktopDropdown"
                >
                  หน้าหลัก
                </RouterLink>
              </li>
            </button>
          </div>

          <!-- Desktop Dropdown Menus -->
          <template v-for="(section, index) in mobileSections" :key="index">
            <!-- Single link -->
            <div
              v-if="section.to"
              class="hover:bg-gray-400 rounded-md transition-colors duration-300"
              :class="{ 'bg-gray-400': section.isActive(route) }"
            >
              <button
                class="text-white hover:text-gray-900 px-3 py-2 text-sm font-bold inline-flex items-center"
                :class="{ 'text-gray-900': section.isActive(route) }"
              >
                <li>
                  <template v-if="section.external">
                    <a
                      :href="section.to"
                      target="_blank"
                      class="text-nav px-3 py-2 text-sm font-bold"
                      @click="closeDesktopDropdown"
                    >
                      {{ section.name }}
                    </a>
                  </template>
                  <template v-else>
                    <RouterLink
                      :to="section.to"
                      class="text-nav px-3 py-2 text-sm font-bold"
                      @click="closeDesktopDropdown"
                    >
                      {{ section.name }}
                    </RouterLink>
                  </template>
                </li>
              </button>
            </div>

            <!-- Dropdown menu -->
            <div
              v-else
              class="relative hover:bg-gray-400 rounded-md transition-colors duration-300"
              :class="{ 'bg-gray-400': section.isActive(route) }"
            >
              <li>
                <button
                  @click="toggleDropdown(section.name)"
                  class="text-nav desktop-dropdown-button text-white hover:text-gray-900 px-3 py-2 text-sm font-bold inline-flex items-center"
                  :class="{ 'text-gray-900': section.isActive(route) }"
                >
                  {{ section.name }}
                  <svg
                    class="w-4 h-4 ml-1 transition-transform duration-200"
                    :class="{
                      'transform rotate-180': activeDropdown === section.name,
                    }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <Transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 transform -translate-y-2"
                  enter-to-class="opacity-100 transform translate-y-0"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 transform translate-y-0"
                  leave-to-class="opacity-0 transform -translate-y-2"
                >
                  <div
                    v-if="activeDropdown === section.name"
                    class="desktop-dropdown-content absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    <!-- Recursive rendering for dropdown items -->
                    <template
                      v-for="(item, itemIndex) in section.items"
                      :key="itemIndex"
                    >
                      <!-- Nested dropdown items -->
                      <div v-if="item.items" class="relative group">
                        <button
                          @click="
                            toggleNestedDropdown(section.name, item.label)
                          "
                          class="block w-full text-right px-3 py-2 text-base text-gray-700 hover:bg-gray-100 relative"
                        >
                          <svg
                            class="w-4 h-4 mr-2 inline-block absolute left-2 top-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M15 19l-7-7 7-7"></path>
                          </svg>
                          {{ item.label }}
                        </button>
                        <div
                          v-if="
                            activeNestedDropdown ===
                            `${section.name}-${item.label}`
                          "
                          class="absolute left-full top-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1"
                        >
                          <!-- Render nested items -->
                          <template
                            v-for="(subItem, subIndex) in item.items"
                            :key="subIndex"
                          >
                            <!-- External link -->
                            <a
                              v-if="subItem.external"
                              :href="subItem.to"
                              target="_blank"
                              rel="noopener noreferrer"
                              @click="closeMobileMenu"
                              class="block px-4 py-2 text-sm transition-colors duration-200"
                              :class="{
                                'text-blue-500 bg-gray-100':
                                  route.path === subItem.to,
                                'text-gray-700 hover:bg-gray-100':
                                  route.path !== subItem.to,
                              }"
                            >
                              {{ subItem.label }}
                            </a>
                            <!-- {{ typeof subItem.items }} -->
                            <div
                              v-else-if="subItem.items"
                              class="relative group"
                            >
                              <button
                                @click="
                                  toggleNestedNestedDropdown(
                                    section.name,
                                    subItem.label,
                                    item.label
                                  )
                                "
                                class="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative"
                              >
                                <svg
                                  class="w-4 h-4 mr-2 inline-block absolute left-2 top-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <path d="M15 19l-7-7 7-7"></path>
                                </svg>
                                {{ subItem.label }}
                              </button>
                              <div
                                v-if="
                                  activeNestedNestedDropdown ===
                                  `${subItem.label}-${section.name}-${item.label}`
                                "
                                class="absolute left-full top-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1"
                              >
                                <template
                                  v-for="(
                                    nestedsubitem, nestedsubitemIdex
                                  ) in subItem.items"
                                >
                                  <!-- External link -->
                                  <a
                                    v-if="nestedsubitem.external"
                                    :href="nestedsubitem.to"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    @click="closeDesktopDropdown"
                                    class="block px-4 py-2 text-base transition-colors duration-200"
                                    :class="{
                                      'text-blue-500 bg-gray-100':
                                        route.path === nestedsubitem.to,
                                      'text-gray-700 hover:bg-gray-100':
                                        route.path !== nestedsubitem.to,
                                    }"
                                  >
                                    {{ nestedsubitem.label }}
                                  </a>

                                  <!-- Internal link -->
                                  <RouterLink
                                    v-else-if="nestedsubitem.to !== undefined"
                                    :to="nestedsubitem.to"
                                    @click="closeDesktopDropdown"
                                    class="block px-4 py-2 text-base transition-colors duration-200"
                                    :class="{
                                      'text-blue-500 bg-gray-100':
                                        route.path === nestedsubitem.to,
                                      'text-gray-700 hover:bg-gray-100':
                                        route.path !== nestedsubitem.to,
                                    }"
                                  >
                                    {{ nestedsubitem.label }}
                                  </RouterLink>
                                </template>
                              </div>
                            </div>
                            <!-- Internal link -->
                            <RouterLink
                              v-else
                              :to="subItem.to"
                              @click="closeDesktopDropdown"
                              class="block px-4 py-2 text-base transition-colors duration-200"
                              :class="{
                                'text-blue-500 bg-gray-100':
                                  route.path === subItem.to,
                                'text-gray-700 hover:bg-gray-100':
                                  route.path !== subItem.to,
                              }"
                            >
                              {{ subItem.label }}
                            </RouterLink>
                          </template>
                        </div>
                      </div>
                      <!-- Regular dropdown items -->
                      <template v-else>
                        <!-- External link -->
                        <a
                          v-if="item.external"
                          :href="item.to"
                          target="_blank"
                          rel="noopener noreferrer"
                          @click="closeDesktopDropdown"
                          class="block px-3 py-2 text-base transition-colors duration-200"
                          :class="{
                            'text-blue-500 bg-gray-100': route.path === item.to,
                            'text-gray-600 hover:text-gray-900 hover:bg-gray-50':
                              route.path !== item.to,
                          }"
                        >
                          {{ item.label }}
                        </a>
                        <RouterLink
                          v-else
                          :to="item.to"
                          @click="closeDesktopDropdown"
                          class="block px-3 py-2 text-base transition-colors duration-200"
                          :class="{
                            'text-blue-500 bg-gray-100': route.path === item.to,
                            'text-gray-700 hover:bg-gray-100':
                              route.path !== item.to,
                          }"
                        >
                          {{ item.label }}
                        </RouterLink>
                      </template>
                    </template>
                  </div>
                </Transition>
              </li>
            </div>
          </template>
        </ul>
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden flex h-16 items-center">
        <button
          @click="toggleMobileMenu"
          aria-label="Toggle menu"
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span class="sr-only">Toggle menu</span>
          <svg
            v-if="!isOpen"
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[400px]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-[400px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-show="isOpen" class="md:hidden bg-white overflow-hidden">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <RouterLink
              to="/"
              class="block px-3 py-2 text-base font-medium transition-colors duration-200"
              @click="closeMobileMenu"
              :class="{
                'text-blue-500 bg-gray-100': route.path === '/',
                'text-gray-700 hover:text-gray-900 hover:bg-gray-50':
                  route.path !== '/',
              }"
            >
              หน้าหลัก
            </RouterLink>

            <!-- Mobile Menu Items -->
            <template v-for="section in mobileSections" :key="section.name">
              <!-- Direct link -->
              <template v-if="section.to">
                <!-- External link -->
                <a
                  v-if="section.external"
                  :href="section.to"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="closeMobileMenu"
                  class="block px-3 py-2 text-base font-medium transition-colors duration-200"
                  :class="{
                    'text-blue-500 bg-gray-100': section.isActive(route),
                    'text-gray-700 hover:text-gray-900 hover:bg-gray-50':
                      !section.isActive(route),
                  }"
                >
                  {{ section.name }}
                </a>
                <!-- Internal link -->
                <RouterLink
                  v-else
                  :to="section.to"
                  @click="closeMobileMenu"
                  class="block px-3 py-2 text-base font-medium transition-colors duration-200"
                  :class="{
                    'text-blue-500 bg-gray-100': section.isActive(route),
                    'text-gray-700 hover:text-gray-900 hover:bg-gray-50':
                      !section.isActive(route),
                  }"
                >
                  {{ section.name }}
                </RouterLink>
              </template>

              <!-- Dropdown section -->
              <template v-else-if="section.items">
                <div class="mobile-menu-section">
                  <button
                    @click="toggleMobileDropdown(section.name, $event)"
                    class="w-full flex justify-between items-center px-3 py-2 text-base font-medium transition-colors duration-200"
                    :class="{
                      'text-blue-500 bg-gray-100': section.isActive(route),
                      'text-gray-700 hover:text-gray-900 hover:bg-gray-50':
                        !section.isActive(route),
                    }"
                  >
                    {{ section.name }}
                    <svg
                      class="w-4 h-4 transition-transform duration-200"
                      :class="{
                        'transform rotate-180':
                          mobileActiveDropdown === section.name,
                      }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 max-h-0"
                    enter-to-class="opacity-100 max-h-[400px]"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 max-h-[400px]"
                    leave-to-class="opacity-0 max-h-0"
                  >
                    <div
                      v-show="mobileActiveDropdown === section.name"
                      class="pl-2 overflow-hidden"
                    >
                      <template
                        v-for="(item, itemIndex) in section.items"
                        :key="itemIndex"
                      >
                        <!-- Nested dropdown handling -->
                        <template v-if="item.items">
                          <div class="mobile-submenu-section">
                            <button
                              @click="
                                toggleMobileNestedDropdown(
                                  section.name,
                                  item.label,
                                  $event
                                )
                              "
                              class="w-full flex justify-between items-center px-3 py-2 text-base font-medium transition-colors duration-200"
                              :class="{
                                'text-blue-500 bg-gray-100':
                                  mobileActiveNestedDropdown ===
                                  `${section.name}-${item.label}`,
                                'text-gray-700 hover:text-gray-900 hover:bg-gray-50':
                                  mobileActiveNestedDropdown !==
                                  `${section.name}-${item.label}`,
                              }"
                            >
                              {{ item.label }}
                              <svg
                                class="w-4 h-4 transition-transform duration-200"
                                :class="{
                                  'transform rotate-180':
                                    mobileActiveNestedDropdown ===
                                    `${section.name}-${item.label}`,
                                }"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            <Transition
                              enter-active-class="transition-all duration-300 ease-out"
                              enter-from-class="opacity-0 max-h-0"
                              enter-to-class="opacity-100 max-h-[200px]"
                              leave-active-class="transition-all duration-200 ease-in"
                              leave-from-class="opacity-100 max-h-[200px]"
                              leave-to-class="opacity-0 max-h-0"
                            >
                              <div
                                v-show="
                                  mobileActiveNestedDropdown ===
                                  `${section.name}-${item.label}`
                                "
                                class="pl-4 overflow-hidden"
                              >
                                <template
                                  v-for="(subItem, subIndex) in item.items"
                                  :key="subIndex"
                                >
                                  <!-- External link -->
                                  <a
                                    v-if="subItem.external"
                                    :href="subItem.to"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    @click="closeMobileMenu"
                                    class="block px-3 py-2 text-base transition-colors duration-200"
                                    :class="{
                                      'text-blue-500 bg-gray-100':
                                        route.path === subItem.to,
                                      'text-gray-600 hover:text-gray-900 hover:bg-gray-50':
                                        route.path !== subItem.to,
                                    }"
                                  >
                                    {{ subItem.label }}
                                  </a>

                                  <div
                                    v-else-if="subItem.items"
                                    class="mobile-submenu-section"
                                  >
                                    <button
                                      @click="
                                        toggleMobileNestedNestedDropdown(
                                          section.name,
                                          subItem.label,
                                          item.label,
                                          $event
                                        )
                                      "
                                      class="w-full flex justify-between items-center px-3 py-2 text-base font-medium transition-colors duration-200"
                                      :class="{
                                        'text-blue-500 bg-gray-100':
                                          mobileActiveNestedNestedDropdown ===
                                          `${subItem.label}-${section.name}-${item.label}`,
                                        'text-gray-700 hover:text-gray-900 hover:bg-gray-50':
                                          mobileActiveNestedNestedDropdown !==
                                          `${subItem.label}-${section.name}-${item.label}`,
                                      }"
                                    >
                                      {{ subItem.label }}
                                      <svg
                                        class="w-4 h-4 transition-transform duration-200"
                                        :class="{
                                          'transform rotate-180':
                                            mobileActiveNestedNestedDropdown ===
                                            `${subItem.label}-${section.name}-${item.label}`,
                                        }"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </button>
                                    <Transition
                                      enter-active-class="transition-all duration-300 ease-out"
                                      enter-from-class="opacity-0 max-h-0"
                                      enter-to-class="opacity-100 max-h-[200px]"
                                      leave-active-class="transition-all duration-200 ease-in"
                                      leave-from-class="opacity-100 max-h-[200px]"
                                      leave-to-class="opacity-0 max-h-0"
                                    >
                                      <div
                                        v-show="
                                          mobileActiveNestedNestedDropdown ===
                                          `${subItem.label}-${section.name}-${item.label}`
                                        "
                                        class="pl-4 overflow-hidden"
                                      >
                                        <template
                                          v-for="(
                                            nestedsubitem, nestedsubitemIdex
                                          ) in subItem.items"
                                        >
                                          <!-- External link -->
                                          <a
                                            v-if="nestedsubitem.external"
                                            :href="nestedsubitem.to"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            @click="closeMobileMenu"
                                            class="block px-3 py-2 text-base transition-colors duration-200"
                                            :class="{
                                              'text-blue-500 bg-gray-100':
                                                route.path === nestedsubitem.to,
                                              'text-gray-600 hover:text-gray-900 hover:bg-gray-50':
                                                route.path !== nestedsubitem.to,
                                            }"
                                          >
                                            {{ nestedsubitem.label }}
                                          </a>
                                          <!-- Internal link -->
                                          <RouterLink
                                            v-else-if="
                                              nestedsubitem.to !== undefined &&
                                              !nestedsubitem.external
                                            "
                                            :to="nestedsubitem.to"
                                            @click="closeMobileMenu"
                                            class="block px-3 py-2 text-base transition-colors duration-200"
                                            :class="{
                                              'text-blue-500 bg-gray-100':
                                                route.path === nestedsubitem.to,
                                              'text-gray-600 hover:text-gray-900 hover:bg-gray-50':
                                                route.path !== nestedsubitem.to,
                                            }"
                                          >
                                            {{ nestedsubitem.label }}
                                          </RouterLink>
                                        </template>
                                      </div>
                                    </Transition>
                                  </div>
                                  <!-- Internal link -->
                                  <RouterLink
                                    v-else
                                    :to="subItem.to"
                                    @click="closeMobileMenu"
                                    class="block px-3 py-2 text-base transition-colors duration-200"
                                    :class="{
                                      'text-blue-500 bg-gray-100':
                                        route.path === subItem.to,
                                      'text-gray-600 hover:text-gray-900 hover:bg-gray-50':
                                        route.path !== subItem.to,
                                    }"
                                  >
                                    {{ subItem.label }}
                                  </RouterLink>
                                </template>
                              </div>
                            </Transition>
                          </div>
                        </template>
                        <!-- Regular dropdown item -->
                        <template v-else>
                          <!-- External link -->
                          <a
                            v-if="item.external"
                            :href="item.to"
                            target="_blank"
                            rel="noopener noreferrer"
                            @click="closeMobileMenu"
                            class="block px-3 py-2 text-base transition-colors duration-200"
                            :class="{
                              'text-blue-500 bg-gray-100':
                                route.path === item.to,
                              'text-gray-600 hover:text-gray-900 hover:bg-gray-50':
                                route.path !== item.to,
                            }"
                          >
                            {{ item.label }}
                          </a>
                          <!-- Internal link -->
                          <RouterLink
                            v-else
                            :to="item.to"
                            @click="closeMobileMenu"
                            class="block px-3 py-2 text-base transition-colors duration-200"
                            :class="{
                              'text-blue-500 bg-gray-100':
                                route.path === item.to,
                              'text-gray-600 hover:text-gray-900 hover:bg-gray-50':
                                route.path !== item.to,
                            }"
                          >
                            {{ item.label }}
                          </RouterLink>
                        </template>
                      </template>
                    </div>
                  </Transition>
                </div>
              </template>
            </template>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<style scoped>
.transition-all {
  transition-property: all;
}

@media (max-width: 1280px) {
  .text-nav {
    display: flex;
    align-self: center;
    font-size: 13px;
  }
}

@media (max-width: 1024px) {
  .text-nav {
    display: flex;
    align-self: center;
    font-size: 10px;
  }

  .end-content {
    margin-right: 0 !important;
  }

  .title-bar {
    display: flex;
    flex-direction: column;
    margin-bottom: 25%;
  }

  .start-content {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .text-title {
    justify-items: center !important;
    text-align: center;
    /* Center text when width < 1024px */
  }
}

@media (max-width: 870px) {
  .start-content {
    margin-bottom: 1%;
  }

  .text-title h1 {
    font-size: larger;
  }
}

@media (max-width: 800px) {
  .title-bar {
    margin-bottom: 30%;
  }
}

@media (max-width: 660px) {
  .title-bar {
    margin-bottom: 35%;
  }
}

@media (max-width: 604px) {
  .user {
    margin-bottom: 40%;
  }

  .title-bar {
    margin-bottom: 40%;
  }

  .text-title h1 {
    font-size: medium;
  }
}

@media (max-width: 506px) {
  .title-bar {
    margin-bottom: 45%;
  }

  .text-title h1 {
    font-size: small;
  }
}

@media (max-width: 446px) {
  .title-bar {
    margin-bottom: 50%;
  }

  .text-title h1 {
    font-size: x-small;
  }
}

@media (max-width: 400px) {
  .title-bar {
    margin-bottom: 55%;
  }

  .text-title h1 {
    font-size: xx-small;
  }
}

.desktop-dropdown-content {
  right: 0; /* Align dropdown to the right */
  left: auto; /* Remove left alignment */
}

.desktop-dropdown-content .relative.group {
  text-align: right; /* Align text to the right */
}

.desktop-dropdown-content .relative.group button {
  justify-content: flex-end; /* Align button content to the right */
}

.desktop-dropdown-content .relative.group svg {
  margin-left: 0; /* Remove left margin */
  margin-right: 0.5rem; /* Add right margin */
}

/* Adjust nested dropdowns */
.desktop-dropdown-content .absolute.left-full {
  right: 100%; /* Align nested dropdown to the left */
  left: auto; /* Remove left alignment */
}

/* Adjust nested nested dropdowns */
.desktop-dropdown-content .absolute.left-full .absolute.left-full {
  right: 100%; /* Align nested nested dropdown to the left */
  left: auto; /* Remove left alignment */
}
</style>
