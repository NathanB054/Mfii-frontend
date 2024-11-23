<template>
    <v-app>
        <v-main>
            <staff-layout>
                <v-container>
                    <v-card class="rounded-xl pa-4">
                        <v-container class="flex justify-center">
                            <v-card-title class="text-h4">สร้างโพสข่าวสาร</v-card-title>
                        </v-container>
                        <v-container class="containerPost d-flex justify-space-between">
                            <!-- News Images Upload Section -->
                            <v-container class="imageUpload">
                                <div>
                                    <div class="titleNews flex justify-center">
                                        <v-chip class="ma-2 pa-5 text-10" elevation="2"
                                            style="border-radius: 50px; font-size: 1.2rem;">
                                            อัพโหลดรูปภาพข่าวสาร
                                        </v-chip>
                                    </div>
                                    <v-container class="imageUpload flex justify-center">
                                        <v-btn color="blue" @click="openDialog('images')"
                                            prepend-icon="mdi-file-image">อัพโหลดไฟล์รูปภาพ</v-btn>
                                        <div class="mx-4 flex align-center">
                                            <h1>หรือ</h1>
                                        </div>
                                        <v-btn color="light-blue lighten-5" class="black--text"
                                            @click="openDialog('linkImage')" prepend-icon="mdi-web">
                                            อัพโหลดลิงค์รูปภาพ
                                        </v-btn>
                                    </v-container>
                                </div>
                            </v-container>

                            <!-- Spacer -->
                            <v-spacer></v-spacer>

                            <!-- YouTube Upload Section -->
                            <v-container class="youtubeContainer flex align-center">
                                <div>
                                    <div>
                                        <v-chip class="ma-2 pa-5 text-h10" elevation="2"
                                            style="border-radius: 50px;font-size: 1.2rem;">
                                            อัพโหลดลิงค์(Youtube)
                                        </v-chip>
                                    </div>
                                    <v-container class="youtubeBtn d-flex justify-center">
                                        <v-btn color="red" class="white--text" @click="openDialog('linkVideo')"
                                            prepend-icon="mdi-youtube">
                                            อัพโหลดลิงค์ youtube
                                        </v-btn>
                                    </v-container>
                                </div>
                            </v-container>
                        </v-container>

                        <!-- Dialog for Upload -->
                        <v-dialog v-model="dialogNewpost" max-width="500px">
                            <v-card class="rounded-xl py-2 px-2">
                                <v-card-text>
                                    <v-form @submit.prevent="addNews">
                                        <p class="ml-10 text-red-500 mb-2"
                                            v-if="activeField === 'linkImage' || activeField === 'images'">
                                            อัพโหลดรูปภาพขนาดไม่เกิน 2048 X 800
                                        </p>
                                        <div v-if="activeField === 'images'">
                                            <p class="text-warning text-sm font-italic ml-10">
                                                <v-icon color="warning">mdi-alert-circle-outline</v-icon>
                                                อัพโหลดไฟล์รูปภาพไม่เกิน 2 MB
                                            </p>
                                        </div>
                                        <v-text-field v-if="activeField === 'linkVideo'" v-model="news.linkVideo"
                                            label="URL video" clearable prepend-icon="mdi-youtube"
                                            variant="solo-filled"></v-text-field>
                                        <v-text-field v-if="activeField === 'linkImage'" v-model="news.linkImage"
                                            label="URL Images" clearable prepend-icon="mdi-web"
                                            variant="solo-filled"></v-text-field>
                                        <v-file-input v-if="activeField === 'images'" v-model="news.images"
                                            label="Upload Images" chips multiple show-size variant="solo-filled"
                                            accept="image/*" :rules="[fileSizeRule]">
                                        </v-file-input>
                                    </v-form>
                                    <v-text-field v-if="activeField === 'images' || activeField === 'linkImage'"
                                        v-model="news.linkPage" label="URL PAGE" clearable prepend-icon="mdi-web"
                                        variant="solo-filled"></v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="red darken-1" variant="tonal"
                                        @click="dialogNewpost = false">ยกเลิก</v-btn>
                                    <v-btn color="green darken-1" variant="tonal" type="submit"
                                        :disabled="!validateForm()" @click="addNews">
                                        บันทึก
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-card>
                </v-container>

                <!-- Display Existing Images -->
                <v-container>
                    <v-row>
                        <v-col v-for="(img, index) in imgs" :key="index" cols="12" md="4">
                            <v-card class="hover:shadow-lg transition-shadow rounded-lg my-1 mx-1"
                                style="max-width: 400px">
                                <v-img v-if="img.filePath.length > 0" :src="`${baseUrl}/${img.filePath[0]}`"
                                    height="150px" cover />
                                <v-img v-else-if="img.linkImage.length > 0" :src="img.linkImage[0]" height="150px"
                                    cover />
                                <iframe v-else-if="img.linkVideo.length > 0" :src="img.linkVideo" height="150px"
                                    class="w-full"></iframe>
                                <p v-else>No media available</p>
                                <v-container class="d-flex justify-center">
                                    <v-btn @click="confirmDelete(img._id, index)" color="error" icon>
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>

                <!-- Delete Confirmation -->
                <v-dialog v-model="dialog" max-width="400">
                    <v-card class="rounded-xl py-2 px-2">
                        <v-card-title class="headline text-red-800 text-2xl">ยืนยันการลบ</v-card-title>
                        <v-card-text>
                            คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="red darken-1" variant="tonal" text @click="cancelDelete">ยกเลิก</v-btn>
                            <v-btn color="green darken-1" variant="tonal" @click="deleteImage">ยืนยัน</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </staff-layout>
        </v-main>
    </v-app>
