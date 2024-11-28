<template>
    <div class="search-nav-container">
        <v-text-field v-model="search" density="comfortable" placeholder="Search" prepend-inner-icon="mdi-magnify"
            :style="{ maxWidth: maxWidth }" variant="solo" clearable @click:clear="clearSearch"
            @keyup.enter="fetchResearchData" hide-details rounded class="pb-6" :min-width="minWidth"
            ref="searchField"></v-text-field>
        <v-menu v-model="showMenu" :close-on-content-click="false" :nudge-width="300" :offset-y="true" max-width="300"
            min-width="200" max-height="400" :activator="'parent'">
            <v-card>
                <v-list v-if="combinedResults.length > 0">
                    <template v-for="item in combinedResults">
                        <!-- eslint-disable-next-line vue/valid-v-for -->
                        <v-list-item @click="handleItemClick(item)">
                            <v-list-item-title>{{ item.nameOnMedia || item.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item.industryType || (item.external ? 'ลิงค์ภายนอก' : 'ลิงค์ภายใน')
                                }}</v-list-item-subtitle>
                        </v-list-item>
                    </template>
                </v-list>
                <v-card-text v-else-if="hasSearched && !loading">
                    ไม่พบข้อมูล
                </v-card-text>
                <v-card-text v-if="loading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
import api from '@/stores/axios-config';
const url = import.meta.env.VITE_BASE_URL;

export default {
    name: 'NavSearch',
    props: {
        maxWidth: {
            type: String,
            default: '300px'
        },
        minWidth: {
            type: String,
            default: '150px'
        }
    },
    data() {
        return {
            search: '',
            baseUrl: '',
            apiResults: [],
            loading: false,
            hasSearched: false,
            showMenu: false,
            pages: [
                { name: "หน้าหลัก", path: "/" },
                { name: "ยกระดับงานวิจัยและนวัตกรรม", path: "/services/ups" },
                { name: "ขั้นตอนการขออนุญาตใช้สิทธิ", path: "/services/lap" },
                { name: "อบรมและให้คำปรึกษา", path: "/services/ipa" },
                { name: "ยื่นขอรับความคุ้มครอง", path: "/services/ipp" },
                { name: "ผลงานพร้อมถ่ายทอด", path: "/tt/all-categories" },
                { name: "ระเบียบข้อบังคับ มฟล.", path: "/recmn/mfii/rule" },
                { name: "จัดสรรผลประโยชน์", path: "/recmn/mfii/benefits" },
                { name: "Q&A", path: "/recmn/mfii/q&a" },
                { name: "แบบฟอร์มขอยื่นจด", path: "/recmn/downloads/request_form" },
                { name: "เอกสารการอบรม", path: "/recmn/downloads/training" },
                { name: "MRii", path: "/recmn/about/inside/MRii" },
                { name: "MFii", path: "/recmn/about/inside/MFii" },
                { name: "Research", path: "/recmn/about/inside/research" },
                { name: "DIP", path: "/recmn/about/outside/DIP" },
                { name: "WIPO", path: "/recmn/about/outside/WIPO" },
                { name: "อวท.", path: "/recmn/about/outside/อวท" },
                { name: "โครงสร้างองค์กร", path: "https://mfii.mfu.ac.th/mfii-about/mfii-structure.html", external: true },
                { name: "บุคลากร", path: "https://mfii.mfu.ac.th/mfii-ip-staff.html", external: true },
                { name: "ติดต่อเรา", path: "/about-us/contact" },
                { name: "สมัครสมาชิก", path: "/register" },
                { name: "เข้าสู่ระบบ", path: "/login" },
            ],
        };
    },
    computed: {
        combinedResults() {
            const pageResults = this.pages.filter(page =>
                page.name.toLowerCase().includes(this.search.toLowerCase())
            );
            return [...this.apiResults, ...pageResults];
        }
    },
    methods: {
        clearSearch() {
            this.search = '';
            this.apiResults = [];
            this.hasSearched = false;
            this.showMenu = false;
        },
        fetchResearchData() {
            if (!this.search.trim()) return;
            const indust = "all";
            const prop = "all";
            const tech = "all";
            const descript = this.search.trim() || "all";
            this.loading = true;
            this.hasSearched = true;
            this.showMenu = true;

            api.get(`/getsResearch/${indust}/${prop}/${tech}/${descript}`, {
                withCredentials: true,
                credentials: "include",
            })
                .then((response) => {
                    if (response.status == 200) {
                        const activeData = response.data.result.filter(
                            (item) => item.status === "active"
                        );
                        this.apiResults = activeData; // Store only API results here
                        if (this.combinedResults.length === 0) {
                            this.snackbar.message = "No results found";
                            this.snackbar.color = "error";
                            this.snackbar.show = true;
                        }
                        console.log("Search success");
                    } else {
                        this.error = new Error("API response is not OK");

                    }
                    this.loading = false;
                })
                .catch((error) => {
                    console.log("Searched");
                    console.log(error);
                    this.loading = false;
                    this.apiResults = []; // Clear API results on error
                });
        },
        handleItemClick(item) {
            if (item.external) {
                window.open(item.path, '_blank');
            } else if (item._id) {
                this.$router.push({ name: 'Innovation Detail', params: { id: item._id } });
            } else {
                this.$router.push(item.path);
            }
            this.showMenu = false;
        },
    },

    mounted() {
        this.baseUrl = url;
    },
    watch: {
        
        search(newVal) {
            if (newVal.trim()) {
                this.fetchResearchData();
            } else {
                this.showMenu = false;
            }
        }
    }

};
</script>

<style scoped>
.search-nav-container {
    position: relative;
    width: 100%;
}

.v-menu__content {
    margin-top: 5px !important;
    position: absolute;
    width: 100% !important;
    left: 0 !important;
}
</style>