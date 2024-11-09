<template>
    <div class="w-full h-52">
        <h1>TEST</h1>
    </div>
    <header class="sticky top-0 z-50 bg-white shadow-md">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Desktop Menu -->
            <div class="hidden md:flex justify-center h-16">
                <ul class="flex items-center w-full max-w-2xl justify-between">
                    <!-- Home (no dropdown) -->
                    <li>
                        <RouterLink
                            to="/"
                            :class="{
                                'text-blue-500': route.path === '/',
                                'text-gray-600 hover:text-gray-900': route.path !== '/'
                            }"
                            class="px-3 py-2 text-sm font-medium"
                        >
                            หน้าหลัก
                        </RouterLink>
                    </li>

                    <!-- บริการของเรา -->
                    <li class="relative">
                        <button
                            @click="toggleDropdown('about')"
                            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center"
                        >
                            บริการของเรา
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            v-if="activeDropdown === 'about'"
                            class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                        >
                            <RouterLink
                                v-for="(item, index) in mobileSections[0].items"
                                :key="index"
                                :to="item.to"
                                :class="{
                                    'text-blue-500': route.path === item.to,
                                    'text-gray-700 hover:bg-gray-100': route.path !== item.to
                                }"
                                class="block px-4 py-2 text-sm"
                            >
                                {{ item.label }}
                            </RouterLink>
                        </div>
                    </li>

                    <!-- ผลงานพร้อมถ่ายทอด -->
                    <li>
                        <RouterLink
                            to="/admin/about"
                            :class="{
                                'text-blue-500': route.path === '/about',
                                'text-gray-600 hover:text-gray-900': route.path !== '/about'
                            }"
                            class="px-3 py-2 text-sm font-medium"
                        >
                            ผลงานพร้อมถ่ายทอด
                        </RouterLink>
                    </li>

                    <!-- ข้อมูลแนะนำ -->
                    <li class="relative">
                        <button
                            @click="toggleDropdown('services')"
                            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center"
                        >
                            ข้อมูลแนะนำ
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            v-if="activeDropdown === 'services'"
                            class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                        >
                            <RouterLink
                                v-for="(item, index) in mobileSections[1].items"
                                :key="index"
                                :to="item.to"
                                :class="{
                                    'text-blue-500': route.path === item.to,
                                    'text-gray-700 hover:bg-gray-100': route.path !== item.to
                                }"
                                class="block px-4 py-2 text-sm"
                            >
                                {{ item.label }}
                            </RouterLink>
                        </div>
                    </li>

                    <!-- เกี่ยวกับเรา -->
                    <li class="relative">
                        <button
                            @click="toggleDropdown('contact')"
                            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center"
                        >
                            เกี่ยวกับเรา
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            v-if="activeDropdown === 'contact'"
                            class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                        >
                            <RouterLink
                                v-for="(item, index) in mobileSections[2].items"
                                :key="index"
                                :to="item.to"
                                :class="{
                                    'text-blue-500': route.path === item.to,
                                    'text-gray-700 hover:bg-gray-100': route.path !== item.to
                                }"
                                class="block px-4 py-2 text-sm"
                            >
                                {{ item.label }}
                            </RouterLink>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden flex justify-center h-16 items-center">
                <button
                    @click="isOpen = !isOpen"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                    <span class="sr-only">Open main menu</span>
                    <svg v-if="!isOpen" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </nav>

        <!-- Mobile menu -->
        <div v-show="isOpen" class="md:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <!-- Home Link -->
                <RouterLink
                    to="/"
                    :class="{
                        'text-blue-500': route.path === '/',
                        'text-gray-700 hover:text-gray-900 hover:bg-gray-50': route.path !== '/'
                    }"
                    class="block px-3 py-2 text-base font-medium"
                >
                    หน้าหลัก
                </RouterLink>

                <!-- Mobile Accordion Menu for About, Services, Contact -->
                <div v-for="section in mobileSections" :key="section.name">
                    <button
                        @click="mobileActiveDropdown = mobileActiveDropdown === section.name ? null : section.name"
                        class="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                        {{ section.name }}
                        <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'transform rotate-180': mobileActiveDropdown === section.name }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div v-show="mobileActiveDropdown === section.name" class="pl-4 transition-all duration-200">
                        <RouterLink
                            v-for="(item, itemIndex) in section.items"
                            :key="itemIndex"
                            :to="item.to"
                            :class="{
                                'text-blue-500': route.path === item.to,
                                'text-gray-600 hover:text-gray-900 hover:bg-gray-50': route.path !== item.to
                            }"
                            class="block px-3 py-2 text-base"
                        >
                            {{ item.label }}
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const isOpen = ref(false);
const activeDropdown = ref(null);
const mobileActiveDropdown = ref(null);
const route = useRoute(); // Use useRoute to get the current route

const toggleDropdown = (dropdown) => {
    activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
};

const mobileSections = [
    {
        name: 'About',
        items: [
            { label: 'Our Story', to: '/about/story' },
            { label: 'Team', to: '/about/team' },
            { label: 'Careers', to: '/about/careers' },
        ]
    },
    {
        name: 'Services',
        items: [
            { label: 'Service 1', to: '/services/service1' },
            { label: 'Service 2', to: '/services/service2' },
            { label: 'Service 3', to: '/services/service3' },
        ]
    },
    {
        name: 'Contact',
        items: [
            { label: 'Email Us', to: '/contact/email' },
            { label: 'Phone', to: '/contact/phone' },
            { label: 'Location', to: '/contact/location' },
        ]
    }
];
</script>

<style scoped>
/* Optional additional styles */
</style>
