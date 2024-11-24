<template>
    <v-container>
        <div class="main-container">
            <!-- Left Column: Image Slider -->
            <div class="left">
                <v-carousel height="500" hide-delimiters>
                    <v-carousel-item v-for="(image, index) in images" :key="index">
                        <v-img :src="image" contain width="800" height="500"></v-img>
                    </v-carousel-item>
                </v-carousel>
            </div>

            <!-- Right Column: Text and Additional Info -->
            <div class="right">
                <div class="text-box">
                    <p class="text-header">ข้อมูลการดำเนินการยกระดับผลงานวิจัยสู่ภาคอุตสาหกรรม</p>
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

                <!-- Include AssetAwareInfo Component -->
                <AssetAwareInfo />
            </div>
        </div>
    </v-container>
</template>

<script>
import AssetAwareInfo from "../components/AssetAwareInfo.vue";
import image1 from "../assets/images/5_Steps_to_Create_an_Infographic_Blog_Post.jpg";
import image2 from "../assets/images/800x500 test.jpeg";

export default {
    name: "AwareAssetInfo",
    components: {
        AssetAwareInfo,
    },
    data() {
        return {
            images: [image1, image2], // Array of images for the slider
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
    box-sizing: border-box;
}

.text-box {
    margin-bottom: 20px;
}

.text-header {
    font-weight: bold;
    margin-bottom: 10px;
}

.long-text {
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    text-align: justify;
}
</style>
