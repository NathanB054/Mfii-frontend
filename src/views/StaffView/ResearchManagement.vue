<template>
    <v-app>
        <v-main>
            <staff-layout>
                <v-container class="font-noto-sans-thai">
                    <v-card class="rounded-3xl pa-2 mb-2 !bg-gray-200">
                        <v-card-title class="d-flex align-center my-2">
                            <v-icon icon="mdi-clipboard-edit"></v-icon> &nbsp; จัดการผลงานวิจัย
                            <v-spacer></v-spacer>
                            <v-text-field class="px-5" v-model="search" density="compact" label="Search"
                                prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line
                                clearable @click:clear="clearSearch"></v-text-field>
                            <v-btn @click="createResearch" class="my-4 !bg-slate-800 text-white">เพิ่มผลงานวิจัย</v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table v-model:search="search" :headers="headers" :items="researchesRevert"
                                :items-per-page="10" class="elevation-1">
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-container class="flex justify-center align-center">
                                        <v-icon small class="mr-2" @click="editResearch(item)">mdi-pencil</v-icon>
                                        <v-icon small class="mr-2"
                                            :class="item.status == 'active' ? 'text-green' : 'text-red'"
                                            @click="toggleVisibility(item)">
                                            {{ item.status == 'active' ? 'mdi-eye' : 'mdi-eye-off' }}
                                        </v-icon>
                                        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                                    </v-container>
                                </template>
                            </v-data-table>

                        </v-card-text>
                    </v-card>
                    <v-dialog v-model="dialog" max-width="1050px">
                        <v-card class="rounded-xl">
                            <v-card-title>{{ isEdit ? 'แก้ไขผลงานวิจัย' : 'สร้างผลงานวิจัย' }}</v-card-title>
                            <v-card-text>
                                <v-form ref="form" v-model="valid">
                                    <v-text-field label="ชื่อผลงาน" variant="solo-filled"
                                        v-model="currentResearch.nameOnMedia" :rules="[rules.required]"
                                        required></v-text-field>
                                    <v-combobox v-model="currentResearch.inventor" label="ผู้ประดิษฐ์"
                                        variant="solo-filled" chips multiple :rules="[rules.required]"
                                        required></v-combobox>
                                    <v-autocomplete variant="solo-filled" flat label="สังกัด"
                                        v-model="currentResearch.major"
                                        :items="['สำนักวิชาศิลปศาสตร์', 'สำนักวิชาวิทยาศาสตร์', 'สำนักวิชาการจัดการ', 'สำนักวิชาเทคโนโลยีสารสนเทศ', 'สำนักวิชาอุตสาหกรรมเกษตร', 'สำนักวิชานิติศาสตร์', 'สำนักวิชาวิทยาศาสตร์เครื่องสำอาง', 'สำนักวิชาวิทยาศาสตร์สุขภาพ', 'สำนักวิชาพยาบาลศาสตร์', 'สำนักวิชาเวชศาสตร์ชะลอวัยและฟื้นฟูสุขภาพ', 'สำนักวิชาแพทยศาสตร์', 'สำนักวิชาทันตแพทยศาสตร์', 'สำนักวิชานวัตกรรมสังคม', 'สำนักวิชาจีนวิทยา', 'สำนักวิชาการแพทย์บูรณาการ', 'อื่นๆ']"
                                        :rules="[rules.required]" required></v-autocomplete>
                                    <v-autocomplete variant="solo-filled" flat label="ทรัพย์สินทางปัญญา"
                                        v-model="currentResearch.intelProp"
                                        :items="['สิทธิบัตรการประดิษฐ์', 'อนุสิทธิบัตร', 'สิทธิบัตรออกแบบ', 'ลิขสิทธิ์', 'ลิขสิทธิ์-โปรแกรมคอมพิวเตอร์', 'ผลงานวิจัย', 'ต้นแบบ', 'อื่น ๆ']"
                                        :rules="[rules.required]" required></v-autocomplete>
                                    <v-autocomplete variant="solo-filled" flat label="ประเภทอุตสาหกรรม"
                                        v-model="currentResearch.industryType"
                                        :items="['เครื่องสำอาง', 'การเกษตรและเทคโนโลยีชีวภาพ', 'การแปรรูปอาหาร', 'เชื้อเพลิงชีวภาพและเคมีชีวภาพ', 'การแพทย์ครบวงจร', 'สร้างสรรค์', 'อิเล็กทรอนิกส์อัจฉริยะ', 'หุ่นยนต์', 'ดิจิตอล', 'การท่องเที่ยวกลุ่มรายได้ดีและการท่องเที่ยวเชิงสุขภาพ', 'การบินและระบบขนส่ง', 'ยานยนต์สมัยใหม่']"
                                        :rules="[rules.required]" required></v-autocomplete>
                                    <v-autocomplete variant="solo-filled" flat label="ความพร้อมของเทคโนโลยี"
                                        v-model="currentResearch.techReadiness"
                                        :items="['ระดับการทดลอง', 'ระดับต้นแบบ', 'ระดับถ่ายทอด']"
                                        :rules="[rules.required]" required></v-autocomplete>
                                    <v-textarea label="เนื้อหา" variant="solo-filled"
                                        v-model="currentResearch.description" :rules="[rules.required]"
                                        required></v-textarea>
                                    <v-textarea label="จุดเด่น" variant="solo-filled"
                                        v-model="currentResearch.highlight"></v-textarea>
                                    <v-combobox v-model="currentResearch.coop" label="ความร่วมมือที่เสาะหา" chips
                                        multiple variant="solo-filled" :rules="[rules.required]" required></v-combobox>
                                    <v-text-field label="ปีงบประมาณ" variant="solo-filled"
                                        v-model="currentResearch.budgetYear" :rules="[rules.required]"
                                        required></v-text-field>
                                    <v-combobox label="Keyword" variant="solo-filled" chips multiple
                                        v-model="currentResearch.keyword"></v-combobox>
                                    <v-container class="flex">
                                        <v-checkbox v-model="currentResearch.ipType" label="Portfolio" value="portfolio"
                                            :rules="[rules.required]" required></v-checkbox>
                                        <v-checkbox v-model="currentResearch.ipType" label="Prototype" value="prototype"
                                            :rules="[rules.required]" required></v-checkbox>
                                    </v-container>
                                    <p class="ml-10 text-red-500">อัพโหลดปกรูปภาพขนาดไม่เกิน 800 X 530 </p>
                                    <div>
                                        <p class="text-warning text-sm font-italic  ml-10">
                                            <v-icon color="warning">mdi-alert-circle-outline</v-icon>
                                            อัพโหลดไฟล์รูปภาพไม่เกิน 2 MB
                                        </p>
                                    </div>
                                    <v-file-input label="Upload Images" multiple @change="handleFileUpload"
                                        variant="solo-filled" accept="image/*" prepend-icon="mdi-camera"
                                        @click:clear="clearFileInputs" :rules="[fileSizeRule]" chips></v-file-input>
                                    <div>
                                        <p class="text-warning text-sm font-italic ml-10">
                                            <v-icon color="warning">mdi-alert-circle-outline</v-icon>
                                            อัพโหลดไฟล์ PDF ไม่เกิน 10 MB
                                        </p>
                                    </div>
                                    <v-file-input label="Upload PDF" @change="handlePdfUpload" variant="solo-filled"
                                        accept="application/pdf" prepend-icon="mdi-file-pdf-box"
                                        @click:clear="clearFileInputs" :rules="[fileSizeRule]" chips></v-file-input>
                                    <v-container fluid>
                                        <v-row>
                                            <v-col v-for="(img, index) in currentResearch.filePath" :key="index"
                                                cols="12" sm="6" md="6" lg="6">
                                                <v-card class="mx-auto" max-width="400" style="position: relative;">
                                                    <template
                                                        v-if="typeof img === 'string' && img.toLowerCase().endsWith('.pdf')">
                                                        <v-icon size="100" color="red">mdi-file-pdf-box</v-icon>
                                                        <v-card-text class="text-center">{{ img.split('/').pop()
                                                            }}</v-card-text>
                                                    </template>
                                                    <template v-else>
                                                        <v-img :src="`${baseUrl}/${img}`"
                                                            v-model="currentResearch.filePath" height="250" cover>
                                                        </v-img>
                                                    </template>
                                                    <v-btn v-if="isEdit" @click="markForDeletion(index)"
                                                        :class="{ 'marked-for-deletion': markedForDeletion.includes(index) }"
                                                        :icon="markedForDeletion.includes(index) ? 'mdi-check' : 'mdi-delete'"
                                                        style="position: absolute; top: 5px; right: 5px;"></v-btn>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="red darken-1" variant="tonal" class="" text
                                    @click="dialog = false">ยกเลิก</v-btn>
                                <v-btn color="green darken-1" variant="tonal" text @click="validateForm">{{ isEdit ?
                                    'บันทึก' : 'สร้าง'
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
                    <v-card-title class="text-h5 text-center text-black">คุณแน่ใจหรือว่าต้องการลบ<br>
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
import api from '@/stores/axios-config';
import { useErrorStore } from "@/stores/errorStore";
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
            markedForDeletion: [],
            search: "",
            baseUrl: "",
            dialog: false,
            isEdit: false,
            dialogDelete: false,
            headers: [
                { title: 'ชื่อผลงาน', value: 'nameOnMedia' },
                { title: 'หมวดหมู่', value: 'industryType' },
                { title: 'ผู้จัดทำ', value: 'inventor' },
                { title: 'Actions', align: 'center', value: 'actions', sortable: false }
            ],
            researches: [],
            researchesRevert: [],
            currentResearch: {
                budgetYear: '',
                nameOnMedia: '',
                inventor: [],
                major: '',
                intelProp: '',
                industryType: '',
                description: '',
                highlight: '',
                techReadiness: '',
                coop: [],
                ipType: '',
                filePath: null,
                img: null,
                link: '',
                status: '',
                keyword: null
            },
            rules: {
                required: value => !!value || 'กรุณากรอกข้อมูลในช่อง'
            }
        }
    },


    methods: {
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
                await api.patch(`/staff/updateResearchData/${item._id}`, { status: item.status });
                errorStore.show(
                    item.status === "active" ? "เปิดแสดงผลงานวิจัย" : "ปิดแสดงผลงานวิจัย",
                    {
                        color: item.status === "active" ? "success" : "warning",
                        icon: item.status === "active" ? "mdi-check-circle" : "mdi-alert-circle",
                        timeout: 5000
                    }
                );
            } catch (error) {
                this.handleError(error);
            }
        },
        resetCurrentResearch() {
            this.currentResearch = {
                budgetYear: '',
                nameOnMedia: '',
                inventor: [],
                major: '',
                intelProp: '',
                industryType: '',
                description: '',
                highlight: '',
                techReadiness: '',
                coop: [],
                ipType: '',
                filePath: null,
                img: null,
                link: '',
                status: 'active',
                keyword: null
            };
            this.markedForDeletion = [];
        },
        validateForm() {
            this.$refs.form.validate();
            if (this.checkFileSizes()) {
                if (this.valid) {
                    this.saveResearch();
                }
            }
        },

        handleFileUpload(event) {
            this.currentResearch.img = Array.from(event.target.files);
        },

        handlePdfUpload(event) {
            this.currentResearch.pdfPath = event.target.files[0];
        },

        clearFileInputs() {
            this.currentResearch.img = null;
            this.currentResearch.pdfPath = null;
        },

        async saveResearch() {
            if (!this.valid) {
                return;
            }
            if (!this.checkFileSizes()) {
                return;
            }
            this.isUploading = true
            try {
                const formData = new FormData();
                formData.append('budgetYear', this.currentResearch.budgetYear);
                formData.append('nameOnMedia', this.currentResearch.nameOnMedia);
                formData.append('inventor', this.currentResearch.inventor);
                formData.append('major', this.currentResearch.major);
                formData.append('description', this.currentResearch.description);
                formData.append('intelProp', this.currentResearch.intelProp);
                formData.append('industryType', this.currentResearch.industryType);
                formData.append('techReadiness', this.currentResearch.techReadiness);
                formData.append('coop', this.currentResearch.coop);
                formData.append('link', this.currentResearch.link);
                formData.append('status', this.currentResearch.status);
                formData.append('ipType', this.currentResearch.ipType);
                formData.append('keyword', this.currentResearch.keyword);

                // Split highlights and append each one individually
                const highlightString = Array.isArray(this.currentResearch.highlight)
                    ? this.currentResearch.highlight.join(',')
                    : this.currentResearch.highlight;
                const highlights = highlightString.split(',').map(item => item.trim());
                highlights.forEach((highlight, index) => {
                    formData.append(`highlight[${index}]`, highlight);
                });

                if (this.currentResearch.img) {
                    this.currentResearch.img.forEach((file, index) => {
                        formData.append(`file${index + 1}`, file);
                    });
                }

                if (this.currentResearch.pdfPath) {
                    formData.append('pdf', this.currentResearch.pdfPath);
                }

                if (this.isEdit) {
                    try {
                        await api.patch(`/staff/updateResearchData/${this.currentResearch._id}`, {
                            budgetYear: this.currentResearch.budgetYear,
                            nameOnMedia: this.currentResearch.nameOnMedia,
                            inventor: this.currentResearch.inventor,
                            major: this.currentResearch.major,
                            description: this.currentResearch.description,
                            intelProp: this.currentResearch.intelProp,
                            industryType: this.currentResearch.industryType,
                            highlight: highlights,
                            techReadiness: this.currentResearch.techReadiness,
                            coop: this.currentResearch.coop,
                            link: this.currentResearch.link,
                            status: this.currentResearch.status,
                            ipType: this.currentResearch.ipType,
                            keyword: this.currentResearch.keyword,
                        });
                        await api.patch(`/staff/addFileResearch/${this.currentResearch._id}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                        });

                        if (this.markedForDeletion.length > 0) {
                            const filePathsToDelete = this.markedForDeletion.map(index => this.currentResearch.filePath[index]);
                            await api.patch(`/staff/deleteFileResearch/research/${this.currentResearch._id}`, {
                                filePath: filePathsToDelete
                            });
                        }
                        errorStore.show("แก้ไขผลงานวิจัยสำเร็จ", {
                            color: 'success',
                            icon: 'mdi-check-circle',
                            timeout: 5000
                        });
                    } catch (error) {
                        this.handleError(error);
                    }
                } else {
                    await api.post('/staff/addResearch', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    });
                    errorStore.show("เพิ่มผลงานวิจัยเรียบร้อยแล้ว", {
                        color: 'success',
                        icon: 'mdi-check-circle',
                        timeout: 5000
                    });
                }
                this.fetchResearches();

            } catch (error) {
                this.handleError(error);
            } finally {
                this.isUploading = false;
                this.dialog = false;
                this.resetCurrentResearch();
            }

        },

        handleError() {
            errorStore.show("ไม่มีการตอบกลับจากเซิฟเวอร์ หรือ เซิฟเวอร์ผิดผลาด", {
                color: "error",
                icon: "mdi-alert-circle",
                timeout: 5000
            });
            this.dialog = false;
            this.resetCurrentResearch();
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
                await api.delete(`/staff/deleteResearch/research/${this.currentResearch._id}`);
                this.dialogDelete = false;
                this.fetchResearches();
                errorStore.show("ลบผลงานวิจัยสำเร็จ", {
                    color: 'success',
                    icon: 'mdi-check-circle',
                    timeout: 5000
                });

            } catch (error) {
                this.handleError(error);
            }
        },
        markForDeletion(index) {
            if (!this.markedForDeletion.includes(index)) {
                this.markedForDeletion.push(index);
            } else {
                const deletionIndex = this.markedForDeletion.indexOf(index);
                this.markedForDeletion.splice(deletionIndex, 1);
            }
        },

        // =====================================================================================================
        // get research data funnctions
        async fetchResearches() {
            try {
                const response = await api.get('/getsResearch/all/all/all/all');
                this.researches = response.data.result;
                this.researchesRevert = [...response.data.result].reverse();

            } catch (error) {
                this.handleError(error);
            }
        },

        clearSearch() {
            this.search = "";
            this.fetchResearches()
        },

        // Check if all files are within the size limit
        checkFileSizes() {
            const maxSizeImage = 2 * 1024 * 1024; // 2 MB
            const maxSizePDF = 10 * 1024 * 1024; // 10 MB
            if (this.currentResearch.img) {
                for (const file of this.currentResearch.img) {
                    if (file.size > maxSizeImage) {
                        errorStore.show(`File ${file.name} is too large. Max size is 2MB.`, {
                            color: "error",
                            icon: "mdi-alert-circle",
                            timeout: 5000
                        });
                        return false;
                    }
                }
            }
            if (this.currentResearch.pdfPath && this.currentResearch.pdfPath.size > maxSizePDF) {
                errorStore.show(`File ${this.currentResearch.pdfPath.name} is too large. Max size is 10MB.`, {
                    color: "error",
                    icon: "mdi-alert-circle",
                    timeout: 5000
                });
                return false;
            }
            return true;
        },

        //File size validation
        fileSizeRule(value) {
            if (value && value.length) {
                const maxSizeImage = 2 * 1024 * 1024; // 2 MB
                const maxSizePDF = 10 * 1024 * 1024; // 10 MB

                for (const file of value) {
                    if (file.type.includes('image') && file.size > maxSizeImage) {
                        return `Image file ${file.name} is too large. Max size is 2MB.`;
                    } else if (file.type.includes('pdf') && file.size > maxSizePDF) {
                        return `PDF file ${file.name} is too large. Max size is 10MB.`;
                    }
                }
            }
            return true;
        }

    },

    watch: {
        dialog(newValue) {
            if (!newValue) {
                this.markedForDeletion = [];
            }
        }
    },
    // get research data when loaded website
    async created() {
        this.fetchResearches();
        this.baseUrl = baseURL;
    },


}

</script>

<style scoped>
.marked-for-deletion {
    border: 3px solid red;
}

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