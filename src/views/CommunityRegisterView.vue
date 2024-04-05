<template>
  <v-container is-fluid>
    <v-row v-if="display.mdAndUp">
      <v-col>

      </v-col>

      <v-col cols="8">
        <v-sheet class="pa-10" >

          <v-form ref="form">
            <v-text-field v-model="communityStore.post.title" variant="underlined" label="제목" required></v-text-field>
            <v-text-field v-model="communityStore.post.password" variant="underlined" label="비밀번호" required></v-text-field>

            <QuillEditor v-model:content="communityStore.post.content" theme="snow" contentType="html" style="height: 500px;" />

            <v-col class="text-right">
              <v-btn class="text-right" color="success" @click="communityStore.register()">
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
              <v-btn class="text-right" color="success" @click="communityStore.register()">
                등록하기
              </v-btn>
            </v-col>


          </v-form>
        </v-sheet>
      </v-col>

    </v-row>
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
      content: '',
      writer: '',
    };

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

  }

}
</script>
