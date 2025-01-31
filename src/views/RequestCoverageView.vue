<template>

  <div v-if="detailsItems && detailsItems.length > 0"
    class="flex flex-col items-center space-y-4 p-4 bg-gray-100 min-h-screen">
    <div>
      <h1 class="lg:text-2xl md:text-xl sm:text-lg text-base pb-10 pt-4">
        การขอรับความคุ้มครองทรัพย์สินทางปัญญา
      </h1>
    </div>



    <!-- Dropdown Section -->
    <div class="flex flex-wrap justify-center gap-4 sm:gap-6 lg:flex-nowrap lg:justify-between lg:w-[1240px]">
      <div v-for="(item, index) in detailsItems" :key="index"
        class="py-6 relative bg-white border border-gray-300 shadow-md rounded-lg cursor-pointer w-full sm:w-1/3 lg:w-[18%] flex flex-col justify-between items-center text-center"
        @click="toggleDropdown(index)" :class="{ 'bg-blue text-white': item.show, 'bg-white text-black': !item.show }">
        <!-- Title Section -->
        <div class="title-section flex flex-1 items-center justify-center">
          <div>{{ item.title }}</div>
        </div>
        <!-- Icon Fixed at the Bottom -->
        <div class="icon-container text-xl ">
          <i v-if="item.title === 'สิทธิบัตรการประดิษฐ์/อนุสิทธิบัตร'"><img
              src="@/assets/icons/intellectual.png" alt="icon" class="my-3" style="width: 50px; height: 50px" /></i>
          <i v-if="item.title === 'สิทธิบัตรการออกแบบผลิตภัณฑ์'"><img
            src="@/assets/icons/design.png" alt="icon" class="my-3" style="width: 50px; height: 50px" /></i>
          <i v-if="item.title === 'ลิขสิทธิ์'"><img
            src="@/assets/icons/copyright.png" alt="icon" class="my-3" style="width: 50px; height: 50px" /></i>
          <i v-if="item.title === 'เครื่องหมายการค้า'"><img
            src="@/assets/icons/trademarks.png" alt="icon" class="my-3" style="width: 50px; height: 50px" /></i>
          <i v-if="item.title === 'ระบบติดตามผลงานที่อยู่ระหว่างดำเนินการยื่นคำขอฯ'"
            class="text-xl"><img
            src="@/assets/icons/waiting.png" alt="icon" class="my-3" style="width: 50px; height: 50px" /></i>
        </div>
      </div>
    </div>

    <!-- Details Section with Animation -->
    <transition-group name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-for="(item, index) in detailsItems" :key="'details-' + index" v-show="item.show"
        class="bg-gray-200 border border-gray-300 shadow-md p-4 w-full sm:w-1/2 mt-4">
        <ul class="flex flex-row">
          <li v-for="(detail, idx) in item.details" :key="idx">
            {{ detail }}
          </li>
          <li>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat, cum laudantium? Nam quas qui, inventore
            expedita recusandae adipisci, eaque nostrum libero, minima nisi itaque aliquid facilis similique quia vel
            nemo!
          </li>
        </ul>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "RequestCoverageView",
  data() {
    return {
      detailsItems: [
        {
          title: "สิทธิบัตรการประดิษฐ์/อนุสิทธิบัตร",
          details: [
            "นิยาม/ความหมายสั้น ๆ",
            "แบบฟอร์มคำขอ ที่เกี่ยวข้องของแต่ละประเภท",
            "ขั้นตอนการยื่นคำขอ",
          ],
          show: false,
        },
        {
          title: "สิทธิบัตรการออกแบบผลิตภัณฑ์",
          details: [
            "นิยาม/ความหมายสั้น ๆ",
            "แบบฟอร์มคำขอ ที่เกี่ยวข้องของแต่ละประเภท",
          ],
          show: false,
        },
        {
          title: "ลิขสิทธิ์",
          details: ["รายละเอียดอื่น ๆ เกี่ยวกับลิขสิทธิ์"],
          show: false,
        },
        {
          title: "เครื่องหมายการค้า",
          details: ["รายละเอียดเกี่ยวกับเครื่องหมายการค้า"],
          show: false,
        },
        {
          title: "ระบบติดตามผลงานที่อยู่ระหว่างดำเนินการยื่นคำขอฯ",
          details: ["แบบลิ้งค์ IP Tracking ในนี้ด้วย"],
          show: false,
        },
      ],
    };
  },
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
  },
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