</template>
<script>
import StaffLayout from "@/layouts/staff.vue";
import api from '@/stores/axios-config';
import { useErrorStore } from "@/stores/errorStore";
const errorStore = useErrorStore();
const baseURL = import.meta.env.VITE_BASE_URL;

export default {
    name: "staff-newPost-page",
    components: {
        StaffLayout,
    },
    data() {
        return {
            baseUrl: baseURL,
            news: {
                images: [], // Array to hold uploaded files
                linkVideo: "",
                linkImage: "",
                linkPage: "",
            },
            imgs: [], // Array to store fetched images
            dialog: false, // Dialog state for delete confirmation
            dialogNewpost: false, // Dialog state for new post form
            activeField: '', // Tracks which input field is active
            deleteIndex: -1, // Index of the item to delete
            deleteImgId: '', // ID of the item to delete
        };
    },
    methods: {
        // Open dialog for specific input type
        openDialog(field) {
            this.activeField = field;
            this.dialogNewpost = true;
        },

        // Validate form before submission
        validateForm() {
            // Ensure at least one input field has valid data
            if (
                this.news.images.length === 0 &&
                !this.news.linkImage &&
                !this.news.linkVideo
            ) {
                return false;
            }
            return true;
        },

        // Convert YouTube URL to embed format
        convertToEmbedUrl(url) {
            try {
                const videoId = url.split('v=')[1] || url.split('/')[3];
                const ampersandPosition = videoId.indexOf('&');
                return ampersandPosition !== -1
                    ? `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`
                    : `https://www.youtube.com/embed/${videoId}`;
            } catch {
                errorStore.show("ลิงก์วิดีโอไม่ถูกต้อง", {
                    color: 'error',
                    icon: 'mdi-alert-circle',
                    timeout: 5000
                });
                return "";
            }
        },

        // Add new news post
        async addNews() {
            try {
                if (!this.validateForm()) return;

                if (!this.checkFileSizes()) {
                    return;
                }

                const formData = new FormData();
                this.news.images.forEach((file) => formData.append('images', file));
                if (this.news.linkVideo) {
                    const embedUrl = this.convertToEmbedUrl(this.news.linkVideo);
                    if (!embedUrl) return;
                    formData.append('linkVideo', embedUrl);
                }
                if (this.news.linkImage) formData.append('linkImage', this.news.linkImage);
                if (this.news.linkPage) formData.append('linkPage', this.news.linkPage);

                await api.post('/staff/addNews', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                this.fetchImg();
                this.resetNewsForm();
                this.dialogNewpost = false;
                errorStore.show("โพสต์สําเร็จ", {
                    color: 'success',
                    icon: 'mdi-check-circle',
                    timeout: 5000
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

        // Reset form fields
        resetNewsForm() {
            this.news = { images: [], linkVideo: "", linkImage: "", linkPage: "" };
        },

        // Fetch existing news images from API
        async fetchImg() {
            try {
                const response = await api.get('/getsNews');
                this.imgs = response.data.result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

        // Confirm deletion dialog
        confirmDelete(imgId, index) {
            this.deleteIndex = index;
            this.deleteImgId = imgId;
            this.dialog = true;
        },

        // Delete image from server
        async deleteImage() {
            try {
                await api.delete(`staff/deleteNews/news/${this.deleteImgId}`);
                this.imgs.splice(this.deleteIndex, 1);
                this.dialog = false;
                errorStore.show("ลบสำเร็จ", {
                    color: 'success',
                    icon: 'mdi-check-circle',
                    timeout: 5000
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

        // Cancel delete action
        cancelDelete() {
            this.dialog = false;
        },

        // Check file sizes (ensure all files are <= 2MB)
        checkFileSizes() {
            const maxSize = 2 * 1024 ** 2; // 2 MB
            return this.news.images.every((file) => file.size <= maxSize);
        },

        // Rule to validate file size in file input
        fileSizeRule(value) {
            const maxSize = 2 * 1024 ** 2;
            if (value && Array.isArray(value)) {
                return value.every(file => file.size <= maxSize) || "ขนาดไฟล์ควรน้อยกว่า 2MB";
            }
            return true;
        },
    },

    // Fetch existing images on component mount
    mounted() {
        this.fetchImg();
    },
};
</script>


<style scoped>
.youtubeContainer {
    justify-content: end;
}

@media (max-width: 1295px) {
    .containerPost {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .imageUpload {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .youtubeContainer {
        display: flex;
        justify-content: center;
    }

    .titleNews {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .youtubeBtn {
        align-items: center;
        justify-content: center;
    }
}

@media (max-width: 465px) {
    .containerPost .v-btn {
        font-size: 10px;
        padding: 4px 8px;
        min-width: 50px;
        height: 28px;
    }
}
</style>
