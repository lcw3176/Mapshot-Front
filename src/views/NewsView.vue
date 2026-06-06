<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="9" lg="8">

        <!-- 헤더 -->
        <div class="d-flex align-center justify-space-between flex-wrap mb-1">
          <div>
            <h1 class="text-h5 font-weight-bold mb-1">
              <v-icon icon="mdi-newspaper-variant-outline" color="success" class="mr-1"/>
              도시뉴스
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              도시공학·도시계획 뉴스를 모아 AI가 요약해 드려요
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

        <!-- 키워드 필터 -->
        <v-chip-group
          v-if="!newsStore.isLoading && newsStore.articles.length"
          v-model="selectedKeyword"
          selected-class="text-success"
          mandatory
          column
          class="mb-2"
        >
          <v-chip
            v-for="keyword in newsStore.keywords"
            :key="keyword"
            :value="keyword"
            variant="outlined"
            filter
          >
            {{ keyword }}
          </v-chip>
        </v-chip-group>

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
          v-else-if="!newsStore.filteredArticles.length"
          class="text-center text-medium-emphasis py-16"
        >
          표시할 뉴스가 없어요.
        </div>

        <!-- 기사 카드 목록 -->
        <template v-else>
          <v-card
            v-for="article in newsStore.filteredArticles"
            :key="article.id"
            variant="outlined"
            rounded="lg"
            class="mb-4"
          >
            <v-card-item>
              <div class="d-flex align-center mb-1" style="gap: 8px;">
                <v-chip
                  v-if="article.keyword"
                  size="small"
                  color="success"
                  variant="tonal"
                  label
                >
                  {{ article.keyword }}
                </v-chip>
                <span class="text-caption text-medium-emphasis">
                  {{ newsStore.formatDate(article.publishedAt || article.collectedDate) }}
                </span>
              </div>
              <v-card-title class="text-wrap text-h6 px-0" style="line-height: 1.4;">
                <a
                  :href="article.originalUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="article-title"
                >
                  {{ article.title }}
                </a>
              </v-card-title>
            </v-card-item>

            <v-card-text>
              <template v-if="hasStructuredSummary(article)">
                <p
                  v-if="parsed(article).core"
                  class="text-body-1 font-weight-medium mb-3"
                >
                  {{ parsed(article).core }}
                </p>

                <v-list
                  v-if="parsed(article).points.length"
                  density="compact"
                  class="bg-transparent py-0 mb-2"
                >
                  <v-list-item
                    v-for="(point, i) in parsed(article).points"
                    :key="i"
                    class="px-0"
                    min-height="28"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-circle-small" size="small" color="success"/>
                    </template>
                    <v-list-item-title class="text-body-2 text-wrap">
                      {{ point }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>

                <p
                  v-if="parsed(article).implication"
                  class="text-body-2 text-medium-emphasis mt-2"
                >
                  <v-icon icon="mdi-lightbulb-on-outline" size="small" color="warning" class="mr-1"/>
                  {{ parsed(article).implication }}
                </p>
              </template>

              <!-- 고정 포맷이 아닌 경우 원문 그대로 -->
              <p v-else class="text-body-2" style="white-space: pre-wrap;">
                {{ parsed(article).raw || '요약이 아직 준비되지 않았어요.' }}
              </p>
            </v-card-text>

            <v-divider/>
            <v-card-actions>
              <v-btn
                :href="article.originalUrl"
                target="_blank"
                rel="noopener noreferrer"
                variant="text"
                size="small"
                color="success"
                append-icon="mdi-open-in-new"
              >
                원문 보기
              </v-btn>
            </v-card-actions>
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

  computed: {
    selectedKeyword: {
      get () {
        return this.newsStore.activeKeyword
      },
      set (value) {
        this.newsStore.setKeyword(value || '전체')
      },
    },
  },

  methods: {
    parsed (article) {
      return this.newsStore.parseSummary(article.summary)
    },

    hasStructuredSummary (article) {
      const p = this.parsed(article)
      return !!(p.core || p.points.length || p.implication)
    },

    refresh () {
      this.newsStore.setKeyword('전체')
      this.newsStore.loadRecent()
    },
  },

  created () {
    this.newsStore.loadRecent()
  },
}
</script>

<style scoped>
.article-title {
  color: rgb(var(--v-theme-on-surface));
  text-decoration: none;
}

.article-title:hover {
  color: rgb(var(--v-theme-success));
  text-decoration: underline;
}
</style>
