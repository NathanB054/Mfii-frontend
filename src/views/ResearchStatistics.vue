<template>
    <v-container>
        <v-card class="rounded-lg pa-4 mb-4 !bg-gray-200">
            <v-card-title class="font-semibold"><v-icon>mdi mdi-text-box-search-outline</v-icon>
                ผลงานวิจัยที่ถูกเข้าถึงบ่อย</v-card-title>
            <v-card-text class="rounded-xl">
                <v-data-table :headers="headers" :items="researchWithCounts" :items-per-page="-1" :fixed-header="true"
                    height="400" class="elevation-1">
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>

    <div class="text-center">
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" vertical>
            <div class="text-subtitle-1 pb-2"></div>
            <p>{{ snackbar.message }}</p>
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="snackbar.show = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import  api  from '@/stores/axios-config';
import { ref, reactive, computed } from "vue";
import { useErrorStore } from "@/stores/errorStore";

export default {
    setup() {
        const snackbar = reactive({
            show: false,
            message: "",
            color: "success"
        });

        const productCounts = reactive({});
        const research = ref([]);

        const headers = [
            { title: 'ชื่อผลงาน', align: "start", sortable: false, key: "nameOnMedia" },
            { title: 'จำนวนการเข้าชม', align: "center", key: "viewCount" }
        ];

        const fetchResearch = async () => {
            try {
                const res = await api.get('/getsResearch/all/all/all/all');
                research.value = res.data.result;
            } catch (error) {
             throw error;
            }
        };

        const fetchResearchCounts = async () => {
            const errorStore = useErrorStore();
            try {
                const response = await api.get('/getStatProduct');
                Object.assign(productCounts, response.data.result);
            } catch (error) {
                errorStore.show(`Error fetching research counts ${error}`, {
                        color: 'error',
                        icon: 'mdi-alert-circle',
                        timeout: 5000
                    });
            }
        };

        const researchWithCounts = computed(() => {
            return research.value.map(item => ({
                ...item,
                viewCount: productCounts[item._id] || 0
            }));
        });

        // Fetch both research and product counts when component is created
        fetchResearch();
        fetchResearchCounts();

        return {
            headers,
            researchWithCounts,
            snackbar
        };
    }
};
</script>

<style scoped></style>