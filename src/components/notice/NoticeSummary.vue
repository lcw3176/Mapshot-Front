<template>

    <div class="container is-fluid">

        <div class="tile is-ancestor" v-for="notice in noticeStore.getNotices" v-bind:key="notice.id">
            <div class="tile is-vertical">
                <div class="tile">
                    <div class="tile is-parent is-vertial">
                        <router-link v-bind:to="{ path: `/notice/detail/${notice.id}` }"
                            class="tile is-child notification" style="text-decoration: none; color: inherit;">
                            <article>
                                <p :class="noticeStore.getNoticeTypeClass(`${notice.noticeType}`)">
                                    {{ notice.noticeType }}
                                </p>
                                <p class="subtitle">{{ notice.title }}</p>
                                <p>{{ noticeStore.formatDate(notice.createdDate) }}</p>
                            </article>
                        </router-link>

                    </div>
                </div>
            </div>

        </div>
    </div>

    <InfiniteLoading @infinite="noticeStore.infiniteHandler" />

</template>



<script>
import InfiniteLoading from 'v3-infinite-loading';
import { useNoticeStore } from '@/store/notice';


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
        const noticeStore = useNoticeStore();

        return {
            noticeStore
        }
    },



}
</script>