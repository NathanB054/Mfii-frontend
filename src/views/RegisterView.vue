<template>
  <v-container class="font-noto-sans-thai rounded-xl flex justify-center items-center bg-gray-100 !mb-5 !mt-5">
    <v-card class="w-full max-w-2xl rounded-xl !p-8">
      <v-card-title>
        <h2 class="text-2xl font-semibold !mb-2">
          <v-icon class="align-baseline" style="font-size: 28px">mdi-account-plus</v-icon>
          สมัครสมาชิก
        </h2>
      </v-card-title>
      <v-card-text>
        <!-- ใช้ v-model="isFormValid" เพื่อจัดการสถานะ valid ของฟอร์ม -->
        <v-form v-model="isFormValid" @submit.prevent="register">
          <!-- Business Type and Name Fields -->
          <div>
            <h1>ประเภทธุรกิจ</h1>
            <v-radio-group :rules="[(v) => !!v || 'กรุณาเลือก ประเภทธุรกิจ']" color="#BA984C"
              v-model="form.businessType" required>
              <v-radio label="บุคคลธรรมดา" value="บุคคลธรรมดา"></v-radio>
              <v-radio label="นิติบุคคล" value="นิติบุคคล"></v-radio>
              <v-radio label="บุคลากร มฟล" value="บุคลากร มฟล"></v-radio>
            </v-radio-group>
          </div>

          <div>
            <p class="mb-2 text-warning"> <v-icon color="warning">mdi-alert-circle-outline</v-icon>
              ถ้าไม่มีให้ใส่เครื่องหมาย -
            </p>
          </div>
          <v-text-field v-model="form.businessName" label="ระบุ ชื่อกิจการ" variant="outlined" outlined color="#BA984C"
            :rules="[(v) => !!v || 'กรุณากรอก ชื่อกิจการ']" required></v-text-field>

          <!-- User Fields -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.firstName" label="ชื่อ" variant="outlined" outlined color="#BA984C"
                :rules="[(v) => !!v || 'กรุณากรอก ชื่อ']" required></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.lastName" label="นามสกุล" variant="outlined" outlined color="#BA984C"
                :rules="[(v) => !!v || 'กรุณากรอก นามสกุล']" required></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.email" label="อีเมล" prepend-inner-icon="mdi-email-outline" variant="outlined"
                outlined color="#BA984C" :rules="[rules.required, rules.email, rules.notEmpty]" required></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="form.phone" label="เบอร์โทรศัพท์" prepend-inner-icon="mdi-phone-outline"
                variant="outlined" outlined color="#BA984C" :rules="[rules.required, rules.phone, rules.notEmpty]"
                required></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="form.password" label="รหัสผ่าน"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline" variant="outlined" color="#BA984C"
                @click:append-inner="showPassword = !showPassword"
                :rules="[(v) => !!v || 'กรุณากรอก รหัสผ่าน', (v) => v.length >= 6 || 'กรุณากรอก รหัสผ่าน 6 ตัวอักษรขึ้นไป']"
                required class="mb-4"></v-text-field>
            </v-col>
          </v-row>

          <v-btn class="rounded-xl" type="submit" color="#BA984C" block>สมัครสมาชิก</v-btn>

          <div class="text-center justify-center pt-5 flex text-base">
            <p>
              <router-link to="/login" class="px-2 hover:underline" style="color: #ba984c">เข้าสู่ระบบ</router-link>
            </p>
            <p class="text-gray-500">หากท่านสมัครสมาชิกไว้แล้ว</p>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';  // Pinia store
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const form = ref({
      businessType: '',
      businessName: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    });

    const showPassword = ref(false);

    // สถานะ valid ของฟอร์ม
    const isFormValid = ref(false);

    const rules = {
      required: (v) => !!v || 'กรุณากรอกข้อมูล',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'รูปแบบอีเมล์ไม่ถูกต้อง',
      phone: value => /^\d{9,10}$/.test(value) || 'หมายเลขโทรศัพท์ต้องเป็นตัวเลข 9 หรือ 10 หลัก',
      notEmpty: value => (value && value.trim().length > 0) || 'ช่องนี้ไม่สามารถเว้นว่างได้'
    };

    const register = async () => {
      // ตรวจสอบว่า ฟอร์มถูกต้องหรือไม่ก่อนทำการสมัคร
      if (!isFormValid.value) {
        console.error('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }

      try {
        // สร้างออบเจกต์ใหม่ที่ trim ค่าทั้งหมดก่อนส่งไป register
        const trimmedForm = {
          businessType: form.value.businessType.trim(),
          businessName: form.value.businessName.trim(),
          firstName: form.value.firstName.trim(),
          lastName: form.value.lastName.trim(),
          email: form.value.email.trim().toLowerCase(), // trim และแปลงเป็น lowercase
          phoneNumber: form.value.phone.trim(),
          password: form.value.password.trim(),
        };

        // เรียกใช้ authStore.register พร้อมออบเจกต์ที่ปรับแต่งแล้ว
        await authStore.register(trimmedForm);

        // หลังจากสมัครสมาชิกสำเร็จ
        router.push('/'); // เปลี่ยนเส้นทางตามต้องการ
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    };

    return {
      form,
      showPassword,
      rules,
      register,
      isFormValid,
    };
  },
};
</script>
