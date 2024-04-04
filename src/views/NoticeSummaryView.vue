<template>
    <v-container is-fluid>

        <v-lazy transition="fade-transition" v-model="noticeStore.ready" :options="{threshold: .5}">
            <v-row>
                <v-col>

                </v-col>

                <v-col cols="8">
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    No
                                </th>
                                <th class="text-left" v-if="display.mdAndUp">
                                    카테고리
                                </th>

                                <th class="text-left">
                                    제목
                                </th>

                                <th class="text-left" v-if="display.mdAndUp">
                                    작성일
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="notice in noticeStore.notices" :key="notice.id">

                                <td>{{ notice.id }}</td>
                                <td v-if="display.mdAndUp">
                                    <v-chip :color=noticeStore.getNoticeTypeClass(notice.noticeType) variant="outlined">
                                        {{ notice.noticeType }}
                                    </v-chip>
                                </td>
                                <td><v-list-item :to="{ path: `/notice/detail/${notice.id}` }"> {{ notice.title
                                }}</v-list-item>
                                </td>
                                <td v-if="display.mdAndUp">{{ noticeStore.formatDate(notice.createdDate) }}</td>
                            </tr>
                        </tbody>
                    </v-table>

                </v-col>

                <v-col>

                </v-col>
            </v-row>
        </v-lazy>
    </v-container>

    <InfiniteLoading @infinite="noticeStore.infiniteHandler">

    </InfiniteLoading>
</template>

<script>
import InfiniteLoading from 'v3-infinite-loading';
import { useNoticeStore } from '@/store/notice';
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
    name: 'NoticeView',
    data() {
        const display = ref(useDisplay());


        return {
            notices: [],
            loadNum: 0,
            display

        }
    },

    components: {
        InfiniteLoading,
    },

    setup() {
        const noticeStore = useNoticeStore();

        return {
            noticeStore
        }
    },
}

</script>
