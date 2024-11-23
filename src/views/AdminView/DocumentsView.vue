<template>
    <admin-layout>
        <v-container class="py-4">
            <v-card class="pa-4">
                <v-card-title class="text-h5">Download Database</v-card-title>
                <v-card-text>
                    <v-select v-model="selectedOption" :items="options" item-title="name" item-value="value"
                        label="Select Data Type"></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="downloadCSVs()" :disabled="!selectedOption"
                        class="!bg-red-700 !text-slate-50">Download
                        CSV</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </admin-layout>
</template>

<script>
import AdminLayout from "@/layouts/admin.vue";
import api from '@/stores/axios-config';
import { ref } from 'vue';
import { useErrorStore } from "@/stores/errorStore";
const errorStore = useErrorStore();

export default {
    name: 'document-page',
    components: {
        AdminLayout,
    },
    data() {
        return {
            selectedOption: ref(null),
            options: [
                { name: 'รายงาน การเข้าถึงผลงาน/วิจัย', value: 'researchAccess' },
                { name: 'รายงาน การเข้าถึงเว็บไซต์รายวัน', value: 'dailyAccess' },
                { name: 'รายงาน การเข้าถึงเว็บไซต์รายเดือน', value: 'monthlyAccess' },
                { name: 'รายงาน การเข้าถึงเว็บไซต์รายปี', value: 'yearlyAccess' },
            ]
        };
    },

    methods: {
        async downloadCSVs() {
            try {
                const response = await api.get('/download?fields=' + this.selectedOption, {
                    responseType: 'blob' // Important: responseType set to 'blob' for file download
                });

                // Create a Blob object from the response
                const blob = new Blob([response.data], { type: 'text/csv' });

                // Create a URL for the blob
                const url = window.URL.createObjectURL(blob);

                // Find the selected option object
                const selectedOptionObj = this.options.find(option => option.value === this.selectedOption);
                // Get the name of the selected option
                const fileName = selectedOptionObj ? selectedOptionObj.name : 'download';

                // Create a temporary <a> element to trigger the download
                const link = document.createElement('a');
                link.href = url;
                link.download = `${fileName}.csv`; // Set the file name here
                document.body.appendChild(link);

                // Trigger the download
                link.click();

                // Clean up: remove the temporary link and revoke the URL object
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                errorStore.show("ดาวน์โหลดรายงานสำเร็จ", {
                    color: 'success',
                    icon: 'mdi-check-circle',
                    timeout: 5000
                });
            } catch (error) {
                errorStore.show("ไม่มีการตอบกลับจากเซิฟเวอร์ หรือ เซิฟเวอร์ผิดผลาด", {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
            }
        }
    }
};
</script>

<style scoped></style>
