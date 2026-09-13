<template>
  <article class="news-digest">

    <!-- ① 들어가며 (리드) -->
    <p v-if="digest.intro" class="digest-lede">{{ digest.intro }}</p>

    <!-- ② 한눈에 보기: 카테고리별 헤드라인 목차. 소식이 적으면(3건 이하) 생략 -->
    <nav v-if="showToc" class="digest-toc" aria-label="오늘의 소식 목차">
      <div class="toc-heading">오늘의 소식 {{ sections.length }}건</div>
      <div v-for="g in groups" :key="g.category" class="toc-group">
        <span class="toc-category">{{ g.category }}</span>
        <ul class="toc-list">
          <li v-for="s in g.items" :key="s.index">
            <!--
              href 는 접근성/복사용으로만 두고 실제 이동은 JS 로 한다.
              해시 이동을 브라우저에 맡기면 popstate → router.beforeEach 가 돌면서
              전역 로딩 오버레이가 깜빡인다(router/index.js 참고).
            -->
            <a
              :href="`#${anchorId(s.index)}`"
              class="toc-link"
              @click.prevent="jumpTo(s.index)"
            >{{ s.title }}</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- ③ 본문: 카테고리별 묶음. 카드·칩 없이 신문 지면처럼 흐르게 -->
    <section v-for="g in groups" :key="g.category" class="digest-group">
      <h2 class="group-title">{{ g.category }}</h2>

      <article
        v-for="s in g.items"
        :key="s.index"
        :id="anchorId(s.index)"
        class="story"
      >
        <h3 class="story-title">{{ s.title }}</h3>
        <p class="story-body">{{ s.body }}</p>

        <p v-if="s.nextStep" class="story-next">
          <span class="story-next-label">다음 일정</span>{{ s.nextStep }}
        </p>

        <!--
          지역만 남기고 entities/keywords/whyMatters 는 렌더하지 않는다.
          - keywords, entities: 본문에 이미 있는 단어를 칩으로 반복할 뿐이다.
          - whyMatters: "~이 중요해지고 있습니다" 류 상투구가 매 꼭지마다 붙어
            글 전체를 AI 생성물처럼 보이게 만든다. 데이터는 그대로 오므로
            나중에 필요하면 v-if 한 줄로 되살릴 수 있다.
          지역은 맵샷 독자(도시계획)에게 실질 정보라 한 줄 메타로 남긴다.
        -->
        <p v-if="regionsOf(s).length" class="story-regions">
          <v-icon icon="mdi-map-marker-outline" size="14" class="mr-1"/>
          {{ regionsOf(s).join(', ') }}
        </p>

        <ul v-if="(s.sources || []).length" class="story-sources">
          <li v-for="(src, si) in s.sources" :key="si">
            <a
              :href="src.url"
              target="_blank"
              rel="noopener noreferrer"
              :title="src.title"
              class="source-link"
            >
              <span class="source-title">{{ src.title }}</span>
              <v-icon icon="mdi-open-in-new" size="12" class="ml-1 flex-shrink-0"/>
            </a>
          </li>
        </ul>
      </article>
    </section>

    <!-- ④ 이런 뜻이에요: 용어 2~3개라 아코디언보다 펼쳐진 정의 목록이 읽기 편하다 -->
    <section v-if="glossary.length" class="digest-glossary">
      <h2 class="group-title">이런 뜻이에요</h2>
      <dl class="glossary-list">
        <template v-for="(g, i) in glossary" :key="i">
          <dt>{{ g.term }}</dt>
          <dd>{{ g.explanation }}</dd>
        </template>
      </dl>
    </section>

    <!-- ⑤ 마치며: 본문과 같은 서체로 닫는다. 박스·로봇 아이콘 없음 -->
    <section v-if="digest.outro" class="digest-outro">
      <h2 class="group-title">마치며</h2>
      <p class="story-body">{{ digest.outro }}</p>
    </section>

    <!-- ⑥ 함께 보면 좋아요 -->
    <section v-if="relatedPosts.length" class="digest-related">
      <h2 class="group-title">함께 보면 좋아요</h2>
      <router-link
        v-for="p in relatedPosts"
        :key="p.id"
        :to="`/news/${p.id}`"
        class="related-row"
      >
        <span class="related-date">{{ formatDate(p.createdDate) }}</span>
        <span class="related-text">
          <span class="related-title">{{ p.title }}</span>
          <span class="related-preview">{{ cleanPreview(p.preview) }}</span>
        </span>
      </router-link>
    </section>

    <!-- ⑦ 출처 전체 (접힘) -->
    <section v-if="sources.length" class="digest-sources">
      <v-expansion-panels variant="accordion" flat>
        <v-expansion-panel :title="`출처 ${sources.length}건 보기`" class="sources-panel">
          <template v-slot:text>
            <ul class="story-sources">
              <li v-for="(src, i) in sources" :key="i">
                <a
                  :href="src.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="src.title"
                  class="source-link"
                >
                  <span class="source-title">{{ src.title }}</span>
                  <v-icon icon="mdi-open-in-new" size="12" class="ml-1 flex-shrink-0"/>
                </a>
              </li>
            </ul>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </section>

  </article>
</template>

<script>
import dayjs from 'dayjs'

