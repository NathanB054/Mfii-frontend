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

                <v-container v-if="!user" class="flex justify-center align-center " style="height: 50vh;">
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
                          <v-btn type="submit" class="bg-red text-white">ส่ง</v-btn>
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

    </v-main>
  </v-app>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import api from "@/stores/axios-config";
import { computed } from "vue";
import { useErrorStore } from "@/stores/errorStore";



export default {
  name: "contact-page",
  data() {
    return {
      formValid: false,
      user: {},
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
      const errorStore = useErrorStore();
      if (await this.validateForm()) {
        this.form.messageReply.user = this.user._id;
        try {
          await api.post('/user/mesRequest', this.form);
          errorStore.show("ขอข้อมูลเพิ่มเติมสำเร็จ!", {
            color: 'success',
            icon: 'mdi-check-circle',
            timeout: 5000
          });  
          setTimeout(() => {
            this.$router.push('/message');
          }, 2700);
        } catch (error) {
          console.log(error)
          // Handle error
        }
      } else {
        console.log("Form is not valid");
        errorStore.show("กรุณากรอกข้อมูลให้ครบ", {
            color: 'warning',
            icon: 'mdi-alert-circle',
            timeout: 5000
          });
      }

    },

  },

   //get user
   setup() {
      const authStore = useAuthStore();
      const user = computed(() => authStore.user); // Access the user data
      // Return variables to make them accessible in the template
      return { user };
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