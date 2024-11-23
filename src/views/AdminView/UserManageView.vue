<template>
  <admin-layout>
    <!-- Content for admin page goes here -->
    <v-container>
      <!-- Topic -->
      <v-card class="rounded-xl pa-4">
        <v-card-title class="d-flex align-center pe-2">
          <v-icon icon="mdi-account-group"></v-icon> &nbsp; User Management

          <v-spacer></v-spacer>

          <!-- search -->
          <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
            variant="solo-filled" flat clearable hide-details single-line></v-text-field>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn class="mx-4" color="primary" dark v-bind="props">
                <v-icon class="pr-2">mdi-plus</v-icon> New User
              </v-btn>
            </template>
            <v-form ref="form" @submit.prevent="this.formTitle === 'New User' ? addsave() : editsave()">
              <v-card class="rounded-xl pa-4">
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="12" sm="12">
                        <v-text-field variant="solo-filled" flat v-model="editedItem.firstName" label="First Name"
                          :rules="[(v) => !!v || 'กรุณากรอก ชื่อจริง']" required></v-text-field>
                        <v-text-field variant="solo-filled" flat v-model="editedItem.lastName" label="Last Name"
                          :rules="[(v) => !!v || 'กรุณากรอก นามสกุล']" required></v-text-field>
                        <v-text-field variant="solo-filled" flat v-model="editedItem.phoneNumber" label="Phone"
                          :rules="[rules.requiredPhone, rules.phone, rules.notEmpty]" required></v-text-field>
                      </v-col>

                      <v-col cols="12" md="12" sm="12">
                        <v-text-field variant="solo-filled" flat v-model="editedItem.email" label="Email"
                          :rules="[rules.requiredEmail, rules.email]"></v-text-field>
                        <v-text-field v-if="this.editedIndex === -1" v-model="editedItem.password" label="Password"
                          variant="solo-filled" flat :rules="[
                            (v) => !!v || 'กรุณากรอก รหัสผ่าน',
                            (v) =>
                              v.length >= 6 ||
                              'กรุณากรอก รหัสผ่าน 6 ตัวอักษรขึ้นไป',
                          ]" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6" sm="6">
                        <v-autocomplete variant="solo-filled" flat label="Role" v-model="editedItem.role"
                          :items="['user', 'staff']" :rules="[(v) => !!v || 'กรุณาเลือก role']"
                          required></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="6" sm="6">
                        <v-autocomplete variant="solo-filled" flat label="Status" v-model="editedItem.status"
                          :items="['active', 'inactive']"></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>


                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red-darken-1" variant="outlined" class="hover:bg-red-300" @click="close">
                    ยกเลิก
                  </v-btn>
                  <v-btn color="green-darken-1" variant="outlined" class="hover:bg-green-200" type="submit">
                    บันทึก
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>

          <!-- Delete User -->
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card class="rounded-xl pa-4">
              <v-card-title
                class="text-h5 text-center text-red-500">คุณแน่ใจหรือว่าต้องการลบผู้ใช้รายนี้?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="'blue-grey-darken-1" variant="outlined" class="hover:bg-gray-500"
                  @click="closeDelete">ยกเลิก</v-btn>
                <v-btn color="red-darken-1" variant="outlined" class="hover:bg-red-300"
                  @click="deleteItemConfirm">ตกลง</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- </v-toolbar> -->
          <!-- </template> -->
        </v-card-title>
        <v-divider></v-divider>


        <!-- data table -->
        <v-data-table v-model:search="search" :headers="headers" :items="users.resutl" :items-per-page="-1"
          :sort-by="[{ key: 'userId', order: 'asc' }]" :fixed-header="true" height="400">
          <template v-slot:item.status="{ item }">
            <div>
              <v-chip :color="item.status.toLowerCase() === 'active' ? 'green' : 'red'
                " class="text-uppercase" size="small" label>
                {{ item.status }}
              </v-chip>
            </div>
          </template>

          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>


          <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </admin-layout>
  <div class="text-center">
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" vertical>
      <div class="text-subtitle-1 pb-2"></div>
      <p>{{ snackbar.message }}</p>
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import AdminLayout from "@/layouts/admin.vue";
import api from '@/stores/axios-config';
import { useErrorStore } from "@/stores/errorStore";
const errorStore = useErrorStore();
export default {
  components: {
    AdminLayout,
  },
  data: () => ({
    rules: {
      requiredEmail: value => !!value || 'กรุณากรอก อีเมล',
      requiredPhone: value => !!value || 'กรุณากรอก เบอร์โทรศัพท์',
      email: value => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(com|co\.th|ac\.th|net|in\.th|mfu\.ac\.th|org|edu|gov|co\.[a-zA-Z]{2}|uk|de|fr|jp|cn|us|au|info|biz|io|me|tv|ca|nl|it|br|ru|es)$/;
        if (!emailPattern.test(value)) {
          return 'โปรดกรอกอีเมลให้ถูกต้อง';
        }
        // Return true or undefined if the email is valid
        return true;
      },
      phone: value => /^\d{9,10}$/.test(value) || 'หมายเลขโทรศัพท์ต้องเป็นตัวเลข 9 หรือ 10 หลัก',
      notEmpty: value => (value && value.trim().length > 0) || 'ช่องนี้ไม่สามารถเว้นว่างได้'
    },
    search: "",
    users: [],
    snackbar: {
      show: false,
      message: "",
      color: "success", // Default color
    },
    dialog: false,
    dialogDelete: false,
    headers: [{
      title: "ID",
      align: "center",
      key: "_id"
    },
    {
      title: "Name",
      align: "start",
      sortable: false,
      key: "firstName"
    },
    {
      title: "Last Name",
      align: "start",
      sortable: false,
      key: "lastName"
    },
    {
      title: "Email",
      sortable: false,
      key: "email"
    },
    {
      title: "Phone",
      sortable: false,
      key: "phoneNumber"
    },
    {
      title: "Create Date",
      key: "createdAt",
      formatter: (value) => {
        if (!value) return '';
        const date = new Date(value);
        return date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
      }
    },
    {
      title: "Role",
      key: "role"
    },
    {
      title: "Status",
      key: "status"
    },
    {
      title: "Actions",
      key: "actions",
      sortable: false
    },
    ],
    editedIndex: -1,
    editedItem: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "",
      status: "",
    },
    defaultItem: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "",
      status: "active",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  async created() {
    this.initialize();
    this.fectchUser();
  },

  methods: {
    initialize() {
      this.search = "";
    },

    // datetime format
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    },


    // fetch users =============================================================
    async fectchUser() {
      try {
        const response = await api.get("/admin/getsUser");
        this.users = response.data;
      } catch (error) {
        throw error;
      }
    },

    // Delete users ====================================================================================
    deleteItem(item) {
      this.editedIndex = this.users.resutl.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.users.resutl.splice(this.editedIndex, 1);
      try {
        const res = await api.delete(
          "/admin/deleteUser/" + this.editedItem._id
        );
        errorStore.show("ลบข้อมูลผู้ใช้งานสําเร็จ", {
          color: 'success',
          icon: 'mdi-check-circle',
          timeout: 5000
        });
        this.fectchUser();
      } catch (error) {
        this.fectchUser();
        throw error;
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    // =================================================================================

    //edit user ========================================================================

    editItem(item) {
      this.editedIndex = this.users.resutl.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async editsave() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        if (this.editedIndex > -1) {
          Object.assign(this.users.resutl[this.editedIndex], this.editedItem);
          try {
            await api.patch(
              "/admin/updatePatch/" + this.editedItem._id, {
              firstName: this.editedItem.firstName.trim(),
              lastName: this.editedItem.lastName.trim(),
              email: this.editedItem.email.trim().toLowerCase(),
              phoneNumber: this.editedItem.phoneNumber.trim(),
              role: this.editedItem.role,
              status: this.editedItem.status,
            }
            );
            errorStore.show("แก้ไขข้อมูลผู้ใช้งานสําเร็จ", {
              color: 'success',
              icon: 'mdi-check-circle',
              timeout: 5000
            });
            this.fectchUser();
            this.close();
          } catch (error) {
            this.fectchUser();
            this.close();
            throw error;
          }
        } else {
          this.users.resutl.push(this.editedItem);
        }
      } else {
        errorStore.show("กรอกข้อมูลไม่ครบ", {
          color: 'warning',
          icon: 'mdi-alert-circle',
          timeout: 5000
        });
      }
    },

    // Add user =========================================================================================================================
    async addsave() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        if (!this.editedIndex > -1) {
          //  Object.assign(this.users.resutl[this.editedIndex], this.editedItem);
          // console.log(this.editedItem._id);
          try {
            await api.post(
              "/register", {
              firstName: this.editedItem.firstName.trim(),
              lastName: this.editedItem.lastName.trim(),
              email: this.editedItem.email.trim().toLowerCase(),
              phoneNumber: this.editedItem.phoneNumber.trim(),
              password: this.editedItem.password.trim(),
              role: this.editedItem.role,
              status: this.editedItem.status,
              // createDate: createDate,
            },
            );
            errorStore.show("เพิ่มข้อมูลผู้ใช้งานสําเร็จ", {
              color: 'success',
              icon: 'mdi-check-circle',
              timeout: 5000
            });
            this.fectchUser();
          } catch (error) {
            this.fectchUser();
            throw error;
          }
        } else {
          this.users.resutl.push(this.editedItem);
        }
        this.close();
      }
      else {
        errorStore.show("กรอกข้อมูลไม่ครบ", {
          color: 'warning',
          icon: 'mdi-alert-circle',
          timeout: 5000
        });
      }

    }

  },

};
</script>



<style scoped>
/* สำหรับเบราว์เซอร์ Webkit (เช่น Chrome, Safari) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* สำหรับ Firefox */
html {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style>