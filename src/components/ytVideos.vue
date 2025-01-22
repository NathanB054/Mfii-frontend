<template>
    <!-- Video YouTube -->
   <v-container fluid class="youtubeContainer pt-10">
     <v-carousel v-if="filteredVideos.length > 0" :key="carouselKey" class="myCarousel"
       height="500" :value="0">
       <v-carousel-item v-for="(item, index) in filteredVideos" :key="index">
         <v-sheet class="d-flex align-center justify-center" height="90%">
           <iframe class="video-iframe" :src="item.linkVideo" :title="item.title || `Video ${index + 1}`"
             frameborder="0" allowfullscreen></iframe>
         </v-sheet>
       </v-carousel-item>
     </v-carousel>
   </v-container>
</template>

<script>
import api from '@/stores/axios-config';
const baseURL = import.meta.env.VITE_BASE_URL;
export default {
 name: 'ytvideos',
 data() {
     return {
       images: [],
       baseUrl: baseURL,
       carouselKey: 0,
     };
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
   created(){
 this.Getnews();
   },

   computed: {
   filteredVideos() {
     return this.images.filter(
       (item) => item.linkVideo && item.linkVideo.length > 0
     );
   },
 }
 }


</script>

<style  scoped>
 @import "../styles/index.css";
</style>