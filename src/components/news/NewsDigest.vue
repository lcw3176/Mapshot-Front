<template>
  <div class="news-digest">

    <!-- ② 히어로 -->
    <section class="digest-hero">
      <p v-if="digest.intro" class="digest-intro">{{ digest.intro }}</p>

      <!-- 오늘의 숫자 -->
      <div v-if="hasHighlight" class="highlight-card">
        <div class="highlight-eyebrow">오늘의 숫자</div>
        <div class="highlight-number">{{ digest.highlight.number }}</div>
        <div v-if="digest.highlight.label" class="highlight-label">
          {{ digest.highlight.label }}
        </div>
        <div v-if="digest.highlight.description" class="highlight-desc">
          {{ digest.highlight.description }}
        </div>
      </div>

      <!-- 키워드 클라우드 -->
      <div v-if="keywordCloud.length" class="keyword-cloud">
        <v-chip
          v-for="k in keywordCloud"
          :key="k.text"
          size="small"
          variant="tonal"
          color="success"
          class="ma-1"
          :class="`kw-${sizeFor(k.count)}`"
        >
          {{ k.text }}
        </v-chip>
      </div>
    </section>

    <!-- ③ 오늘의 도시 소식 (섹션 카드) -->
    <section v-if="sections.length" class="digest-sections">
      <h2 class="block-title">오늘의 도시 소식</h2>

      <v-card
        v-for="(s, i) in sections"
        :key="i"
        variant="outlined"
        rounded="lg"
        class="section-card mb-3"
        :style="{ borderLeft: `4px solid ${colorFor(s.category)}` }"
      >
        <v-card-text>
          <v-chip
            size="x-small"
            label
            class="mb-2 font-weight-medium"
            :style="{ backgroundColor: colorFor(s.category), color: '#fff' }"
          >
            {{ s.category || '기타' }}
          </v-chip>

          <h3 class="section-title">{{ s.title }}</h3>
          <p class="section-body">{{ s.body }}</p>

          <div v-if="s.whyMatters" class="callout callout-why">
            <span class="callout-label">왜 중요한가요</span>
            <span>{{ s.whyMatters }}</span>
          </div>
          <div v-if="s.nextStep" class="callout callout-next">
            <span class="callout-label">다음은</span>
            <span>{{ s.nextStep }}</span>
          </div>

          <div v-if="hasTags(s)" class="tag-row">
            <v-chip
              v-for="r in (s.regions || [])"
              :key="`r-${r}`"
              size="x-small" variant="tonal" color="blue-grey" class="ma-1"
            >{{ r }}</v-chip>
            <v-chip
              v-for="e in (s.entities || [])"
              :key="`e-${e}`"
              size="x-small" variant="tonal" color="indigo" class="ma-1"
            >{{ e }}</v-chip>
            <v-chip
              v-for="k in (s.keywords || [])"
              :key="`k-${k}`"
              size="x-small" variant="text" color="success" class="ma-1"
            >#{{ k }}</v-chip>
          </div>

          <!-- 기사 원문 링크 -->
          <div v-if="(s.sources || []).length" class="source-row">
            <v-chip
              v-for="(src, si) in s.sources"
              :key="`src-${si}`"
              :href="src.url"
              target="_blank"
              rel="noopener noreferrer"
              :title="src.title"
              size="x-small"
              variant="outlined"
              color="grey-darken-1"
              class="ma-1 source-chip"
            >
              <v-icon start icon="mdi-open-in-new" size="11"/>
              {{ src.title }}
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
    </section>

    <!-- ④ 부가 코너 -->
    <!-- 언급된 지역 -->
    <section v-if="regionStats.length" class="digest-extra">
      <h2 class="block-title">언급된 지역</h2>
      <v-chip
        v-for="r in regionStats"
        :key="r.name"
        size="small" variant="tonal" color="blue-grey" class="ma-1"
      >
        {{ r.name }}
        <span v-if="r.count" class="region-count">{{ r.count }}</span>
      </v-chip>
    </section>

    <!-- 이런 뜻이에요 -->
    <section v-if="glossary.length" class="digest-extra">
      <h2 class="block-title">이런 뜻이에요</h2>
      <v-expansion-panels variant="accordion" class="glossary-panels">
        <v-expansion-panel
          v-for="(g, i) in glossary"
          :key="i"
          :title="g.term"
          :text="g.explanation"
        />
      </v-expansion-panels>
    </section>

    <!-- 출처 (접힘) -->
    <section v-if="sources.length" class="digest-extra">
      <v-expansion-panels variant="accordion">
        <v-expansion-panel :title="`출처 ${sources.length}건 보기`">
          <template v-slot:text>
            <v-list density="compact" class="bg-transparent py-0">
              <v-list-item
                v-for="(src, i) in sources"
                :key="i"
                :href="src.url"
                target="_blank"
                rel="noopener noreferrer"
                class="px-0"
                min-height="28"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-link-variant" size="small" color="success"/>
                </template>
                <v-list-item-title class="text-body-2 text-wrap source-link">
                  {{ src.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </section>

    <!-- ⑤ 함께 보면 좋아요 -->
    <section v-if="relatedPosts.length" class="digest-extra">
      <h2 class="block-title">함께 보면 좋아요</h2>
      <v-card
        v-for="p in relatedPosts"
        :key="p.id"
        variant="outlined"
        rounded="lg"
        class="related-card mb-2"
        :to="`/news/${p.id}`"
      >
        <v-card-text class="py-3">
          <div class="related-title">{{ p.title }}</div>
          <div class="related-preview">{{ p.preview }}</div>
          <div class="related-date">{{ formatDate(p.createdDate) }}</div>
        </v-card-text>
      </v-card>
    </section>

    <!-- ⑥ 맵샷AI의 한마디 -->
    <section v-if="digest.outro" class="signature-block">
      <div class="signature-eyebrow">
        <v-icon icon="mdi-robot-happy-outline" size="small" color="success" class="mr-1"/>
        맵샷AI의 한마디
      </div>
      <p class="signature-text">{{ digest.outro }}</p>
    </section>

  </div>
</template>

<script>
import dayjs from 'dayjs'

// 카테고리 → 액센트 컬러. 모르는 값은 회색으로 폴백한다(LLM이 새 값을 만들 수 있음).
const CATEGORY_COLORS = {
  정책: '#3b82f6',
  기술: '#8b5cf6',
  재생: '#22c55e',
  제도: '#f59e0b',
  시장: '#f43f5e',
  기타: '#6b7280',
}

export default {
  name: 'NewsDigest',

  props: {
    digest: { type: Object, required: true },
    sources: { type: Array, default: () => [] },
    relatedPosts: { type: Array, default: () => [] },
  },

  computed: {
    sections () {
      return this.digest.sections || []
    },
    keywordCloud () {
      return this.digest.keywordCloud || []
    },
    regionStats () {
      return this.digest.regionStats || []
    },
    glossary () {
      return this.digest.glossary || []
    },
    hasHighlight () {
      const h = this.digest.highlight
      return !!(h && h.number)
    },
  },

  methods: {
    colorFor (category) {
      return CATEGORY_COLORS[category] || CATEGORY_COLORS['기타']
    },
    // count 크기에 비례해 폰트 크기 3단계.
    sizeFor (n) {
      if (n >= 4) return 'lg'
      if (n >= 2) return 'md'
      return 'sm'
    },
    hasTags (s) {
      return (s.regions && s.regions.length) ||
        (s.entities && s.entities.length) ||
        (s.keywords && s.keywords.length)
    },
    formatDate (dateString) {
      if (!dateString) return ''
      return dayjs(dateString).format('YYYY.MM.DD')
    },
  },
}
</script>

<style scoped>
.news-digest {
  padding: 4px 0 8px;
}

/* 히어로 */
.digest-intro {
  font-size: 1.0625rem;
  line-height: 1.75;
  margin: 4px 0 16px;
}

.highlight-card {
  border: 1px solid rgba(var(--v-theme-success), 0.35);
  background: rgba(var(--v-theme-success), 0.06);
  border-radius: 14px;
  padding: 16px 20px;
  margin: 8px 0 16px;
  text-align: center;
}

.highlight-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: rgb(var(--v-theme-success));
  font-weight: 700;
}

.highlight-number {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 4px 0 2px;
}

.highlight-label {
  font-size: 0.9375rem;
  font-weight: 600;
}

.highlight-desc {
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-top: 4px;
}

.keyword-cloud {
  display: flex;
  flex-wrap: wrap;
  margin: 4px -4px 8px;
}

.kw-lg { font-size: 0.95rem !important; font-weight: 700; }
.kw-md { font-size: 0.825rem !important; font-weight: 600; }
.kw-sm { font-size: 0.72rem !important; }

/* 블록 제목 */
.block-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 28px 0 12px;
}

