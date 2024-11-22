import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useErrorStore } from "@/stores/errorStore";

// Create an axios instance (recommended approach)
const api = axios.create({
  baseURL: "http://localhost:7770/api",
  timeout: 10000, // Optional: add timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    
    // Add token if available
    if (authStore.token) {
      // Ensure proper token format
      config.headers["Authorization"] = authStore.token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();
    const errorStore = useErrorStore();

    // Handle 401 (Unauthorized)
    if (error.response?.status === 401) {
      authStore.logout();
      
      // Optional: Show error message
      errorStore.show('Session expired. Please log in again.', {
        color: 'warning',
        icon: 'mdi-alert-circle',
        timeout: 5000
      });
    }

    // Optional: Global error handling
    if (errorStore) {
      errorStore.handleApiError(error);
    }

    return Promise.reject(error);
  }
);

export default api;