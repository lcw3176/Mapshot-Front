<template>
  <v-container class="py-6 news-reader">
    <v-row justify="center">
      <!-- 목록(md9/lg8)보다 한 단계 좁게. 1rem 한글 본문은 700px 안쪽이 읽기 편하다 -->
      <v-col cols="12" md="8" lg="7" xl="6">

        <!-- 상단 뒤로가기 -->
        <v-btn
          variant="text"
          color="success"
          prepend-icon="mdi-arrow-left"
          to="/news"
          class="mb-3 px-2"
        >
          목록으로
        </v-btn>

        <!-- 로딩 -->
        <div v-if="newsStore.isDetailLoading" class="text-center py-16">
          <v-progress-circular indeterminate color="success" size="48"/>
          <p class="text-body-2 text-medium-emphasis mt-4">불러오는 중…</p>
        </div>

        <!-- 에러 -->
        <v-alert
          v-else-if="newsStore.isDetailError || !newsStore.post"
          type="error"
          variant="tonal"
          class="my-6"
          text="게시글을 불러올 수 없어요."
        />

        <!-- 본문 -->
        <v-card v-else variant="outlined" rounded="lg">

          <!-- ① 헤더 -->
          <v-card-item>
            <!-- text-h5 를 안 쓰는 이유: Vuetify 타이포 유틸이 Roboto 를 박아 넣어 .news-reader 서체를 덮는다 -->
            <v-card-title class="text-wrap news-title">
              {{ newsStore.post.title }}
            </v-card-title>
            <div class="text-caption text-medium-emphasis mt-2 news-meta">
              <span>{{ newsStore.formatDate(newsStore.post.createdDate) }}</span>
              <span v-if="sources.length"> · 출처 {{ sources.length }}건</span>
            </div>
          </v-card-item>

          <v-divider/>

          <v-card-text>
            <!-- digest 가 있으면 풍부 UI, 없으면 기존 HTML 본문으로 폴백 -->
            <!-- relatedPosts 는 응답에 오지만 그리지 않는다: 제목이 전부 "도시뉴스 브리핑 (날짜)"라 고를 정보가 없다 -->
            <NewsDigest
              v-if="newsStore.post.digest"
              :digest="newsStore.post.digest"
              :sources="sources"
            />

            <template v-else>
              <div class="news-body" v-html="newsStore.post.content"></div>

              <!-- 폴백 경로의 출처 블록 -->
              <template v-if="sources.length">
                <v-divider class="my-4"/>
                <div class="text-overline text-medium-emphasis mb-1">출처</div>
                <v-list density="compact" class="bg-transparent py-0">
                  <v-list-item
                    v-for="(source, i) in sources"
                    :key="i"
                    :href="source.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-0"
                    min-height="28"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-link-variant" size="small" color="success"/>
                    </template>
                    <v-list-item-title class="text-body-2 text-wrap source-link">
                      {{ source.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </template>
            </template>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useNewsStore } from '@/store/news'
import NewsDigest from '@/components/news/NewsDigest.vue'

export default {
  name: 'NewsDetailView',

  components: { NewsDigest },

  props: {
    id: [Number, String],
  },

  setup () {
    const newsStore = useNewsStore()
    return { newsStore }
  },

  computed: {
    sources () {
      return (this.newsStore.post && this.newsStore.post.sources) || []
    },
  },

  created () {
    this.newsStore.loadDetail(this.id)
  },
}
</script>

<style scoped>
/* 읽기 화면 서체. Pretendard 는 public/index.html 에서 동적 서브셋으로 불러온다 */
.news-reader {
  font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui,
    'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
}

.news-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.015em;
  word-break: keep-all;
  text-wrap: balance;
}

.news-meta {
  font-variant-numeric: tabular-nums;
}

.news-body :deep(h3) {
  font-size: 1rem;
  font-weight: 700;
  margin: 12px 0 6px;
}

.news-body :deep(p) {
  margin: 6px 0;
  line-height: 1.6;
}

.news-body :deep(ul) {
  padding-left: 20px;
  margin: 6px 0;
}

.news-body :deep(li) {
  margin: 2px 0;
  line-height: 1.5;
}

.source-link {
  color: rgb(var(--v-theme-on-surface));
}

.source-link:hover {
  color: rgb(var(--v-theme-success));
  text-decoration: underline;
}
</style>
