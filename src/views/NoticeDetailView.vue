<template>
    <v-container is-fluid>
        <div v-if="noticeStore.isLoading" class="loading-container">
            <div class="loading">
                <Moon-loader />
            </div>
        </div>

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


                        <div class="blockquote text-body-1">
                            <VueShowdown :markdown="noticeStore.notice.content" flavor="github" />
                        </div>

                    </div>
                </v-sheet>

            </v-col>

            <v-col>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { VueShowdown } from 'vue-showdown';
import { useNoticeStore } from '@/store/notice';
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'


export default {
    name: 'NoticeDetailView',
    components: {
        VueShowdown,
        MoonLoader,
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


    props: {
        postNumber: Number
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

