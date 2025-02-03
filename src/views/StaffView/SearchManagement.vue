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
              <v-text-field
                class="px-5"
                v-model="search"
                density="compact"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="solo-filled"
                flat
                hide-details
                single-line
                clearable
                @click:clear="clearSearch"
              ></v-text-field>
              <v-btn
                @click="createResearch"
                class="my-4 !bg-slate-800 text-white"
                >เพิ่มการสืบค้น</v-btn
              >
            </v-card-title>
            <v-card-text>
              <v-data-table
                v-model:search="search"
                :headers="headers"
                :items="researchesRevert"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-container class="flex justify-center align-center">
                    <v-icon small class="mr-2" @click="editResearch(item)"
                      >mdi-pencil</v-icon
                    >
                    <!-- <v-icon
                      small
                      class="mr-2"
                      :class="
                        item.status == 'active' ? 'text-green' : 'text-red'
                      "
                      @click="toggleVisibility(item)"
                    >
                      {{ item.status == "active" ? "mdi-eye" : "mdi-eye-off" }}
                    </v-icon> -->
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                  </v-container>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <v-dialog v-model="dialog" max-width="1050px">
            <v-card class="rounded-xl">
              <v-card-title>{{
                isEdit
                  ? "แก้ไขสืบค้นข้อมูลทรัพย์สินทางปัญญา"
                  : "สร้างสืบค้นข้อมูลทรัพย์สินทางปัญญา"
              }}</v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid">
                  <v-text-field
                    label="ชื่อผลงาน"
                    variant="solo-filled"
                    v-model="currentResearch.nameOnMedia"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <v-combobox
                    v-model="currentResearch.inventor"
                    label="ผู้ประดิษฐ์"
                    variant="solo-filled"
                    chips
                    multiple
                    :rules="[rules.required]"
                    required
                  ></v-combobox>
                  <v-autocomplete
                    variant="solo-filled"
                    flat
                    label="สังกัด"
                    v-model="currentResearch.beLongTo"
                    :items="[
                      'สำนักวิชาศิลปศาสตร์',
                      'สำนักวิชาวิทยาศาสตร์',
                      'สำนักวิชาการจัดการ',
                      'สำนักวิชาเทคโนโลยีดิจิทัลประยุกต์',
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
                      'ศูนย์ความเป็นเลิศด้านนวัตกรรมผลิตภัณฑ์ธรรมชาติ',
                      'สถาบันชาและกาแฟ แห่งมหาวิทยาลัยแม่ฟ้าหลวง',
                      'ศูนย์นวัตกรรมสมุนไพรครบวงจร มหาวิทยาลัยแม่ฟ้าหลวง',
                      'สถาบันนวัตกรรมการเรียนรู้มหาวิทยาลัยแม่ฟ้าหลวง',
                      'ศูนย์ความเป็นเลิศทางด้านการวิจัยเชื้อรา',
                      'ศูนย์ภาษาและวัฒนธรรมจีนสิรินธร',
                      'โรงพยาบาลมหาวิทยาลัยแม่ฟ้าหลวง',
                      'อื่นๆ',
                    ]"
                    :rules="[rules.required]"
                    required
                  ></v-autocomplete>
                  <v-combobox
                    variant="solo-filled"
                    flat
                    label="ผู้ทรงสิทธิ"
                    v-model="currentResearch.holderOfRight"
                    :rules="[rules.required]"
                  ></v-combobox>
                  <v-autocomplete
                    variant="solo-filled"
                    flat
                    label="ทรัพย์สินทางปัญญา"
                    v-model="currentResearch.ipType"
                    :items="[
                      'สิทธิบัตรการประดิษฐ์',
                      'อนุสิทธิบัตร',
                      'สิทธิบัตรการออกแบบ',
                      'ลิขสิทธิ์ อื่นๆ',
                      'ลิขสิทธิ์-โปรแกรมคอมพิวเตอร์',
                      'เครื่องหมายการค้า',
                    ]"
                    :rules="[rules.required]"   
                    required
                  ></v-autocomplete>
                  <v-autocomplete
                    variant="solo-filled"
                    flat
                    label="ประเภทอุตสาหกรรม"
                    v-model="currentResearch.industType"
                    :items="[
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
                    ]"
                    :rules="[rules.required]"
                    required
                  ></v-autocomplete>
                  <!-- <v-autocomplete variant="solo-filled" flat label="ความพร้อมของเทคโนโลยี"
                                        v-model="currentResearch.techReadiness"
                                        :items="['ระดับการทดลอง', 'ระดับต้นแบบ', 'ระดับถ่ายทอด']"
                                        :rules="[rules.required]" required></v-autocomplete>

                                    <v-combobox v-model="currentResearch.coop" label="ความร่วมมือที่เสาะหา" chips
                                        multiple variant="solo-filled" :rules="[rules.required]" required></v-combobox> -->

                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <v-text-field
                          label="เลขที่คำขอ"
                          variant="solo-filled"
                          v-model="currentResearch.requestNo"
                          :rules="[rules.required]"
                        ></v-text-field>

                        <!-- Date Picker วันที่ยื่นคำขอ -->
                        <v-menu
                          v-model="MenuSubmitDate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template #activator="{ props }">
                            <v-text-field
                              v-bind="props"
                              label="วันที่ยื่นคำขอ"
                              v-model="formattedDateSubmit"
                              readonly
                              variant="solo-filled"
                              prepend-inner-icon="mdi-calendar-range"
                              :rules="[rules.requiredDate]"
                            />
                          </template>

                          <v-date-picker
                            v-model="currentResearch.submitDate"
                            @update:modelValue="MenuSubmitDate = false"
                            locale="th-TH"
                          />
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <v-text-field
                          label="เลขที่ประกาศโฆษณา"
                          v-model="currentResearch.adsNo"
                          :rules="[rules.required]"
                          variant="solo-filled"
                        ></v-text-field>

                        <!-- Date Picker วันที่ประกาศโฆษณา -->
                        <v-menu
                          v-model="MenuAdsDate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template #activator="{ props }">
                            <v-text-field
                              v-bind="props"
                              label="วันที่ประกาศโฆษณา"
                              v-model="formattedDateAds"
                              readonly
                              variant="solo-filled"
                              prepend-inner-icon="mdi-calendar-range"
                              :rules="[rules.requiredDate]"
                            >
                            </v-text-field>
                          </template>
                          <v-date-picker
                            v-model="currentResearch.adsDate"
                            @update:modelValue="MenuAdsDate = false"
                            locale="th-TH"
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <v-text-field
                          label="เลขที่รับจดทะเบียน"
                          variant="solo-filled"
                          v-model="currentResearch.regNo"
                          :rules="[rules.required]"
                        ></v-text-field>

                        <!-- Date Picker วันที่รับจดทะเบียน -->
                        <v-menu
                          v-model="MenuRegDate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template #activator="{ props }">
                            <v-text-field
                              v-bind="props"
                              label="วันที่รับจดทะเบียน"
                              v-model="formattedDateReg"
                              readonly
                              variant="solo-filled"
                              prepend-inner-icon="mdi-calendar-range"
                              :rules="[rules.requiredDate]"
                            >
                            </v-text-field>
                          </template>
                          <v-date-picker
                            v-model="currentResearch.regDate"
                            @update:modelValue="MenuRegDate = false"
                            locale="th-TH"
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <!-- Date Picker วันที่หมดอายุ -->
                        <v-menu
                          v-model="MenuExpDate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template #activator="{ props }">
                            <v-text-field
                              v-bind="props"
                              label="วันที่หมดอายุ"
                              v-model="formattedDateExp"
                              readonly
                              variant="solo-filled"
                              prepend-inner-icon="mdi-calendar-range"
                              :rules="[rules.requiredDate]"
                            >
                            </v-text-field>
                          </template>
                          <v-date-picker
                            v-model="currentResearch.expDate"
                            @update:modelValue="MenuExpDate = false"
                            locale="th-TH"
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <v-menu
                          v-model="MenuFeePay"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template #activator="{ props }">
                            <v-text-field
                              v-bind="props"
                              label="ครบกำหนดชำระค่าธรรมเนียมรายปี"
                              v-model="formattedfeePay"
                              readonly
                              variant="solo-filled"
                              prepend-inner-icon="mdi-calendar-range"
                              :rules="[rules.requiredDate]"
                            >
                            </v-text-field>
                          </template>
                          <v-date-picker
                            v-model="currentResearch.feePay"
                            @update:modelValue="MenuFeePay = false"
                            locale="th-TH"
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <!-- Date Picker แจ้งเตือนชำระค่าธรรมเนียมรายปี -->
                        <v-menu
                          v-model="MenuNotiFeePay"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template #activator="{ props }">
                            <v-text-field
                              v-bind="props"
                              label="แจ้งเตือนชำระค่าธรรมเนียมรายปี"
                              v-model="formattednotiFeePay"
                              readonly
                              variant="solo-filled"
                              prepend-inner-icon="mdi-calendar-range"
                              :rules="[rules.requiredDate]"
                            >
                            </v-text-field>
                          </template>
                          <v-date-picker
                            v-model="currentResearch.notiFeePay"
                            @update:modelValue="MenuNotiFeePay = false"
                            locale="th-TH"
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>

                  <v-text-field
                    label="ปีงบประมาณ"
                    variant="solo-filled"
                    v-model="currentResearch.budgetYear"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>

                  <v-text-field
                    label="แก้ไขเพิ่มเติม"
                    variant="solo-filled"
                    v-model="currentResearch.addEditing"
                  ></v-text-field>

                  <v-text-field
                    label="สถานะสุดท้าย"
                    variant="solo-filled"
                    v-model="currentResearch.finalStatus"
                    :rules="[rules.required]"
                  ></v-text-field>

                  <v-text-field
                    label="การใช้ประโยชน์"
                    variant="solo-filled"
                    v-model="currentResearch.util"
                    :rules="[rules.required]"
                  ></v-text-field>

                  <v-text-field
                    label="อื่นๆ"
                    variant="solo-filled"
                    v-model="currentResearch.other"
                  ></v-text-field>

                  <v-text-field
                    label="หมายเหตุ"
                    variant="solo-filled"
                    v-model="currentResearch.note"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="red darken-1"
                  variant="tonal"
                  class=""
                  text
                  @click="dialog = false"
                  >ยกเลิก</v-btn
                >
                <v-btn
                  color="green darken-1"
                  variant="tonal"
                  text
                  @click="validateForm"
                  >{{ isEdit ? "บันทึก" : "สร้าง" }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- loading indicator -->
          <div v-if="isUploading" class="loading-overlay">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
            <span class="loading-text"
              >กำลังบันทึกการสืบค้นข้อมูลทรัพย์สินทางปัญญา...</span
            >
          </div>
        </v-container>
      </staff-layout>

      <!-- Dialog delete research -->
      <v-dialog v-model="dialogDelete" max-width="800px">
        <v-card class="rounded-xl pa-4">
          <v-card-title class="text-h5 text-center text-black"
            >คุณแน่ใจหรือว่าต้องการลบ<br />
            <p class="text-red-500">{{ currentResearch.nameOnMedia }} ?</p>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="'blue-grey-darken-1"
              variant="outlined"
              class="hover:bg-gray-500"
              @click="closeDelete"
              >ยกเลิก</v-btn
            >
            <v-btn
              color="red-darken-1"
              variant="outlined"
              class="hover:bg-red-300"
              @click="deleteResearch"
              >ตกลง</v-btn
            >
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
  name: "staff-SearchManagement-page",
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
        { title: "หมวดหมู่", value: "industType" },
        { title: "ผู้จัดทำ", value: "inventor" },
        {
          title: "Actions",
          align: "center",
          value: "actions",
          sortable: false,
        },
      ],
      MenuSubmitDate: false,
      MenuAdsDate: false,
      MenuRegDate: false,
      MenuExpDate: false,
      MenuFeePay: false,
      MenuNotiFeePay: false,

      researches: [],
      researchesRevert: [],
      currentResearch: {
        budgetYear: "",
        nameOnMedia: "",
        inventor: [],
        beLongTo: "",
        holderOfRight: "",
        ipType: "",
        requestNo: "",
        submitDate: null,
        finalStatus: "",
        addEditing: "",
        adsNo: "",
        adsDate: null,
        regNo: "",
        regDate: null,
        expDate: null,
        feePay: null,
        notiFeePay: null,
        other: "",
        industType: "",
        workType: "",
        util: "",
        note: "",
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
      this.currentResearch = {
        ...item,
        submitDate: item.submitDate ? new Date(item.submitDate) : null,
        adsDate: item.adsDate ? new Date(item.adsDate) : null,
        regDate: item.regDate ? new Date(item.regDate) : null,
        expDate: item.expDate ? new Date(item.expDate) : null,
        feePay: item.feePay ? new Date(item.feePay) : null,
        notiFeePay: item.notiFeePay ? new Date(item.notiFeePay) : null,
      };
      this.isEdit = true;
      this.dialog = true;
    },
    async toggleVisibility(item) {
      // Toggle the visibility status
      item.status = item.status === "active" ? "inactive" : "active";

      // Send the updated status to the localhost
      try {
        await api.patch(`staff/updateIPData/${item._id}`, {
          status: item.status,
        });
        errorStore.show(
          item.status === "active"
            ? "เปิดแสดงสืบค้นข้อมูลทรัพย์สินทางปัญญา"
            : "ปิดแสดงสืบค้นข้อมูลทรัพย์สินทางปัญญา",
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
        beLongTo: "",
        holderOfRight: "",
        ipType: "",
        requestNo: "",
        submitDate: null,
        finalStatus: "",
        addEditing: "",
        adsNo: "",
        adsDate: null,
        regNo: "",
        regDate: null,
        expDate: null,
        feePay: null,
        notiFeePay: null,
        other: "",
        industType: "",
        workType: "",
        util: "",
        note: "",
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
        // Helper function to format dates properly
        const formatDate = (date) => {
          // Ensure the date is either a valid Date object or a Valid Date string; return null for invalid or missing dates
          if (!date || isNaN(new Date(date).getTime())) return null;
          return dayjs(date).format("YYYY-MM-DD");
        };

        // Validate that all required fields are present
        const requiredFields = [
          "industType",
          "requestNo",
          "ipType",
          "holderOfRight",
          "beLongTo",
          "nameOnMedia",
          "budgetYear",
        ];

        for (const field of requiredFields) {
          if (!this.currentResearch[field]) {
            console.error(`${field} is required.`);
            // Provide feedback in the UI
            errorStore.show(`Please fill in the required field: ${field}`, {
              color: "error",
              icon: "mdi-alert-circle",
              timeout: 5000,
            });
            this.isUploading = false;
            return;
          }
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("budgetYear", this.currentResearch.budgetYear);
        formData.append(
          "submitDate",
          formatDate(this.currentResearch.submitDate)
        );
        formData.append("adsDate", formatDate(this.currentResearch.adsDate));
        formData.append("regDate", formatDate(this.currentResearch.regDate));
        formData.append("expDate", formatDate(this.currentResearch.expDate));
        formData.append("feePay", formatDate(this.currentResearch.feePay));
        formData.append(
          "notiFeePay",
          formatDate(this.currentResearch.notiFeePay)
        );
        formData.append("nameOnMedia", this.currentResearch.nameOnMedia);
        formData.append("inventor", this.currentResearch.inventor);
        formData.append("beLongTo", this.currentResearch.beLongTo);
        formData.append("industType", this.currentResearch.industType);
        formData.append("ipType", this.currentResearch.ipType);
        formData.append("holderOfRight", this.currentResearch.holderOfRight);
        formData.append("requestNo", this.currentResearch.requestNo);
        formData.append("finalStatus", this.currentResearch.finalStatus);
        formData.append("addEditing", this.currentResearch.addEditing);
        formData.append("adsNo", this.currentResearch.adsNo);
        formData.append("regNo", this.currentResearch.regNo);
        formData.append("other", this.currentResearch.other);
        formData.append("workType", this.currentResearch.workType);
        formData.append("util", this.currentResearch.util);
        formData.append("note", this.currentResearch.note);

        if (this.isEdit) {
          // Simplify the PATCH operation; use one request and formData appropriately
          await api.patch(
            `staff/updateIPData/${this.currentResearch._id}`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // Log success message
          errorStore.show("แก้ไขสืบค้นข้อมูลทรัพย์สินทางปัญญาสำเร็จ", {
            color: "success",
            icon: "mdi-check-circle",
            timeout: 5000,
          });
        } else {
          // POST request for adding new data
          await api.post("staff/addIP", formData, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          // Log success message
          errorStore.show("เพิ่มสืบค้นข้อมูลทรัพย์สินทางปัญญาเรียบร้อยแล้ว", {
            color: "success",
            icon: "mdi-check-circle",
            timeout: 5000,
          });
        }

        // Refresh the data
        this.fetchResearches();
      } catch (error) {
        // Log the error details for better debugging
        console.error(
          "Error saving research:",
          error.response || error.message
        );

        // Handle error UI feedback and reset input state
        errorStore.show("เกิดข้อผิดพลาดในการจัดการข้อมูล", {
          color: "error",
          icon: "mdi-alert-circle",
          timeout: 5000,
        });
      } finally {
        // Update UI states regardless of success or failure
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
        await api.delete(`staff/deleteIP/${this.currentResearch._id}`);
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
        const response = await api.get("/getsIP/all/all/all");
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
    formatThaiDate: (date) => {
      if (!date || isNaN(new Date(date).getTime())) return "ไม่มีข้อมูล";
      return dayjs(date).locale("th").format("DD MMMM YYYY");
    },
  },

  computed: {
    formattedDateSubmit() {
      return this.formatThaiDate(this.currentResearch.submitDate);
    },
    formattedDateAds() {
      return this.formatThaiDate(this.currentResearch.adsDate);
    },
    formattedDateReg() {
      return this.formatThaiDate(this.currentResearch.regDate);
    },
    formattedDateExp() {
      return this.formatThaiDate(this.currentResearch.expDate);
    },
    formattedfeePay() {
      return this.formatThaiDate(this.currentResearch.feePay);
    },
    formattednotiFeePay() {
      return this.formatThaiDate(this.currentResearch.notiFeePay);
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
