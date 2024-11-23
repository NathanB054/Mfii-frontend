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
        const response = await api.post("/login", { email, password });
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
        throw error;
      }
    },

    async register(formData) {
      try {
        // Send registration data
        const response = await api.post("/register", formData); 
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
        throw error;
      }
    },

    async fetchUser() {
      try {
        const response = await api.get("/getUser");
        this.user = response.data.resutl;
      } catch (error) {
        console.error("Failed to fetch user:", error);
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
