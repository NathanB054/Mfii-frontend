<template>
    <v-app>
        <v-main>
            <staff-layout>
                <v-container class="font-noto-sans-thai">
                    <v-card class="rounded-3xl pa-2 mb-2 !bg-gray-200">
                        <v-card-title class="d-flex align-center my-2">
                            <v-icon icon="mdi-text-box-search"></v-icon> &nbsp;
                            จัดการสืบค้นข้อมูลทรัพย์สินทางปัญญา
                            <v-spacer></v-spacer>
                            <v-text-field class="px-5" v-model="search" density="compact" label="Search"
                                prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line
                                clearable @click:clear="clearSearch"></v-text-field>
                            <v-btn @click="createResearch" class="my-4 !bg-slate-800 text-white">เพิ่มการสืบค้น</v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table v-model:search="search" :headers="headers" :items="researchesRevert"
                                :items-per-page="10" class="elevation-1">
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-container class="flex justify-center align-center">
                                        <v-icon small class="mr-2" @click="editResearch(item)">mdi-pencil</v-icon>
                                        <v-icon small class="mr-2" :class="item.status == 'active' ? 'text-green' : 'text-red'
                                            " @click="toggleVisibility(item)">
                                            {{ item.status == "active" ? "mdi-eye" : "mdi-eye-off" }}
                                        </v-icon>
                                        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                                    </v-container>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                    <v-dialog v-model="dialog" max-width="1050px">
                        <v-card class="rounded-xl">
                            <v-card-title>{{
                                isEdit ? "แก้ไขสืบค้นข้อมูลทรัพย์สินทางปัญญา" : "สร้างสืบค้นข้อมูลทรัพย์สินทางปัญญา"
                            }}</v-card-title>
                            <v-card-text>
                                <v-form ref="form" v-model="valid">
                                    <v-text-field label="ชื่อผลงาน" variant="solo-filled"
                                        v-model="currentResearch.nameOnMedia" :rules="[rules.required]"
                                        required></v-text-field>
                                    <v-combobox v-model="currentResearch.inventor" label="ผู้ประดิษฐ์"
                                        variant="solo-filled" chips multiple :rules="[rules.required]"
                                        required></v-combobox>
                                    <v-autocomplete variant="solo-filled" flat label="สังกัด"
                                        v-model="currentResearch.major" :items="[
                                            'สำนักวิชาศิลปศาสตร์',
                                            'สำนักวิชาวิทยาศาสตร์',
                                            'สำนักวิชาการจัดการ',
                                            'สำนักวิชาเทคโนโลยีสารสนเทศ',
                                            'สำนักวิชาอุตสาหกรรมเกษตร',
                                            'สำนักวิชานิติศาสตร์',
                                            'สำนักวิชาวิทยาศาสตร์เครื่องสำอาง',
                                            'สำนักวิชาวิทยาศาสตร์สุขภาพ',
                                            'สำนักวิชาพยาบาลศาสตร์',
                                            'สำนักวิชาเวชศาสตร์ชะลอวัยและฟื้นฟูสุขภาพ',
                                            'สำนักวิชาแพทยศาสตร์',
                                            'สำนักวิชาทันตแพทยศาสตร์',
                                            'สำนักวิชานวัตกรรมสังคม',
                                            'สำนักวิชาจีนวิทยา',
                                            'สำนักวิชาการแพทย์บูรณาการ',
                                            'อื่นๆ',
                                        ]" :rules="[rules.required]" required></v-autocomplete>
                                    <v-combobox variant="solo-filled" flat label="ผู้ทรงสิทธิ"
                                        v-model="currentResearch.holder" :rules="[rules.required]"></v-combobox>
                                    <v-autocomplete variant="solo-filled" flat label="ทรัพย์สินทางปัญญา"
                                        v-model="currentResearch.intelProp" :items="[
                                            'สิทธิบัตรการประดิษฐ์',
                                            'อนุสิทธิบัตร',
                                            'สิทธิบัตรออกแบบ',
                                            'ลิขสิทธิ์',
                                            'ลิขสิทธิ์-โปรแกรมคอมพิวเตอร์',
                                            'ผลงานวิจัย',
                                            'ต้นแบบ',
                                            'อื่น ๆ',
                                        ]" :rules="[rules.required]" required></v-autocomplete>
                                    <v-autocomplete variant="solo-filled" flat label="ประเภทอุตสาหกรรม"
                                        v-model="currentResearch.industryType" :items="[
                                            'เครื่องสำอาง',
                                            'การเกษตรและเทคโนโลยีชีวภาพ',
                                            'การแปรรูปอาหาร',
                                            'เชื้อเพลิงชีวภาพและเคมีชีวภาพ',
                                            'การแพทย์ครบวงจร',
                                            'สร้างสรรค์',
                                            'อิเล็กทรอนิกส์อัจฉริยะ',
                                            'หุ่นยนต์',
                                            'ดิจิตอล',
                                            'การท่องเที่ยวกลุ่มรายได้ดีและการท่องเที่ยวเชิงสุขภาพ',
                                            'การบินและระบบขนส่ง',
                                            'ยานยนต์สมัยใหม่',
                                        ]" :rules="[rules.required]" required></v-autocomplete>
                                    <v-autocomplete variant="solo-filled" flat label="ความพร้อมของเทคโนโลยี"
                                        v-model="currentResearch.techReadiness"
                                        :items="['ระดับการทดลอง', 'ระดับต้นแบบ', 'ระดับถ่ายทอด']"
                                        :rules="[rules.required]" required></v-autocomplete>

                                    <v-combobox v-model="currentResearch.coop" label="ความร่วมมือที่เสาะหา" chips
                                        multiple variant="solo-filled" :rules="[rules.required]" required></v-combobox>

                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="12" lg="4">
                                                <v-text-field label="เลขที่คำขอ" variant="solo-filled"
                                                    v-model="currentResearch.numberReq"
                                                    :rules="[rules.required]"></v-text-field>

                                                <!-- Date Picker วันที่ยื่นคำขอ -->
                                                <v-menu v-model="dateReq" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    min-width="290px">
                                                    <template #activator="{ props }">
                                                        <v-text-field v-bind="props" label="วันที่ยื่นคำขอ"
                                                            v-model="formattedDateReq" readonly variant="solo-filled"
                                                            prepend-inner-icon="mdi-calendar-range"
                                                            :rules="[rules.requiredDate]">
                                                        </v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="currentResearch.dateReq"
                                                        @update:modelValue="dateReq = false" locale="th-TH">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12" lg="4">
                                                <v-text-field label="เลขที่ประกาศโฆษณา"
                                                    v-model="currentResearch.numberAds" :rules="[rules.required]"
                                                    variant="solo-filled"></v-text-field>

                                                <!-- Date Picker วันที่ประกาศโฆษณา -->
                                                <v-menu v-model="dateAds" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    min-width="290px">
                                                    <template #activator="{ props }">
                                                        <v-text-field v-bind="props" label="วันที่ประกาศโฆษณา"
                                                            v-model="formattedDateAds" readonly variant="solo-filled"
                                                            prepend-inner-icon="mdi-calendar-range"
                                                            :rules="[rules.requiredDate]">
                                                        </v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="currentResearch.dateAds"
                                                        @update:modelValue="dateAds = false" locale="th-TH">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12" lg="4">
                                                <v-text-field label="เลขที่รับจดทะเบียน" variant="solo-filled"
                                                    v-model="currentResearch.numberRegister"
                                                    :rules="[rules.required]"></v-text-field>

                                                <!-- Date Picker วันที่รับจดทะเบียน -->
                                                <v-menu v-model="dateRegister" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    min-width="290px">
                                                    <template #activator="{ props }">
                                                        <v-text-field v-bind="props" label="วันที่รับจดทะเบียน"
                                                            v-model="formattedDateRegister" readonly
                                                            variant="solo-filled"
                                                            prepend-inner-icon="mdi-calendar-range"
                                                            :rules="[rules.requiredDate]">
                                                        </v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="currentResearch.dateRegister"
                                                        @update:modelValue="dateRegister = false" locale="th-TH">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-col>
                                        </v-row>

                                        <v-row>
                                            <v-col cols="12" sm="12" md="12" lg="4">
                                                <!-- Date Picker วันที่หมดอายุ -->
                                                <v-menu v-model="dateExp" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    min-width="290px">
                                                    <template #activator="{ props }">
                                                        <v-text-field v-bind="props" label="วันที่หมดอายุ"
                                                            v-model="formattedDateExp" readonly variant="solo-filled"
                                                            prepend-inner-icon="mdi-calendar-range"
                                                            :rules="[rules.requiredDate]">
                                                        </v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="currentResearch.dateExp"
                                                        @update:modelValue="dateExp = false" locale="th-TH">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12" lg="4">
                                                <v-menu v-model="dueFee" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    min-width="290px">
                                                    <template #activator="{ props }">
                                                        <v-text-field v-bind="props"
                                                            label="ครบกำหนดชำระค่าธรรมเนียมรายปี"
                                                            v-model="formatteddueFee" readonly variant="solo-filled"
                                                            prepend-inner-icon="mdi-calendar-range"
                                                            :rules="[rules.requiredDate]">
                                                        </v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="currentResearch.dueFee"
                                                        @update:modelValue="dueFee = false" locale="th-TH">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12" lg="4">
                                                <!-- Date Picker แจ้งเตือนชำระค่าธรรมเนียมรายปี -->
                                                <v-menu v-model="notifyFee" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    min-width="290px">
                                                    <template #activator="{ props }">
                                                        <v-text-field v-bind="props"
                                                            label="แจ้งเตือนชำระค่าธรรมเนียมรายปี"
                                                            v-model="formattednotifyFee" readonly variant="solo-filled"
                                                            prepend-inner-icon="mdi-calendar-range"
                                                            :rules="[rules.requiredDate]">
                                                        </v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="currentResearch.notifyFee"
                                                        @update:modelValue="notifyFee = false" locale="th-TH">
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-col>
                                        </v-row>
                                    </v-container>

                                    <v-text-field label="ปีงบประมาณ" variant="solo-filled"
                                        v-model="currentResearch.budgetYear" :rules="[rules.required]"
                                        required></v-text-field>

                                    <v-text-field label="แก้ไขเพิ่มเติม" variant="solo-filled"
                                        v-model="currentResearch.editMore"></v-text-field>

                                    <v-text-field label="สถานะสุดท้าย" variant="solo-filled"
                                        v-model="currentResearch.lastStatus" :rules="[rules.required]"></v-text-field>

                                    <v-text-field label="ลักษณะผลงาน" variant="solo-filled"
                                        v-model="currentResearch.workType" :rules="[rules.required]"></v-text-field>

                                    <v-text-field label="การใช้ประโยชน์" variant="solo-filled"
                                        v-model="currentResearch.utilization" :rules="[rules.required]"></v-text-field>

                                    <v-text-field label="อื่นๆ" variant="solo-filled"
                                        v-model="currentResearch.other"></v-text-field>

                                    <v-text-field label="หมายเหตุ" variant="solo-filled"
                                        v-model="currentResearch.note"></v-text-field>

                                    <v-combobox label="Keyword" variant="solo-filled" chips multiple
                                        v-model="currentResearch.keyword"></v-combobox>
                                    <v-container class="flex">
                                        <v-checkbox v-model="currentResearch.ipType" label="Portfolio" value="portfolio"
                                            :rules="[rules.required]" required></v-checkbox>
                                        <v-checkbox v-model="currentResearch.ipType" label="Prototype" value="prototype"
                                            :rules="[rules.required]" required></v-checkbox>
                                    </v-container>

                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="red darken-1" variant="tonal" class="" text
                                    @click="dialog = false">ยกเลิก</v-btn>
                                <v-btn color="green darken-1" variant="tonal" text @click="validateForm">{{ isEdit ?
                                    "บันทึก" : "สร้าง"
                                    }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!-- loading indicator -->
                    <div v-if="isUploading" class="loading-overlay">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        <span class="loading-text">Saving research...</span>
                    </div>
                </v-container>
            </staff-layout>

            <!-- Dialog delete research -->
            <v-dialog v-model="dialogDelete" max-width="800px">
                <v-card class="rounded-xl pa-4">
                    <v-card-title class="text-h5 text-center text-black">คุณแน่ใจหรือว่าต้องการลบ<br />
                        <p class="text-red-500">{{ currentResearch.nameOnMedia }} ?</p>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="'blue-grey-darken-1" variant="outlined" class="hover:bg-gray-500"
                            @click="closeDelete">ยกเลิก</v-btn>
                        <v-btn color="red-darken-1" variant="outlined" class="hover:bg-red-300"
                            @click="deleteResearch">ตกลง</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-main>
    </v-app>
</template>

<script>
import StaffLayout from "@/layouts/staff.vue";
import api from "@/stores/axios-config";
import { useErrorStore } from "@/stores/errorStore";
import dayjs from "dayjs";
import "dayjs/locale/th";
const errorStore = useErrorStore();
const baseURL = import.meta.env.VITE_BASE_URL;

export default {
    name: "staff-ResearchManagement-page",
    components: {
        StaffLayout,
    },
    data() {
        return {
            valid: false,
            isUploading: false,
            search: "",
            baseUrl: "",
            dialog: false,
            isEdit: false,
            dialogDelete: false,
            headers: [
                { title: "ชื่อผลงาน", value: "nameOnMedia" },
                { title: "หมวดหมู่", value: "industryType" },
                { title: "ผู้จัดทำ", value: "inventor" },
                {
                    title: "Actions",
                    align: "center",
                    value: "actions",
                    sortable: false,
                },
            ],
            dateReq: false,
            dateAds: false,
            dateRegister: false,
            dateExp: false,
            dueFee: false,
            notifyFee: false,
            researches: [],
            researchesRevert: [],
            currentResearch: {
                dateReq: null,
                dateAds: null,
                dateRegister: null,
                dateExp: null,
                dueFee: null,
                notifyFee: null,
                numberReq: "",
                numberAds: "",
                numberRegister: "",
                editMore: "",
                lastStatus: "",
                workType: "",
                utilization: "",
                other: "",
                note: "",
                budgetYear: "",
                nameOnMedia: "",
                inventor: [],
                major: "",
                intelProp: "",
                industryType: "",
                techReadiness: "",
                coop: [],
                ipType: "",
                status: "",
                keyword: null,
            },
            rules: {
                required: (value) => !!value || "กรุณากรอกข้อมูลในช่อง",
                requiredDate: (value) => !!value || "กรุณาเลือกวันที่",
            },
        };
    },

    methods: {
        closeMenu() {
            this.menu = false; // ปิดเมนูเมื่อเลือกวันที่
        },
        createResearch() {
            this.resetCurrentResearch();
            this.isEdit = false;
            this.dialog = true;
        },
        editResearch(item) {
            this.currentResearch = { ...item };
            this.isEdit = true;
            this.dialog = true;
        },
        async toggleVisibility(item) {
            // Toggle the visibility status
            item.status = item.status === "active" ? "inactive" : "active";

            // Send the updated status to the localhost
            try {
                await api.patch(`/staff/updateResearchData/${item._id}`, {
                    status: item.status,
                });
                errorStore.show(
                    item.status === "active" ? "เปิดแสดงสืบค้นข้อมูลทรัพย์สินทางปัญญา" : "ปิดแสดงสืบค้นข้อมูลทรัพย์สินทางปัญญา",
                    {
                        color: item.status === "active" ? "success" : "warning",
                        icon:
                            item.status === "active"
                                ? "mdi-check-circle"
                                : "mdi-alert-circle",
                        timeout: 5000,
                    }
                );
            } catch (error) {
                this.handleError(error);
            }
        },
        resetCurrentResearch() {
            this.currentResearch = {
                budgetYear: "",
                nameOnMedia: "",
                inventor: [],
                major: "",
                intelProp: "",
                industryType: "",
                techReadiness: "",
                coop: [],
                ipType: "",
                status: "active",
                keyword: null,
            };
        },
        validateForm() {
            this.$refs.form.validate();
            if (this.valid) {
                this.saveResearch();
            }
        },

        async saveResearch() {
            if (!this.valid) {
                return;
            }
            this.isUploading = true;
            try {
                const formData = new FormData();
                formData.append("numberReq", this.currentResearch.numberReq);
                formData.append("numberAds", this.currentResearch.numberAds);
                formData.append("numberRegister", this.currentResearch.numberRegister);
                formData.append("dateReq", this.currentResearch.dateReq);
                formData.append("dateAds", this.currentResearch.dateAds);
                formData.append("dateRegister", this.currentResearch.dateRegister);
                formData.append("dateExp", this.currentResearch.dateExp);
                formData.append("dueFee", this.currentResearch.dueFee);
                formData.append("notifyFee", this.currentResearch.notifyFee);
                formData.append("editMore", this.currentResearch.editMore);
                formData.append("lastStatus", this.currentResearch.lastStatus);
                formData.append("workType", this.currentResearch.workType);
                formData.append("utilization", this.currentResearch.utilization);
                formData.append("other", this.currentResearch.other);
                formData.append("note", this.currentResearch.note);
                formData.append("budgetYear", this.currentResearch.budgetYear);
                formData.append("nameOnMedia", this.currentResearch.nameOnMedia);
                formData.append("inventor", this.currentResearch.inventor);
                formData.append("major", this.currentResearch.major);
                formData.append("description", this.currentResearch.description);
                formData.append("intelProp", this.currentResearch.intelProp);
                formData.append("industryType", this.currentResearch.industryType);
                formData.append("techReadiness", this.currentResearch.techReadiness);
                formData.append("coop", this.currentResearch.coop);
                formData.append("status", this.currentResearch.status);
                formData.append("ipType", this.currentResearch.ipType);
                formData.append("keyword", this.currentResearch.keyword);


                if (this.isEdit) {
                    try {
                        await api.patch(
                            `/staff/updateResearchData/${this.currentResearch._id}`,
                            {
                                numberReq: this.currentResearch.numberReq,
                                numberAds: this.currentResearch.numberAds,
                                numberRegister: this.currentResearch.numberRegister,
                                dateReq: this.currentResearch.dateReq,
                                dateAds: this.currentResearch.dateAds,
                                dateRegister: this.currentResearch.dateRegister,
                                dateExp: this.currentResearch.dateExp,
                                dueFee: this.currentResearch.dueFee,
                                notifyFee: this.currentResearch.notifyFee,
                                editMore: this.currentResearch.editMore,
                                lastStatus: this.currentResearch.lastStatus,
                                workType: this.currentResearch.workType,
                                utilization: this.currentResearch.utilization,
                                other: this.currentResearch.other,
                                note: this.currentResearch.note,
                                budgetYear: this.currentResearch.budgetYear,
                                nameOnMedia: this.currentResearch.nameOnMedia,
                                inventor: this.currentResearch.inventor,
                                major: this.currentResearch.major,
                                description: this.currentResearch.description,
                                intelProp: this.currentResearch.intelProp,
                                industryType: this.currentResearch.industryType,
                                techReadiness: this.currentResearch.techReadiness,
                                coop: this.currentResearch.coop,
                                status: this.currentResearch.status,
                                ipType: this.currentResearch.ipType,
                                keyword: this.currentResearch.keyword,
                            }
                        );
                        await api.patch(
                            `/staff/addFileResearch/${this.currentResearch._id}`,
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );

                        if (this.currentResearch.length > 0) {
                            await api.patch(
                                `/staff/deleteFileResearch/research/${this.currentResearch._id}`
                            );
                        }
                        errorStore.show("แก้ไขสืบค้นข้อมูลทรัพย์สินทางปัญญาสำเร็จ", {
                            color: "success",
                            icon: "mdi-check-circle",
                            timeout: 5000,
                        });
                    } catch (error) {
                        this.dialog = false;
                        this.resetCurrentResearch();
                        throw error;
                    }
                } else {
                    await api.post("/staff/addResearch", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    errorStore.show("เพิ่มสืบค้นข้อมูลทรัพย์สินทางปัญญาเรียบร้อยแล้ว", {
                        color: "success",
                        icon: "mdi-check-circle",
                        timeout: 5000,
                    });
                }
                this.fetchResearches();
            } catch (error) {
                this.dialog = false;
                this.resetCurrentResearch();
                throw error;
            } finally {
                this.isUploading = false;
                this.dialog = false;
                this.resetCurrentResearch();
            }
        },
        // =====================================================================================================

        // Delete Research =====================================================================================================
        deleteItem(item) {
            this.currentResearch = Object.assign({}, item);
            this.dialogDelete = true;
        },
        closeDelete() {
            this.dialogDelete = false;
        },

        async deleteResearch() {
            try {
                await api.delete(
                    `/staff/deleteResearch/research/${this.currentResearch._id}`
                );
                this.dialogDelete = false;
                this.fetchResearches();
                errorStore.show("ลบสืบค้นข้อมูลทรัพย์สินทางปัญญาสำเร็จ", {
                    color: "success",
                    icon: "mdi-check-circle",
                    timeout: 5000,
                });
            } catch (error) {
                this.dialog = false;
                this.resetCurrentResearch();
                throw error;
            }
        },

        // =====================================================================================================
        // get research data funnctions
        async fetchResearches() {
            try {
                const response = await api.get("/getsResearch/all/all/all/all");
                this.researches = response.data.result;
                this.researchesRevert = [...response.data.result].reverse();
            } catch (error) {
                this.dialog = false;
                this.resetCurrentResearch();
                throw error;
            }
        },

        clearSearch() {
            this.search = "";
            this.fetchResearches();
        },

        // Date Picker
        formatThaiDate: (date) =>
            date ? dayjs(date).locale("th").format("DD MMMM YYYY") : "",
    },

    computed: {
        formattedDateReq() {
            return this.formatThaiDate(this.currentResearch.dateReq);
        },
        formattedDateAds() {
            return this.formatThaiDate(this.currentResearch.dateAds);
        },
        formattedDateRegister() {
            return this.formatThaiDate(this.currentResearch.dateRegister);
        },
        formattedDateExp() {
            return this.formatThaiDate(this.currentResearch.dateExp);
        },
        formatteddueFee() {
            return this.formatThaiDate(this.currentResearch.dueFee);
        },
        formattednotifyFee() {
            return this.formatThaiDate(this.currentResearch.notifyFee);
        },
    },

    // get research data when loaded website
    async created() {
        this.fetchResearches();
        this.baseUrl = baseURL;
    },
};
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-text {
    color: white;
    margin-top: 16px;
}
</style>