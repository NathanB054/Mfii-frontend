<template>
  <v-app>
    <v-main>
      <v-container fluid v-if="research" class="font-noto-sans-thai">
        <v-row class="mx-5 pt-6">
          <v-col cols="12" md="7" lg="7">
            <v-card
              class="rounded-xl max-h-fit !bg-gray-100 pa-3 overflow-auto"
              height="500"
            >
              <div class="contents">
                <ul class="py-3 font-bold text-xl">
                  ชื่อผลงาน
                  {{
                    research.nameOnMedia
                  }}
                </ul>
                <ul>
                  ผู้ประดิษฐ์
                </ul>
                <li
                  v-for="(inventor, index) in research.inventor"
                  :key="index"
                  class="pl-10"
                >
                  {{ inventor }}
                </li>
                <ul>
                  สังกัด:
                  <span class="text-gray-700">{{ research.major }}</span>
                </ul>
                <ul>
                  ทรัพย์สินทางปัญญา:
                  <span class="text-red-600">{{ research.intelProp }}</span>
                </ul>
                <ul>
                  ประเภทอุตสาหกรรม:
                  <span class="text-green-600">{{
                    research.industryType
                  }}</span>
                </ul>
                <ul>
                  รายละเอียดผลงาน
                </ul>
                <p class="pl-10">
                  {{ research.description }}
                </p>
                <ul>
                  จุดเด่น
                </ul>
                <li
                  v-for="(highlight, index) in research.highlight"
                  :key="index"
                  class="pl-10"
                >
                  {{ highlight }}
                </li>
                <ul>
                  ความพร้อมของเทคโนโลยี:
                  <span class="text-pink-600">{{
                    research.techReadiness
                  }}</span>
                </ul>
                <ul>
                  ความร่วมมือที่เสาะหา
                </ul>
                <li
                  v-for="(coop, index) in research.coop"
                  :key="index"
                  class="pl-10"
                >
                  {{ coop }}
                </li>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="5" lg="5">
            <div class="d-flex justify-center items-center">
              <v-carousel show-arrows="hover" cycle hide-delimiter-background>
                <v-carousel-item
                  v-for="(pic, index) in filteredImages"
                  :key="index"
                  :src="`${baseUrl}/${pic}`"
                  fit
                ></v-carousel-item>
              </v-carousel>
            </div>
          </v-col>
          <v-col cols="12" md="2" lg="2">
            <v-container class="text-center">
              <div>
                <v-btn
                  class="responsive-btn"
                  variant="outlined"
                  rounded="xl"
                  size="small"
                  block
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                  @click="downloadPdf()"
                >
                  <v-icon left class="mr-1">mdi-download</v-icon>
                  <span>Download PDF</span>
                </v-btn>
              </div>
            </v-container>
          </v-col>
        </v-row>
        <v-container
          fluid
          class="text-white mt-5"
          style="background-color: #380075"
        >
          <p>
            สนใจเทคโนโลยี โปรดติดต่อ <br />
            ฝ่ายจัดการทรัพย์สินทางปัญญา มหาวิทยาลัยแม่ฟ้าหลวง <br />
            โทรศัพท์ 0 5391 7182 หรือ 0 5391 7014 <br />
            อีเมล ip.mfii@mfu.ac.th
          </p>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import api from "@/stores/axios-config";
import { useErrorStore } from "@/stores/errorStore";
const baseURL = import.meta.env.VITE_BASE_URL;

export default {
  name: "innovation-page",
  props: ["id"],
  data() {
    return {
      research: null,
      isLoading: true,
      baseUrl: "",
    };
  },
  beforeRouteUpdate(to, from, next) {
    // console.log("Routing update detected");
    // console.log("From:", from.params.id);
    // console.log("To:", to.params.id);
    // Fetch new data for the new ID
    this.fetchData();
    next();
  },

  created() {
    this.baseUrl = baseURL;
  },

  methods: {
    async fetchData() {
      try {
        const response = await api.get(`/getResearch?researchId=${this.id}`); // Replace with your API endpoint
        this.research = response.data.result;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    downloadPdf() {
      const errorStore = useErrorStore();
      if (this.research.filePath && this.research.filePath.length > 0) {
        const pdfPath = this.research.filePath.find((path) =>
          path.toLowerCase().endsWith(".pdf")
        );
        if (pdfPath) {
          window.open(`${baseURL}/${pdfPath}`, "_blank");
        } else {
          // Handle case where no PDF file is found
          errorStore.show("ไม่มีไฟล์ PDF", {
            color: "warning",
            icon: "mdi-alert-circle",
            timeout: 5000,
          });
        }
      } else {
        // Handle case where research data or file paths are not loaded
        errorStore.show("No research data loaded.", {
          color: "error",
          icon: "mdi-alert-circle",
          timeout: 5000,
        });
      }
    },
  },
  computed: {
    filteredImages() {
      if (this.research) {
        return this.research.filePath.filter(
          (pic) => !pic.toLowerCase().endsWith(".pdf")
        );
      }
      return [];
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
ul {
  font-weight: 600;
  padding: 5px;
}

span {
  font-weight: 400;
}

/* Smaller text for iPad screen sizes */
@media (max-width: 1024px) {
  .responsive-btn span,
  v-icon {
    font-size: 8px;
  }
}
</style>
