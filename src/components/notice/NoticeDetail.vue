<template>
    <div class="box">

        <article class="media">
            <div class="media-content">
                <div class="content">
                    <small :class="getNoticeTypeClass(noticeDetailStore.getNotice.noticeType)">
                        {{ noticeDetailStore.getNotice.noticeType }}
                    </small>
                    <strong class="ml-3">{{ noticeDetailStore.getNotice.title }} </strong>   
                </div>

                <div class="content">
                    <small class="tag">작성일</small>
                    <small class="ml-3">{{ formatDate(noticeDetailStore.getNotice.createdDate) }}</small>
                </div>

                <div class="content m-5">
                    <VueShowdown :markdown="noticeDetailStore.getNotice.content"/>
                </div>

            </div>
        </article>

    </div>

</template>

<script>
import { VueShowdown } from 'vue-showdown';
import { useNoticeDetailStore } from '@/store/noticeDetail';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'


export default {
    name: 'NoticeDetail',
    components: {
        VueShowdown,
    },

    setup() {
        const noticeDetailStore = useNoticeDetailStore();
        dayjs.locale('ko')

        return {
            noticeDetailStore
        }
    },

    created() {
        this.noticeDetailStore.loadPost(this.postNumber);
    },

    props: {
        postNumber: Number
    },

    methods: {
        formatDate(dateString) {
            const date = dayjs(dateString);

            return date.format('YYYY.MM.DD hh:ss');
        },

        
        getNoticeTypeClass(noticeType) {
            switch (noticeType) {
                case '업데이트':
                    return 'tag is-info mb-2';
                case '점검예정':
                    return 'tag is-warning mb-2';
                case '오류수정':
                    return 'tag is-danger mb-2';
            }
        },

        
    }


}
</script>
