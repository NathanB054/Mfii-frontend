<template>
    <v-container>
        <div v-if="dataInfo" class="main-container">
            <!-- Left Column: Image Slider -->
            <div class="left flex justify-center align-center">
            <div v-if="dataInfo.filePath" class="image-box">
                <img v-if="dataInfo.filePath.includes('uploads\\image')" :src="`${baseUrl}/${dataInfo.filePath[0]}`" alt="Infographic or Activity" />
                <iframe v-else :src="`${baseUrl}/${dataInfo.filePath[0]}#toolbar=0`"
                    class="yes max-w-full  rounded-xl mx-auto" frameborder="0" width="100%" height="100%">
                </iframe>
            </div>
        </div>

            <!-- <div class="left">
                <v-carousel height="500" hide-delimiters>
                    <v-carousel-item v-for="(image, index) in images" :key="index">
                        <v-img :src="image" contain width="800" height="500"></v-img>
                    </v-carousel-item>
                </v-carousel>
            </div> -->

            <!-- Right Column: Text and Additional Info -->
            <div v-if="dataInfo.information && dataInfo.servicesSubType" class="right">
                <div class="text-box">
                    <p class="text-header">{{ dataInfo.servicesSubType }}</p>
                    <p class="long-text">
                       {{ dataInfo.information }}
                    </p>
                </div>

                <!-- Include AssetAwareInfo Component -->
                <AssetAwareInfo />
            </div>
        </div>
    </v-container>
</template>

<script>
import AssetAwareInfo from "../components/AssetAwareInfo.vue";
import image1 from "../assets/images/5_Steps_to_Create_an_Infographic_Blog_Post.jpg";
import image2 from "../assets/images/800x500 test.jpeg";

import api from "@/stores/axios-config";

const baseURL = import.meta.env.VITE_BASE_URL;
export default {
    name: "AwareAssetInfo",
    components: {
        AssetAwareInfo,
    },
    data() {
        return {
            // images: [image1, image2], // Array of images for the slider,
            dataInfo: null,
            baseUrl: baseURL,
            isLoading: false
        };
    },

    methods: {
        async fetchData() {
            this.isLoading = true;
            try {
                const res = await api.get(`/getsServices/งานยกระดับงานวิจัยและนวัตกรรม/all`);
                if (res.data) {
                    this.dataInfo = res.data.result[0];
                }
                console.log(this.dataInfo);
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.error("Error fetching data:", error);
                throw error;
            }
        },
    },



    mounted() {
        this.fetchData();
    }
};
</script>

<style scoped>
.main-container {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.left,
.right {
    width: 48%;
    box-sizing: border-box;
}

.image-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* ให้พื้นที่สำหรับรูปภาพเต็มที่ในคอลัมน์ซ้าย */
    height: 70vh;
    /* กำหนดความสูงเป็น 500px */
    text-align: center;
    overflow: hidden;
    /* ตัดส่วนเกินของรูปที่ไม่อยู่ในกรอบ */
}

.image-box img {
    width: 800px;
    /* กำหนดความกว้างเป็น 800px */
    height: 100%;
    /* กำหนดความสูงเป็น 500px */
    object-fit: contain;
    /* ทำให้รูปภาพเต็มกรอบโดยไม่เสียสัดส่วน */
}


.text-box {
    margin-bottom: 20px;
}

.text-header {
    font-weight: bold;
    margin-bottom: 10px;
}

.long-text {
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    text-align: justify;
}
</style>
