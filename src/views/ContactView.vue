<template>
    <v-container fluid>
        <v-row v-if="display.mdAndUp">
            <v-col>

            </v-col>

            <v-col cols="8">
                <div v-if="isLoading" class="loading-container">
                    <div class="loading">
                        <Moon-loader />
                    </div>
                </div>

                <v-form ref="form" @submit.prevent="sendEmail">
                    <input type="hidden" name="contact_number">

                    <div class="text-subtitle-1 text-medium-emphasis">문의 종류</div>

                    <v-select class="select" variant="underlined" :items="['오류 / 버그', '기능 추가', '사용법', '기타']" label="카테고리"
                        name="to_name">

                    </v-select>

                    <div class="text-subtitle-1 text-medium-emphasis">답신 메일</div>

                    <v-text-field label="답장 받으실 메일을 적어주세요" variant="underlined" name="from_name" v-model="from_name">
                    </v-text-field>



                    <div class="text-subtitle-1 text-medium-emphasis">내용</div>
                    <v-textarea rows="10" variant="outlined" placeholder="내용을 적어주세요" name="message" v-model="message">
                    </v-textarea>

                    <v-btn type="submit" color="success">전송하기</v-btn>

                </v-form>

                <v-snackbar v-model="snackbar" vertical :timeout="10000">
                    <div class="text-subtitle-1 pb-2">전송이 완료되었습니다.</div>

                    <p>최대한 빠른 시일 내에 답변 드리겠습니다.</p>
                    <p>기능 추가는 구현 가능여부 조사를 위해 답장이 다소 느릴 수 있습니다.</p>

                    <template v-slot:actions>
                        <v-btn color="blue" variant="text" @click="snackbar = false">
                            Close
                        </v-btn>
                    </template>
                </v-snackbar>
            </v-col>

            <v-col>

            </v-col>
        </v-row>
        
        <v-container fluid v-else>
            <div v-if="isLoading" class="loading-container">
                    <div class="loading">
                        <Moon-loader />
                    </div>
                </div>

                <v-form ref="form" @submit.prevent="sendEmail">
                    <input type="hidden" name="contact_number">

                    <div class="text-subtitle-1 text-medium-emphasis">문의 종류</div>

                    <v-select class="select" variant="underlined" :items="['오류 / 버그', '기능 추가', '사용법', '기타']" label="카테고리"
                        name="to_name">

                    </v-select>

                    <div class="text-subtitle-1 text-medium-emphasis">답신 메일</div>

                    <v-text-field label="답장 받으실 메일을 적어주세요" variant="underlined" name="from_name" v-model="from_name">
                    </v-text-field>



                    <div class="text-subtitle-1 text-medium-emphasis">내용</div>
                    <v-textarea rows="10" variant="outlined" placeholder="내용을 적어주세요" name="message" v-model="message">
                    </v-textarea>

                    <v-btn type="submit" color="success">전송하기</v-btn>

                </v-form>

                <v-snackbar v-model="snackbar" vertical :timeout="10000">
                    <div class="text-subtitle-1 pb-2">전송이 완료되었습니다.</div>

                    <p>최대한 빠른 시일 내에 답변 드리겠습니다.</p>
                    <p>기능 추가는 구현 가능여부 조사를 위해 답장이 다소 느릴 수 있습니다.</p>

                    <template v-slot:actions>
                        <v-btn color="blue" variant="text" @click="snackbar = false">
                            Close
                        </v-btn>
                    </template>
                </v-snackbar>
        </v-container>

    </v-container>
</template>


<script>

import emailjs from '@emailjs/browser';
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
    name: 'ContactView',


    data() {
        const display = ref(useDisplay());

        return {
            from_name: "",
            message: "",
            isLoading: false,
            snackbar: false,
            display
        }
    },


    methods: {
        sendEmail() {
            if (this.from_name.trim() === "") {
                alert("답장 받으실 메일을 입력해 주세요.");
                return;
            }

            if (this.message.trim() === "") {
                alert("문의하실 내용을 입력해 주세요.");
                return;
            }

            this.isLoading = true;

            emailjs.sendForm('mapshot_contact', 'template_2wpci79', this.$refs.form.$el, 'user_betWihA6XgXwOyOKEHdeq')
                .then((result) => {
                    this.snackbar = true;
                    this.isLoading = false;
                }, (error) => {
                    alert("일시적인 서버 오류입니다. 잠시 후 다시 시도해주세요 \n[ERROR]: " + error.text);
                    this.isLoading = false;
                });
        }
    }

}
</script>



<style scoped>
.loading {
    z-index: 2;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
