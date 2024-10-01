<template>
  <v-container is-fluid>

    <v-row v-if="display.mdAndUp">
      <v-col>

      </v-col>

      <v-col cols="8" v-if="this.noticeStore.loading">
        <v-skeleton-loader type="table">


        </v-skeleton-loader>

      </v-col>


      <v-col v-else cols="8">
        <v-table class="text-body-1">
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
          <tr v-for="notice in noticeStore.notices" :key="notice.id">

            <td>{{ notice.id }}</td>
            <td>
              <v-chip :color=noticeStore.getNoticeTypeClass(notice.noticeType) variant="outlined">
                {{ notice.noticeType }}
              </v-chip>
            </td>
            <td>
              <v-list-item :to="{ path: `/notice/detail/${notice.id}` }"> {{
                  notice.title
                }}
              </v-list-item>
            </td>
            <td>{{ noticeStore.formatDateWithoutHour(notice.createdDate) }}</td>
          </tr>
          </tbody>
        </v-table>

        <v-pagination v-model="noticeStore.nowPage" @click="noticeStore.loadPostList(noticeStore.nowPage)"
                      :length="noticeStore.totalPage"></v-pagination>

      </v-col>

      <v-col>

      </v-col>
    </v-row>


    <v-row v-else>

      <v-col v-if="this.noticeStore.loading">
        <v-skeleton-loader type="table">

        </v-skeleton-loader>
      </v-col>

      <v-col v-else>

        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              제목
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="notice in noticeStore.notices" :key="notice.id">

            <td>
              <v-list-item :to="{ path: `/notice/detail/${notice.id}` }">
                {{ notice.title }}
              </v-list-item>
            </td>
          </tr>
          </tbody>
        </v-table>

        <v-pagination v-model="noticeStore.nowPage" @click="noticeStore.loadPostList(noticeStore.nowPage)"
                      :length="noticeStore.totalPage"></v-pagination>

      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import { useNoticeStore } from '@/store/notice'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  name: 'NoticeView',
  data () {
    const display = ref(useDisplay())

    return {
      notices: [],
      loadNum: 0,
      display

    }
  },

  setup () {
    const noticeStore = useNoticeStore()

    return {
      noticeStore
    }
  },

  created () {
    this.noticeStore.loadPostList(this.noticeStore.nowPage)

  }
}

</script>
