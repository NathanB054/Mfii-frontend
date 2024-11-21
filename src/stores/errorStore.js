// src/stores/errorStore.js
import { defineStore } from 'pinia'

export const useErrorStore = defineStore('errorStore', {
  state: () => ({
    isVisible: false,
    message: '',
    color: 'error',
    icon: 'mdi-alert-circle',
    timeout: 5000
  }),
  actions: {
    // Generic error showing method
    show(message, options = {}) {
      this.message = message
      this.color = options.color || 'error'
      this.icon = options.icon || 'mdi-alert-circle'
      this.timeout = options.timeout || 5000
      this.isVisible = true
    },
    
    // Hide error snackbar
    hide() {
      this.isVisible = false
    },

    // Comprehensive API error handler
    handleApiError(error) {
      let errorMessage = 'An unexpected error occurred'

      if (error.response) {
        // Server responded with an error status
        switch (error.response.status) {
          case 400:
            errorMessage = 'Bad Request: ' + 
              (error.response.data.message || 'Invalid data submitted')
            break
          case 401:
            errorMessage = 'Unauthorized: Please log in again'
            break
          case 403:
            errorMessage = 'Forbidden: You do not have permission'
            break
          case 404:
            errorMessage = 'Not Found: The requested resource does not exist'
            break
          case 422:
            // Validation errors
            errorMessage = error.response.data.errors 
              ? Object.values(error.response.data.errors).flat().join(', ')
              : 'Validation failed'
            break
          case 500:
            errorMessage = 'Server Error: Please try again later'
            break
          default:
            errorMessage = error.response.data.message || 'An error occurred'
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'No response from server. Please check your connection.'
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || 'An unexpected error occurred'
      }

      // Show the error
      this.show(errorMessage, {
        color: 'error',
        icon: 'mdi-alert-circle',
        timeout: 5000
      })
    }
  }
})