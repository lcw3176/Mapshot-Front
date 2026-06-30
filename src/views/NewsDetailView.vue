<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="9" lg="8">

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
            <v-card-title class="text-wrap text-h5" style="line-height: 1.4;">
              {{ newsStore.post.title }}
            </v-card-title>
            <div class="d-flex align-center flex-wrap mt-2" style="gap: 8px;">
              <span class="text-caption text-medium-emphasis">
                {{ newsStore.formatDate(newsStore.post.createdDate) }}
              </span>
              <v-chip
                v-if="sources.length"
                size="x-small"
                variant="tonal"
                color="success"
                prepend-icon="mdi-link-variant"
              >
                출처 {{ sources.length }}건
              </v-chip>
            </div>
          </v-card-item>

          <v-divider/>

          <v-card-text>
            <!-- digest 가 있으면 풍부 UI, 없으면 기존 HTML 본문으로 폴백 -->
            <NewsDigest
              v-if="newsStore.post.digest"
              :digest="newsStore.post.digest"
              :sources="sources"
              :related-posts="relatedPosts"
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
    relatedPosts () {
      return (this.newsStore.post && this.newsStore.post.relatedPosts) || []
    },
  },

  created () {
    this.newsStore.loadDetail(this.id)
  },
}
</script>

<style scoped>
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
