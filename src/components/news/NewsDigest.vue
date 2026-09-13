<template>
  <article class="news-digest">

    <!-- ① 들어가며 (리드) -->
    <p v-if="digest.intro" class="digest-lede">{{ digest.intro }}</p>

    <!--
      ② 본문. 신문 1면처럼 첫 꼭지는 '톱기사'(큰 이미지 + 큰 제목)로 세우고,
      나머지는 카테고리 묶음 안에서 썸네일 + 제목 + 본문 행으로 흐른다.
      blocks 가 [톱기사, 묶음제목, 기사, 기사, 묶음제목, ...] 순서의 평면 배열이라
      기사 마크업을 한 번만 쓴다(톱기사/일반 차이는 클래스와 v-if 로만).
    -->
    <template v-for="b in blocks" :key="b.key">
      <h2 v-if="b.type === 'group'" class="group-title">{{ b.category }}</h2>

      <article
        v-else
        class="story"
        :class="{ 'story-lead': b.lead, 'has-thumb': !b.lead && imageOk(b.story) }"
      >
        <!-- 톱기사 이미지: 지면 상단의 시각 앵커. 클릭하면 첫 출처 기사로 -->
        <a
          v-if="b.lead && imageOk(b.story)"
          class="lead-figure"
          v-bind="sourceLinkAttrs(firstSource(b.story))"
        >
          <img
            :src="b.story.image"
            :alt="b.story.title"
            decoding="async"
            referrerpolicy="no-referrer"
            @error="markBroken(b.story.image)"
          >
        </a>

        <!-- 톱기사엔 카테고리 라벨을 달지 않는다: 바로 아래 첫 묶음 제목과 같은 글자가 겹쳐 보인다 -->
        <component :is="b.lead ? 'h2' : 'h3'" class="story-title">
          {{ b.story.title }}
        </component>

        <!-- 일반 기사 썸네일: 데스크톱은 오른쪽 4:3, 모바일은 제목 옆 정사각 -->
        <a
          v-if="!b.lead && imageOk(b.story)"
          class="story-thumb"
          v-bind="sourceLinkAttrs(firstSource(b.story))"
        >
          <img
            :src="b.story.image"
            :alt="b.story.title"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
            @error="markBroken(b.story.image)"
          >
        </a>

        <div class="story-rest">
          <p class="story-body">{{ b.story.body }}</p>

          <p v-if="b.story.nextStep" class="story-next">
            <span class="story-next-label">다음 일정</span>{{ b.story.nextStep }}
          </p>

          <!--
            지역만 남기고 entities/keywords/whyMatters 는 렌더하지 않는다.
            - keywords, entities: 본문에 이미 있는 단어를 칩으로 반복할 뿐이다.
            - whyMatters: "~이 중요해지고 있습니다" 류 상투구가 매 꼭지마다 붙어
              글 전체를 AI 생성물처럼 보이게 만든다. 데이터는 그대로 오므로
              나중에 필요하면 v-if 한 줄로 되살릴 수 있다.
            지역은 맵샷 독자(도시계획)에게 실질 정보라 한 줄 메타로 남긴다.
          -->
          <p v-if="(b.story.regions || []).length" class="story-regions">
            <v-icon icon="mdi-map-marker-outline" size="14" class="mr-1"/>
            {{ b.story.regions.join(', ') }}
          </p>

          <ul v-if="(b.story.sources || []).length" class="story-sources">
            <li v-for="(src, si) in b.story.sources" :key="si">
              <a class="source-link" v-bind="sourceLinkAttrs(src)" :title="src.title">
                <img
                  v-if="faviconOk(src.url)"
                  :src="faviconFor(src.url)"
                  alt=""
                  width="16"
                  height="16"
                  loading="lazy"
                  class="source-favicon"
                  @error="markBroken(faviconFor(src.url))"
                >
                <span class="source-title">{{ src.title }}</span>
              </a>
            </li>
          </ul>
        </div>
      </article>
    </template>

    <!-- ③ 이런 뜻이에요: 용어 2~3개라 아코디언보다 펼쳐진 정의 목록이 읽기 편하다 -->
    <section v-if="glossary.length" class="digest-glossary">
      <h2 class="group-title">이런 뜻이에요</h2>
      <dl class="glossary-list">
        <template v-for="(g, i) in glossary" :key="i">
          <dt>{{ g.term }}</dt>
          <dd>{{ g.explanation }}</dd>
        </template>
      </dl>
    </section>

    <!-- ④ 마치며: 본문과 같은 서체로 닫는다. 박스·로봇 아이콘 없음 -->
    <section v-if="digest.outro" class="digest-outro">
      <h2 class="group-title">마치며</h2>
      <p class="story-body">{{ digest.outro }}</p>
    </section>

    <!-- ⑤ 출처 전체 (접힘) -->
    <section v-if="sources.length" class="digest-sources">
      <v-expansion-panels variant="accordion" flat>
        <v-expansion-panel :title="`출처 ${sources.length}건 보기`" class="sources-panel">
          <template v-slot:text>
            <ul class="story-sources">
              <li v-for="(src, i) in sources" :key="i">
                <a class="source-link" v-bind="sourceLinkAttrs(src)" :title="src.title">
                  <img
                    v-if="faviconOk(src.url)"
                    :src="faviconFor(src.url)"
                    alt=""
                    width="16"
                    height="16"
                    loading="lazy"
                    class="source-favicon"
                    @error="markBroken(faviconFor(src.url))"
                  >
                  <span class="source-title">{{ src.title }}</span>
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
export default {
  name: 'NewsDigest',

  props: {
    digest: { type: Object, required: true },
    sources: { type: Array, default: () => [] },
  },

  data () {
    return {
      // 로드에 실패한 이미지 URL. 기사 썸네일은 원본 언론사 CDN 핫링크라 언제든 깨질 수 있고,
      // 깨진 이미지 아이콘을 보여주느니 칸을 통째로 접는 편이 낫다.
      brokenImages: {},
    }
  },

  computed: {
    sections () {
      return this.digest.sections || []
    },
    glossary () {
      return this.digest.glossary || []
    },
    // 렌더 순서의 평면 배열. 첫 섹션은 톱기사로 빼고, 나머지는 카테고리 첫 등장 순으로 묶는다.
    // LLM 이 같은 카테고리를 떨어뜨려 놓아도(기술 3건 뒤 다른 카테고리, 맨 끝에 기술 1건) 한 묶음이 된다.
    blocks () {
      const sections = this.sections
      if (!sections.length) return []

      const out = [{ key: 'lead', type: 'story', lead: true, story: sections[0] }]

      const byCategory = {}
      const order = []
      sections.slice(1).forEach((story, i) => {
        const category = story.category || '기타'
        if (!byCategory[category]) {
          byCategory[category] = []
          order.push(category)
        }
        byCategory[category].push({ key: `s-${i + 1}`, type: 'story', lead: false, story })
      })
      order.forEach((category) => {
        out.push({ key: `g-${category}`, type: 'group', category })
        out.push(...byCategory[category])
      })
      return out
    },
  },

  methods: {
    imageOk (story) {
      return !!story.image && !this.brokenImages[story.image]
    },
    markBroken (url) {
      this.brokenImages[url] = true
    },
    firstSource (story) {
      return (story.sources || [])[0] || null
    },
    // 출처가 없으면 링크 속성을 비워 <a> 가 그냥 래퍼로만 남게 한다.
    sourceLinkAttrs (src) {
      if (!src || !src.url) return {}
      return { href: src.url, target: '_blank', rel: 'noopener noreferrer' }
    },
    // 언론사 파비콘. 구글 s2 서비스는 키 없이 <img> 로 바로 쓸 수 있고 없는 도메인은 기본 아이콘을 준다.
    faviconFor (url) {
      try {
        return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`
      } catch (e) {
        return ''
      }
    },
    faviconOk (url) {
      const favicon = this.faviconFor(url)
      return !!favicon && !this.brokenImages[favicon]
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
 * 서체는 상위 .news-reader(뷰)에서 지정한다.
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
  margin: 0 0 28px;
}

/* ② 묶음 제목: 신문 지면의 섹션명처럼 작은 라벨 + 가로선 */
.group-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: rgb(var(--v-theme-success));
  margin: 40px 0 18px;
}

.group-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(var(--v-theme-on-surface), 0.12);
}

/* 기사 공통 */
.story + .story {
  margin-top: 32px;
}

.story-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: -0.005em;
  text-wrap: balance;
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

/* 톱기사 */
.story-lead .story-title {
  font-size: 1.5rem;
  line-height: 1.35;
  letter-spacing: -0.015em;
  margin-bottom: 10px;
}

.lead-figure {
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(var(--v-theme-on-surface), 0.06);
  margin: 0 0 16px;
}

/* 일반 기사 + 썸네일: 제목·본문 영역과 그림 영역을 그리드로 배치 */
.story.has-thumb {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 88px;
  grid-template-areas:
    'title thumb'
    'rest  rest';
  column-gap: 14px;
  row-gap: 4px;
  align-items: start;
}

.story.has-thumb .story-title { grid-area: title; margin-bottom: 4px; }
.story.has-thumb .story-thumb { grid-area: thumb; }
.story.has-thumb .story-rest  { grid-area: rest; min-width: 0; }

.story-thumb {
  display: block;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(var(--v-theme-on-surface), 0.06);
}

@media (min-width: 600px) {
  .story.has-thumb {
    grid-template-columns: minmax(0, 1fr) 168px;
    grid-template-areas:
      'title thumb'
      'rest  thumb';
    column-gap: 22px;
  }

  .story-thumb {
    aspect-ratio: 4 / 3;
  }
}

.lead-figure img,
.story-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 그림이 링크임을 알리는 최소한의 피드백 */
a.lead-figure:hover img,
a.story-thumb:hover img {
  transform: scale(1.03);
}

@media (prefers-reduced-motion: reduce) {
  .lead-figure img,
  .story-thumb img {
    transition: none;
  }

  a.lead-figure:hover img,
  a.story-thumb:hover img {
    transform: none;
  }
}

/* 출처 링크 */
.story-sources {
  list-style: none;
  margin: 0;
  padding: 0;
}

.story-sources li {
  margin: 3px 0;
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
  transition: color 0.15s ease-out;
}

.source-favicon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: 8px;
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

/* ③ 용어 */
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

/* ⑤ 출처 전체 */
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
