<template>
  <LoadingOverlay :loading="isLoading" message="โปรดรอสักครู่..." />
  <div class="flex flex-col items-center space-y-4 p-4 bg-gray-100 min-h-screen">
    <div>
      <h1 class="lg:text-2xl md:text-xl sm:text-lg text-base pb-10 pt-4">
        การขอรับความคุ้มครองทรัพย์สินทางปัญญา
      </h1>
    </div>

    <!-- Dropdown Section -->
    <div class="flex flex-wrap justify-center gap-4 sm:gap-6 lg:flex-nowrap lg:justify-between lg:w-[1240px]">
      <div v-if="!detailsItems || detailsItems.length === 0">ไม่มีข้อมูล หรือโหลดข้อมูลล้มเหลว</div>
      <div v-if="detailsItems && detailsItems.length > 0" v-for="(item, index) in detailsItems" :key="index"
        class="relative bg-white border border-gray-300 shadow-md rounded-lg cursor-pointer w-full sm:w-1/3 lg:w-[18%] flex flex-col justify-between items-center text-center"
        @click="toggleDropdown(index)" :class="{ 'bg-blue text-white': item.show, 'bg-white text-black': !item.show }">
        <!-- Title Section -->
        <div class="title-section flex flex-1 items-center justify-center">
          <div>{{ item.title }}</div>
        </div>
        <!-- Icon Fixed at the Bottom -->
        <div class="icon-container">
          <i v-if="item.title === `สิทธิบัตรการประดิษฐ์ หรือ อนุสิทธิบัตร`"
            class="mdi mdi-lightbulb-on-outline text-xl"></i>
          <i v-if="item.title === 'สิทธิบัตรการออกแบบผลิตภัณฑ์'" class="mdi mdi-palette-outline text-xl"></i>
          <i v-if="item.title === 'ลิขสิทธิ์'" class="mdi mdi-book-lock-outline text-xl"></i>
          <i v-if="item.title === 'เครื่องหมายการค้า'" class="mdi mdi-tag-outline text-xl"></i>
          <i v-if="item.title === 'ระบบติดตามผลงานที่อยู่ระหว่างดำเนินการยื่นคำขอฯ'"
            class="mdi mdi-eye-outline text-xl"></i>
        </div>
      </div>
    </div>

    <!-- Details Section with Animation -->
    <transition-group name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-for="(item, index) in detailsItems" :key="'details-' + index" v-show="item.show"
        class="bg-gray-200 border border-gray-300 shadow-md p-4 w-full sm:w-1/2 mt-4">
        <div class="grid grid-cols-3 gap-0">

          <p>นิยาม <br>  {{ item.details[0] }}</p>
          <div class="border-l border-gray-400 mx-auto"></div>

          <div v-if = "item.steps[0] !== undefined">
            ขั้นตอนการยื่นคำขอ
            <p v-for="step in item.steps[0].split(',')">
              {{ step }}
            </p>
            <div v-if="item.linkServices[0] !==undefined "  >
              <a v-if="item.linkServices[0].startsWith('http') || item.linkServices[0].startsWith('https')" :href="item.linkServices[0 ]" target="_blank">ลิงค์เอกสาร</a>
              <p v-else >ลิงค์เอกสารไม่ถูกต้อง</p>
            </div>
            <div v-else>ไม่มีลิงค์เอกสาร</div>
          </div>
        </div>
        
        <!-- <ul class="flex flex-row justify-between">

          <li v-for="(detail, idx) in item.details" :key="idx">
            {{ detail }}
          </li>
          <li v-for="(step, idx) in item.steps" :key="idx">
            {{ step }}
          </li>
        </ul> -->
      </div>
    </transition-group>
  </div>
</template>

<script>
import api from '@/stores/axios-config';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
export default {
  name: "RequestCoverageView",
  components: {
    LoadingOverlay
  },
  props: {
    topicToggle: {
      type: String,
      required: false,
      default:''

    }
  },
  data() {
    return {
      detailsItems: [
      ],
      isLoading: false,
      topics: [
        "สิทธิบัตรการประดิษฐ์ หรือ อนุสิทธิบัตร",
        "สิทธิบัตรการออกแบบผลิตภัณฑ์",
        "ลิขสิทธิ์",
        "เครื่องหมายการค้า",
        "ระบบติดตามผลงานที่อยู่ระหว่างดำเนินการยื่นคำขอฯ"
      ]
    };

  },
  // {
  //         title: "สิทธิบัตรการประดิษฐ์/อนุสิทธิบัตร",
  //         details: [
  //           "นิยาม/ความหมายสั้น ๆ",
  //           "แบบฟอร์มคำขอ ที่เกี่ยวข้องของแต่ละประเภท",
  //           "ขั้นตอนการยื่นคำขอ",
  //         ],
  //         show: false,
  //       },
  //       {
  //         title: "สิทธิบัตรการออกแบบผลิตภัณฑ์",
  //         details: [
  //           "นิยาม/ความหมายสั้น ๆ",
  //           "แบบฟอร์มคำขอ ที่เกี่ยวข้องของแต่ละประเภท",
  //         ],
  //         show: false,
  //       },
  //       {
  //         title: "ลิขสิทธิ์",
  //         details: ["รายละเอียดอื่น ๆ เกี่ยวกับลิขสิทธิ์"],
  //         show: false,
  //       },
  //       {
  //         title: "เครื่องหมายการค้า",
  //         details: ["รายละเอียดเกี่ยวกับเครื่องหมายการค้า"],
  //         show: false,
  //       },
  //       {
  //         title: "ระบบติดตามผลงานที่อยู่ระหว่างดำเนินการยื่นคำขอฯ",
  //         details: ["แบบลิ้งค์ IP Tracking ในนี้ด้วย"],
  //         show: false,
  //       },
  methods: {
    toggleDropdown(index) {
      if (this.detailsItems[index]) {
        this.detailsItems[index].show = !this.detailsItems[index].show;
        this.detailsItems.forEach((item, i) => {
          if (i !== index) item.show = false;
        });
      } else {
        console.error("Invalid index:", index);
      }
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(-20px)';
    },
    enter(el, done) {
      el.offsetHeight;
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
      done();
    },
    leave(el, done) {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      el.style.opacity = 0;
      el.style.transform = 'translateY(-20px)';
      done();
    },




    // API =============================================================


    async fetchData() {
      this.isLoading = true;
      try {
        const res = await api.get(`/getsServices/all/all`);
        console.log(res.data.result);
        if (res.data) {
          this.topics.forEach(topic => {
            const filtered = res.data.result.filter(item => item.servicesType === topic);
            this.detailsItems.push({
              title: topic,
              details: filtered.map(item => item.information),
              steps: filtered.map(item => item.servicesSubType),
              show: false,
              linkServices: filtered.map(item => item.linkServices)
            });
          })
          console.log(this.detailsItems);
          // this.detailsItems = res.data.result;

        }
        console.log(this.detailsItems);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error("Error fetching data:", error);
        throw error;
      }

    }
  },

  mounted() {
    this.fetchData().then(() => {
    console.log('prop',this.topicToggle)
    if (this.topicToggle) {
      this.detailsItems.forEach(item => {
        item.show = (item.title === this.topicToggle);
      });
    }
  });
  }
};
</script>

<style scoped>
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  /* Fixed height for consistent positioning */
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  /* Push title to the center */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.bg-blue-500 {
  background-color: #3b82f6;
  /* Adjust to the blue you want */
}

.text-white {
  color: white;
}

.text-black {
  color: black;
}
</style>
