<template>
    <v-app>
        <v-main class="bg-gray-100 font-noto-sans-thai">
            <Filters />
            <Table />
        </v-main>
    </v-app>
</template>
<script>
import Filters from '@/components/filter.vue'
import Table from '@/components/Table.vue';
Table
export default {
    name: "TableResearch",
    components: {
        Filters,
        Table
    },
}
</script>
<style></style>