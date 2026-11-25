<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="9" lg="8">

        <!-- 헤더 -->
        <div class="d-flex align-center justify-space-between flex-wrap mb-4">
          <div>
            <h1 class="text-h5 font-weight-bold mb-1">
              <v-icon icon="mdi-newspaper-variant-outline" color="success" class="mr-1"/>
              도시뉴스
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ currentTrack.desc }}
            </p>
          </div>
          <v-btn
            variant="text"
            prepend-icon="mdi-refresh"
            color="success"
            :loading="newsStore.isLoading"
            @click="refresh"
          >
            새로고침
          </v-btn>
        </div>

        <!-- 갈래: 브리핑 / 보도자료 풀이. URL(?track=press)에 남겨 지도·상세에서 돌아올 때 같은 갈래로 연다 -->
        <v-tabs
          :model-value="newsStore.track"
          color="success"
          density="comfortable"
          class="mb-4"
          @update:model-value="changeTrack"
        >
          <v-tab v-for="t in tracks" :key="t.value" :value="t.value">{{ t.label }}</v-tab>
        </v-tabs>

        <!-- 로딩 -->
        <div v-if="newsStore.isLoading" class="text-center py-16">
          <v-progress-circular indeterminate color="success" size="48"/>
          <p class="text-body-2 text-medium-emphasis mt-4">뉴스를 불러오는 중…</p>
        </div>

        <!-- 에러 -->
        <v-alert
          v-else-if="newsStore.isError"
          type="error"
          variant="tonal"
          class="my-6"
          text="뉴스를 불러오지 못했어요. 잠시 후 새로고침해 주세요."
        />

        <!-- 빈 상태 -->
        <div
          v-else-if="!newsStore.posts.length"
          class="text-center text-medium-emphasis py-16"
        >
          아직 발행된 {{ currentTrack.label }} 글이 없어요.
        </div>

        <!-- 게시글 목록 (클릭 → 상세) -->
        <v-card v-else variant="outlined" rounded="lg">
          <v-list class="py-0">
            <template v-for="(post, i) in newsStore.posts" :key="post.id">
              <v-divider v-if="i !== 0"/>
              <v-list-item
                :to="`/news/${post.id}`"
                class="py-3"
              >
                <v-list-item-title class="text-subtitle-1 font-weight-medium text-wrap mb-1">
                  {{ post.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2 text-medium-emphasis text-wrap">
                  {{ post.preview }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-caption text-medium-emphasis text-right" style="white-space:nowrap;">
                    {{ newsStore.formatDate(post.createdDate) }}
                  </div>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-card>

        <!-- 페이지 넘김. 페이지도 URL(?page=)에 남겨 상세에서 '목록으로' 돌아올 때 같은 페이지로 온다 -->
        <v-pagination
          v-if="!newsStore.isLoading && !newsStore.isError && newsStore.totalPages > 1"
          :model-value="newsStore.page"
          :length="newsStore.totalPages"
          :total-visible="7"
          color="success"
          density="comfortable"
          class="mt-4"
          @update:model-value="changePage"
        />

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { TRACKS, useNewsStore } from '@/store/news'

export default {
  name: 'NewsView',

  setup () {
    const newsStore = useNewsStore()
    return { newsStore, tracks: TRACKS }
  },

  computed: {
    currentTrack () {
      return TRACKS.find(t => t.value === this.newsStore.track) ?? TRACKS[0]
    },
  },

  watch: {
    '$route.query' (query) {
      if (this.$route.name !== 'news') return
      this.newsStore.loadRecent(this.normalize(query.track), this.toPage(query.page))
    },
  },

  methods: {
    normalize (track) {
      return TRACKS.some(t => t.value === track) ? track : 'briefing'
    },
    toPage (page) {
      const n = parseInt(page, 10)
      return Number.isFinite(n) && n > 0 ? n : 1
    },
    query (track, page) {
      const q = {}
      if (track !== 'briefing') q.track = track
      if (page > 1) q.page = String(page)
      return q
    },
    changeTrack (track) {
      // 갈래를 바꾸면 1페이지부터
      this.$router.replace({ query: this.query(track, 1) })
    },
    changePage (page) {
      this.$router.push({ query: this.query(this.newsStore.track, page) })
      window.scrollTo({ top: 0 })
    },
    refresh () {
      this.newsStore.loadRecent(this.newsStore.track, this.newsStore.page)
    },
  },

  created () {
    this.newsStore.loadRecent(this.normalize(this.$route.query.track), this.toPage(this.$route.query.page))
  },
}
</script>
