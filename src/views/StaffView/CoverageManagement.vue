<template>
    <StaffLayout>
        <LoadingOverlay v-if="loading && dataInfo.id || dataInfo.sevicesType || dataInfo.sevicesSubType"></LoadingOverlay>

        <v-card v-else class="mx-auto pa-4" max-width="800">
            <v-card-title>PDF Document Upload</v-card-title>
            
            <!-- Upload Section -->
            <v-file-input v-model="pdfFile" accept=".pdf" label="Upload PDF" prepend-icon="mdi-file-pdf-box"
                @change="handleFileUpload" :error-messages="fileError" show-size truncate-length="15"></v-file-input>

            <!-- Document Information Form -->
            <v-form ref="form" v-model="valid" @submit.prevent="saveDocument">
                <!-- Topic Dropdown -->
                <v-select v-model="dataInfo.servicesType" :items="topics" label="Select Topic" :rules="topicRules" required
                    clearable></v-select>

                <v-textarea v-model="dataInfo.servicesSubType" label="ขั้นตอนการยื่นคำขอ" :rules="infoRules" counter
                    required></v-textarea>

                <v-textarea v-model="dataInfo.information" label="นิยามความหมายสั้นๆ" :rules="titleRules"
                    required></v-textarea>



                <!-- Preview Section -->
                <v-card v-if="pdfPreviewUrl" class="mt-4 mb-4">
                    <v-card-title>Preview</v-card-title>
                    <v-card-text>
                        <object :data="pdfPreviewUrl" type="application/pdf" width="100%" height="500">
                            <p>PDF preview is not available. Please download to view.</p>
                        </object>
                    </v-card-text>
                </v-card>

                <!-- Action Buttons -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="resetForm" :disabled="!pdfFile && !documentTitle && !documentInfo">
                        Reset
                    </v-btn>
                    <v-btn color="primary" type="submit" :disabled="!valid || !pdfFile" :loading="loading">
                        Save Document
                    </v-btn>
                </v-card-actions>
            </v-form>

            <!-- Success Snackbar -->
            <v-snackbar v-model="snackbar" :color="snackbarColor">
                {{ snackbarText }}
                <template v-slot:action="{ attrs }">
                    <v-btn text v-bind="attrs" @click="snackbar = false">
                        Close
                    </v-btn>
                </template>
            </v-snackbar>
        </v-card>
    </StaffLayout>
</template>

<script>
import StaffLayout from '@/layouts/staff.vue';
import api from '@/stores/axios-config';
import { useErrorStore } from '@/stores/errorStore';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const baseURL = import.meta.env.VITE_BASE_URL;
export default {
    name: 'CoverageManagement',
    components: {
        StaffLayout,
        LoadingOverlay
    },
    data() {
        return {
            dataInfo: [],
            valid: false,
            pdfFile: null,
            pdfPreviewUrl: null,
            documentTitle: '',
            documentInfo: '',
            selectedTopic: 'สิทธิบัตรการออกแบบผลิตภัณฑ์',
            loading: false,
            topics: [
                'สิทธิบัตรการประดิษฐ์/อนุสิทธิบัตร',
                'สิทธิบัตรการออกแบบผลิตภัณฑ์',
                'ลิขสิทธิ์',
                'เครื่องหมายการค้า',
                'ระบบติดตามผลงานที่อยู่ระหว่างดำเนินการยื่นคำขอฯ',
            ],
            fileError: '',
            snackbar: false,
            snackbarText: '',
            snackbarColor: 'success',

            titleRules: [
                v => !!v || 'Title is required',
                v => v.length <= 100 || 'Title must be less than 100 characters'
            ],
            topicRules: [
                v => !!v || 'Topic is required'
            ],
            infoRules: [
                v => !!v || 'Information is required',
                v => v.length <= 500 || 'Information must be less than 500 characters'
            ]
        }
    },
    methods: {
        handleFileUpload(file) {
            this.fileError = '';
            this.pdfPreviewUrl = null;

            if (!file) {
                return;
            }

            // Check file type
            if (!file.endsWith('.pdf')) {
                this.fileError = 'Please upload a valid PDF file';
                this.pdfFile = null;
                return;
            }

            // Check file size (e.g., max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                this.fileError = 'File size must be less than 10MB';
                this.pdfFile = null;
                return;
            }

            try {
                this.pdfPreviewUrl = URL.createObjectURL(file);
            } catch (error) {
                console.error('Error creating preview URL:', error);
                this.fileError = 'Error creating file preview';
            }
        },

        async fetchData(){
            console.log(this.selectedTopic)
            const res = await api.get(`/getsServices/${this.selectedTopic}/all`);
            console.log('success')
            console.log(res.data.result[0])
            this.dataInfo = res.data.result[0];
        },

        async saveDocument() {
            if (!this.$refs.form.validate() || !this.pdfFile) {
                return;
            }
            this.loading = true;

            try {
                const formData = new FormData();
                formData.append('file', this.pdfFile);
                formData.append('servicesSubType', this.documentTitle);
                formData.append('servicesType', this.selectedTopic);
                formData.append('information', this.documentInfo);

                const response = await api.post('/staff/addServices', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log("success",response)
                this.showSnackbar('Document saved successfully!', 'success');
                this.resetForm();
            } catch (error) {
                console.log("Eorrr",response)
                console.error('Error saving document:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },


        

        resetForm() {
            if (this.$refs.form) {
                this.$refs.form.reset();
            }
            this.pdfFile = null;
            if (this.pdfPreviewUrl) {
                URL.revokeObjectURL(this.pdfPreviewUrl);
            }
            this.pdfPreviewUrl = null;
            this.documentTitle = '';
            this.documentInfo = '';
            this.selectedTopic = 'สิทธิบัตรการประดิษฐ์/อนุสิทธิบัตร';
            this.fileError = '';
        },

        showSnackbar(text, color = 'success') {
            this.snackbarText = text;
            this.snackbarColor = color;
            this.snackbar = true;
        }
    },
    beforeDestroy() {
        // Clean up any object URLs when component is destroyed
        if (this.pdfPreviewUrl) {
            URL.revokeObjectURL(this.pdfPreviewUrl);
        }
    },

    mounted() {
        this.fetchData();
    }
}
</script>

<style scoped>
.v-card {
    margin-top: 20px;
}
</style>