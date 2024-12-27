<template>
    <staff-layout>
        <div class="min-h-screen bg-gradient-to-b from-indigo-100 to-white p-8">
            <div class="container mx-auto max-w-4xl">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-bold text-gray-800">อัพโหลดไฟล์ระเบียบ PDF</h1>
                    <p class="text-lg text-gray-600">อัพโหลดไฟล์ PDF ที่เกี่ยวข้องกับระเบียบ</p>
                </div>

                <!-- Upload Section -->
                <div class="bg-white p-8 rounded-xl shadow-lg">
                    <!-- File Drop Area -->
                    <div class="border-2 border-dashed border-gray-400 rounded-lg p-10 text-center"
                        @dragover.prevent="dragOver" @dragleave.prevent="dragLeave" @drop.prevent="dropFile">
                        <input type="file" ref="fileInput" @change="handleFileUpload" accept="application/pdf"
                            class="hidden" />
                        <template v-if="!pdfPreview">
                            <v-icon class="text-6xl text-gray-500 mb-4">mdi-cloud-upload</v-icon>
                            <p class="text-gray-500 mb-4">ลากและวางไฟล์ PDF ที่นี่ หรือ</p>
                            <button @click="triggerFileInput"
                                class="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300">
                                เลือกไฟล์
                            </button>
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center">
                                <v-icon class="text-6xl text-red-500 mb-4">mdi-file-pdf</v-icon>
                                <p class="text-gray-600 mb-4">ไฟล์ PDF พร้อมสำหรับการอัพโหลด</p>
                                <button @click="triggerFileInput"
                                    class="bg-yellow px-6 py-2 rounded-full opacity-80 hover:opacity-100 transition-all">
                                    เปลี่ยนไฟล์
                                </button>
                                <p class="mt-4 text-sm text-gray-500">ชื่อไฟล์: {{ pdfFileName }}</p>
                            </div>
                        </template>
                    </div>

                    <!-- Form Section -->
                    <div class="mt-8">
                        <v-text-field v-model="pdfTitle" label="ชื่อระเบียบ" variant="outlined" class="mb-6"
                            :rules="[rules.required]" required></v-text-field>

                        <div class="flex justify-between">
                            <v-btn @click="uploadPDF" color="green darken-1" variant="elevated"
                                :disabled="!pdfPreview || !pdfTitle">
                                อัพโหลด
                            </v-btn>
                            <v-btn v-if="pdfPreview" @click="clearPDF" color="red darken-1" variant="outlined">
                                ยกเลิก
                            </v-btn>
                        </div>
                    </div>
                </div>

                <!-- PDF Gallery Section -->
                <div class="mt-12">
                    <h2 class="text-3xl font-semibold text-gray-800 mb-8">คลังไฟล์ PDF</h2>
                    <template v-if="pdfs.length">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div v-for="(pdf, index) in pdfs" :key="index"
                                class="bg-white p-6 rounded-lg shadow-lg text-center">
                                <v-icon class="text-4xl text-blue-500 mb-4">mdi-file-pdf</v-icon>
                                <p class="text-lg font-semibold text-gray-800">{{ pdf.title }}</p>
                                <div class="mt-4 flex justify-center space-x-4">
                                    <v-btn @click="startEditPDF(pdf)" color="blue" small>แก้ไข</v-btn>
                                    <v-btn @click="deleteDialog = true; selectedPDF = pdf" color="red" small>ลบ</v-btn>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-center py-12 bg-gray-100 rounded-lg">
                            <v-icon class="text-6xl text-gray-400 mb-4">mdi-file-pdf-box</v-icon>
                            <p class="text-gray-600">ยังไม่มีไฟล์ PDF ในคลัง</p>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Edit PDF Dialog -->
            <v-dialog v-model="editDialog" max-width="600px">
                <v-card v-if="selectedPDF" class="rounded-xl pa-6">
                    <v-card-title class="text-2xl font-semibold text-gray-800">
                        แก้ไขข้อมูล PDF
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="selectedPDF.title" label="ชื่อไฟล์ PDF" variant="outlined"
                            class="mb-4"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="savePDFEdit" color="green" variant="elevated">บันทึก</v-btn>
                        <v-btn @click="editDialog = false" color="red" variant="outlined">ยกเลิก</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- Delete Confirmation Dialog -->
            <v-dialog v-model="deleteDialog" max-width="400px">
                <v-card class="rounded-xl pa-6">
                    <v-card-title class="text-xl text-red-700 font-semibold">ยืนยันการลบ</v-card-title>
                    <v-card-text>
                        <p>คุณต้องการลบไฟล์นี้ใช่หรือไม่?</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="deleteDialog = false" color="grey" variant="tonal">ยกเลิก</v-btn>
                        <v-btn @click="deletePDF(selectedPDF.id)" color="red" variant="tonal">ลบ</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </staff-layout>
