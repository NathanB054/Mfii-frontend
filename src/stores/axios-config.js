import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// Set base URL
axios.defaults.baseURL = "http://localhost:7770";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers["Authorization"] = authStore.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
    }
    return Promise.reject(error);
  }
);

export default axios;