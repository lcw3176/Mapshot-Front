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
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                                No
                            </th>
                            <th class="text-left">
                                카테고리
                            </th>

                            <th class="text-left">
                                제목
                            </th>

                            <th class="text-left">
                                작성일
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="notice in noticeStore.getNotices" :key="notice.id">

                            <td>{{ notice.id }}</td>
                            <td>
                                <v-chip :color=noticeStore.getNoticeTypeClass(notice.noticeType) variant="outlined">
                                    {{ notice.noticeType }}
                                </v-chip>
                            </td>
                            <td><v-list-item :to="{ path: `/notice/detail/${notice.id}` }"> {{ notice.title }}</v-list-item>
                            </td>
                            <td>{{ noticeStore.formatDate(notice.createdDate) }}</td>
                        </tr>
                    </tbody>
                </v-table>

            </v-col>

            <v-col>

            </v-col>
        </v-row>
    </v-container>

    <InfiniteLoading @infinite="noticeStore.infiniteHandler">

    </InfiniteLoading>

</template>



<script>
import InfiniteLoading from 'v3-infinite-loading';
import { useNoticeStore } from '@/store/notice';
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'

export default {
    name: 'NoticeSummary',
    data() {
        return {
            notices: [],
            loadNum: 0,

        }
    },

    components: {
        InfiniteLoading,
        MoonLoader
    },

    setup() {
        const noticeStore = useNoticeStore();

        return {
            noticeStore
        }
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