</template>

<script>
import StaffLayout from "@/layouts/staff.vue";
import { useErrorStore } from "@/stores/errorStore";
const errorStore = useErrorStore();
export default {
    name: "PDF Management",
    components: {
        StaffLayout,
    },
    data() {
        return {
            pdfFile: null,
            pdfPreview: null,
            pdfFileName: '',
            pdfTitle: '',
            editDialog: false,
            deleteDialog: false,
            selectedPDF: null,
            pdfs: [],
            rules: {
                required: value => !!value || 'กรุณากรอกข้อมูล',
            },
        };
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.processFile(file);
            }
        },
        dropFile(event) {
            const file = event.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
                this.processFile(file);
            }
        },
        processFile(file) {
            if (file.type !== 'application/pdf') {
                errorStore.show(`กรุณาอัพโหลดเฉพาะไฟล์ PDF`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000,
                });
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                errorStore.show(`ขนาดไฟล์ต้องไม่เกิน 10MB`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000,
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                this.pdfPreview = 'mdi-file-pdf';
                this.pdfFileName = file.name; // Display file name
            };
            reader.onerror = () => {
                errorStore.show(`เกิดข้อผิดพลาดในการอ่านไฟล์`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000,
                });
            };
            reader.readAsDataURL(file);
            this.pdfFile = file;
        },
        async uploadPDF() {
            if (!this.pdfFile || !this.pdfTitle) return;

            // จำลองข้อมูลการอัพโหลด
            const mockResponse = {
                status: 200,
                data: {
                    id: Date.now(), // ใช้ timestamp เป็น id
                },
            };

            // ใช้เวลาหน่วง (simulating delay) เพื่อให้เหมือนกับการเชื่อมต่อกับ API
            setTimeout(() => {
                if (mockResponse.status === 200) {
                    this.pdfs.push({
                        title: this.pdfTitle,
                        description: '', // เพิ่มข้อมูลคำอธิบายถ้าต้องการ
                        id: mockResponse.data.id,
                    });
                    this.clearPDF();
                    errorStore.show(`ไฟล์ PDF ถูกอัพโหลดเรียบร้อยแล้ว`, {
                        color: "success",
                        icon: "mdi-alert-circle",
                        timeout: 5000,
                    });
                } else {
                    errorStore.show(`เกิดข้อผิดพลาดในการอัพโหลด`, {
                        color: "error",
                        icon: "mdi-alert-circle",
                        timeout: 5000,
                    });

                }
            },);
        },
        savePDFEdit() {
            if (!this.selectedPDF.title) {
                errorStore.show(`กรุณากรอกชื่อไฟล์`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000,
                });
                return;
            }

            // จำลองการบันทึกการแก้ไข
            const pdfIndex = this.pdfs.findIndex(pdf => pdf.id === this.selectedPDF.id);
            if (pdfIndex !== -1) {
                this.pdfs[pdfIndex] = this.selectedPDF;
            }

            this.editDialog = false;
            errorStore.show(`ข้อมูล PDF ถูกบันทึกเรียบร้อยแล้ว`, {
                color: "success",
                icon: "mdi-alert-circle",
                timeout: 5000,
            });

        },
        deletePDF(id) {
            const pdfIndex = this.pdfs.findIndex(pdf => pdf.id === id);
            if (pdfIndex !== -1) {
                this.pdfs.splice(pdfIndex, 1); // ลบไฟล์จากรายการ
                this.deleteDialog = false;
                errorStore.show(`ไฟล์ PDF ถูกลบเรียบร้อยแล้ว`, {
                    color: "success",
                    icon: "mdi-alert-circle",
                    timeout: 5000,
                });
            }
        },
        clearPDF() {
            this.pdfPreview = null;
            this.pdfFile = null;
            this.pdfTitle = '';
            this.pdfFileName = '';
        },
        startEditPDF(pdf) {
            this.selectedPDF = { ...pdf };
            this.editDialog = true;
        },
        dragOver(event) {
            event.preventDefault();
        },
        dragLeave(event) {
            event.preventDefault();
        },
    },
};
</script>

<style scoped>
/* เพิ่ม CSS ตามที่ต้องการ */
</style>