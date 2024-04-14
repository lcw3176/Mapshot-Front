<template>
  <v-container is-fluid>
    <v-row v-if="display.mdAndUp">
      <v-col>

      </v-col>

      <v-col cols="8">
        <v-sheet class="pa-10" >

          <v-form ref="form">
            <v-text-field v-model="communityStore.post.title" variant="underlined" label="제목" required class="mb-4"></v-text-field>
            <v-text-field v-model="communityStore.post.password" variant="underlined" label="비밀번호" required class="mb-4"></v-text-field>

            <QuillEditor v-model:content="communityStore.post.content" theme="snow" contentType="html" style="height: 500px;" />

            <v-col class="text-right">
              <v-btn class="text-right" color="success" @click="communityStore.registerPost()">
                등록하기
              </v-btn>
            </v-col>


          </v-form>
        </v-sheet>
      </v-col>

      <v-col>

      </v-col>
    </v-row>


    <v-row v-else>
      <v-col>
        <v-sheet>

          <v-form ref="form">
            <v-text-field v-model="communityStore.post.title" variant="underlined" label="제목" required></v-text-field>
            <v-text-field v-model="communityStore.post.password" variant="underlined" label="비밀번호" required></v-text-field>

            <QuillEditor v-model:content="communityStore.post.content" theme="snow" contentType="html" style="height: 500px;" />

            <v-col class="text-right">
              <v-btn class="text-right" color="success" @click="communityStore.registerPost()">
                등록하기
              </v-btn>
            </v-col>


          </v-form>
        </v-sheet>
      </v-col>

    </v-row>
    <v-alert v-if="alertStatue()"
      title="글자수 제한"
      :text="communityStore.alertMessage"
      type="error"
    ></v-alert>

  </v-container>
</template>


<script>

import { useCommunityStore } from '@/store/community.js'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {

  components: {
    QuillEditor
  },

  setup() {
    const communityStore = useCommunityStore();

    communityStore.post = {
      title: '',
      password: '',
      createdDate: '',
      content: '',
    }

    return {
      communityStore,
    }

  },

  data() {
    const display = ref(useDisplay());

    return {
      display
    }
  },


  methods: {

    alertStatue() {

      if(this.communityStore.post.title.length > 50){
        this.communityStore.isAlert = true;
        this.communityStore.alertMessage = "제목은 50자 이하여야 합니다.";
      }


      else if (this.communityStore.post.password.length > 50){
        this.communityStore.isAlert = true;
        this.communityStore.alertMessage = "비밀번호는 50자 이하여야 합니다.";
      }

      else if(this.communityStore.post.content.length > 2000){
        this.communityStore.isAlert = true;
        this.communityStore.alertMessage = "내용은 2000자 이하여야 합니다.";
      }

      else {
        this.communityStore.isAlert = false;
        this.communityStore.alertMessage = '';
      }

      return this.communityStore.isAlert;
    },

  }

}
</script>
