<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';


const isOpen = ref(false);
const activeDropdown = ref(null);
const mobileActiveDropdown = ref(null);
const route = useRoute();
const authStore = useAuthStore();


const mobileSections = [
    {
        name: 'บริการของเรา',
        items: [{ label: 'Service 1', to: '/service1' }, { label: 'Service 2', to: '/service2' }],
        isActive: (route) => route.path.startsWith('/service')
    },
    {
        name: 'ผลงานพร้อมถ่ายทอด',
        to: '/innovation',
        isActive: (route) => route.path === '/innovation'
    },
    {
        name: 'ข้อมูลแนะนำ',
        items: [{ label: 'Info 1', to: '/info1' }, { label: 'Info 2', to: '/info2' }],
        isActive: (route) => route.path.startsWith('/info')
    },
    {
        name: 'เกี่ยวกับเรา',
        items: [{ label: 'About 1', to: '/about' }, { label: 'About 2', to: '/about' }],
        isActive: (route) => route.path.startsWith('/about')
    }
];

const toggleDropdown = (dropdown) => {
    activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
};

const toggleMobileMenu = (event) => {
    // Prevent event from bubbling up to document
    event.stopPropagation();
    isOpen.value = !isOpen.value;
};

const toggleMobileDropdown = (dropdown, event) => {
    // Prevent event from bubbling up to document
    event.stopPropagation();
    mobileActiveDropdown.value = mobileActiveDropdown.value === dropdown ? null : dropdown;
};

// Updated click outside handler
const handleClickOutside = (event) => {
    const navElement = event.target.closest('nav');
    const dropdownButtons = document.querySelectorAll('.desktop-dropdown-button');
    const isClickOnButton = Array.from(dropdownButtons).some(button => button.contains(event.target));
    const dropdownContent = event.target.closest('.desktop-dropdown-content');
    const mobileMenuButton = event.target.closest('button[aria-label="Toggle menu"]');

    // Handle desktop menu dropdowns
    if (!navElement || (!isClickOnButton && !dropdownContent)) {
        activeDropdown.value = null;
    }

    // Handle mobile menu - close when clicking outside
    if (!navElement && !mobileMenuButton) {
        isOpen.value = false;
        mobileActiveDropdown.value = null;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});


