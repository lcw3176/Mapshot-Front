<template>
    <v-container is-fluid>
        <v-lazy transition="fade-transition" v-model="communityStore.ready" :options="{threshold: .5}">
            <v-row v-if="display.mdAndUp">
                <v-col>

                </v-col>

              <v-col cols="8" v-if="this.communityStore.loading" >
                <v-skeleton-loader type="article">


                </v-skeleton-loader>

              </v-col>


              <v-col v-else cols="8">

                    <v-sheet class="d-flex flex-wrap mx-auto pa-10" elevation="1">
                        <div>

                          <v-chip color="success" variant="outlined">
                            {{ communityStore.post.writer }}
                          </v-chip>
                          <h2 class="text-h5 font-weight-black mt-2">{{ communityStore.post.title }}</h2>

                          <div class="text-h font-weight-medium mt-2">
                            {{ communityStore.formatDate(communityStore.post.createdDate) }}
                          </div>

                          <QuillEditor v-model:content="communityStore.post.content" theme="bubble" readOnly="true"
                                       contentType="html" class="blockquote text-body-1" />

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
                              <v-btn variant="text" color="error" @click="communityStore.deletePost()">삭제하기</v-btn>
                              <v-btn variant="text" color="info" @click="overlay = !overlay">닫기</v-btn>
                            </v-card-actions>
                          </v-container>
                        </v-card>
                      </v-overlay>
                    </v-sheet>

                <v-sheet class="d-flex flex-wrap mx-auto ma-2 pr-5 pl-5" elevation="0" v-for="comment in communityStore.comments" :key="comment.id">
                  <v-divider class="mb-2"></v-divider>
                  <v-row align="center">
                    <v-col cols="2">
                      {{ comment.writer }}
                    </v-col>

                    <v-col class="text-body-1">
                      {{ comment.content }}
                    </v-col>

                    <v-col cols="2">
                      {{ communityStore.formatDate(comment.createdDate) }}
                    </v-col>

                    <v-col cols="1">
                      <v-btn
                        icon="mdi-close"
                        variant="text"
                        size="x-small"
                        @click="commentOverlay = !commentOverlay; communityStore.removeCommentId = comment.id"
                      ></v-btn>
                    </v-col>

                  </v-row>
                </v-sheet>

                <v-overlay :model-value="commentOverlay" class="align-center justify-center">
                  <v-card>
                    <v-container>
                      <v-card-title>비밀번호를 입력해주세요.</v-card-title>
                      <v-divider></v-divider>
                      <v-card-item>
                        <v-text-field v-model="communityStore.commentPassword" variant="outlined"></v-text-field>
                      </v-card-item>
                      <v-card-actions>
                        <v-btn variant="text" color="error" @click="communityStore.deleteComment()">삭제하기</v-btn>
                        <v-btn variant="text" color="info" @click="commentOverlay = !commentOverlay">닫기</v-btn>
                      </v-card-actions>
                    </v-container>
                  </v-card>
                </v-overlay>

                <v-pagination v-model="communityStore.commentPage" @click="communityStore.loadComments(this.communityStore.commentPage, this.postNumber)" :length="communityStore.commentTotalPage"></v-pagination>

                <v-textarea class="mt-10" label="댓글" variant="outlined" v-model="this.communityStore.comment.content"></v-textarea>

                <v-row>
                  <v-col cols="4">
                    <v-text-field label="비밀번호" variant="outlined"  v-model="this.communityStore.comment.password">

                    </v-text-field>
                  </v-col>

                  <v-col>


                  </v-col>

                  <v-col class="text-right" cols="2">
                    <v-btn variant="flat" size="large" color="#5865f2" @click="this.communityStore.registerComment(this.postNumber)">입력하기</v-btn>
                  </v-col>
                </v-row>

              </v-col>

                <v-col>

                </v-col>
            </v-row>

          <v-row v-else>
            <v-col v-if="this.communityStore.loading" >
              <v-skeleton-loader type="article">


              </v-skeleton-loader>

            </v-col>

            <v-col v-else>
                <div>

                  <v-chip color="success" variant="outlined">
                    {{ communityStore.post.writer }}
                  </v-chip>
                  <h2 class="text-h5 font-weight-black mt-2">{{ communityStore.post.title }}</h2>

                  <div class="text-h font-weight-medium mt-2">
                    {{ communityStore.formatDate(communityStore.post.createdDate) }}
                  </div>

                  <QuillEditor v-model:content="communityStore.post.content" theme="bubble" readOnly="true"
                               contentType="html" class="blockquote text-body-1" />

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
                        <v-btn variant="text" color="error" @click="communityStore.deletePost()">삭제하기</v-btn>
                        <v-btn variant="text" color="info" @click="overlay = !overlay">닫기</v-btn>
                      </v-card-actions>
                    </v-container>
                  </v-card>
                </v-overlay>

              <v-sheet class="d-flex flex-wrap mx-auto ma-2 pr-5 pl-5" elevation="0" v-for="comment in communityStore.comments" :key="comment.id">
                <v-divider class="mb-2"></v-divider>
                <v-row>
                  <v-col>
                    {{ comment.writer }}
                  </v-col>

                  <v-col class="text-body-1">
                    {{ comment.content }}
                  </v-col>

                  <v-col cols="1">
                    <v-btn
                      icon="mdi-close"
                      variant="text"
                      size="x-small"
                      @click="commentOverlay = !commentOverlay; communityStore.removeCommentId = comment.id"
                    ></v-btn>
                  </v-col>

                </v-row>

              </v-sheet>

              <v-overlay :model-value="commentOverlay" class="align-center justify-center">
                <v-card>
                  <v-container>
                    <v-card-title>비밀번호를 입력해주세요.</v-card-title>
                    <v-divider></v-divider>
                    <v-card-item>
                      <v-text-field v-model="communityStore.commentPassword" variant="outlined"></v-text-field>
                    </v-card-item>
                    <v-card-actions>
                      <v-btn variant="text" color="error" @click="communityStore.deleteComment()">삭제하기</v-btn>
                      <v-btn variant="text" color="info" @click="commentOverlay = !commentOverlay">닫기</v-btn>
                    </v-card-actions>
                  </v-container>
                </v-card>
              </v-overlay>

              <v-pagination v-model="communityStore.commentPage" @click="communityStore.loadComments(this.communityStore.commentPage, this.postNumber)" :length="communityStore.commentTotalPage"></v-pagination>

              <v-textarea class="mt-10" label="댓글" variant="outlined" v-model="this.communityStore.comment.content"></v-textarea>

              <v-row>
                <v-col cols="4">
                  <v-text-field label="비밀번호" variant="outlined"  v-model="this.communityStore.comment.password">

                  </v-text-field>
                </v-col>

                <v-col>


                </v-col>

                <v-col>
                  <v-btn variant="flat" size="large" color="#5865f2" @click="this.communityStore.registerComment(this.postNumber)">입력하기</v-btn>
                </v-col>
              </v-row>

            </v-col>
          </v-row>
        </v-lazy>


    </v-container>
</template>

<script>
import { useCommunityStore } from '@/store/community';

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

import { ref } from 'vue'
import { useDisplay } from 'vuetify'

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
      const display = ref(useDisplay());

      return {
        overlay: null,
        commentOverlay: null,
        display
      }
    },

    created() {
        this.communityStore.loadSinglePost(this.postNumber);
        this.communityStore.loadComments(this.communityStore.commentPage, this.postNumber);
    },


    methods: {

    },

    props: {
        postNumber: Number
    }
}
</script>
