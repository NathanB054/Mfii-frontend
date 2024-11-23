// src/stores/errorStore.js
import { defineStore } from "pinia";

export const useErrorStore = defineStore("errorStore", {
  state: () => ({
    isVisible: false,
    message: "",
    color: "error",
    icon: "mdi-alert-circle",
    timeout: 5000,
  }),
  actions: {
    // Generic error showing method
    show(message, options = {}) {
      this.message = message;
      this.color = options.color || "error";
      this.icon = options.icon || "mdi-alert-circle";
      this.timeout = options.timeout || 5000;
      this.isVisible = true;
    },

    // Hide error snackbar
    hide() {
      this.isVisible = false;
    },

    // Comprehensive API error handler
    handleApiError(error) {
      let errorMessage = "An unexpected error occurred";

      if (error.response) {
        if (error.response.data.description) {
          if (error.response.data.description.code === 40102) {
            setTimeout(function () {
              window.location.reload();
            }, 3000);
          }

          errorMessage =
            error.response.data.description.description +
            " Code: " +
            error.response.data.description.code;
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = "ไม่มีการตอบกลับจากเซิฟเวอร์ หรือ เซิฟเวอร์ผิดผลาด";
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || "An unexpected error occurred";
      }

      // Show the error
      this.show(errorMessage, {
        color: "error",
        icon: "mdi-alert-circle",
        timeout: 5000,
      });
    },
  },
});
