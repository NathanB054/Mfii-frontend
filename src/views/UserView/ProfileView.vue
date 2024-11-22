<template>
    <v-container class="font-noto-sans-thai pa-4 my-15">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="rounded-xl bg-gray-300 px-2 py-2">
            <v-card-title class="headline primary white--text">
              แก้ไขข้อมูลส่วนตัว
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="saveProfile" ref="form">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="solo-filled"
                      v-model="user.firstName"
                      label="ชื่อ"
                      prepend-inner-icon="mdi-account"
                      :rules="[rules.required, rules.notEmpty]"
                      required
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="solo-filled"
                      v-model="user.lastName"
                      label="นามสกุล"
                      prepend-inner-icon="mdi-account"
                      :rules="[rules.required, rules.notEmpty]"
                      required
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="solo-filled"
                      v-model="user.email"
                      label="อีเมล"
                      prepend-inner-icon="mdi-email"
                      :rules="[rules.required, rules.email, rules.notEmpty]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="solo-filled"
                      v-model="user.phoneNumber"
                      label="เบอร์โทรศัพท์"
                      prepend-inner-icon="mdi-phone"
                      :rules="[rules.required, rules.phone, rules.notEmpty]"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12">
                    <v-autocomplete
                      variant="solo-filled"
                      label="ประเภทธุรกิจ"
                      v-model="user.businessType"
                      :items="['บุคคลธรรมดา', 'นิติบุคคล']"
                      :rules="[rules.required]"
                      required
                    ></v-autocomplete>
  
                    <v-text-field
                      variant="solo-filled"
                      v-model="user.businessName"
                      label="ชื่อกิจการ"
                      :rules="[rules.required, rules.notEmpty]"
                      required
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12" class="text-center">
                    <v-btn type="submit" color="success rounded-xl w-full" class="mr-2">บันทึก</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import api from "@/stores/axios-config";
  import { useAuthStore } from "@/stores/auth";
  import { computed } from "vue";
  
  export default {
    name: "user-profile-page",
    data() {
      return {
        snackbar: {
          show: false,
          message: "",
          color: "success", // Default color
        },
        user: {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          businessType: "",
          businessName: "",
        },
        rules: {
          required: (value) => !!value || "กรุณากรอกข้อมูล",
          email: (value) => {
            const emailPattern =
              /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(com|co\.th|ac\.th|net|in\.th|mfu\.ac\.th|org|edu|gov|co\.[a-zA-Z]{2}|uk|de|fr|jp|cn|us|au|info|biz|io|me|tv|ca|nl|it|br|ru|es)$/;
  
            return emailPattern.test(value) || "โปรดกรอกอีเมลให้ถูกต้อง";
          },
          phone: (value) =>
            /^\d{9,10}$/.test(value) ||
            "หมายเลขโทรศัพท์ต้องเป็นตัวเลข 9 หรือ 10 หลัก",
          notEmpty: (value) =>
            (value && value.trim().length > 0) || "ช่องนี้ไม่สามารถเว้นว่างได้",
        },
      };
    },
  
    methods: {
      async validateForm() {
        const { valid } = await this.$refs.form.validate();
        return valid;
      },
  

      // save profile
      async saveProfile() {
        if (await this.validateForm()) {
          try {
            await api.patch("api/user/updatePatch", this.user);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } catch (error) {
            console.log(error)
            if (error.response && error.response.data) {
              const errorMessage =
                error.response.data.description.description +
                " " +
                error.response.data.description.code ||
                "Save failed";
              this.snackbar = {
                show: true,
                message: errorMessage,
                color: "error",
              };
            }
            throw error;
          }
        } else {
          console.log("Form is not valid");
        }
      },
    },
  
    //get user info
    setup() {
      const authStore = useAuthStore();
      const user = computed(() => authStore.user || {});
      return { user };
    },
  };
  </script>
  
  <style lang="scss" scoped></style>
  