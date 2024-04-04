<template>
    <v-container is-fluid>
        <v-lazy transition="fade-transition" v-model="communityStore.ready" :options="{threshold: .5}">
            <v-row>
                <v-col>

                </v-col>

                <v-col cols="8">

                    <v-sheet class="d-flex flex-wrap mx-auto pa-10" elevation="1">
                        <div>

                          <v-chip color="success" variant="outlined">
                            {{ communityStore.post.writer }}
                          </v-chip>
                          <h2 class="text-h5 font-weight-black mt-2">{{ communityStore.post.title }}</h2>

                          <div class="text-h font-weight-medium mt-2">
                            {{ communityStore.formatDate(communityStore.post.createdDate) }}
                          </div>

                          <div class="blockquote text-body-1 noticeContent">
                            <QuillEditor v-model:content="communityStore.post.content" theme="bubble" readOnly="true"
                                         contentType="html" />
                          </div>

                        </div>

                        <v-col class="text-right">
                          <v-btn variant="outlined" @click="overlay = !overlay">삭제하기</v-btn>
                        </v-col>

                      <v-overlay :model-value="overlay" class="align-center justify-center">
                        <v-card>
                          <v-container>
                            <v-card-title>비밀번호를 입력해주세요.</v-card-title>
                            <v-divider></v-divider>
                            <v-card-item>
                              <v-text-field v-model="communityStore.password" variant="outlined"></v-text-field>
                            </v-card-item>
                            <v-card-actions>
                              <v-btn variant="text" color="error" @click="communityStore.delete()">삭제하기</v-btn>
                              <v-btn variant="text" color="info" @click="overlay = !overlay">닫기</v-btn>
                            </v-card-actions>
                          </v-container>
                        </v-card>
                      </v-overlay>
                    </v-sheet>

                </v-col>

                <v-col>

                </v-col>
            </v-row>
        </v-lazy>


    </v-container>
</template>

<script>
import { useCommunityStore } from '@/store/community';

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

export default {
    name: 'CommunityPostView',
    components: {
        QuillEditor,
    },


    setup() {
        const communityStore = useCommunityStore();

        return {
          communityStore
        }
    },

    data(){
      return {
        overlay: null,
      }
    },

    created() {
        this.communityStore.loadSinglePost(this.postNumber);
    },


    methods: {

    },

    props: {
        postNumber: Number
    }
}
</script>
