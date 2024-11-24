<template>
    <!-- Filters Section -->
    <v-container fluid>
        <v-card class="rounded-lg py-6 px-4">
            <v-row class="d-flex justify-center">
                <v-col cols="12" sm="6" md="4" lg="3">
                    <v-combobox v-model="Industry_type" :items="indust" item-value="value" item-title="text" clearable
                        chips density="comfortable" variant="outlined" label="ประเภทอุตสาหกรรม"></v-combobox>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                    <v-combobox v-model="Intellectual_property_type" :items="prop" item-value="value" item-title="text"
                        clearable chips density="comfortable" variant="outlined" label="ประเภทผลงาน"></v-combobox>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                    <!-- search -->
                    <v-text-field v-model="search" density="comfortable" placeholder="Search"
                        prepend-inner-icon="mdi-magnify" style="max-width: 300px" variant="solo" clearable hide-details
                        rounded  >
                    </v-text-field>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
export default {
    name: "Filters",
    data() {
        return {
            search: "",
            Industry_type: "ทั้งหมด",
            Intellectual_property_type: "ทั้งหมด",
            indust: [
                { value: "cosme", text: "เครื่องสำอาง" },
                { value: "agtech", text: "การเกษตรและเทคโนโลยีชีวภาพ" },
                { value: "f4f", text: "การแปรรูปอาหาร" },
                { value: "biofc", text: "เชื้อเพลิงชีวภาพและเคมีชีวภาพ" },
                { value: "medhub", text: "การแพทย์ครบวงจร" },
                { value: "arts", text: "สร้างสรรค์" },
                { value: "smeln", text: "อิเล็กทรอนิกส์อัจฉริยะ" },
                { value: "robot", text: "หุ่นยนต์" },
                { value: "digit", text: "ดิจิทัล" },
                {
                    value: "amwt",
                    text: "การท่องเที่ยวกลุ่มรายได้ดีและการท่องเที่ยวเชิงสุขภาพ",
                },
                { value: "alois", text: "การบินและโลจิสติกส์" },
                { value: "nxato", text: "ยานยนต์สมัยใหม่" },
            ],
            prop: [
                { value: "ptn", text: "สิทธิบัตรการประดิษฐ์" },
                { value: "ppt", text: "อนุสิทธิบัตร" },
                { value: "dsp", text: "สิทธิบัตรออกแบบ" },
                { value: "cpr", text: "ลิขสิทธิ์" },
                { value: "cpp", text: "ลิขสิทธิ์-โปรแกรมคอมพิวเตอร์" },
                { value: "khw", text: "ผลงานวิจัย" },
                { value: "pte", text: "ต้นแบบ" },
                { value: "oth", text: "อื่น ๆ" },
            ],
        }
    },
}
</script>
<style scoped>
/* Tailwind CSS classes can be used directly in the template */
.hover\\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.transition-shadow {
  transition: box-shadow 0.3s ease;
}
</style>