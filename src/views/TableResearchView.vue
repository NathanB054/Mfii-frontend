<template>
    <!-- Filters Section -->
    <v-container fluid>
        <v-card class="rounded-lg py-6 px-4">
            <v-row class="d-flex justify-center">
                <v-col cols="12" sm="6" md="4" lg="3">
                    <v-combobox v-model="Industry_type" :items="indust" item-value="value" item-title="text" clearable
                        chips density="comfortable" variant="outlined" label="ประเภทอุตสาหกรรม"></v-combobox>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                    <v-combobox v-model="Intellectual_property_type" :items="prop" item-value="value" item-title="text"
                        clearable chips density="comfortable" variant="outlined" label="ประเภทผลงาน"></v-combobox>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                    <!-- search -->
                    <v-text-field v-model="search" density="comfortable" placeholder="Search"
                        prepend-inner-icon="mdi-magnify" style="max-width: 300px" variant="solo" clearable hide-details
                        rounded>
                    </v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </v-container>

    <!-- Data Section -->
    <v-container fluid>
        <v-card class="rounded-lg pa-4 mb-4 !bg-gray-200">
            <v-card-title class="d-flex flex-column flex-md-row align-start align-md-center my-2 !text-2xl">
                <div class="d-flex align-center">
                    <v-icon icon="mdi-text-box-search" />
                    <span class="text-start text-xl sm:text-xl md:text-2xl lg:text-3xl ml-2">
                        สืบค้นข้อมูลทรัพย์สินทางปัญญา
                    </span>
                </div>
                <v-spacer></v-spacer>
                <span class="mt-2 mt-md-0 text-warning !text-sm d-flex align-center">
                    <v-icon color="warning" class="mr-1">mdi-alert-circle-outline</v-icon>
                    บุคลากร มฟล เข้าสู่ระบบเพื่อเข้าถึงข้อมูลมากขึ้น!
                </span>
            </v-card-title>
            <v-card-text class="rounded-xl">
                <v-data-table :headers="filteredHeaders" :items="data" :items-per-page="-1" :fixed-header="true"
                    height="450" class="elevation-0">
                    <template v-for="header in filteredHeaders" v-slot:[`item.${header.key}`]="{ item }">
                        <div :style="{
                            width: ['intelProp', 'editMore', 'workType'].includes(header.key) ? '150px' : ['nameOnMedia', 'inventor', 'major', 'holder', 'other', 'industryType', 'utilization', 'note'].includes(header.key) ? '250px' : 'auto',
                            padding: '8px'
                        }">
                            <template v-if="header.key === 'inventor'">
                                <ul style="list-style-type: none; padding-left: 0; text-align: left;">
                                    <li v-for="(name, index) in item[header.key]" :key="index">- {{ name }}</li>
                                </ul>
                            </template>
                            <template v-else>
                                {{ item[header.key] }}
                            </template>
                        </div>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import api from '@/stores/axios-config';
import { useErrorStore } from '@/stores/errorStore';

