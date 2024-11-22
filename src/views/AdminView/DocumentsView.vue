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
                    <v-btn @click="downloadCSVs()" :disabled="!selectedOption" class="!bg-red-700 !text-slate-50">Download
                        CSV</v-btn>
                </v-card-actions>
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
    </admin-layout>
</template>

<script>
import AdminLayout from "@/layouts/admin.vue";
import api from '@/stores/axios-config';
import { ref } from 'vue';


export default {
    name: 'document-page',
    components: {
        AdminLayout,
    },
    data() {
        return {
            snackbar: {
                show: false,
                message: "",
                color: "success", // Default color
            },
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
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
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

            } catch (error) {
                let errorMessage = "An unexpected error occurred";
                let errorCode = "Unknown";
                let errorDetails = "";
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    const errorDesc = error.response.data.description;
                    if (errorDesc && (errorDesc.code === 40107 || errorDesc.code === 40102)) {
                        // Handle specific error codes
                        errorMessage = errorDesc.code === 40107 ? errorDesc.description : errorDesc.description;
                        errorCode = errorDesc.code;
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    } else {
                        errorMessage = errorDesc?.description || error.response.data.message || "Server error";
                        errorCode = error.response.status;
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    errorMessage = "ไม่มีการตอบกลับจากเซิฟเวอร์ หรือ เซิฟเวอร์ผิดผลาด";
                } else if (error.code === 'ERR_NETWORK') {
                    // Network error
                    errorMessage = "Network Error";
                    errorCode = error.code;
                } else {
                    // Something happened in setting up the request that triggered an Error
                    errorMessage = error.message;
                }
                // Add more detailed error information
                errorDetails = `${error.name}: ${error.message}`;
                // Log the error
                console.error(`Error : ${errorDetails}`, error);

                this.snackbar = {
                    message: `Error: ${errorMessage}${errorCode !== "Unknown" ? ` (Code: ${errorCode})` : ''}`,
                    color: "error",
                    Errcode: errorCode,
                    show: true
                };
            }
        }

    }

};
</script>

<style scoped></style>