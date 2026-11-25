<template>
  <div class="press-explainer">
    <!-- 출처 고지는 글 머리에. 공공누리 제1유형(출처표시) 조건이자, 'AI 가 지어낸 글'로 보이지 않게 하려는 장치 -->
    <p class="press-explainer__origin">
      <v-icon size="16" class="mr-1">mdi-file-document-outline</v-icon>
      {{ press?.sourceName || '국토교통부' }} 보도자료를 정리한 글이에요
      <template v-if="press?.department"> · {{ press.department }}</template>
      <template v-if="press?.publishedAt"> · {{ formatDate(press.publishedAt) }} 배포</template>
    </p>

    <p v-if="explainer.summary" class="press-explainer__summary">{{ explainer.summary }}</p>

    <section v-if="explainer.points?.length" class="press-explainer__block">
      <h3 class="press-explainer__heading">핵심</h3>
      <ul class="press-explainer__points">
        <li v-for="(p, i) in explainer.points" :key="i">{{ p }}</li>
      </ul>
    </section>

    <section v-if="explainer.where || regions.length" class="press-explainer__block">
      <h3 class="press-explainer__heading">대상 지역</h3>
      <p v-if="explainer.where" class="press-explainer__text">{{ explainer.where }}</p>
      <div v-if="regions.length" class="press-explainer__regions">
        <!-- 지도 링크는 행정구역 사전의 대표점(대략 위치)을 쓴다. LLM 이 낸 지명 텍스트로 좌표를 만들지 않는다 -->
        <v-btn
          v-for="r in regions"
          :key="r.code"
          :to="mapLink(r)"
          size="small"
          variant="tonal"
          color="info"
          prepend-icon="mdi-map-marker-radius-outline"
        >
          맵샷 지도에서 {{ r.label }} 보기
        </v-btn>
      </div>
    </section>

    <section v-if="explainer.schedule?.length" class="press-explainer__block">
      <h3 class="press-explainer__heading">일정</h3>
      <ul class="press-explainer__schedule">
        <li v-for="(s, i) in explainer.schedule" :key="i">
          <span class="press-explainer__when">{{ s.when }}</span>
          <span>{{ s.what }}</span>
        </li>
      </ul>
    </section>

    <section v-if="explainer.forPractitioners" class="press-explainer__block press-explainer__practice">
      <h3 class="press-explainer__heading">실무자가 볼 점</h3>
      <p class="press-explainer__text">{{ explainer.forPractitioners }}</p>
    </section>

    <p v-if="!explainer.generated" class="press-explainer__fallback">
      국토교통부가 보도자료에 붙인 요약을 그대로 옮겼어요. 자세한 내용은 원문에서 확인해 주세요.
    </p>

    <div class="press-explainer__footer">
      <v-btn
        v-if="press?.url"
        :href="press.url"
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        color="success"
        size="small"
        prepend-icon="mdi-open-in-new"
      >
        {{ press.sourceName || '국토교통부' }} 원문 보기
      </v-btn>
      <p class="press-explainer__license">
        이 글은 국토교통부 보도자료(공공누리 제1유형: 출처표시)를 바탕으로 정리했어요. 정확한 내용은 원문을 기준으로 해 주세요.
      </p>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'PressExplainer',

  props: {
    explainer: { type: Object, required: true },
    press: { type: Object, default: null },
  },

  computed: {
    regions () {
      return this.press?.regions ?? []
    },
  },

  methods: {
    formatDate (value) {
      return dayjs(value).format('YYYY.MM.DD')
    },
    /** 지도 화면을 도시소식이 켜진 상태로 열고 그 지역을 고른다(MapView 가 쿼리를 읽는다) */
    mapLink (r) {
      return { path: '/', query: { press: r.code, lat: r.lat, lng: r.lng } }
    },
  },
}
</script>

<style scoped>
.press-explainer {
  color: #1f2a33;
  line-height: 1.7;
}

.press-explainer__origin {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 0 16px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f3f6f8;
  color: #4a5560;
  font-size: 0.85rem;
}

.press-explainer__summary {
  margin: 0 0 20px;
  font-size: 1.1rem;
  font-weight: 700;
}

.press-explainer__block {
  margin-bottom: 20px;
}

.press-explainer__heading {
  margin: 0 0 6px;
  color: #2e7d32;
  font-size: 0.9rem;
  font-weight: 700;
}

.press-explainer__points,
.press-explainer__schedule {
  margin: 0;
  padding-left: 20px;
  font-size: 1rem;
}

.press-explainer__points li,
.press-explainer__schedule li {
  margin-bottom: 4px;
}

.press-explainer__when {
  margin-right: 8px;
  font-weight: 700;
}

.press-explainer__text {
  margin: 0;
  font-size: 1rem;
}

.press-explainer__regions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.press-explainer__practice {
  padding: 12px 14px;
  border-left: 3px solid #2e7d32;
  background: #f4faf4;
}

.press-explainer__fallback {
  margin: 0 0 16px;
  color: #6b7680;
  font-size: 0.85rem;
}

.press-explainer__footer {
  padding-top: 16px;
  border-top: 1px solid #e3e7ea;
}

.press-explainer__license {
  margin: 10px 0 0;
  color: #6b7680;
  font-size: 0.8rem;
}
</style>