export default {
    name: "Table",
    data() {
        return {
            search: "",
            Industry_type: "ทั้งหมด",
            Intellectual_property_type: "ทั้งหมด",
            indust: [
                { value: "cosme", text: "เครื่องสำอาง" },
                { value: "agtech", text: "การเกษตรและเทคโนโลยีชีวภาพ" },
                { value: "f4f", text: "การแปรรูปอาหาร" },
                { value: "biofc", text: "เชื้อเพลิงชีวภาพและเคมีชีวภาพ" },
                { value: "medhub", text: "การแพทย์ครบวงจร" },
                { value: "arts", text: "สร้างสรรค์" },
                { value: "smeln", text: "อิเล็กทรอนิกส์อัจฉริยะ" },
                { value: "robot", text: "หุ่นยนต์" },
                { value: "digit", text: "ดิจิทัล" },
                {
                    value: "amwt",
                    text: "การท่องเที่ยวกลุ่มรายได้ดีและการท่องเที่ยวเชิงสุขภาพ",
                },
                { value: "alois", text: "การบินและโลจิสติกส์" },
                { value: "nxato", text: "ยานยนต์สมัยใหม่" },
            ],
            prop: [
                { value: "ptn", text: "สิทธิบัตรการประดิษฐ์" },
                { value: "ppt", text: "อนุสิทธิบัตร" },
                { value: "dsp", text: "สิทธิบัตรออกแบบ" },
                { value: "cpr", text: "ลิขสิทธิ์" },
                { value: "cpp", text: "ลิขสิทธิ์-โปรแกรมคอมพิวเตอร์" },
                { value: "khw", text: "ผลงานวิจัย" },
                { value: "pte", text: "ต้นแบบ" },
                { value: "oth", text: "อื่น ๆ" },
            ],

            businessType: "", // ประเภทผู้ใช้
            headers: [
                { title: "ลำดับ", key: "id" },
                { title: "ชื่อผลงาน", key: "nameOnMedia" },
                { title: "ชื่อ - นามสกุล", key: "inventor" },
                { title: "สังกัด", key: "major" },
                { title: "ผู้ทรงสิทธิ", key: "holder" },
                { title: "ประเภทผลงาน", key: "intelProp" },
                { title: "เลขที่คำขอ", key: "numberReq" },
                { title: "วันที่ยื่นคำขอ", key: "dateReq" },
                { title: "ปีงบประมาณ", key: "budgetYear" },
                { title: "แก้ไขเพิ่มเติม", key: "editMore" },
                { title: "เลขที่ประกาศโฆษณา", key: "numberAds" },
                { title: "วันที่ประกาศโฆษณา", key: "dateAds" },
                { title: "สถานะสุดท้าย", key: "lastStatus" },
                { title: "เลขที่รับจดทะเบียน", key: "numberRegister" },
                { title: "วันที่รับจดทะเบียน", key: "dateRegister" },
                { title: "วันที่หมดอายุ", key: "dateExp" },
                { title: "ครบกำหนดชำระค่าธรรมเนียมรายปี", key: "dueFee" },
                { title: "แจ้งเตือนชำระค่าธรรมเนียมรายปี", key: "notiFee" },
                { title: "อื่นๆ", key: "other" },
                { title: "ประเภทอุตสาหกรรม", key: "industryType" },
                { title: "ลักษณะผลงาน", key: "workType" },
                { title: "การใช้ประโยชน์", key: "utilization" },
                { title: "หมายเหตุ", key: "note" },
            ].map((column) => ({
                ...column,
                align: "center",
            })),
            data: [], // เก็บข้อมูลจาก API
        };
    },
    methods: {
        // Search ResearchData
        fetchResearchData() {
            const indust = this.Industry_type?.value || "all";
            const prop = this.Intellectual_property_type?.value || "all";
            const descript = (this.search ? this.search.trim() : "all");
            api.get(`/getsResearch/${indust}/${prop}/all/${descript}`).then((response) => {
                if (response.status == 200) {
                    this.data = response.data.result.map((item, index) => ({
                        ...item,
                        id: index + 1,
                    }));
                } else {
                    this.error = new Error("Error fetching data");
                }
            })
                .catch((error) => {
                    throw error;
                });
        },
    },
    computed: {
        filteredHeaders() {
            this.fetchResearchData();

            // แสดงคอลัมน์ทั้งหมดเมื่อ businessType เป็น "บุคลากร มฟล"
            if (this.businessType === "บุคลากร มฟล") {
                return this.headers;
            }
            // แสดงคอลัมน์บางส่วนเมื่อไม่ได้ล็อกอิน หรือ businessType เป็น "นิติบุคคล" หรือ "บุคคลธรรมดา"
            else {
                return this.headers.filter((header) =>
                    ["id", "nameOnMedia", "inventor", "major", "intelProp", "industryType"].includes(header.key)
                );
            }
        },
    },
    async mounted() {
        this.fetchResearchData();
        try {
            // ดึงข้อมูลจาก '/getsResearch/all/all/all/all' สำหรับแสดงผลก่อน
            const researchResponse = await api.get("/getsResearch/all/all/all/all");
            // console.log("Research data:", researchResponse.data); // ดูข้อมูลที่ได้รับจาก API

            // เข้าถึงข้อมูลจาก result และทำการปรับโครงสร้าง
            const researchData = researchResponse.data.result || [];
            this.data = researchData.map((item, index) => ({
                ...item,
                id: index + 1, // เพิ่มลำดับอัตโนมัติ
            }));

            // ตรวจสอบว่ามีข้อมูลใน this.data หรือไม่
            if (this.data.length > 0) {
                const errorStore = useErrorStore();
                // ถ้ามีข้อมูลใน this.data ให้เรียก /getUser
                if (localStorage.getItem('token')) {
                   try {
                    const userResponse = await api.get("/getUser");
                    this.businessType = userResponse.data.resutl.businessType;
                    // this.isLoggedIn = userResponse.data.isLoggedIn;
                   } catch (error) {
                    throw error;
                   }
                } 
                //  console.log("businessType:", this.businessType);
            } else {
                console.error("No data found from research API.");
            }

        } catch (error) {
            throw error;
        }
    }
};
</script>
