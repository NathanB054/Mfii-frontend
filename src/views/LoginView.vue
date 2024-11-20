<template>

    <!-- Main container for the login card -->
    <v-container class="font-noto-sans-thai rounded-xl flex justify-center items-center bg-gray-100 mb-6 mt-5">
      <v-card class="w-full max-w-lg rounded-xl p-8">
        <!-- Card title -->
        <v-card-title>
          <h2 class="text-2xl font-semibold mb-2">
            <v-icon class="align-baseline" style="font-size: 28px">mdi-account</v-icon>
            เข้าสู่ระบบ
          </h2>
        </v-card-title>

        <!-- Card content -->
        <v-card-text>
          <v-form @submit.prevent="handleLogin" >
            <!-- Email field -->
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="form.email" label="อีเมล" prepend-inner-icon="mdi-email-outline"
                  variant="outlined" outlined color="#BA984C" :rules="[validateEmail]" required></v-text-field>
              </v-col>

              <!-- Password field -->
              <v-col cols="12">
                <v-text-field v-model="form.password" label="รหัสผ่าน" :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="togglePasswordVisibility" variant="outlined" outlined color="#BA984C"
                  :rules="[validatePassword]" required></v-text-field>
              </v-col>
            </v-row>

            <!-- Login button -->
            <v-btn class="rounded-xl" type="submit" color="#BA984C" block>
              เข้าสู่ระบบ
            </v-btn>

            <!-- Register link -->
            <div class="text-center justify-center pt-5 flex text-base">
              <p>
                <router-link to="/register" class="px-2 hover:underline" style="color: #ba984c">
                  สมัครสมาชิก
                </router-link>
              </p>
              <p class="text-gray-500">หากท่านยังไม่สมัครสมาชิก</p>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>

</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

export default {
  setup() {
    // Local form state
    const form = ref({
      email: "",
      password: "",
    });
    const showPassword = ref(false);

    // Access the auth store
    const authStore = useAuthStore();

    // Login handler
    const handleLogin = async () => {
      try {
        // Call the auth store's login method
        await authStore.login(form.value.email, form.value.password);
        window.location.href = "/"; // Redirect after login
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    // Validation rules
    const validateEmail = (v) =>
      !!v || "กรุณากรอก อีเมล" || /.+@.+\..+/.test(v) || "กรุณากรอกอีเมลให้ถูกต้อง";
    const validatePassword = (v) =>
      !!v || "กรุณากรอก รหัสผ่าน" || v.length >= 6 || "กรุณากรอก รหัสผ่าน 6 ตัวอักษรขึ้นไป";

    return {
      form,
      showPassword,
      handleLogin,
      togglePasswordVisibility,
      validateEmail,
      validatePassword,
    };
  },
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
