<template>
    <v-app>
        <v-main>
            <v-container fluid v-if="research" class="font-noto-sans-thai">
                <v-row class="mx-5 pt-6">
                    <v-col cols="12" md="7" lg="7">
                        <v-card class="rounded-xl max-h-fit !bg-gray-100 pa-3 overflow-auto" height="500">

                            <div class="contents">
                                <ul class="py-3 font-bold text-xl">
                                    ชื่อผลงาน {{ research.nameOnMedia }}
                                </ul>
                                <ul>ผู้ประดิษฐ์</ul>
                                <li v-for="( inventor, index ) in research.inventor" :key="index" class="pl-10">{{
                                    inventor }}</li>
                                <ul>สังกัด: <span class="text-gray-700">{{ research.major }}</span></ul>
                                <ul>ทรัพย์สินทางปัญญา: <span class="text-red-600">{{ research.intelProp }}</span></ul>
                                <ul>ประเภทอุตสาหกรรม: <span class="text-green-600">{{ research.industryType }}</span>
                                </ul>
                                <ul>รายละเอียดผลงาน</ul>
                                <p class="pl-10">
                                    {{ research.description }}
                                </p>
                                <ul>จุดเด่น</ul>
                                <li v-for="( highlight, index ) in research.highlight" :key="index" class="pl-10">{{
                                    highlight }}</li>
                                <ul>ความพร้อมของเทคโนโลยี: <span class="text-pink-600">{{ research.techReadiness
                                        }}</span></ul>
                                <ul>ความร่วมมือที่เสาะหา </ul>
                                <li v-for="( coop, index ) in research.coop" :key="index" class="pl-10">{{ coop }}</li>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="5" lg="5">
                        <div class="d-flex justify-center items-center">
                            <v-carousel show-arrows="hover" cycle hide-delimiter-background>
                                <v-carousel-item v-for="(pic, index) in filteredImages" :key="index"
                                    :src="`${baseUrl}/${pic}`" fit></v-carousel-item>
                            </v-carousel>
                        </div>
                    </v-col>
                    <v-col cols="12" md="2" lg="2">
                        <v-container class="text-center">
                            <div>
                                <v-btn class="responsive-btn" variant="outlined" rounded="xl" size="small" block
                                    style="display: flex; align-items: center; justify-content: center;"
                                    @click="downloadPdf()">
                                    <v-icon left class="mr-1">mdi-download</v-icon>
                                    <span>Download PDF</span>
                                </v-btn>
                            </div>
                        </v-container>
                    </v-col>
                </v-row>
                <v-container fluid class="text-white mt-5" style="background-color: #380075;">
                    <p>
                        สนใจเทคโนโลยี โปรดติดต่อ <br />
                        ฝ่ายจัดการทรัพย์สินทางปัญญา มหาวิทยาลัยแม่ฟ้าหลวง <br />
                        โทรศัพท์ 0 5391 7182 หรือ 0 5391 7014 <br />
                        อีเมล ip.mfii@mfu.ac.th
                    </p>
                </v-container>
            </v-container>

            <div class="text-center">
                <v-snackbar v-model="snackbar.show" :color="snackbar.color">
                    <p>{{ snackbar.message }}</p>

                    <template v-slot:actions>
                        <v-btn color="white" variant="text" @click="snackbar.show = false">
                            Close
                        </v-btn>
                    </template>
                </v-snackbar>
            </div>

        </v-main>
    </v-app>
</template>

<script>
import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
export default {
    name: "innovation-page",
    props: ["id"],
    data() {
        return {
            snackbar: {
                show: false,
                message: "",
                color: "success", // Default color
            },
            research: null,
            isLoading: true,
            baseUrl: '',
        };
    },

    created() {
        this.baseUrl = baseURL
    },

    methods: {
        async fetchData() {
            try {
                const response = await axios.get(`/getResearch?researchId=${this.id}`); // Replace with your API endpoint
                this.research = response.data.result;
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
            } finally {
                this.isLoading = false;
            }
        },

        downloadPdf() {
            if (this.research.filePath && this.research.filePath.length > 0) {
                const pdfPath = this.research.filePath.find(path => path.toLowerCase().endsWith('.pdf'));
                if (pdfPath) {
                    window.open(`${baseURL}/${pdfPath}`, '_blank');
                } else {
                    // Handle case where no PDF file is found
                    this.snackbar.message = 'No PDF file';
                    this.snackbar.color = 'default';
                    this.snackbar.show = true;
                }
            } else {
                // Handle case where research data or file paths are not loaded
                this.snackbar.message = 'No research data loaded.';
                this.snackbar.color = 'error';
                this.snackbar.show = true;
            }
        },
    },
    computed: {
        filteredImages() {
            if (this.research) {
                return this.research.filePath.filter(pic => !pic.toLowerCase().endsWith('.pdf'));
            }
            return [];
        },
    },
    mounted() {
        this.fetchData();
    },

}
</script>

<style scoped>
ul {
    font-weight: 600;
    padding: 5px;
}

span {
    font-weight: 400;
}

/* Smaller text for iPad screen sizes */
@media (max-width: 1024px) {

    .responsive-btn span,
    v-icon {
        font-size: 8px;
    }
}
</style>