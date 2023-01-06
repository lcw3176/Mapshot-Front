<template>
    <div class="box">

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


export default {
    name: 'NoticeDetail',
    components: {
        VueShowdown,
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
