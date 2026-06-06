<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="9" lg="8">

        <!-- 헤더 -->
        <div class="d-flex align-center justify-space-between flex-wrap mb-3">
          <div>
            <h1 class="text-h5 font-weight-bold mb-1">
              <v-icon icon="mdi-newspaper-variant-outline" color="success" class="mr-1"/>
              도시뉴스
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              도시공학·도시계획 뉴스를 모아 AI가 한 편으로 요약해 드려요
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
          아직 발행된 도시뉴스 요약이 없어요.
        </div>

        <!-- 요약 게시글 목록 -->
        <template v-else>
          <v-card
            v-for="post in newsStore.posts"
            :key="post.id"
            variant="outlined"
            rounded="lg"
            class="mb-4"
          >
            <v-card-item>
              <v-card-title class="text-wrap text-h6 px-0" style="line-height: 1.4;">
                {{ post.title }}
              </v-card-title>
              <span class="text-caption text-medium-emphasis">
                {{ newsStore.formatDate(post.createdDate) }}
              </span>
            </v-card-item>

            <!-- LLM 요약 본문 (HTML) -->
            <v-card-text>
              <div class="news-body" v-html="post.content"></div>
            </v-card-text>

            <!-- 출처 (본문과 분리된 별도 블록) -->
            <template v-if="post.sources && post.sources.length">
              <v-divider/>
              <v-card-text class="pb-2">
                <div class="text-overline text-medium-emphasis mb-1">출처</div>
                <v-list density="compact" class="bg-transparent py-0">
                  <v-list-item
                    v-for="(source, i) in post.sources"
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
              </v-card-text>
            </template>
          </v-card>
        </template>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useNewsStore } from '@/store/news'

export default {
  name: 'NewsView',

  setup () {
    const newsStore = useNewsStore()
    return { newsStore }
  },

  methods: {
    refresh () {
      this.newsStore.loadRecent()
    },
  },

  created () {
    this.newsStore.loadRecent()
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