// 목차를 보여줄 최소 꼭지 수. 그 아래면 목차가 본문보다 길어 보인다.
const TOC_MIN_SECTIONS = 4

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
    glossary () {
      return this.digest.glossary || []
    },
    showToc () {
      return this.sections.length >= TOC_MIN_SECTIONS
    },
    // 카테고리별 묶음. 순서는 첫 등장 순. LLM 이 같은 카테고리를 떨어뜨려 놓아도
    // (예: 기술 3건 뒤에 다른 카테고리, 맨 끝에 기술 1건) 한 묶음으로 모은다.
    // index 는 원본 순서로, 목차 링크와 본문 anchor 를 잇는 키다.
    groups () {
      const byCategory = {}
      const order = []
      this.sections.forEach((s, index) => {
        const category = s.category || '기타'
        if (!byCategory[category]) {
          byCategory[category] = { category, items: [] }
          order.push(byCategory[category])
        }
        byCategory[category].items.push({ ...s, index })
      })
      return order
    },
  },

  methods: {
    anchorId (index) {
      return `digest-story-${index}`
    },
    jumpTo (index) {
      const el = this.$el.querySelector(`#${this.anchorId(index)}`)
      if (!el) return
      const reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    },
    regionsOf (s) {
      return s.regions || []
    },
    // 서버 preview 는 본문 HTML 의 첫 소제목("들어가며")까지 같이 잘라 보낸다.
    // 목록에서는 그대로 두고, 여기서만 앞머리를 떼어 문장부터 보이게 한다.
    cleanPreview (preview) {
      return (preview || '').replace(/^들어가며\s*/, '')
    },
    formatDate (dateString) {
      if (!dateString) return ''
      return dayjs(dateString).format('YYYY.MM.DD')
    },
  },
}
</script>

<style scoped>
/*
 * 한국어 본문 가독성의 핵심 두 가지:
 * - word-break: keep-all  → 어절 중간에서 줄이 끊기지 않는다.
 * - overflow-wrap: anywhere → 긴 URL/영문이 컨테이너를 밀어내지 않는다.
 * 색은 전부 Vuetify 테마 토큰(on-surface / success)만 써서 다크 테마에서도 유지된다.
 */
.news-digest {
  word-break: keep-all;
  overflow-wrap: anywhere;
  color: rgba(var(--v-theme-on-surface), 0.87);
  padding: 4px 0 8px;
}

/* ① 리드 */
.digest-lede {
  font-size: 1.0625rem;
  line-height: 1.8;
  margin: 0 0 24px;
}

/* ② 목차 */
.digest-toc {
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.035);
  padding: 16px 18px 14px;
  margin: 0 0 8px;
}

.toc-heading {
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.toc-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 12px;
  padding: 6px 0;
}

.toc-group + .toc-group {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

@media (min-width: 600px) {
  .toc-group {
    grid-template-columns: 3.5rem 1fr;
  }
}

.toc-category {
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgb(var(--v-theme-success));
  line-height: 1.9;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-link {
  display: inline-block;
  font-size: 0.9375rem;
  line-height: 1.9;
  color: inherit;
  text-decoration: none;
}

.toc-link:hover {
  color: rgb(var(--v-theme-success));
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ③ 묶음 제목: 신문 지면의 섹션명처럼 작은 라벨 + 가로선 */
.group-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: rgb(var(--v-theme-success));
  margin: 36px 0 16px;
}

.group-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(var(--v-theme-on-surface), 0.12);
}

.story {
  /* 앱바(64px)에 제목이 가려지지 않게 목차 점프 여백 */
  scroll-margin-top: 80px;
}

.story + .story {
  margin-top: 32px;
}

.story-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.45;
  margin: 0 0 8px;
}

.story-body {
  font-size: 1rem;
  line-height: 1.8;
  margin: 0 0 10px;
}

.story-next {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 8px;
}

.story-next-label {
  font-weight: 700;
  color: rgb(var(--v-theme-success));
  margin-right: 8px;
}

.story-regions {
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin: 0 0 6px;
}

.story-sources {
  list-style: none;
  margin: 0;
  padding: 0;
}

.story-sources li {
  margin: 2px 0;
  /* 링크가 inline-flex 라 li 자체가 폭을 갖도록 */
  display: flex;
}

.source-link {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  min-width: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.6);
  text-decoration: none;
}

/*
 * 한 줄 말줄임은 nowrap+ellipsis 대신 line-clamp 로 한다. nowrap 은 긴 기사 제목을
 * 줄바꿈 불가 텍스트로 만들어, flex/grid 조상의 min-content 폭을 밀어 올릴 수 있다
 * (min-width: auto 가 max-width 를 이긴다). line-clamp 는 줄바꿈이 가능해 안전하다.
 */
.source-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.source-link:hover {
  color: rgb(var(--v-theme-success));
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ④ 용어 */
.glossary-list {
  margin: 0;
}

.glossary-list dt {
  font-size: 0.9375rem;
  font-weight: 700;
  margin-top: 12px;
}

.glossary-list dt:first-child {
  margin-top: 0;
}

.glossary-list dd {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin: 2px 0 0;
}

/* ⑥ 관련 브리핑 */
.related-row {
  display: grid;
  grid-template-columns: 5.25rem 1fr;
  gap: 12px;
  padding: 10px 0;
  color: inherit;
  text-decoration: none;
}

.related-row + .related-row {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.related-date {
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
  line-height: 1.6;
  font-variant-numeric: tabular-nums;
}

.related-text {
  min-width: 0;
}

.related-title {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.6;
}

.related-row:hover .related-title {
  color: rgb(var(--v-theme-success));
}

.related-preview {
  /* 같은 이유로 nowrap 대신 line-clamp (.source-title 주석 참고) */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  line-height: 1.5;
}

/* ⑦ 출처 전체 */
.digest-sources {
  margin-top: 28px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.sources-panel :deep(.v-expansion-panel-title) {
  padding-left: 0;
  padding-right: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.sources-panel :deep(.v-expansion-panel-text__wrapper) {
  padding-left: 0;
  padding-right: 0;
}
</style>