/* 섹션 카드 */
.section-title {
  font-size: 1.0625rem;
  font-weight: 700;
  margin: 2px 0 6px;
  line-height: 1.4;
}

.section-body {
  font-size: 0.95rem;
  line-height: 1.65;
  margin: 0 0 10px;
}

.callout {
  font-size: 0.8625rem;
  line-height: 1.55;
  padding: 7px 10px;
  border-radius: 8px;
  margin: 6px 0;
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.callout-label {
  font-weight: 700;
  margin-right: 6px;
  color: rgb(var(--v-theme-success));
}

.callout-next .callout-label {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  margin: 8px -4px 0;
}

.source-row {
  display: flex;
  flex-wrap: wrap;
  margin: 6px -4px 0;
  padding-top: 8px;
  border-top: 1px dashed rgba(var(--v-theme-on-surface), 0.12);
}

.source-chip {
  max-width: 100%;
}

.source-chip :deep(.v-chip__content) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 260px;
}

/* 부가 코너 */
.region-count {
  font-size: 0.7rem;
  font-weight: 700;
  margin-left: 4px;
  opacity: 0.65;
}

.glossary-panels :deep(.v-expansion-panel-title) {
  font-weight: 600;
  min-height: 44px;
}

.source-link {
  color: rgb(var(--v-theme-on-surface));
}

.source-link:hover {
  color: rgb(var(--v-theme-success));
  text-decoration: underline;
}

/* 관련글 */
.related-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.related-preview {
  font-size: 0.825rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-date {
  font-size: 0.72rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
  margin-top: 4px;
}

/* 맵샷AI의 한마디 */
.signature-block {
  margin-top: 28px;
  padding: 16px 18px;
  border-radius: 14px;
  background: rgba(var(--v-theme-success), 0.06);
  border: 1px dashed rgba(var(--v-theme-success), 0.4);
}

.signature-eyebrow {
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgb(var(--v-theme-success));
  margin-bottom: 6px;
}

.signature-text {
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
}
</style>
