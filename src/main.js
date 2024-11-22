import './index.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Font
import '@fontsource/noto-sans-thai';


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from "./stores/axios-config"; // Import axios configuration
import { useAuthStore } from './stores/auth';

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
    components,
    directives,
  })

const app = createApp(App)
app.use(createPinia())

const authStore = useAuthStore();
authStore.checkAuth(); // Restore token on page refresh


app.use(router)
app.use(vuetify)
app.mount('#app')
