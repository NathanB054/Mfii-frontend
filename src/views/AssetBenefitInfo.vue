<template>
    <div class="main-container">
        <!-- ด้านซ้าย: พื้นที่สำหรับภาพ -->
        <div class="left">
            <div class="image-box">
                <img :src="imageSrc" alt="Infographic or Activity" />
            </div>
        </div>

        <!-- ด้านขวา: พื้นที่สำหรับ Text Box และข้อมูลติดต่อ -->
        <div class="right">
            <div class="text-box">
                <p class="text-header">ข้อมูลการใช้ประโยชน์ทรัพย์สินทางปัญญา</p>
                <p class="long-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
                    dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
                    ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie,
                    enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa,
                    scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero
                    pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio
                    eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus
                    orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque
                    fermentum. Pellentesque nulla eros accumsan quis justo at tincidunt lobortis den
                </p>
            </div>

            <!-- เรียกใช้ AssetAwareInfo -->
            <AssetAwareInfo />
        </div>
    </div>
</template>

<script>
import AssetAwareInfo from "../components/AssetAwareInfo.vue";
import imagePath from "../assets/images/800x500 test.jpeg";

export default {
    name: "AwareAssetInfo",
    components: {
        AssetAwareInfo,
    },
    data() {
        return {
            imageSrc: imagePath,
        };
    },
};
</script>

<style scoped>
.main-container {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.left,
.right {
    width: 48%;
    /* กำหนดให้ทั้งสองคอลัมน์มีความกว้างเท่ากัน */
    box-sizing: border-box;
}

.image-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* ให้พื้นที่สำหรับรูปภาพเต็มที่ในคอลัมน์ซ้าย */
    height: 500px;
    /* กำหนดความสูงเป็น 500px */
    text-align: center;
    overflow: hidden;
    /* ตัดส่วนเกินของรูปที่ไม่อยู่ในกรอบ */
}

.image-box img {
    width: 800px;
    /* กำหนดความกว้างเป็น 800px */
    height: 500px;
    /* กำหนดความสูงเป็น 500px */
    object-fit: contain;
    /* ทำให้รูปภาพเต็มกรอบโดยไม่เสียสัดส่วน */
}

.text-box {
    margin-bottom: 20px;
}

.text-header {
    font-weight: bold;
    margin-bottom: 10px;
}

.text-box textarea {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    font-size: 14px;
    resize: none;
}
</style>