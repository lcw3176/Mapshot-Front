<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col :cols="display.mdAndUp ? 8 : 12">

        <v-overlay :model-value="isLoading" class="align-center justify-center" contained>
          <Moon-loader/>
        </v-overlay>

        <v-card variant="outlined" rounded="lg" class="pa-4">
          <v-card-title class="mb-2">
            <v-icon class="mr-2" color="success">mdi-email-edit-outline</v-icon>
            문의하기
          </v-card-title>
          <v-divider class="mb-4"/>

          <v-form ref="form" @submit.prevent="sendEmail">
            <input type="hidden" name="contact_number">

            <v-select
              variant="outlined"
              density="comfortable"
              :items="['오류 / 버그', '기능 추가', '사용법', '기타']"
              label="문의 종류"
              prepend-inner-icon="mdi-tag-outline"
              name="to_name"
              class="mb-2"
            />

            <v-text-field
              label="답장 받으실 메일"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email-outline"
              name="from_name"
              v-model="from_name"
              class="mb-2"
            />

            <v-textarea
              rows="8"
              variant="outlined"
              placeholder="내용을 적어주세요"
              label="문의 내용"
              name="message"
              v-model="message"
              class="mb-3"
            />

            <v-btn
              type="submit"
              color="success"
              variant="elevated"
              size="large"
              block
              prepend-icon="mdi-send"
              rounded="lg"
            >
              전송하기
            </v-btn>
          </v-form>
        </v-card>

        <v-snackbar v-model="snackbar" vertical :timeout="10000" color="success" rounded="lg">
          <div class="text-subtitle-1 pb-2 font-weight-bold">전송이 완료되었습니다.</div>
          <p>최대한 빠른 시일 내에 답변 드리겠습니다.</p>
          <p>기능 추가는 구현 가능여부 조사를 위해 답장이 다소 느릴 수 있습니다.</p>
          <template v-slot:actions>
            <v-btn variant="text" @click="snackbar = false">닫기</v-btn>
          </template>
        </v-snackbar>

      </v-col>
    </v-row>
  </v-container>
</template>


<script>

import emailjs from '@emailjs/browser'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  name: 'ContactView',
  components: { MoonLoader },

  data () {
    const display = ref(useDisplay())
    return {
      from_name: '',
      message: '',
      isLoading: false,
      snackbar: false,
      display,
    }
  },


  methods: {
    sendEmail () {
      if (this.from_name.trim() === '') {
        alert('답장 받으실 메일을 입력해 주세요.')
        return
      }
      if (this.message.trim() === '') {
        alert('문의하실 내용을 입력해 주세요.')
        return
      }

      this.isLoading = true
      emailjs.sendForm('mapshot_contact', 'template_2wpci79', this.$refs.form.$el, 'user_betWihA6XgXwOyOKEHdeq')
        .then(() => {
          this.snackbar = true
          this.isLoading = false
        }, (error) => {
          alert('일시적인 서버 오류입니다. 잠시 후 다시 시도해주세요 \n[ERROR]: ' + error.text)
          this.isLoading = false
        })
    },
  },
}
</script>



