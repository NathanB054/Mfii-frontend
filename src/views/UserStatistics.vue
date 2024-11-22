<template>
    <v-container>
        <v-card class="rounded-lg !bg-gray-200">
            <v-card-title class="font-semibold"><v-icon>mdi mdi-web</v-icon> จำนวนผู้ใช้งานเว็บไซต์</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-card>
                            <v-card-title>จำนวนผู้ใช้งานวันนี้</v-card-title>
                            <v-card-text>{{ todayUsers || 0 }}</v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-title>จำนวนผู้ใช้งานเดือนนี้</v-card-title>
                            <v-card-text>{{ monthlyUsers || 0 }}</v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-title>จำนวนผู้ใช้งานปีนี้</v-card-title>
                            <v-card-text>{{ yearlyUsers || 0 }}</v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-title>จำนวนผู้ใช้งานทั้งหมด</v-card-title>
                            <v-card-text>{{ totalUsers || 0 }}</v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" vertical>
            <div class="text-subtitle-1 pb-2"></div>
            <p>{{ snackbar.message }}</p>
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="snackbar.show = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>

    </v-container>
</template>

<script>
import api from '@/stores/axios-config';

export default {
    data() {
        return {
            totalUsers: 0,
            todayUsers: 0,
            monthlyUsers: 0,
            yearlyUsers: 0,
            snackbar: {
                show: false,
                message: "",
                color: "success",
            },
        };
    },
    created() {
        this.getViewerCount();
    },
    methods: {
        async getViewerCount() {
            try {
                const response = await api.get('/getStatAll');
                const viewerCounts = response.data.result;

                // Assuming viewerCounts is the object fetched from MongoDB
                this.totalUsers = viewerCounts.totalAccess;
                this.todayUsers = viewerCounts.dailyAccess
                this.monthlyUsers = viewerCounts.monthlyAccess
                this.yearlyUsers = viewerCounts.yearlyAccess
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
        },
    },
};
</script>

<style scoped></style>