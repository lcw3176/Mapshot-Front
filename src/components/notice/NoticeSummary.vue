<template>

    <div class="container is-fluid">

        <div class="tile is-ancestor" v-for="notice in noticeSummaryStore.getNotices" v-bind:key="notice.id">
            <div class="tile is-vertical">
                <div class="tile">
                    <div class="tile is-parent is-vertial">
                        <router-link v-bind:to="{ path: `/notice/detail/${notice.id}` }"
                            class="tile is-child notification" style="text-decoration: none; color: inherit;">
                            <article>
                                <p :class="getNoticeTypeClass(`${notice.noticeType}`)">
                                    {{ notice.noticeType }}
                                </p>
                                <p class="subtitle">{{ notice.title }}</p>
                                <p>{{ formatDate(notice.createdDate) }}</p>
                            </article>
                        </router-link>

                    </div>
                </div>
            </div>

        </div>
    </div>

    <InfiniteLoading @infinite="noticeSummaryStore.infiniteHandler" />

</template>



<script>
import InfiniteLoading from 'v3-infinite-loading';
import { useNoticeSummaryStore } from '@/store/noticeSummary';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'

export default {
    name: 'NoticeSummary',
    data() {
        return {
            notices: [],
            loadNum: 0
        }
    },

    components: {
        InfiniteLoading
    },

    setup() {
        const noticeSummaryStore = useNoticeSummaryStore();

        dayjs.locale('ko')

        return {
            noticeSummaryStore
        }
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