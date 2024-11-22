<template>
    <v-app>
  
      <v-main>
        <v-container>
          <v-row>
            <v-col class="custom-col" col="7" lg="7" md="12" sm="12" xs="12">
              <header>
                <h1 class="font-noto-sans-thai py-3 lg:text-2xl sm:text-xl" style="font-weight: 600; font-size: 35px">
                  ติดต่อเรา
                </h1>
              </header>
  
              <div class="frame frame-default frame-type-html frame-layout-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4109.340290300189!2d99.89215215071464!3d20.044947186473486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d700048c69def1%3A0xa20592e502bc20c9!2sMae%20Fah%20Luang%20University!5e1!3m2!1sen!2sth!4v1573545998005!5m2!1sen!2sth"
                  width="100%" height="450" frameborder="0" style="border: 0" allowfullscreen=""></iframe>
              </div>
  
              <div class="frame frame-default frame-type-text frame-layout-0">
                <p class="font-noto-sans-thai py-2 lg:text-2xl sm:text-xl" style="font-weight: 500; font-size: 18px">
                  <span>ส่วนจัดการทรัพย์สินทางปัญญาและนวัตกรรม (MFii)<br />
                    มหาวิทยาลัยแม่ฟ้าหลวง<br />
                    333 ม.1 ต.ท่าสุด อ.เมือง จ.เชียงราย 57100<br />
                    โทรศัพท์: 0 5391 7182 หรือ 0 5391 7014<br />
                    อีเมล: ip.mfii@mfu.ac.th
                  </span>
                </p>
              </div>
            </v-col>
            <v-col class="custom-col" col="5" lg="5" md="12" sm="12" xs="12">
              <header>
                <h1 class="font-noto-sans-thai py-3 text-center justify-center d-flex"
                  style="font-weight: 600; font-size: 28px">
                  ขอข้อมูลเพิ่มเติมเกี่ยวกับเทคโนโลยี
                </h1>
              </header>
              <v-container
                class="font-noto-sans-thai rounded-xl flex justify-center items-center min-h-fit min-w-full bg-gray-100">
                <v-card class="w-full max-w-full rounded-xl ">
  
                  <v-container v-if="user._id == null" class="flex justify-center align-center " style="height: 50vh;">
                    <v-container class="justify-center align-center">
                      <div class="justify-center align-center flex">
                        <h1 style="font-size: 1.1rem;"> คุณยังไม่ได้เข้าสู่ระบบ โปรด <b>สมัครสมาชิก</b>
                          หรือ <b>เข้าสู่ระบบ</b>
                          เพื่อกรอกแบบฟอร์มขอข้อมูล</h1>
  
                      </div>
                      <div class="flex flex-col items-center space-y-4 mt-10 align-center justify-center">
                        <v-btn :to="{ path: '/register' }"
                          class=" !flex align-center justify-center !bg-red-500 text-white !text-xl py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:bg-red-600 hover:scale-105">
                          สมัครสมาชิก
                        </v-btn>
                        <span class="text-lg">หรือ</span>
                        <v-btn :to="{ path: '/login' }"
                          class="!flex align-center justify-center !bg-red-500 text-white !text-xl py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:bg-red-600 hover:scale-105">
                          เข้าสู่ระบบ
                        </v-btn>
                      </div>
                    </v-container>
                  </v-container>
  
                  <v-container v-else-if="user.role != 'user'" class="flex justify-center">
                    <h1 style="color: red;">คุณไม่มีสิทธิใช้งานบริการนี้</h1>
                  </v-container>
                  <v-card-text v-else>
                    <v-form ref="form" @submit.prevent="sendRequest">
                      <v-row>
                        <v-col cols="12" md="12" lg="12">
                          <div>
                            <v-text-field v-model="form.interestTech" label="เทคโนโลยีที่สนใจ " variant="outlined"
                              outlined color="#BA984C" :rules="[v => !!v || 'กรุณากรอก เทคโนโลยีที่สนใจ']"
                              required></v-text-field>
                          </div>
                          <div>
                            <v-text-field v-model="form.usesScope" label="ขอบเขตการใช้ผลงาน" variant="outlined" outlined
                              color="#BA984C" :rules="[v => !!v || 'กรุณากรอก ขอบเขตการใช้ผลงาน']"
                              required></v-text-field>
  
                            <v-textarea v-model="form.messageReply.messages" label="ข้อความ" variant="outlined" outlined
                              color="#BA984C" :rules="[v => !!v || 'กรุณากรอก ข้อความ']" required></v-textarea>
                          </div>
                          <div class="text-center">
                            <v-btn type="submit" class="bg-red-600 text-white">ส่ง</v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
  
        <v-snackbar v-model="snackbar.show" :timeout="snackbarTimeout" :color="snackbar.color" vertical>
          <div v-if="snackbar.Errcode === 40102 || snackbar.Errcode === 40107" class="text-subtitle-1 pb-2">โปรด <a
              style="text-decoration: underline;" href="/register">สมัครสมาชิก</a> หรือ <a
              style="text-decoration: underline;" href="/login"> เข้าสู่ระบบ </a>
          </div>
          <p>{{ snackbar.message }}</p>
          <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbar.show = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
  
      </v-main>
    </v-app>
  </template>
  
  <script>
  import { useAuthStore } from "@/stores/auth";
  import axios from "axios";
  export default {
    name: "contact-page",
    data() {
      return {
        formValid: false,
        snackbar: {
          show: false,
          message: "",
          Errcode: "",
          color: "success", // Default color
        },
        user: [],
        form: {
          interestTech: "",
          usesScope: "",
          messageReply: {
            "user": "",
            "messages": "",
          },
        },
      };
    },
  
  
    methods: {
  
  
      async validateForm() {
        const { valid } = await this.$refs.form.validate()
        return valid
      },
  
      async sendRequest() {
        if (await this.validateForm()) {
          this.form.messageReply.user = this.user._id;
          try {
            await axios.post('/user/mesRequest', this.form, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            });
            this.snackbar.message = "ขอข้อมูลเพิ่มเติม สำเร็จ! กำลังนำท่านไปยังหน้าข้อความ";
            this.snackbar.color = "success";
            this.snackbar.show = true;
            setTimeout(() => {
              this.$router.push('/message');
              // window.location.reload();
            }, 2700);
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
          }
        } else {
          this.snackbar.message = "กรุณากรอกข้อมูลให้ครบถ้วน";
          this.snackbar.color = "error";
          this.snackbar.show = true;
          return;
        }
  
      },
  
      //get user
      async getUser() {
        const authStore = useAuthStore();
        try {
          if (!authStore.user) {
            await authStore.fetchUser();
          }
          if (authStore.user) {
            this.user = authStore.user.resutl;
          }
        } catch (error) {
          if (!error.response) {
            this.snackbar.message = "Error getting user : " + error;
          } else {
            this.snackbar.message = "Error : " + error.response.data.description.description + " Code: " + error.response.status;
  
          }
          this.snackbar.color = "error"; // Set error color
          this.snackbar.show = true;
        }
      }
    },
  
    computed: {
      snackbarTimeout() {
        if (this.snackbar.Errcode === 40102 || this.snackbar.Errcode === 40107) {
          return -1; // Timeout -1 for specific conditions
        } else {
          return 6000; // Default timeout in milliseconds (6 seconds)
        }
      }
    },
  
    mounted() {
      this.getUser()
    },
  };
  
  
  </script>
  
  <style scoped>
  @media (max-width: 600px) {
    .custom-col {
      flex: 0 0 100%;
      max-width: 100%;
    }
  
    span {
      font-size: 14px;
    }
  }
  </style>
  