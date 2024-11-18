<!-- CookieConsent.vue -->
<template>
    <v-snackbar
      v-model="showBanner"
      :timeout="-1"
      color="grey-lighten-2"
      elevation="24"
      class="cookie-snackbar"
    >
      <v-container class="cookie-content text-center text-base font-noto-sans-thai">
        เว็บไซต์มหาวิทยาลัยแม่ฟ้าหลวงใช้คุกกี้เพื่อเพิ่มประสบการณ์และความพึงพอใจในการใช้งานเว็บไซต์
        <br />
        หากคุณกด “Accept” หรือใช้งานเว็บไซต์ของเราต่อ ถือว่าคุณยินยอมให้มีการใช้งานคุกกี้
        <br />
        <span>
          <a
            href="https://drive.google.com/file/d/1ZsZXvp-TvUGVMPVqCW5Q_YV9G9qXOmvg/view"
            target="_blank"
            rel="noopener noreferrer"
            class="underline font-semibold mx-1"
          >
            ประกาศเกี่ยวกับความเป็นส่วนตัว
          </a>
          <a
            href="https://pdpa.mfu.ac.th/papa-6240/pdpa-6251.html"
            target="_blank"
            rel="noopener noreferrer"
            class="underline font-semibold mx-1"
          >
            นโยบายการใช้คุกกี้
          </a>
        </span>
        <br />
        <v-btn color="red-darken-4" @click="acceptCookies">Accept</v-btn>
      </v-container>
    </v-snackbar>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showBanner: false
      };
    },
    mounted() {
      this.checkCookieConsent();
    },
    methods: {
      checkCookieConsent() {
        if (!this.getCookie('cookieConsent')) {
          this.showBanner = true;
        }
      },
      acceptCookies() {
        const id = this.generateId();
        this.setCookie('cookieConsent', id, 365);
        this.showBanner = false;
      },
      generateId() {
        return [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
      },
      setCookie(name, value, days) {
        let expires = "";
        if (days) {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
        }
        const secure = location.protocol === 'https:' ? "; Secure" : "";
        document.cookie = name + "=" + (value || "") + expires + "; path=/" + secure;
      },
      getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      }
    }
  };
  </script>
  
  <style scoped>
  .cookie-snackbar {
    width: 100vw; /* Full width */
    bottom: 0;
    left: 0;
    right: 0;
  }
  
  .cookie-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 16px;
    font-size: 15px;
  }
  </style>
  