<template>
  <section class="parcel-workspace" :class="{ collapsed: mobile && !expanded }" aria-label="선택한 필지">
    <div v-if="mobile" class="sheet-handle" aria-hidden="true"/>
    <header class="workspace-header">
      <div class="header-copy">
        <span class="eyebrow">선택한 필지</span>
        <h2>{{ parcelStore.parcel?.address || '지도의 필지를 선택해 주세요' }}</h2>
        <p v-if="parcelStore.parcel" class="parcel-id">PNU {{ parcelStore.parcel.pnu }}</p>
      </div>
      <v-btn v-if="mobile" :icon="expanded ? 'mdi-chevron-down' : 'mdi-chevron-up'"
             :aria-label="expanded ? '필지 패널 접기' : '필지 패널 펼치기'"
             variant="text" size="small" @click="expanded = !expanded"/>
      <v-btn v-if="parcelStore.parcel" icon="mdi-close" aria-label="필지 선택 해제"
             variant="text" size="small" @click="parcelStore.clear()"/>
    </header>

    <div v-if="parcelStore.parcel" class="quick-facts">
      <div v-if="parcelStore.parcel.landInfo?.category">
        <span>지목</span><strong>{{ parcelStore.parcel.landInfo.category }}</strong>
      </div>
      <div v-if="parcelStore.parcel.landInfo?.area">
        <span>면적</span><strong>{{ formatArea(parcelStore.parcel.landInfo.area) }}</strong>
      </div>
    </div>

    <template v-if="!mobile || expanded">
      <div v-if="parcelStore.isLoading" class="workspace-state" role="status">
        <v-progress-circular indeterminate size="22" width="2" color="info"/>
        필지 정보를 조회하고 있어요.
      </div>
      <div v-else-if="parcelStore.errorMessage" class="workspace-state workspace-state--error" role="alert">
        {{ parcelStore.errorMessage }}
      </div>
      <div v-else-if="!parcelStore.parcel" class="workspace-state">
        <v-icon size="28" color="info">mdi-map-marker-question-outline</v-icon>
        <strong>지도를 클릭해 필지를 선택해 주세요</strong>
        <span>필지 정보와 빠른 질문이 여기에 표시됩니다.</span>
      </div>
      <template v-else>
        <div class="workspace-tabs" role="tablist" aria-label="필지 화면">
          <button type="button" role="tab" :aria-selected="activeTab === 'info'"
                  :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">필지 정보
          </button>
          <button type="button" role="tab" :aria-selected="activeTab === 'question'"
                  :class="{ active: activeTab === 'question' }" @click="activeTab = 'question'">빠른 질문</button>
        </div>
        <div v-if="activeTab === 'info'" class="workspace-body" role="tabpanel">
          <div v-for="row in rows" :key="row.label" class="info-row">
            <span>{{ row.label }}</span><strong>{{ row.value }}</strong>
          </div>
          <div v-if="landUses.length" class="land-uses">
            <div class="land-uses-heading"><p>용도지역·지구</p><span>{{ landUses.length }}개</span></div>
            <ul class="land-use-list">
              <li v-for="use in visibleLandUses" :key="`${use.name}-${use.conflictType}`">
                <span class="land-use-name">{{ use.name }}</span>
                <span class="land-use-relation" :class="`relation-${use.conflictType}`">
                  {{ relation(use.conflictType) || '관계 미확인' }}
                </span>
              </li>
            </ul>
            <button v-if="landUses.length > 6" type="button" class="land-use-toggle"
                    :aria-expanded="showAllLandUses" @click="showAllLandUses = !showAllLandUses">
              {{ showAllLandUses ? '접기' : `나머지 ${landUses.length - 6}개 보기` }}
            </button>
          </div>
          <p class="source-note">
            출처: 국토교통부 · 브이월드
            <a
              :href="`https://www.eum.go.kr/web/ar/lu/luLandDet.jsp?mode=search&pnu=${encodeURIComponent(parcelStore.parcel.pnu)}`"
              target="_blank" rel="noopener noreferrer">토지이음에서 확인 ↗</a>
          </p>
          <button type="button" class="briefing-entry" @click="activeTab = 'question'">
            <span>이 필지 빠르게 살펴보기</span>
            <small>핵심 요약과 자주 묻는 질문 <v-icon size="14">mdi-arrow-right</v-icon></small>
          </button>
        </div>
        <div v-else class="question-layout" role="tabpanel">
          <div ref="conversationBody" class="workspace-body" aria-live="polite">
            <div class="briefing-card">
              <strong>이 필지 핵심 정보</strong>
              <p v-for="(line, index) in briefingLines" :key="index">{{ line }}</p>
              <small>출처: 국토교통부 · 브이월드. 인허가 가능 여부는 별도 확인이 필요합니다.
                <a :href="`https://www.eum.go.kr/web/ar/lu/luLandDet.jsp?mode=search&pnu=${encodeURIComponent(parcelStore.parcel.pnu)}`"
                   target="_blank" rel="noopener noreferrer">토지이음에서 확인 ↗</a>
              </small>
            </div>
            <div class="quick-questions">
              <p class="question-intro">더 확인하고 싶은 내용을 선택해 보세요.</p>
              <div class="suggestions">
                <button v-for="prompt in suggestions" :key="prompt" type="button"
                        :disabled="parcelStore.isAsking" @click="askSuggested(prompt)">{{ prompt }}
                </button>
              </div>
            </div>
            <div v-if="newsRegion" class="regional-news">
              <strong>{{ newsRegion }} 관련 소식</strong>
              <p>지명으로 검색한 기사입니다. 이 필지와 직접 관련된 소식인지는 원문에서 확인해 주세요.</p>
              <a :href="newsSearchUrl" target="_blank" rel="noopener noreferrer">
                네이버 뉴스에서 검색하기 <v-icon size="14">mdi-open-in-new</v-icon>
              </a>
            </div>
            <div v-for="message in parcelStore.messages" :key="message.id" class="conversation-turn">
              <p class="user-question">{{ message.question }}</p>
              <p v-if="!message.answer && !message.error" class="answer-status">자료를 확인하고 있어요…</p>
              <p v-if="message.error" class="answer-error" role="alert">{{ message.error }}</p>
              <div v-if="message.answer" class="answer-card">
                <span class="answer-label">{{ answerLabel(message.answer.status) }}</span>
                <p>{{ message.answer.answer }}</p>
                <details v-if="message.answer.evidence?.length">
                  <summary>조회 근거 {{ message.answer.evidence.length }}개</summary>
                  <ul>
                    <li v-for="(item, index) in message.answer.evidence" :key="index">
                      {{ item.label }}: {{ item.value }} <small>· {{ item.source }}</small>
                    </li>
                  </ul>
                </details>
                <p v-if="message.answer.missingChecks?.length" class="missing-checks">
                  추가 확인: {{ message.answer.missingChecks.join(', ') }}
                </p>
              </div>
            </div>
          </div>
          <form class="question-composer" @submit.prevent="parcelStore.ask(parcelStore.question)">
            <label class="sr-only" for="parcel-question">이 필지에 질문하기</label>
            <input id="parcel-question" v-model="parcelStore.question" maxlength="300"
                   :disabled="parcelStore.isAsking" placeholder="예: 면적과 용도지역은?"/>
            <button type="submit" aria-label="질문 보내기"
                    :disabled="!parcelStore.question.trim() || parcelStore.isAsking">
              <v-icon size="18">mdi-arrow-up</v-icon>
            </button>
          </form>
        </div>
      </template>
    </template>
  </section>
