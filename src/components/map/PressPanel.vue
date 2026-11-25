<template>
  <section class="press-panel" :class="{ 'is-mobile': mobile }" aria-label="도시소식">
    <header class="press-panel__header">
      <div class="press-panel__titles">
        <h2 class="press-panel__title">도시소식</h2>
        <p class="press-panel__source">국토교통부 보도자료를 지역별로 모았어요</p>
      </div>
      <v-btn v-if="mobile" icon="mdi-close" size="small" variant="text" aria-label="도시소식 닫기"
             @click="press.toggle()"/>
    </header>

    <div class="press-panel__periods" role="group" aria-label="기간">
      <v-btn
        v-for="d in periods"
        :key="d"
        size="small"
        rounded="lg"
        :color="d === press.days ? 'info' : undefined"
        :variant="d === press.days ? 'flat' : 'tonal'"
        :disabled="press.isLoading"
        @click="press.changeDays(d)"
      >
        최근 {{ d }}일
      </v-btn>
    </div>

    <v-progress-linear v-if="press.isLoading" indeterminate color="info" height="2"/>

    <div class="press-panel__scroll" ref="scroll">
      <div v-if="press.isError" class="press-panel__state">
        <p>소식을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.</p>
        <v-btn size="small" variant="tonal" color="info" @click="press.load()">다시 불러오기</v-btn>
      </div>

      <template v-else-if="press.data">
        <div class="press-panel__context">
          <template v-if="press.selected">
            <p class="press-panel__context-text"><strong>{{ press.selected.label }}</strong> 소식 {{ press.listItems.length }}건</p>
            <button type="button" class="press-panel__context-btn" @click="press.clearSelection()">전체 지역 보기</button>
          </template>
          <p v-else class="press-panel__context-text">
            지도에 보이는 지역 소식 {{ press.listItems.length }}건
          </p>
        </div>

        <div v-if="!press.listItems.length" class="press-panel__state">
          <p v-if="press.totalCount === 0">최근 {{ press.days }}일 동안 지도에 표시할 소식이 없어요.</p>
          <p v-else>지금 보이는 범위에는 소식이 없어요. 지도를 넓혀 보거나 기간을 늘려 보세요.</p>
          <v-btn v-if="press.days < maxPeriod" size="small" variant="tonal" color="info"
                 @click="press.changeDays(maxPeriod)">최근 {{ maxPeriod }}일로 늘리기</v-btn>
        </div>

        <section v-for="group in grouped" :key="group.date" class="press-panel__day">
          <h3 class="press-panel__date">{{ group.label }}</h3>
          <ul class="press-panel__list">
            <PressItem
              v-for="item in group.items"
              :key="item.id"
              :item="item"
              :open="press.expandedId === item.id"
              :is-new="press.isNew(item)"
              @toggle="press.toggleExpanded(item.id)"
              @locate="locate(item)"
            />
          </ul>
        </section>

        <section v-if="press.nationalItems.length" class="press-panel__national">
          <button type="button" class="press-panel__national-head" :aria-expanded="press.showNational"
                  @click="press.showNational = !press.showNational">
            <span>전국 단위 소식 {{ press.nationalItems.length }}건</span>
            <v-icon size="18">{{ press.showNational ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </button>
          <p v-if="!press.showNational" class="press-panel__national-hint">
            특정 지역이 아닌 제도·통계·전국 정책 소식이에요.
          </p>
          <ul v-else class="press-panel__list">
            <PressItem
              v-for="item in press.nationalItems"
              :key="item.id"
              :item="item"
              :open="press.expandedId === item.id"
              :is-new="press.isNew(item)"
              @toggle="press.toggleExpanded(item.id)"
            />
          </ul>
        </section>

        <p class="press-panel__note">
          위치는 시군구 단위의 대략적인 위치예요. 보도자료는 공공누리 제1유형(출처표시)에 따라 국토교통부 원문으로 연결돼요.
        </p>
      </template>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import PressItem from '@/components/map/PressItem'
import { PERIODS, usePressMapStore } from '@/store/pressMap'
import { useMapStore } from '@/store/map'

dayjs.locale('ko')

export default {
  name: 'PressPanel',
  components: { PressItem },
  props: {
    mobile: { type: Boolean, default: false },
  },
  setup () {
    return { press: usePressMapStore(), mapStore: useMapStore() }
  },
  data () {
    return { periods: PERIODS }
  },
  computed: {
    maxPeriod () {
      return PERIODS[PERIODS.length - 1]
    },
    /** 날짜별 묶음. 보도자료는 날짜가 곧 맥락이라(조간 배포 등) 날짜 머리를 둔다 */
    grouped () {
      const groups = []
      for (const item of this.press.listItems) {
        const date = item.publishedAt ? dayjs(item.publishedAt).format('YYYY-MM-DD') : 'unknown'
        let g = groups[groups.length - 1]
        if (!g || g.date !== date) {
          g = { date, label: this.dateLabel(item.publishedAt), items: [] }
          groups.push(g)
        }
        g.items.push(item)
      }
      return groups
    },
  },
  watch: {
    'press.selected' () {
      this.$refs.scroll?.scrollTo({ top: 0 })
    },
  },
  methods: {
    dateLabel (value) {
      if (!value) return '날짜 미상'
      const d = dayjs(value)
      const diff = dayjs().startOf('day').diff(d.startOf('day'), 'day')
      if (diff === 0) return `오늘, ${d.format('M월 D일')}`
      if (diff === 1) return `어제, ${d.format('M월 D일')}`
      return d.format('M월 D일 dddd')
    },
    /** 보도자료의 첫 지역으로 지도를 옮기고 그 지역 마커를 고른다 */
    locate (item) {
      const code = item.regions?.[0]?.code
      const region = this.press.data?.regions?.find(r => r.code === code)
      const map = this.mapStore.map
      if (!region || !map) return
      if (map.getLevel() >= 10) map.setLevel(9)
      map.panTo(new window.kakao.maps.LatLng(region.lat, region.lng))
      const marker = this.press.markers.find(m => m.itemIds.includes(item.id) && m.key === code) ??
        this.press.markers.find(m => m.itemIds.includes(item.id))
      if (marker && this.press.selected?.key !== marker.key) this.press.select(marker)
      this.press.expandedId = item.id
    },
  },
}
</script>

<style scoped>
.press-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1 1 auto;
  background: #fff;
}

.press-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 6px 12px 8px;
}

