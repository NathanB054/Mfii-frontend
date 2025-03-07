<template>
    <v-app>
        <v-main>
            <v-container>
                <!-- Message list -->
                <v-card class="rounded-xl bg-black">
                    <v-card-title>ข้อความและการตอบกลับ</v-card-title>
                    <v-card-text>
                        <v-list class="rounded-xl bg-white">
                            <v-container v-if="reversedMessages.length <= 0">
                                <h1>ไม่มีข้อความในขณะนี้...</h1>
                            </v-container>
                            <v-list-item v-else v-for="message in reversedMessages" :key="message.id"
                                class="list-item-border my-2">
                                <v-list-item-title>เทคโนโลยีที่คุณสนใจ: {{ message.interestTech }}</v-list-item-title>
                                <v-list-item-subtitle>ชื่อกิจการของคุณ: {{ message.businessName
                                    }}</v-list-item-subtitle>
                                <v-list-item-subtitle>ขอบเขตการใช้งานของคุณ: {{ message.usesScope
                                    }}</v-list-item-subtitle>
                                <v-list-item-action class="my-2">
                                    <v-btn @click="openReplyDialog(message._id)"
                                        class="!bg-slate-800 text-white mr-2">ตอบกลับ</v-btn>
                                    <v-btn @click="deleteMessage(message._id)" color="error">ลบ</v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>

                <!-- Message Reply -->
                <v-dialog v-model="isDialogOpen" max-width="1000px" class="font-noto-sans-thai">
                    <v-card v-for="selected in selectedMessage" :key="selected._id"
                        class="rounded-xl d-flex flex-column">
                        <v-card-title class="headline text-2xl font-semibold" style="white-space: pre-line;">
                            เทคโนโลยีที่สนใจ: <span class="text-xl">{{ selected.interestTech }}</span>
                        </v-card-title>
                        <v-card-subtitle>กิจการ : {{ selected.businessName }}</v-card-subtitle>
                        <v-card-subtitle>ประเภทกิจการ : {{ selected.businessType }}</v-card-subtitle>
                        <v-card-subtitle>ขอบเขตการใช้งาน : {{ selected.usesScope }}</v-card-subtitle>
                        <v-card-subtitle>ผู้ส่ง : {{ selected.firstName }} {{ selected.lastName }}</v-card-subtitle>
                        <v-card-subtitle>อีเมล: {{ selected.email }}</v-card-subtitle>
                        <v-card-text class="flex-grow-1 d-flex flex-column"
                            style="max-height: 550px; overflow: hidden;">
                            <!-- Chat box -->
                            <div class="chatbox flex-grow-1" style="overflow-y: auto;" ref="chatbox">
                                <v-list>
                                    <v-list-item v-for="reply in sortMessages(selected.messageReply)" :key="reply.id">
                                        <!-- User name displayed outside the message bubble -->
                                        <div
                                            :class="['message-username', reply.user.role === 'user' ? 'text-right' : 'text-left']">
                                            <p
                                                :class="[reply.user.role === 'user' ? 'text-gray text-xs' : 'text-gray text-xs']">
                                                {{ reply.user.role }}: {{ reply.user.firstName }}
                                            </p>
                                            <p
                                                :class="[reply.user.role === 'user' ? 'text-gray-600 text-xs mt-1' : 'text-gray-600 text-xs mt-1']">
                                                ส่งเมื่อ {{ formatDateTime(reply.date) }}
                                            </p>
                                        </div>
                                        <!-- Message bubble -->
                                        <div
                                            :class="['message-bubble', reply.user.role === 'user' ? 'current-user' : 'other-user', 'rounded-lg mt-1']">
                                            <div
                                                :class="['message-content', reply.user.role === 'user' ? 'text-right' : 'text-left']">
                                                {{ reply.messages }}
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                            </div>
                            <v-text-field label="Your Reply" variant="solo-filled" v-model="replyText"
                                @keyup.enter="sendReply" outlined rounded dense></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red darken-1" text @click="closeReplyDialog">Cancel</v-btn>
                            <v-btn color="blue darken-1" text :disabled="!replyText.trim()"
                                @click="replyMessage(replyText, selected._id)">Send</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>

            <!-- confirm delete -->
            <v-dialog v-model="confirmDialog" max-width="600px">
                <v-card class="rounded-xl pa-4">
                    <v-card-title
                        class="text-h5 text-center text-red-500">คุณแน่ใจว่าต้องการลบข้อความนี้หรือไม่?</v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="'blue-grey-darken-1" variant="outlined" class="hover:bg-gray-500"
                            @click="closeDelete">ยกเลิก</v-btn>
                        <v-btn color="red-darken-1" variant="outlined" class="hover:bg-red-300"
                            @click="confirmDelete">ตกลง</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-main>
    </v-app>
</template>

<script>
import api from '@/stores/axios-config';
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import { useErrorStore } from "@/stores/errorStore";

export default {
    name: "messagePage",
    data() {
        return {
            isDialogOpen: false,
            selectedMessage: {},
            replyText: "",
            messages: [],
            user: {
                _id: "",
                email: "",
            },
            confirmDialog: false,
            messageToDelete: null,
        };
    },
    setup() {
        const authStore = useAuthStore();
        const user = computed(() => authStore.user);
        return { user };
    },
    mounted() {
        this.fetchMessages();
    },
    methods: {
        sortMessages(messages) {
            return messages.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        },

        formatDateTime(isoDate) {
            const date = new Date(isoDate);
            const options = {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Bangkok'
            };
            const formatter = new Intl.DateTimeFormat('en-GB', options);
            return formatter.format(date);
        },

        async openReplyDialog(id) {
            try {
                const response = await api.get("/mesDetail/" + id);
                this.selectedMessage = response.data.result;
                this.replyText = ""; // Clear previous reply text
                this.isDialogOpen = true;
            } catch (error) {
                throw error;
            }
        },

        sendReply() {
            if (this.replyText.trim()) {
                this.replyMessage(this.replyText, this.selectedMessage[0]._id);
            }
        },

        async replyMessage(message, id) {
            try {
                await api.patch("/mesReplyUpdate/" + id, {
                    messages: message,
                    user: this.user._id,
                });
                this.selectedMessage[0].messageReply.push({
                    messages: message,
                    user: { firstName: this.user.firstName, role: this.user.role },
                    id: Date.now(),
                    date: Date.now()
                });
                this.replyText = "";
            } catch (error) {
                throw error;
            }
        },

        async fetchMessages() {
            try {
                const response = await api.get("/mesGetData");
                this.messages = response.data.result;
            } catch (error) {
                throw error;
            }
        },

        closeReplyDialog() {
            this.isDialogOpen = false;
        },

        closeDelete() {
            this.confirmDialog = false;
        },

        async deleteMessage(id) {
            this.messageToDelete = id;
            this.confirmDialog = true;
        },

        async confirmDelete() {
            this.confirmDialog = false;
            const errorStore = useErrorStore();
            if (this.messageToDelete) {
                try {
                    await api.delete('/mesDelete/' + this.messageToDelete);
                    errorStore.show("ลบข้อความสำเร็จ!", {
                        color: 'success',
                        icon: 'mdi-check-circle',
                        timeout: 5000
                    });
                    this.fetchMessages();
                } catch (error) {
                    throw error;
                }
                this.messageToDelete = null;
            }
        },

       
    },
    computed: {
        reversedMessages() {
            return this.messages.slice().reverse();
        }
    },
};
</script>

<style scoped>
@import '../../styles/messageReply.css';
</style>