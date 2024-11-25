<template>
  <!-- News Carousel -->
  <v-container
    fluid
    class="c flex w-[90%] p-0 "
  >
    <v-carousel 
      v-if="filteredImages.length"
      :key="carouselKey"
      class="Carousel "
      cycle
      show-arrows="hover"
      hide-delimiter-background
      height="400"
    >
      <v-carousel-item 
        v-for="(path, index) in filteredImages" 
        :key="index"
        class="bg-transparent !shadow-none"
      >
        <template v-if="path.linkImage && path.linkImage.length">
          <template v-for="(link, linkIndex) in path.linkImage" :key="`link-${linkIndex}`">
            <a 
              v-if="path.linkPage" 
              :href="path.linkPage" 
              target="_blank"
            >
              <v-img 
                class="carousel__item mx-auto bg-transparent shadow-none"
                height="100%"
                lazy-src=""
                :src="link"
                contain
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="pink" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </a>
            <v-img 
              v-else 
              class="carousel__item mx-auto bg-transparent shadow-none"
              height="100%"
              lazy-src=""
              :src="link"
              contain
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="pink" indeterminate></v-progress-circular>
                </div>
              </template>
            </v-img>
          </template>
        </template>
        <template v-else-if="path.filePath && path.filePath.length">
          <template v-for="(file, fileIndex) in path.filePath" :key="`file-${fileIndex}`">
            <a 
              v-if="path.linkPage" 
              :href="path.linkPage" 
              target="_blank"
            >
              <v-img 
                class="carousel__item mx-auto bg-transparent shadow-none"
                height="100%"
                lazy-src=""
                :src="`${baseUrl}/${file}`"
                contain
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="pink" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </a>
            <v-img 
              v-else 
              class="carousel__item mx-auto bg-transparent shadow-none"
              height="100%"
              lazy-src=""
              :src="`${baseUrl}/${file}`"
              contain
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="pink" indeterminate></v-progress-circular>
                </div>
              </template>
            </v-img>
          </template>
        </template>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>



<script>
import { defineComponent } from "vue";
import api from "../stores/axios-config";
const url = import.meta.env.VITE_BASE_URL;

export default defineComponent({
  name: "ImageCarousel",
  data() {
    return {
      images: [],
      baseUrl: url,
      carouselKey: 0,
    };
  },
  computed: {
    filteredImages() {
      return this.images.filter(
        (path) =>
          (path.linkImage && path.linkImage.length) || 
          (path.filePath && path.filePath.length)
      );
    },
  },
  async created() {
    this.Getnews();
  },
  methods: {
    async Getnews() {
      try {
        const response = await api.get("/getsNews");
        this.images = response.data.result;
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
  },
});
</script>

<style scoped>

</style>