.press-panel__title {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #1b3a4b;
  letter-spacing: -0.01em;
}

.press-panel__source {
  margin: 2px 0 0;
  font-size: 11px;
  color: #6b7780;
}

.press-panel__periods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 0 12px 10px;
}

.press-panel__periods .v-btn {
  min-width: 0;
  letter-spacing: 0;
  text-transform: none;
}

.press-panel__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  border-top: 1px solid #e7ebee;
}

.press-panel__context {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  background: #f4f7f9;
  border-bottom: 1px solid #e7ebee;
}

.press-panel__context-text {
  margin: 0;
  font-size: 12px;
  color: #33424d;
}

.press-panel__context-text strong {
  font-size: 12px;
  color: #1b3a4b;
}

.press-panel__context-btn {
  flex: 0 0 auto;
  padding: 2px 0;
  font-size: 12px;
  font-weight: 700;
  color: #0277bd;
  background: none;
  border: 0;
  cursor: pointer;
}

.press-panel__date {
  margin: 0;
  padding: 12px 12px 4px 14px;
  font-size: 11px;
  font-weight: 700;
  color: #6b7780;
}

.press-panel__list {
  margin: 0;
  padding: 0;
}

.press-panel__state {
  padding: 20px 14px;
  font-size: 12px;
  line-height: 1.6;
  color: #33424d;
}

.press-panel__state p {
  margin: 0 0 10px;
}

.press-panel__national {
  margin-top: 8px;
  border-top: 6px solid #f4f7f9;
}

.press-panel__national-head span {
  font-size: 13px;
}

.press-panel__national-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 12px 4px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #1b2a35;
  background: none;
  border: 0;
  cursor: pointer;
}

.press-panel__national-hint {
  margin: 0;
  padding: 0 12px 12px 14px;
  font-size: 11px;
  color: #6b7780;
}

.press-panel__note {
  margin: 0;
  padding: 14px 12px 16px 14px;
  font-size: 10.5px;
  line-height: 1.6;
  color: #8a959d;
}

.press-panel__context-btn:focus-visible,
.press-panel__national-head:focus-visible {
  outline: 2px solid #039be5;
  outline-offset: 2px;
}

.is-mobile {
  border-radius: 14px;
  box-shadow: 0 -2px 18px rgba(27, 58, 75, 0.18);
  overflow: hidden;
}

.is-mobile .press-panel__header {
  padding-top: 10px;
}
</style>
