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
                    <div>{{ newsStore.formatDate(post.createdDate) }}</div>
                    <div class="mt-1">
                      <v-icon icon="mdi-eye-outline" size="x-small" class="mr-1"/>{{ post.viewCount }}
                    </div>
                  </div>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-card>

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
