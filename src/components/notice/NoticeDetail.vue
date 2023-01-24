<template>
    <div class="box">
        <div v-if="noticeStore.isLoading" class="loading-container">
            <div class="loading">
                <Moon-loader />
            </div>
        </div>

        <article class="media">
            <div class="media-content">
                <div class="content">
                    <small :class="noticeStore.getNoticeTypeClass(noticeStore.getNotice.noticeType)">
                        {{ noticeStore.getNotice.noticeType }}
                    </small>
                    <strong class="ml-3">{{ noticeStore.getNotice.title }} </strong>   
                </div>

                <div class="content">
                    <small class="tag">작성일</small>
                    <small class="ml-3">{{ noticeStore.formatDate(noticeStore.getNotice.createdDate) }}</small>
                </div>

                <div class="content m-5">
                    <VueShowdown :markdown="noticeStore.getNotice.content"/>
                </div>

            </div>
        </article>

    </div>

</template>

<script>
import { VueShowdown } from 'vue-showdown';
import { useNoticeStore } from '@/store/notice';
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'


export default {
    name: 'NoticeDetail',
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
    },

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