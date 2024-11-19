<template>
    <v-container class="font-noto-sans-thai rounded-xl flex justify-center items-center bg-gray-100 mb-5 mt-5">
      <v-card class="w-full max-w-2xl rounded-xl p-8">
        <v-card-title>
          <h2 class="text-2xl font-semibold mb-2">
            <v-icon class="align-baseline" style="font-size: 28px">mdi-account-plus</v-icon>
            สมัครสมาชิก
          </h2>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="register">
            <!-- Business Type and Name Fields -->
            <div>
              <h1>ประเภทธุรกิจ</h1>
              <v-radio-group :rules="[(v) => !!v || 'กรุณาเลือก ประเภทธุรกิจ']" color="#BA984C"
                v-model="form.businessType" required>
                <v-radio label="บุคคลธรรมดา" value="บุคคลธรรมดา"></v-radio>
                <v-radio label="นิติบุคคล" value="นิติบุคคล"></v-radio>
              </v-radio-group>
            </div>
  
            <v-text-field v-model="form.businessName" label="ระบุ ชื่อกิจการ" variant="outlined" outlined
              color="#BA984C" :rules="[(v) => !!v || 'กรุณากรอก ชื่อกิจการ']" required></v-text-field>
  
            <!-- User Fields -->
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.firstName" label="ชื่อ" variant="outlined" outlined
                  color="#BA984C" :rules="[(v) => !!v || 'กรุณากรอก ชื่อ']" required></v-text-field>
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field v-model="form.lastName" label="นามสกุล" variant="outlined" outlined
                  color="#BA984C" :rules="[(v) => !!v || 'กรุณากรอก นามสกุล']" required></v-text-field>
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field v-model="form.email" label="อีเมล" prepend-inner-icon="mdi-email-outline"
                  variant="outlined" outlined color="#BA984C" :rules="[rules.required, rules.email, rules.notEmpty]" required></v-text-field>
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field v-model="form.phone" label="เบอร์โทรศัพท์" prepend-inner-icon="mdi-phone-outline"
                  variant="outlined" outlined color="#BA984C" :rules="[rules.required, rules.phone, rules.notEmpty]" required></v-text-field>
              </v-col>
  
              <v-col cols="12">
                <v-text-field v-model="form.password" label="รหัสผ่าน" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'" prepend-inner-icon="mdi-lock-outline"
                  variant="outlined" color="#BA984C" @click:append-inner="showPassword = !showPassword"
                  :rules="[(v) => !!v || 'กรุณากรอก รหัสผ่าน', (v) => v.length >= 6 || 'กรุณากรอก รหัสผ่าน 6 ตัวอักษรขึ้นไป']" required class="mb-4"></v-text-field>
              </v-col>
            </v-row>
  
            <v-btn class="rounded-xl" type="submit" color="#BA984C" s block>สมัครสมาชิก</v-btn>
  
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
  
      const rules = {
        required: (v) => !!v || 'This field is required',
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email format',
        phone: (v) => /^\d{10}$/.test(v) || 'Invalid phone number, must be 10 digits',
        notEmpty: (v) => v.trim() !== '' || 'This field cannot be empty',
      };
  
      const register = async () => {
        try {
          // First register the user
          await authStore.register(form.value);
          // After successful registration, user will be logged in automatically
          // Redirect the user to the dashboard or home page
          router.push('/'); // Change '/dashboard' to the route you want to redirect to
        } catch (error) {
          console.error("Registration failed:", error);
        }
      };
  
      return {
        form,
        showPassword,
        rules,
        register,
      };
    },
  };
  </script>
  