// Fetch user information when the component is mounted
onMounted(async () => {
    try {
        if (authStore.token && !authStore.user) {
            await authStore.fetchUser(); // Ensure the user is fetched and stored in authStore.user
        }
    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
});


</script>

<template>
    <div class="w-full h-40 flex items-center justify-between">
        <!-- Start of content -->
        <div class="flex items-center">
            <img src="@/assets/images/mfu_logo.png" alt="mfu logo" width="150px">
            <div class="text-title ml-4">
                <h1 class="text-3xl font-bold">ฝ่ายจัดการทรัพย์สินทางปัญญา มหาวิทยาลัยแม่ฟ้าหลวง</h1>
                <h2 class="text-2xl">MFU Intellectual Property Management and Technology Transfer</h2>
            </div>
        </div>


        <!-- End content -->
        <div class="items-center mr-10">
            <div>
                <input type="text" placeholder="Search" class="border border-gray-300 rounded-md px-4 py-2">
            </div>
            <div v-if="authStore.user" class="flex items-center justify-center mt-4">
                <p>Welcome, {{ authStore.user.firstName }} {{ authStore.user.lastName }}</p>
                <button class="bg-customPurple text-white px-4 py-2 rounded-md ml-4"
                    @click="authStore.logout">Logout</button>
            </div>
            <div v-else class="flex items-center justify-center mt-4">
                <v-btn class="reg bg-black text-white rounded-xl border w-32 h-14 btn-nav mr-1"
                    :to="{ name: 'Register' }">สมัครสมาชิก</v-btn>
                <v-btn class="log text-black rounded-xl border border-black w-32 h-14 btn-nav ml-1"
                    :to="{ name: 'Login' }">เข้าสู่ระบบ</v-btn>
            </div>
        </div>
    </div>

    <!-- ========================================================================================== -->



    <header class="sticky top-0 z-50 bg-customPurple shadow-md">
        <nav class="max-w-screen-xl mx-auto shadow-md md:px-6">
            <!-- Desktop Menu -->
            <div class="hidden md:flex justify-center h-16 items-center">
                <ul class="flex items-center w-full max-w-2xl justify-between max-w-screen-xl">
                    <!-- Home -->
                    <div class="hover:bg-gray-400 rounded-md transition-colors duration-300"
                        :class="{ 'bg-gray-400': route.path === '/' }">
                        <button
                            class="text-white hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center"
                            :class="{ 'text-gray-900': route.path === '/' }">
                            <li>
                                <RouterLink to="/" class="px-3 py-2 text-sm font-medium">
                                    หน้าหลัก
                                </RouterLink>
                            </li>
                        </button>
                    </div>

                    <!-- Desktop Dropdown Menus -->
                    <template v-for="(section, index) in mobileSections" :key="index">
                        <div v-if="section.to" class="hover:bg-gray-400 rounded-md transition-colors duration-300"
                            :class="{ 'bg-gray-400': section.isActive(route) }">
                            <button
                                class="text-white hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center"
                                :class="{ 'text-gray-900': section.isActive(route) }">
                                <li>
                                    <RouterLink :to="section.to" class="px-3 py-2 text-sm font-medium">
                                        {{ section.name }}
                                    </RouterLink>
                                </li>
                            </button>
                        </div>
                        <div v-else class="relative hover:bg-gray-400 rounded-md transition-colors duration-300"
                            :class="{ 'bg-gray-400': section.isActive(route) }">
                            <li>
                                <button @click="toggleDropdown(section.name)"
                                    class="desktop-dropdown-button text-white hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center"
                                    :class="{ 'text-gray-900': section.isActive(route) }">
                                    {{ section.name }}
                                    <svg class="w-4 h-4 ml-1 transition-transform duration-200"
                                        :class="{ 'transform rotate-180': activeDropdown === section.name }" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <Transition enter-active-class="transition ease-out duration-200"
                                    enter-from-class="opacity-0 transform -translate-y-2"
                                    enter-to-class="opacity-100 transform translate-y-0"
                                    leave-active-class="transition ease-in duration-150"
                                    leave-from-class="opacity-100 transform translate-y-0"
                                    leave-to-class="opacity-0 transform -translate-y-2">
                                    <div v-if="activeDropdown === section.name"
                                        class="desktop-dropdown-content absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                        <RouterLink v-for="(item, itemIndex) in section.items" :key="itemIndex"
                                            :to="item.to" class="block px-4 py-2 text-sm transition-colors duration-200"
                                            :class="{
                                                'text-blue-500 bg-gray-100': route.path === item.to,
                                                'text-gray-700 hover:bg-gray-100': route.path !== item.to
                                            }">
                                            {{ item.label }}
                                        </RouterLink>
                                    </div>
                                </Transition>
                            </li>
                        </div>
                    </template>
                </ul>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden flex h-16 items-center">
                <button @click="toggleMobileMenu" aria-label="Toggle menu"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span class="sr-only">Toggle menu</span>
                    <svg v-if="!isOpen" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu -->
            <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[400px]" leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-[400px]" leave-to-class="opacity-0 max-h-0">
                <div v-show="isOpen" class="md:hidden bg-white overflow-hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1">
                        <RouterLink to="/" class="block px-3 py-2 text-base font-medium transition-colors duration-200"
                            :class="{
                                'text-blue-500 bg-gray-100': route.path === '/',
                                'text-gray-700 hover:text-gray-900 hover:bg-gray-50': route.path !== '/'
                            }">
                            หน้าหลัก
                        </RouterLink>

                        <!-- Mobile Menu Items -->
                        <template v-for="section in mobileSections" :key="section.name">
                            <!-- Direct link -->
                            <RouterLink v-if="section.to" :to="section.to"
                                class="block px-3 py-2 text-base font-medium transition-colors duration-200" :class="{
                                    'text-blue-500 bg-gray-100': section.isActive(route),
                                    'text-gray-700 hover:text-gray-900 hover:bg-gray-50': !section.isActive(route)
                                }">
                                {{ section.name }}
                            </RouterLink>

                            <!-- Dropdown section -->
                            <div v-else class="mobile-menu-section">
                                <button @click="toggleMobileDropdown(section.name, $event)"
                                    class="w-full flex justify-between items-center px-3 py-2 text-base font-medium transition-colors duration-200"
                                    :class="{
                                        'text-blue-500 bg-gray-100': section.isActive(route),
                                        'text-gray-700 hover:text-gray-900 hover:bg-gray-50': !section.isActive(route)
                                    }">
                                    {{ section.name }}
                                    <svg class="w-4 h-4 transition-transform duration-200"
                                        :class="{ 'transform rotate-180': mobileActiveDropdown === section.name }"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <Transition enter-active-class="transition-all duration-300 ease-out"
                                    enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-[200px]"
                                    leave-active-class="transition-all duration-200 ease-in"
                                    leave-from-class="opacity-100 max-h-[200px]" leave-to-class="opacity-0 max-h-0">
                                    <div v-show="mobileActiveDropdown === section.name" class="pl-4 overflow-hidden">
                                        <RouterLink v-for="(item, itemIndex) in section.items" :key="itemIndex"
                                            :to="item.to"
                                            class="block px-3 py-2 text-base transition-colors duration-200" :class="{
                                                'text-blue-500 bg-gray-100': route.path === item.to,
                                                'text-gray-600 hover:text-gray-900 hover:bg-gray-50': route.path !== item.to
                                            }">
                                            {{ item.label }}
                                        </RouterLink>
                                    </div>
                                </Transition>
                            </div>
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
</style>