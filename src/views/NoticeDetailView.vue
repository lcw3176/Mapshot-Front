<template>
    <v-container is-fluid>
        <v-lazy transition="fade-transition" v-model="noticeStore.ready" :options="{threshold: .5}">
            <v-row>
                <v-col>

                </v-col>

                <v-col cols="10">

                    <v-sheet class="d-flex flex-wrap mx-auto pa-10" elevation="1">
                        <div>
                            <v-chip :color=noticeStore.getNoticeTypeClass(noticeStore.notice.noticeType) variant="outlined">
                                {{ noticeStore.notice.noticeType }}
                            </v-chip>
                            <h2 class="text-h5 font-weight-black mt-2">{{ noticeStore.notice.title }}</h2>

                            <div class="text-h font-weight-medium mt-2"> {{
                                noticeStore.formatDate(noticeStore.notice.createdDate) }}
                            </div>


                            <div class="blockquote text-body-1 noticeContent">
                                <QuillEditor v-model:content="noticeStore.notice.content" theme="bubble" readOnly="true"
                                    contentType="html" />
                            </div>

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
import { useNoticeStore } from '@/store/notice';

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

export default {
    name: 'NoticeDetailView',
    components: {
        QuillEditor,
    },


    setup() {
        const noticeStore = useNoticeStore();

        return {
            noticeStore
        }
    },

    created() {
        this.noticeStore.loadPost(this.postNumber);
    },


    methods: {

    },

    props: {
        postNumber: Number
    }
}
</script>
