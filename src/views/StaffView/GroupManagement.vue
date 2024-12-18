<template>
    <staff-layout>
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
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
                        <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]"
                            @dragover.prevent="dragOver" @dragleave.prevent="dragLeave" @drop.prevent="dropFile">
                            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*"
                                class="hidden">

                            <template v-if="!imagePreview">
                                <v-icon class="text-6xl text-gray-400 mb-4">mdi-cloud-upload</v-icon>
                                <p class="text-gray-600 mb-4">ลากและวางรูปภาพที่นี่ หรือ</p>
                                <button @click="triggerFileInput"
                                    class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                                    เลือกไฟล์
                                </button>
                            </template>

                            <template v-else>
                                <div class="relative group w-full">
                                    <img :src="imagePreview" class="max-w-full max-h-80 rounded-xl object-cover mx-auto"
                                        @error="handleImageError" />
                                    <div
                                        class="absolute inset-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-300 rounded-xl">
                                        <button @click="triggerFileInput"
                                            class="bg-white px-4 py-2 rounded-full opacity-80 group-hover:opacity-100 transition-all hover:scale-110">
                                            เปลี่ยนรูป
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <!-- Upload Form -->
                        <div>
                            <v-form @submit.prevent="uploadImage">
                                <v-autocomplete variant="solo-filled" flat label="หมวดหมู่" v-model="group"
                                    :items="['งานสร้างความตระหนักด้านทรัพย์สินทางปัญญา', 'การใช้ประโยชน์ผลงานทรัพย์สินทางปัญญา', 'งานยกระดับงานวิจัยและนวัตกรรม']"
                                    :rules="[rules.required]" required></v-autocomplete>
                                <v-text-field v-model="imageTitle" label="ชื่อหัวข้อ" variant="outlined" class="mb-4"
                                    :rules="[rules.topic]" required></v-text-field>

                                <v-textarea v-model="imageDescription" label="คำอธิบาย" variant="outlined" class="mb-4"
                                    :rules="[rules.description]" required rows="4" auto-grow></v-textarea>

                                <div class="flex space-x-4">
                                    <v-btn type="submit" color="green darken-1" variant="elevated"
                                        :disabled="!imagePreview || !group || !imageDescription || !imageTitle"
                                        class="flex-grow">
                                        อัพโหลดข้อมูล
                                    </v-btn>
                                    <v-btn v-if="imagePreview" @click="clearImage" color="red darken-1"
                                        variant="outlined">
                                        ยกเลิก
                                    </v-btn>
                                </div>
                            </v-form>
                        </div>
                    </div>
                </div>

                <!-- Image Gallery -->
                <div class="bg-white shadow-xl rounded-2xl p-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">
                        คลังข้อมูล
                    </h2>

                    <template v-if="images.length">
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <div v-for="(image, index) in images" :key="index" class="relative group">
                                <div class="bg-white shadow-lg rounded-xl overflow-hidden">
                                    <div class="relative">
                                        <img v-if="image.url" :src="image.url" alt="Image"
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
                                        <p class="text-gray-500 text-sm">{{ image.group }}</p>
                                        <p class="text-gray-800 font-medium break-words">{{ image.title }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
                        <v-icon class="text-6xl text-gray-400 mb-4">mdi-image-off</v-icon>
                        <p class="text-gray-600">ยังไม่มีข้อมูลในคลัง</p>
                    </div>
                </div>
            </div>

            <!-- Edit Image Dialog -->
            <v-dialog v-model="editDialog" max-width="600">
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
            </v-dialog>

            <!-- delete dialog -->
            <v-dialog v-model="deleteDialog" max-width="400">
                <v-card class="rounded-xl py-2 px-2">
                    <v-card-title class="headline text-red-800 text-2xl">ยืนยันการลบ</v-card-title>
                    <v-card-text>
                        <p>คุณต้องการลบข้อมูลนี้ใช่หรือไม่?</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="red darken-1" variant="tonal" text @click="deleteDialog = false">ยกเลิก</v-btn>
                        <v-btn color="green darken-1" variant="tonal"
                            @click="deleteImage(selectedImage.id)">ยืนยัน</v-btn>
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
    name: "Aware Management View",
    components: {
        StaffLayout,
    },
    data() {
        return {
            imageFile: null,
            imagePreview: null,
            imageDescription: '',
            imageTitle: '',
            editDialog: false,
            deleteDialog: false,
            selectedImage: null,
            images: [],
            group: null,
            rules: {
                required: value => !!value || 'กรุณากรอกข้อมูลในช่อง',
                topic: value => !!value || 'กรุณากรอกชื่อหัวข้อ',
                description: value => !!value || 'กรุณากรอกคำอธิบาย',
            }
        }
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click()
        },
        handleFileUpload(event) {
            const file = event.target.files[0]
            if (file) {
                this.processFile(file)
            }
        },
        dropFile(event) {
            const file = event.dataTransfer.files[0]
            if (file && file.type.startsWith('image/')) {
                this.processFile(file)
            }
        },
        processFile(file) {
            if (!file.type.startsWith('image/')) {
                errorStore.show(`กรุณาอัพโหลดเฉพาะไฟล์รูปภาพ`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                errorStore.show(`ขนาดไฟล์ต้องไม่เกิน 5MB`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
                return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                    this.imagePreview = e.target.result
                }
                img.onerror = () => {
                    errorStore.show(`ไม่สามารถอ่านไฟล์รูปภาพได้`, {
                        color: "error",
                        icon: "mdi-alert-circle",
                        timeout: 5000
                    });
                }
                img.src = e.target.result
            }
            reader.onerror = () => {
                errorStore.show(`เกิดข้อผิดพลาดในการอ่านไฟล์`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
            }
            reader.readAsDataURL(file)
            this.imageFile = file
        },
        uploadImage() {
            if (!this.imagePreview || !this.group || !this.imageDescription || !this.imageTitle) {
                errorStore.show(`กรุณากรอกข้อมูลให้ครบ`, {
                    color: "warning",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
                return
            }

            const newImage = {
                group: this.group,
                url: this.imagePreview,
                title: this.imageTitle,
                description: this.imageDescription
            }

            this.images.push(newImage)
            this.clearImage()
            errorStore.show("เพิ่มเรียบร้อยแล้ว", {
                color: 'success',
                icon: 'mdi-check-circle',
                timeout: 5000
            });
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
            this.imagePreview = null
            this.imageFile = null
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = ''
            }
        }
    }
}
</script>