</template>

<script>
import { useParcelStore } from '@/store/parcel'

function pushIfPresent (rows, label, value) {
  if (value !== null && value !== undefined && String(value).trim() !== '') {
    rows.push({
      label,
      value
    })
  }
}

function formatArea (area) {
  const value = Number(area)
  return Number.isNaN(value) ? `${area}㎡` : `${value.toLocaleString()}㎡`
}

function formatPrice (price) {
  if (!price?.pricePerSquareMeter) return ''
  const value = Number(price.pricePerSquareMeter)
  const formatted = Number.isNaN(value) ? price.pricePerSquareMeter : value.toLocaleString()
  const year = Number(price.standardYear)
  const ageNote = Number.isFinite(year) && year > 0 && year < new Date().getFullYear() - 2 ? ' · 과거 자료' : ''
  return `${formatted}원/㎡${price.standardYear ? ` · ${price.standardYear}년 기준${ageNote}` : ''}`
}

export default {
  name: 'ParcelInfoCard',
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    return { parcelStore: useParcelStore() }
  },
  data () {
    return {
      activeTab: 'info',
      expanded: !this.mobile,
      showAllLandUses: false,
      suggestions: ['현재 등록된 건물은?', '카페 할 수 있어?', '최근 토지 거래 사례는?']
    }
  },
  computed: {
    selectedPnu () {
      return this.parcelStore.parcel?.pnu
    },
    landUses () {
      const seen = new Set()
      const order = {
        1: 0,
        2: 1,
        3: 2
      }
      return (this.parcelStore.parcel?.landUses || [])
        .filter(use => {
          if (!use?.name?.trim()) return false
          const key = `${use.name.trim()}|${use.conflictType || ''}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        .sort((a, b) => (order[a.conflictType] ?? 3) - (order[b.conflictType] ?? 3) || a.name.localeCompare(b.name, 'ko'))
    },
    visibleLandUses () {
      return this.showAllLandUses ? this.landUses : this.landUses.slice(0, 6)
    },
    briefingLines () {
      const parcel = this.parcelStore.parcel
      if (!parcel) return []
      const lines = []
      const category = parcel.landInfo?.category
      const area = parcel.landInfo?.area
      if (category || area) {
        if (category) lines.push(`지목은 ${category}입니다.`)
        if (area) lines.push(`면적은 ${formatArea(area)}입니다.`)
      }
      const included = this.landUses.filter(use => use.conflictType === '1').map(use => use.name)
      if (included.length) {
        lines.push(`포함된 용도지역·지구: ${included.slice(0, 2).join(', ')}${included.length > 2 ? ` 외 ${included.length - 2}개` : ''}.`)
      }
      if (parcel.landPrice?.pricePerSquareMeter) {
        lines.push(`개별공시지가: ${formatPrice(parcel.landPrice)}. 시세와는 다릅니다.`)
      }
      return lines.length ? lines : ['조회된 핵심 정보가 없습니다. 필지 정보의 항목별 결과를 확인해 주세요.']
    },
    newsRegion () {
      const parts = this.parcelStore.parcel?.address?.trim().split(/\s+/) || []
      if (parts.length < 2) return ''
      const count = parts[1].endsWith('시') && parts[2]?.endsWith('구') ? 3 : 2
      return parts.slice(0, count).join(' ')
    },
    newsSearchUrl () {
      return `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(`${this.newsRegion} 도시계획`)}`
    },
    rows () {
      const parcel = this.parcelStore.parcel
      if (!parcel) return []
      const rows = []
      pushIfPresent(rows, '지목', parcel.landInfo?.category)
      pushIfPresent(rows, '면적', parcel.landInfo?.area && formatArea(parcel.landInfo.area))
      pushIfPresent(rows, '대장구분', parcel.landInfo?.registerType)
      pushIfPresent(rows, '개별공시지가', formatPrice(parcel.landPrice))
      pushIfPresent(rows, '토지이용상황', parcel.landCharacteristic?.landUseStatus)
      pushIfPresent(rows, '지형', parcel.landCharacteristic?.terrainHeight)
      pushIfPresent(rows, '형상', parcel.landCharacteristic?.terrainShape)
      pushIfPresent(rows, '도로접면', parcel.landCharacteristic?.roadSide)
      pushIfPresent(rows, '토지특성 기준연도', parcel.landCharacteristic?.standardYear && `${parcel.landCharacteristic.standardYear}년`)
      return rows
    },
  },
  watch: {
    'parcelStore.selectedPoint' () {
      this.activeTab = 'info'
    },
    selectedPnu () {
      this.activeTab = 'info'
      this.showAllLandUses = false
      if (this.mobile && this.parcelStore.parcel) this.expanded = true
    },
    'parcelStore.messages': {
      deep: true,
      handler () {
        this.$nextTick(() => {
          const body = this.$refs.conversationBody
          if (body) body.scrollTop = body.scrollHeight
        })
      }
    }
  },
  methods: {
    formatArea,
    relation (type) {
      return ({
        1: '포함',
        2: '저촉',
        3: '접함'
      })[type] || ''
    },
    answerLabel (status) {
      return ({
        answered: '조회 결과',
        needs_check: '추가 확인 필요',
        no_data: '조회 결과 없음',
        unsupported: '지원하지 않는 질문'
      })[status] || '답변'
    },
    askSuggested (prompt) {
      this.parcelStore.question = prompt
      this.parcelStore.ask(prompt)
    },
  },
}
</script>

<style scoped>
.parcel-workspace {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  background: #fff;
  color: #263238;
  font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
  font-size: 12px;
}

.parcel-workspace button, .parcel-workspace input, .parcel-workspace .v-btn {
  font-family: inherit;
}

.workspace-header {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 12px 14px 9px;
}

.header-copy {
  flex: 1;
  min-width: 0;
}

.eyebrow {
  display: block;
  margin-bottom: 5px;
  color: #087e92;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .04em;
}

.workspace-header h2 {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 800;
  word-break: keep-all;
}

.parcel-id {
  margin: 5px 0 0;
  color: #7a8790;
  font-size: 11px;
}

.quick-facts {
  display: flex;
  gap: 8px;
  padding: 0 14px 9px;
}

.quick-facts > div {
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f2f7f8;
}

.quick-facts span {
  display: block;
  color: #6d7d85;
  font-size: 11px;
}

.quick-facts strong {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.workspace-state {
  display: flex;
  flex: 1;
  min-height: 130px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
  color: #718089;
  font-size: 12px;
}

.workspace-state strong {
  color: #33434a;
  font-size: 13px;
}

.workspace-state--error, .answer-error {
  color: #b83b3b;
}

.workspace-tabs {
  display: flex;
  border-bottom: 1px solid #e4eaed;
  padding: 0 14px;
}

.workspace-tabs button {
  flex: 1;
  padding: 9px 4px;
  color: #74828b;
  font-size: 12px;
  font-weight: 700;
  border-bottom: 2px solid transparent;
}

.workspace-tabs button.active {
  color: #087e92;
  border-color: #087e92;
}

.workspace-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 11px 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #eef1f2;
  font-size: 12px;
  line-height: 1.5;
}

.info-row span, .info-row strong {
  font-size: 12px !important;
}

.info-row span {
  color: #6e7c84;
}

.info-row strong {
  text-align: right;
  font-weight: 700;
}

.land-uses {
  padding-top: 14px;
}

.land-uses-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.land-uses-heading p {
  margin: 0;
  color: #52636b;
  font-size: 12px !important;
  font-weight: 700;
}

.land-uses-heading span {
  color: #87949a;
  font-size: 11px;
}

.land-use-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid #eef1f2;
}

.land-use-list li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px solid #eef1f2;
  font-size: 12px !important;
  line-height: 1.5;
}

.land-use-name {
  flex: 1;
  min-width: 0;
  color: #33434a;
  overflow-wrap: anywhere;
  font-size: 12px !important;
}

.land-use-relation {
  flex: none;
  padding: 1px 5px;
  border-radius: 4px;
  background: #eef4f5;
  color: #516a70;
  font-size: 12px !important;
  line-height: 1.5;
}

.land-use-relation.relation-1 {
  background: #eaf5f5;
  color: #087e92;
}

.land-use-toggle {
  width: 100%;
  margin-top: 6px;
  padding: 6px 0;
  color: #087e92;
  text-align: center;
  font-size: 12px !important;
  font-weight: 700;
}

.source-note {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px 12px;
  margin: 16px 0 0;
  color: #87949a;
  font-size: 11px;
}

.source-note a {
  color: #087e92;
  font-size: 11px;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.briefing-entry {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 3px;
  margin-top: 14px;
  padding: 10px 12px;
  border: 1px solid #cfe3e7;
  border-radius: 10px;
  background: #f4fafb;
  color: #17444d;
  text-align: left;
}

.briefing-entry span, .briefing-card strong, .regional-news strong {
  font-size: 12px;
  font-weight: 800;
}

.briefing-entry small {
  color: #58717a;
  font-size: 11px;
}

.briefing-card, .regional-news {
  padding: 11px 12px;
  border: 1px solid #dcebee;
  border-radius: 10px;
  background: #f7fbfc;
  font-size: 12px;
  line-height: 1.55;
}

.briefing-card p, .regional-news p {
  margin: 5px 0 0;
  font-size: 12px !important;
  line-height: 1.55;
}

.briefing-card small {
  display: block;
  margin-top: 8px;
  color: #718089;
  font-size: 11px;
  line-height: 1.5;
}

.briefing-card small a {
  color: #087e92;
  font-size: 11px;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.quick-questions {
  margin: 14px 0;
}

.regional-news {
  margin-bottom: 16px;
  background: #fff;
}

.regional-news p {
  color: #657780;
}

.regional-news a {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 8px;
  color: #087e92;
  font-size: 12px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.question-layout {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.question-intro {
  color: #52636b;
  font-size: 12px;
  line-height: 1.5;
}

.conversation-turn {
  margin: 0 0 14px;
}

.user-question {
  width: fit-content;
  max-width: 90%;
  margin: 0 0 8px auto;
  padding: 8px 11px;
  border-radius: 12px 12px 3px 12px;
  background: #e6f4f5;
  color: #17444d;
  font-size: 12px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
}

.suggestions button {
  padding: 8px 10px;
  border: 1px solid #d7e6e9;
  border-radius: 18px;
  background: #f6fafb;
  color: #087e92;
  font-size: 12px;
}

.suggestions button:disabled {
  opacity: .5;
}

.answer-status {
  color: #657780;
  font-size: 12px;
}

.answer-card {
  padding: 11px 12px;
  border: 1px solid #dcebee;
  border-radius: 12px;
  background: #f7fbfc;
  font-size: 12px;
  line-height: 1.55;
  white-space: pre-line;
}

.answer-label {
  display: block;
  margin-bottom: 7px;
  color: #087e92;
  font-size: 11px;
  font-weight: 800;
}

.answer-card p {
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 12px !important;
  line-height: 1.55 !important;
}

.answer-card summary, .answer-card li {
  font-size: 12px !important;
  line-height: 1.5;
}

.answer-card details {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #e1e9eb;
}

.answer-card summary {
  cursor: pointer;
  color: #52656d;
}

.answer-card ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.answer-card li {
  margin: 4px 0;
}

.answer-card small {
  color: #829097;
}

.answer-card .missing-checks {
  margin-top: 10px;
  color: #9a662b;
}

.question-composer {
  display: flex;
  gap: 7px;
  margin: 8px 12px 12px;
  padding: 5px 5px 5px 12px;
  border: 1px solid #cddfe3;
  border-radius: 12px;
}

.question-composer:focus-within {
  border-color: #087e92;
}

.question-composer input {
  flex: 1;
  min-width: 0;
  outline: 0;
  font-size: 12px;
}

.question-composer button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #087e92;
  color: #fff;
}

.question-composer button:disabled {
  background: #c6d2d5;
}

.sheet-handle {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: #d2dbde;
  align-self: center;
  margin-top: 7px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 959px) {
  .parcel-workspace {
    height: 100%;
    border-radius: 16px;
    box-shadow: 0 5px 24px rgba(15, 37, 43, .22);
    overflow: hidden;
    pointer-events: auto;
  }

  .parcel-workspace.collapsed {
    height: auto;
  }

  .parcel-workspace.collapsed .quick-facts {
    padding-bottom: 14px;
  }
}
</style>
