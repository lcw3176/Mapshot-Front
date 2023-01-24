<template>

    <div v-if="isLoading" class="loading-container">
        <div class="loading">
            <Moon-loader />
        </div>
    </div>
        
    <form ref="form" @submit.prevent="sendEmail">
        <input type="hidden" name="contact_number">
        <div class="field">
            <label class="label">카테고리</label>
            <div class="control">
                <div class="select">
                    <select name="to_name">
                        <option>오류 / 버그</option>
                        <option>기능 추가</option>
                        <option>사용법</option>
                        <option>기타</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="field">
            <label class="label">답신 메일</label>
            <div class="control has-icons-left has-icons-right">
                <input class="input" type="email" placeholder="답장 받으실 메일을 적어주세요" name="from_name" v-model="from_name">
                <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                </span>
            </div>
        </div>

        <div class="field">
            <label class="label">내용</label>
            <div class="control">
                <textarea class="textarea" rows="10" placeholder="내용을 적어주세요" name="message" v-model="message"></textarea>
            </div>
        </div>

        <div class="field is-grouped">
            <div class="control">
                <button type="submit" class="button is-link">전송하기</button>
            </div>
        </div>

    </form>
</template>

<script>
import emailjs from '@emailjs/browser';
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'

export default {
    name: 'ContactForm',
    
    components:{
        MoonLoader
    },

    data() {
        return {
            from_name: "",
            message: "",
            isLoading: false,
        }
    },


    methods: {
      sendEmail() {
        if (this.from_name.trim() === "") {
            alert("답장 받으실 메일을 입력해 주세요.");
            return;
        }

        if(this.message.trim() === ""){
            alert("문의하실 내용을 입력해 주세요.");
            return;
        }

        this.isLoading = true;
        emailjs.sendForm('mapshot_contact', 'template_2wpci79', this.$refs.form, 'user_betWihA6XgXwOyOKEHdeq')
          .then((result) => {
            alert("전송이 완료되었습니다.");
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
