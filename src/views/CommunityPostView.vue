<template>
    <v-container is-fluid>
        <v-lazy transition="fade-transition" v-model="communityStore.ready" :options="{threshold: .5}">
            <v-row>
                <v-col>

                </v-col>

                <v-col cols="8">

                    <v-sheet class="pa-10" elevation="1">
                        <div>

                            <h2 class="font-weight-black">{{ communityStore.post.title }}</h2>
                          <p class="text-right"> {{
                              communityStore.formatDate(communityStore.post.createdDate) }}
                          </p>

                          <h4 class="text-right">
                              작성자: {{ communityStore.post.writer }}
                            </h4>



                            <p>
                                <QuillEditor v-model:content="communityStore.post.content" theme="bubble" readOnly="true"
                                    contentType="html" />
                            </p>

                        </div>
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
