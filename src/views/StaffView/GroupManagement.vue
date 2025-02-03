<template>
    <staff-layout>

        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <LoadingOverlay :loading="isLoading" message="โปรดรอสักครู่..." />
            <!-- Container -->
            <div class="container mx-auto max-w-6xl">
                <!-- Header -->
                <div class="mb-8 text-center">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        จัดการสร้างความตระหนัก, การใช้ประโยชน์, และงานยกระดับงานวิจัยและนวัตกรรม
                    </h1>
                </div>

                <!-- Upload Section -->
                <div class="bg-white shadow-xl rounded-2xl p-6 mb-8">
                    <div class="grid md:grid-cols-2 gap-6 items-center">
                        <!-- Image Preview Area -->
                        <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[700px]"
                            @dragover.prevent="dragOver" @dragleave.prevent="dragLeave" @drop.prevent="dropFile">
                            <input type="file" ref="fileInput" @change="handleFileUpload" accept="*"
                                class="hidden">

                            <template v-if="!dataInfo.FilePreview">
                                <v-icon class="text-6xl text-gray-400 mb-4">mdi-cloud-upload</v-icon>
                                <p class="text-gray-600 mb-4">ลากและวางไฟล์ที่นี่ หรือ</p>
                                <button @click="triggerFileInput"
                                    class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                                    เลือกไฟล์
                                </button>
                            </template>

                            <template v-else>
                                <div class="relative group w-full">
                                    <!-- เช็คว่าเป็นรูปภาพ -->
                                    <img v-if="dataInfo.FilePreview[0].includes('image')"   
                                        :src="dataInfo.id ? `${baseUrl}/${dataInfo.FilePreview}` : `${dataInfo.FilePreview}`"
                                        class="yes max-w-full max-h-80 rounded-xl object-cover mx-auto"
                                        @error="handleImageError" />
                                        
                                    <!-- เช็คว่าเป็น pdf -->
                                    <div v-else-if="dataInfo.FilePreview[0].includes('.pdf')">
                                        <iframe v-if="dataInfo.id" :src="`${baseUrl}/${dataInfo.FilePreview}#toolbar=0`"
                                            class="yes max-w-full min-h-[500px] rounded-xl mx-auto" frameborder="0"
                                            width="100%" height="100%">
                                        </iframe>
                                    </div>
                                    <!-- เช็คว่าเป็น pdf preview -->
                                    <div v-else-if="dataInfo.FilePreview.includes('data:application/pdf')">
                                        <iframe :src="`${dataInfo.FilePreview}#toolbar=0`"
                                            class="yes max-w-full min-h-[500px] rounded-xl mx-auto" frameborder="0"
                                            width="100%" height="100%">
                                        </iframe>
                                    </div>
                                    
                                     <!-- เช็คว่าเป็นรูป preview -->
                                    <img v-else :src="dataInfo.FilePreview"
                                        class="no max-w-full max-h-80 rounded-xl object-cover mx-auto"
                                        @error="handleImageError" />

                                        <!-- <div>{{ dataInfo.FilePreview }}</div> -->
                                    <div
                                        :class="dataInfo.FilePreview[0].includes('.pdf') ? 'mt-2' : 'absolute inset-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-300 rounded-xl '">
                                        <button @click="triggerFileInput"
                                            class="bg-white px-4 py-2 rounded-full opacity-80 group-hover:opacity-100 transition-all hover:scale-110">
                                            เปลี่ยนไฟล์
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <!-- Upload Form -->
                        <div>
                            <v-form @submit.prevent="uploadImage">
                                <!-- Dropdown with @change to trigger fetchData -->
                                <v-autocomplete variant="solo-filled" flat label="หมวดหมู่"
                                    v-model="servicesForApi.servicesType" :items="dropdownItems"
                                    :rules="[rules.required]" @change="fetchData"></v-autocomplete>

                                <!-- Text field for the fetched data -->
                                <v-text-field v-model="dataInfo.servicesSubType" label="ชื่อหัวข้อ" variant="outlined"
                                    class="mb-4" :rules="[rules.topic]" required></v-text-field>

                                <!-- Textarea for the fetched description -->
                                <v-textarea v-model="dataInfo.information" label="คำอธิบาย" variant="outlined"
                                    class="mb-4" :rules="[rules.description]" required rows="4" auto-grow></v-textarea>
                                <!-- Buttons -->
                                <div class="flex space-x-4">
                                    <v-btn v-if="dataInfo.id == null" type="submit" color="green darken-1"
                                        variant="elevated"
                                        :disabled="!dataInfo.FilePreview || !dataInfo.information || !servicesForApi.servicesType"
                                        class="flex-grow">
                                        อัพโหลดข้อมูล
                                    </v-btn>
                                    <v-btn v-else color="green darken-1" variant="elevated" @click="updateImagenData"
                                        :disabled="!dataInfo.FilePreview || !servicesForApi.servicesType || !dataInfo.information || !dataInfo.servicesType"
                                        class="flex-grow">
                                        แก้ไขข้อมูล
                                    </v-btn>
                                    <v-btn v-if="dataInfo.FilePreview && dataInfo.id" @click="deleteDialog = true"
                                        color="red darken-1" variant="outlined">
                                        ลบข้อมูล
                                    </v-btn>
                                </div>
                            </v-form>
                        </div>
                    </div>
                </div>

                <!-- Image Gallery -->
                <!-- <div class="bg-white shadow-xl rounded-2xl p-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">
                        คลังข้อมูล
                    </h2>

                    <template v-if="dataInfo.length">
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <div v-for="(info, index) in dataInfo" :key="index" class="relative group">
                                <div class="bg-white shadow-lg rounded-xl overflow-hidden">
                                    <div class="relative">
                                        <img v-if="info.filePath" :src="info.filePath" alt="Image"
                                            class="w-full h-48 object-cover" />
                                        <div
                                            class="absolute inset-0 bg-opacity-100 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center space-x-4">
                                            <button @click="startEditImage(image)"
                                                class="bg-white p-2 rounded-full opacity-80 group-hover:opacity-100 transition-all hover:scale-110">
                                                <v-icon>mdi-pencil</v-icon>
                                            </button>
                                            <button @click="deleteDialog = true; selectedImage = image"
                                                class="bg-red-500 text-white p-2 rounded-full opacity-80 group-hover:opacity-100 transition-all hover:scale-110">
                                                <v-icon>mdi-delete</v-icon>
                                            </button>
                                        </div>
                                        
                                    </div>
                                    <div class="p-4">
                                        <p class="text-gray text-sm">{{ info.servicesType }}</p>
                                        <p class="text-gray font-medium break-words">{{ info.servicesSubType }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
                        <v-icon class="text-6xl text-gray-400 mb-4">mdi-image-off</v-icon>
                        <p class="text-gray-600">ยังไม่มีข้อมูลในคลัง</p>
                    </div>
                </div> -->
            </div>

            <!-- Edit Image Dialog -->
            <!-- <v-dialog v-model="editDialog" max-width="600">
                <v-card v-if="selectedImage" class="rounded-2xl">
                    <v-card-title class="text-2xl font-semibold text-gray-800 pb-0">
                        แก้ไขข้อมูล
                    </v-card-title>
                    <v-card-text>
                        <div class="max-w-full bg-gray-200 flex items-center justify-center rounded-xl mb-4">
                            <img v-if="selectedImage.url" :src="selectedImage.url" alt="Image"
                                class="max-w-full h-full object-cover rounded-xl" />
                        </div>
                        <v-autocomplete variant="solo-filled" flat label="หมวดหมู่" v-model="selectedImage.group"
                            :items="['งานสร้างความตระหนักด้านทรัพย์สินทางปัญญา', 'การใช้ประโยชน์ผลงานทรัพย์สินทางปัญญา', 'งานยกระดับงานวิจัยและนวัตกรรม']"></v-autocomplete>
                        <v-text-field v-model="selectedImage.title" label="ชื่อหัวข้อ" variant="outlined"
                            class="mb-4"></v-text-field>
                        <v-textarea v-model="selectedImage.description" label="คำอธิบาย" variant="outlined" rows="4"
                            auto-grow></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="saveImageEdit" color="green darken-1" variant="elevated" class="mr-2">
                            บันทึก
                        </v-btn>
                        <v-btn @click="editDialog = false" color="red darken-1" variant="outlined">
                            ยกเลิก
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog> -->

            <!-- delete dialog -->
            <v-dialog v-model="deleteDialog" max-width="400">
                <v-card class="rounded-xl py-2 px-2">
                    <v-card-title class="headline text-red-800 text-2xl">ยืนยันการลบ</v-card-title>
                    <v-card-text>
                        <p>คุณต้องการลบข้อมูลนี้ใช่หรือไม่?</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="red darken-1" variant="tonal" text @click="deleteDialog = false">ยกเลิก</v-btn>
                        <v-btn color="green darken-1" variant="tonal" @click="deleteData(dataInfo.id)">ยืนยัน</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </div>
    </staff-layout>
</template>

<script>
import StaffLayout from "@/layouts/staff.vue";
import { useErrorStore } from "@/stores/errorStore";
import api from "@/stores/axios-config";
import "vuetify/dist/vuetify.min.css";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
const errorStore = useErrorStore();
const baseURL = import.meta.env.VITE_BASE_URL;
export default {
    name: "Aware Management View",
    components: {
        StaffLayout,
        LoadingOverlay
    },
    data() {
        return {
            isLoading: false,
            deleteDialog: false,
            baseUrl: baseURL,
            dataInfo: {
                id: null,
                servicesType: null,
                information: null,
                servicesSubType: null,
                FilePreview: null,
            },
            imageFile: null,
            imageCheck: null,
            selectedImage: null,
            images: [],
            group: null,
            rules: {
                required: value => !!value || 'กรุณากรอกข้อมูลในช่อง',
                topic: value => !!value || 'กรุณากรอกชื่อหัวข้อ',
                description: value => !!value || 'กรุณากรอกคำอธิบาย',
            },
            servicesForApi: {
                servicesType: null || "งานสร้างความตระหนักด้านทรัพย์สินทางปัญญา",
            },
            dropdownItems: [
                "งานสร้างความตระหนักด้านทรัพย์สินทางปัญญา",
                "การใช้ประโยชน์ผลงานทรัพย์สินทางปัญญา",
                "งานยกระดับงานวิจัยและนวัตกรรม",
            ],
        }
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click()
        },

        handleFileUpload(event) {
            const file = event.target.files[0]
            if (file.type === 'application/pdf' || file.type.startsWith('image')) {
                this.processFile(file)
                this.imageFile = file
            } else {
                errorStore.show(`กรุณาอัพโหลดเฉพาะไฟล์รูปภาพหรือ PDF`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                })
            }
        },

        dropFile(event) {
            const file = event.dataTransfer.files[0]
            if (file.type === 'application/pdf' || file.type.startsWith('image')) {
                this.processFile(file)
                this.imageFile = file
            }
            else {
                errorStore.show(`กรุณาอัพโหลดเฉพาะไฟล์รูปภาพหรือ PDF`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                })
            }
        },


        processFile(file) {
            // Check if the file is an image or a PDF
            if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
                errorStore.show(`กรุณาอัพโหลดเฉพาะไฟล์รูปภาพหรือ PDF`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
                return;
            }

            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                errorStore.show(`ขนาดไฟล์ต้องไม่เกิน 5MB`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
                return;
            }

            const reader = new FileReader();

            // Handle image files
            if (file.type.startsWith('image/')) {
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        this.dataInfo.FilePreview = e.target.result; // Display image preview
                    };
                    img.onerror = () => {
                        errorStore.show(`ไม่สามารถอ่านไฟล์รูปภาพได้`, {
                            color: "error",
                            icon: "mdi-alert-circle",
                            timeout: 5000
                        });
                    };
                    img.src = e.target.result;
                };
            }

            // Handle PDF files
            if (file.type === 'application/pdf') {
                reader.onload = (e) => {
                    this.dataInfo.FilePreview = e.target.result; // Store PDF data for further processing
                    // You can add logic here to display the PDF preview (e.g., use a PDF viewer)
                };
            }

            reader.onerror = () => {
                errorStore.show(`เกิดข้อผิดพลาดในการอ่านไฟล์`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
            };

            reader.readAsDataURL(file);
            this.imageFile = file;
        },


        startEditImage(image) {
            this.selectedImage = { ...image }
            this.editDialog = true
        },
        saveImageEdit() {
            const index = this.images.findIndex(img => img.id === this.selectedImage.id)
            if (index !== -1) {
                this.images[index] = { ...this.selectedImage }
                this.editDialog = false
                errorStore.show("แก้ไขสำเร็จ", {
                    color: 'success',
                    icon: 'mdi-check-circle',
                    timeout: 5000
                });
            }
        },
        deleteImage(imageId) {
            this.images = this.images.filter(img => img.id !== imageId)
            this.deleteDialog = false
            errorStore.show("ลบสำเร็จ", {
                color: 'success',
                icon: 'mdi-check-circle',
                timeout: 5000
            });
        },
        clearImage() {
            this.group = null
            this.imageTitle = ''
            this.imageDescription = ''
            this.dataInfo.FilePreview = null
            this.imageFile = null
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = ''
            }
        },


        // ===================================================== API =========================================================

        // fetch data
        async fetchData() {
            this.isLoading = true;
            if (!this.servicesForApi.servicesType) return;
            try {
                const res = await api.get(`/getsServices/${this.servicesForApi.servicesType}/all`);
                // Check if res.data and res.data.result exist and are valid arrays
                if (res.data && Array.isArray(res.data.result) && res.data.result.length > 0) {
                    // Extract data from the first item in the result array
                    this.dataInfo = null;
                    this.dataInfo = {
                        id: res.data.result[0]?._id || null,
                        servicesType: res.data.result[0]?.servicesType || this.servicesForApi.servicesType,
                        servicesSubType: res.data.result[0]?.servicesSubType || "",
                        information: res.data.result[0]?.information || "",
                        FilePreview: res.data.result[0]?.filePath || null
                    };
                    this.imageFile = res.data.result[0]?.filePath || null
                    this.imageCheck = this.imageFile;
                    this.isLoading = false;
                } else {
                    // Handle empty or invalid data gracefully
                    this.dataInfo = {
                        id: null,
                        servicesType: "",
                        servicesSubType: "",
                        information: ""
                    };
                    this.isLoading = false;
                }
            } catch (error) {
                this.isLoading = false;
                console.error("Error fetching data:", error);
                throw error;
            }
        },

        // แก้ไขข้อมูล
        async updateImagenData() {
            const formUpdate = new FormData();
            this.isLoading = true;
            console.log("Check", this.imageCheck)
            console.log("File", this.imageFile)
            try {
                // if change image do this function
                if (this.imageFile !== this.imageCheck) {
                    const updateImg = api.patch(`/staff/deleteFileServices/services/${this.dataInfo.id}`, {
                        filePath: this.imageCheck
                    }).then(api.patch(`/staff/addFileServices/services/${this.dataInfo.id}`, {
                        file: this.imageFile
                    }, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    })
                    )

                    console.log("Updated File")
                }
                // and update data
                formUpdate.append('servicesType', this.servicesForApi.servicesType);
                formUpdate.append('servicesSubType', this.dataInfo.servicesSubType);
                formUpdate.append('information', this.dataInfo.information);
                const res = await api.patch(`/staff/updateServicesData/${this.dataInfo.id}`, formUpdate);
                this.isLoading = false;
                errorStore.show("แก้ไขข้อมูลเรียบร้อย", {
                    color: 'success',
                    icon: 'mdi-check-circle',
                    timeout: 5000
                });

                this.fetchData();
            } catch (error) {
                this.isLoading = false;
                throw error;
            }
        },

        // upload image และ information
        async uploadImage() {
            this.isLoading = true
            console.log(this.servicesForApi, this.dataInfo)
            if (!this.servicesForApi.servicesType || !this.dataInfo.servicesSubType || !this.dataInfo.information || !this.dataInfo.FilePreview) {
                errorStore.show(`กรุณากรอกข้อมูลให้ครบ`, {
                    color: "warning",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
                return
            }
            const newImage = {
                group: this.group,
                url: this.dataInfo.FilePreview,
                title: this.imageTitle,
                description: this.imageDescription,
            }

            const formPayload = new FormData();
            try {
                formPayload.append('servicesType', this.servicesForApi.servicesType);
                formPayload.append('servicesSubType', this.dataInfo.servicesSubType);
                formPayload.append('information', this.dataInfo.information);
                formPayload.append('file', this.imageFile);
                const res = await api.post('/staff/addServices', formPayload, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                })
                console.log(res);
                this.images.push(newImage);
                this.clearImage();

                // fetch data
                this.fetchData();
                this.isLoading = false
                errorStore.show("เพิ่มเรียบร้อยแล้ว", {
                    color: 'success',
                    icon: 'mdi-check-circle',
                    timeout: 5000
                });
            } catch (error) {
                console.error(error);
                this.isLoading = false
            }

        },

        // ลบข้อมูล
        async deleteData(id) {
            this.isLoading = true;
            try {
                await api.delete(`/staff/deleteServices/services/${id}`);
                this.fetchData();
                this.deleteDialog = false;
                this.isLoading = false;
                errorStore.show("ลบข้อมูลสําเร็จ", {
                    color: 'success',
                    icon: 'mdi-check-circle',
                    timeout: 5000
                });
            } catch (error) {
                this.isLoading = false;
                this.deleteDialog = false;
                throw error;
            }
        },

    },


    mounted() {
        this.fetchData();
    },

    // เช็คว่า servicesType มีการเปลี่ยนแปลงหรือไม่
    watch: {
        'servicesForApi.servicesType': {
            handler(newValue) {
                if (newValue) {
                    this.fetchData();
                }
            }
        }
    }
}
</script>