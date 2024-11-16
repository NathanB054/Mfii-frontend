<template>
  <main>
    <div class="flex justify-center items-center mt-5">
      <div class="w-[90%] bg-gray-200">
        <Carousel />
      </div>
    </div>
    <div>
      <quickmenu/>
    </div>
  </main>
</template>

<script>
import Carousel from '../components/carousel.vue'
import quickmenu from '@/components/quickmenu.vue';
export default {
  components: {
    Carousel,
    quickmenu
  }
}

</script>