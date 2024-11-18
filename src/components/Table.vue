<template>
    <v-container>
        <v-card class="rounded-lg pa-4 mb-4 !bg-gray-200">
            <v-card-title class="d-flex align-center my-2 !text-2xl">
                <v-icon icon="mdi-text-box-search"></v-icon>&nbsp; สืบค้นข้อมูลทรัพย์สินทางปัญญา
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text class="rounded-xl">
                <v-data-table :headers="filteredHeaders" :items="data" :items-per-page="-1" :fixed-header="true"
                height="400" class="elevation-0">
                    <template v-for="header in filteredHeaders" v-slot:[`item.${header.key}`]="{ item }">
                        <div :style="{
                            width: ['intelProp', 'editMore', 'workType'].includes(header.key) ? '150px' : ['nameOnMedia', 'inventor', 'major', 'holder', 'other', 'indust', 'utilization', 'note'].includes(header.key) ? '250px' : 'auto',
                            // backgroundColor: getColumnColor(header.key),
                            padding: '8px'
                        }">
                            <!-- ถ้าเป็นคอลัมน์ 'inventor' ให้แสดงเป็นรายการแยกบรรทัด -->
                            <template v-if="header.key === 'inventor'">
                                <ul style="list-style-type: none; padding-left: 0; text-align: left;">
                                    <li v-for="(name, index) in item[header.key]" :key="index">- {{ name }}</li>
                                </ul>
                            </template>
                            <!-- ถ้าไม่ใช่ 'inventor' ให้แสดงเป็นค่าเดิม -->
                            <template v-else>
                                {{ item[header.key] }}
                            </template>
                        </div>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: "Table",
    data() {
        return {
            isLoggedIn: false, // แสดงสถานะการเข้าสู่ระบบ
            businessType: "บุคลากร มฟล", // ประเภทผู้ใช้
            headers: [
                { title: 'ลำดับ', key: 'id' },
                { title: 'ชื่อผลงาน', key: 'nameOnMedia' },
                { title: 'ชื่อ - นามสกุล', key: 'inventor' },
                { title: 'สังกัด', key: 'major' },
                { title: 'ผู้ทรงสิทธิ', key: 'holder' },
                { title: 'ประเภทผลงาน', key: 'intelProp' },
                { title: 'เลขที่คำขอ', key: 'numberReq' },
                { title: 'วันที่ยื่นคำขอ', key: 'dateReq' },
                { title: 'ปีงบประมาณ', key: 'year' },
                { title: 'แก้ไขเพิ่มเติม', key: 'editMore' },
                { title: 'เลขที่ประกาศโฆษณา', key: 'numberAds' },
                { title: 'วันที่ประกาศโฆษณา', key: 'dateAds' },
                { title: 'สถานะสุดท้าย', key: 'status' },
                { title: 'เลขที่รับจดทะเบียน', key: 'numberRegister' },
                { title: 'วันที่รับจดทะเบียน', key: 'dateRegister' },
                { title: 'วันที่หมดอายุ', key: 'exp' },
                { title: 'ครบกำหนดชำระค่าธรรมเนียมรายปี', key: 'dueFee' },
                { title: 'แจ้งเตือนชำระค่าธรรมเนียมรายปี', key: 'notiFee' },
                { title: 'อื่นๆ', key: 'other' },
                { title: 'ประเภทอุตสาหกรรม', key: 'indust' },
                { title: 'ลักษณะผลงาน', key: 'workType' },
                { title: 'การใช้ประโยชน์', key: 'utilization' },
                { title: 'หมายเหตุ', key: 'note' },
            ].map(column => ({
                ...column,
                align: 'center',
            })),
            data: [
                {
                    id: '1',
                    nameOnMedia: 'การเตรียมสารสกัดใบเหงือกปลาหมอดอกขาวสำหรับเวชสำอางบำรุงผิว',
                    inventor: ['รศ.ดร.มยุรี กัลยาวัฒนกุล', 'รศ.ดร.ณัฐยา เหล่าฤทธิ์', 'ผศ.ดร.ภักวดี ไชยกุล'],
                    major: 'สำนักวิชาวิทยาศาสตร์เครื่องสำอาง',
                    holder: 'มหาวิทยาลัยมแม่ฟ้าหลวง',
                    intelProp: 'อนุสิทธิบัตร',
                    numberReq: '00000000000001',
                    dateReq: '01/01/2564',
                    year: '2564',
                    editMore: 'แก้ไขเพิ่มเติม ครั้งที่ 1',
                    numberAds: '00000000000001',
                    dateAds: '20/02/2564',
                    status: 'ยื่นคำขอ',
                    numberRegister: '00000000000001',
                    dateRegister: '01/01/2564',
                    exp: '01/01/2565',
                    dueFee: '01/01/2565',
                    notiFee: '01/01/2565',
                    other: '01/01/2565 - ยื่นคำขอในระบบออนไลน์',
                    indust: 'เครื่องสำอาง',
                    workType: 'ผลิตภัณฑ์',
                    utilization: 'เพื่อการใช้ในเวชสำอาง',
                    note: 'ไม่มี',
                },
                {
                    id: '2',
                    nameOnMedia: 'การผลิตเมล็ดพันธุ์ข้าวนาปรังหอมมะลิ 105 ด้วยเทคโนโลยีเมล็ดพันธุ์เทียม',
                    inventor: ['ดร.สมชาย ใจดี', 'ดร.สมหญิง ใจงาม'],
                    major: 'สำนักวิชาวิทยาศาสตร์การอาหาร',
                    holder: 'มหาวิทยาลัยแม่ฟ้าหลวง',
                    intelProp: 'สิทธิบัตร',
                    numberReq: '00000000000002',
                    dateReq: '15/03/2564',
                    year: '2564',
                    editMore: 'แก้ไขเพิ่มเติม ครั้งที่ 2',
                    numberAds: '00000000000002',
                    dateAds: '30/04/2564',
                    status: 'ประกาศโฆษณา',
                    numberRegister: '00000000000002',
                    dateRegister: '15/05/2564',
                    exp: '15/05/2565',
                    dueFee: '15/05/2565',
                    notiFee: '15/05/2565',
                    other: '15/05/2565 - ยื่นคำขอในระบบออนไลน์',
                    indust: 'อาหารเสริม',
                    workType: 'ผลิตภัณฑ์',
                    utilization: 'เพื่อการใช้ในอาหารเสริม',
                    note: 'ไม่มี',
                },
            ],
        }
    },
    computed: {
        filteredHeaders() {
            // if (!this.isLoggedIn) return [];
            if (!this.isLoggedIn && ["นิติบุคคล", "บุคคลธรรมดา"].includes(this.businessType)) {
                return this.headers.filter(header =>
                    ["id", "nameOnMedia", "inventor", "major", "reqNumber", "intelProp", "indust"].includes(header.key)
                );
            }
            if (this.businessType === "บุคลากร มฟล") {
                return this.headers;
            }
            return [];
        },
    },
    // methods: {
    //     getColumnColor(key) {
    //         const colors = {
    //             id: '#ffcccc',
    //             nameOnMedia: '#ccffcc',
    //             intelProp: '#ccffcc',
    //             dateReq: '#ccccff',
    //             year: '#ffffcc',
    //             workType: '#ffffcc',
    //         };
    //         return colors[key] || '#ffffff'; // Default to white if no color specified
    //     }
    // }
};
</script>
