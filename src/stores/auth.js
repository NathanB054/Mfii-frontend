import { defineStore } from "pinia";
import axios from "axios";
import { useErrorStore } from "./errorStore";
import api from "./axios-config";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null, // JWT token
    user: null,  // User information
  }),

  actions: {
    async login(email, password) {
      const errorStore = useErrorStore();
      try {
        const response = await axios.post("/api/login", { email, password });
        const { token } = response.data.result;
        
        // Save token in state and localStorage
        this.token = token;
        localStorage.setItem("token", token);

        // Set token in axios headers for future requests
        axios.defaults.headers.common["Authorization"] = token;

        // Optionally fetch user info immediately
        await this.fetchUser();

        return response.data.description;
      } catch (error) {
        console.error("Login failed:", error);
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.description.description + ' ' + error.response.data.description.code || 'Login failed';
          errorStore.show(errorMessage, {
            color: 'error',
            icon: 'mdi-alert-circle',
            timeout: 5000
          });
        }
        throw error;
      }
    },

    async register(formData) {
      const errorStore = useErrorStore();
      try {
        // Send registration data
        const response = await axios.post("/api/register", formData); 
        const { token } = response.data.result;

        // Save token in state and localStorage
        this.token = token;
        localStorage.setItem("token", token);

        // Set token in axios headers for future requests
        axios.defaults.headers.common["Authorization"] = token;

        // Optionally fetch user info after registration
        await this.fetchUser();

        // After successful registration, log the user in
        await this.login(formData.email, formData.password); // Login after registration

        return response.data.description;
      } catch (error) {
        console.error("Registration failed:", error);
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.description.description + ' ' + error.response.data.description.code || 'Login failed';
          errorStore.show(errorMessage, {
            color: 'error',
            icon: 'mdi-alert-circle',
            timeout: 5000
          });
        }
        throw error;
      }
    },

    async fetchUser() {
      const errorStore = useErrorStore();
      try {
        const response = await axios.get("/api/getUser");
        this.user = response.data.resutl;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.description.description + ' ' + error.response.data.description.code || 'Login failed';
          errorStore.show(errorMessage, {
            color: 'error',
            icon: 'mdi-alert-circle',
            timeout: 5000
          });
        }
        throw error;
      }
    },

      logout() {
      this.token = null;
      this.user = null;
      // Clear localStorage and axios headers
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      
    },

    checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
        axios.defaults.headers.common["Authorization"] = token;
      }
    },
  },
});
