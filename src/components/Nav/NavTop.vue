<template>
    <div class="w-full h-40 flex items-center">
        <img src="@/assets/images/mfu_logo.png" alt="mfu logo" width="150px">
        <div class="text-title ml-4">
            <h1 class="text-3xl font-bold">ฝ่ายจัดการทรัพย์สินทางปัญญา มหาวิทยาลัยแม่ฟ้าหลวง</h1>
            <h2 class="text-2xl">MFU Intellectual Property Management and Technology Transfer</h2>
        </div>
    </div>

    <header class="sticky top-0 z-50 bg-white shadow-md">
        <nav class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Desktop Menu -->
            <div class="hidden md:flex justify-center h-16 items-center">
                <ul class="flex items-center w-full max-w-2xl justify-between max-w-screen-xl">
                    <!-- Home (no dropdown) -->
                    <div class="hover:bg-gray-100 rounded-md transition-colors duration-300">
                        <li>
                            <RouterLink to="/" :class="{
                                'text-blue-500': route.path === '/',
                                'text-gray-600 hover:text-gray-900': route.path !== '/'
                            }" class="px-3 py-2 text-sm font-medium">
                                หน้าหลัก
                            </RouterLink>
                        </li>
                    </div>

                    <!-- บริการของเรา -->
                    <div class="relative hover:bg-gray-100 rounded-md transition-colors duration-300">
                        <li>
                            <button @click="toggleDropdown('about')"
                                class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center">
                                บริการของเรา
                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="activeDropdown === 'about'"
                                class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                <RouterLink v-for="(item, index) in mobileSections[0].items" :key="index" :to="item.to"
                                    :class="{
                                        'text-blue-500': route.path === item.to,
                                        'text-gray-700 hover:bg-gray-100': route.path !== item.to
                                    }" class="block px-4 py-2 text-sm">
                                    {{ item.label }}
                                </RouterLink>
                            </div>
                        </li>
                    </div>

                    <!-- ผลงานพร้อมถ่ายทอด -->
                    <div class="hover:bg-gray-100 rounded-md transition-colors duration-300">
                        <li>
                            <RouterLink to="/admin/about" :class="{
                                'text-blue-500': route.path === '/about',
                                'text-gray-600 hover:text-gray-900': route.path !== '/about'
                            }" class="px-3 py-2 text-sm font-medium">
                                ผลงานพร้อมถ่ายทอด
                            </RouterLink>
                        </li>
                    </div>

                    <!-- ข้อมูลแนะนำ -->
                    <div class="relative hover:bg-gray-100 rounded-md transition-colors duration-300">
                        <li>
                            <button @click="toggleDropdown('services')"
                                class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center">
                                ข้อมูลแนะนำ
                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="activeDropdown === 'services'"
                                class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                <RouterLink v-for="(item, index) in mobileSections[1].items" :key="index" :to="item.to"
                                    :class="{
                                        'text-blue-500': route.path === item.to,
                                        'text-gray-700 hover:bg-gray-100': route.path !== item.to
                                    }" class="block px-4 py-2 text-sm">
                                    {{ item.label }}
                                </RouterLink>
                            </div>
                        </li>
                    </div>

                    <!-- เกี่ยวกับเรา -->
                    <div class="relative hover:bg-gray-100 rounded-md transition-colors duration-300">
                        <li>
                            <button @click="toggleDropdown('contact')"
                                class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center">
                                เกี่ยวกับเรา
                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="activeDropdown === 'contact'"
                                class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                <RouterLink v-for="(item, index) in mobileSections[2].items" :key="index" :to="item.to"
                                    :class="{
                                        'text-blue-500': route.path === item.to,
                                        'text-gray-700 hover:bg-gray-100': route.path !== item.to
                                    }" class="block px-4 py-2 text-sm">
                                    {{ item.label }}
                                </RouterLink>
                            </div>
                        </li>
                    </div>
                </ul>
            </div>

            <!-- Mobile menu button and Mobile Menu -->
            <div class="md:hidden flex h-16 items-center">
                <button @click="isOpen = !isOpen"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span class="sr-only">Open main menu</span>
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
            <div v-show="isOpen" class="md:hidden">
                <div class="px-2 pt-2 pb-3 space-y-1">
                    <RouterLink to="/" :class="{
                        'text-blue-500': route.path === '/',
                        'text-gray-700 hover:text-gray-900 hover:bg-gray-50': route.path !== '/'
                    }" class="block px-3 py-2 text-base font-medium">
                        หน้าหลัก
                    </RouterLink>

                    <!-- Mobile Accordion for sections -->
                    <div v-for="section in mobileSections" :key="section.name">
                        <button
                            @click="mobileActiveDropdown = mobileActiveDropdown === section.name ? null : section.name"
                            class="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                            {{ section.name }}
                            <svg class="w-4 h-4 transition-transform duration-200"
                                :class="{ 'transform rotate-180': mobileActiveDropdown === section.name }" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div v-show="mobileActiveDropdown === section.name" class="pl-4 transition-all duration-200">
                            <RouterLink v-for="(item, itemIndex) in section.items" :key="itemIndex" :to="item.to"
                                :class="{
                                    'text-blue-500': route.path === item.to,
                                    'text-gray-600 hover:text-gray-900 hover:bg-gray-50': route.path !== item.to
                                }" class="block px-3 py-2 text-base">
                                {{ item.label }}
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const isOpen = ref(false);
const activeDropdown = ref(null);
const mobileActiveDropdown = ref(null);
const route = useRoute();

const toggleDropdown = (dropdown) => {
    activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
};

const mobileSections = [
    { name: 'บริการของเรา', items: [{ label: 'Service 1', to: '/service1' }, { label: 'Service 2', to: '/service2' }] },
    { name: 'ข้อมูลแนะนำ', items: [{ label: 'Info 1', to: '/info1' }, { label: 'Info 2', to: '/info2' }] },
    { name: 'เกี่ยวกับเรา', items: [{ label: 'About 1', to: '/about1' }, { label: 'About 2', to: '/about2' }] }
];
</script>

<style scoped>
/* Optional additional styles */
</style>
