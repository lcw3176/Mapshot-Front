<template>
  <div class="map-page">
  <!-- 지도 -->
  <div class="map_wrap">
    <div id="map" ref="mapElement" @contextmenu.prevent style="width:100%;height:100%;position:relative;overflow:hidden;"></div>

    <div id="menu_wrap" v-if="display.mdAndUp" :class="{ 'parcel-active': parcelStore.enabled }">
      <v-form v-if="!parcelStore.enabled" id="searchPlaces" @submit.prevent="mapStore.searchPlaces" class="pa-2">
        <v-text-field
          id="keyword"
          label="장소 검색"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          class="mb-2"
          bg-color="surface"
        />
        <v-btn type="submit" color="info" variant="tonal" block size="small" prepend-icon="mdi-map-search">
          검색하기
        </v-btn>
      </v-form>
      <div class="parcel-mode-control">
        <v-btn :color="parcelStore.enabled ? 'info' : undefined"
               :variant="parcelStore.enabled ? 'flat' : 'tonal'"
               :prepend-icon="parcelStore.enabled ? 'mdi-check' : 'mdi-vector-square'"
               block size="small" @click="parcelStore.toggle()">
          {{ parcelStore.enabled ? '필지 선택 중 · 종료' : '필지 선택하기' }}
        </v-btn>
      </div>
      <v-divider/>
      <div v-show="!parcelStore.enabled" class="place-results">
        <ul id="placesList"></ul>
        <div id="pagination"></div>
      </div>
      <ParcelInfoCard v-if="parcelStore.enabled" class="desktop-parcel-workspace"/>
      <!-- 광고 ①: 검색 패널 하단. 필지 모드에선 카드가 공간을 다 써야 해서 숨긴다.
           v-if 가 아니라 v-show — 토글할 때마다 새 광고 요청이 나가지 않게 (AdSlot 주석 참고) -->
      <div v-if="leftAd" v-show="!parcelStore.enabled" class="side-ad">
        <AdSlot slot-id="3631787426" :width="300" :height="leftAd.height"/>
      </div>
    </div>

    <v-btn v-if="!display.mdAndUp" class="mobile-parcel-toggle" size="small"
           :color="parcelStore.enabled ? 'info' : 'surface'"
           :prepend-icon="parcelStore.enabled ? 'mdi-check' : 'mdi-vector-square'"
           @click="parcelStore.toggle()">
      {{ parcelStore.enabled ? '필지 선택 중' : '필지 선택' }}
    </v-btn>
    <div v-if="!display.mdAndUp && parcelStore.enabled" class="mobile-parcel-workspace">
      <ParcelInfoCard mobile/>
    </div>
    <div class="custom_typecontrol">
      <v-list theme="dark">
        <v-list-item v-for="(value, key) in mapStore.baseMapStyles" :key="key" :value="value" color="info"
                     @click="mapStore.changeMapStyle(value)" density="compact"
                     :active="value === mapStore.currentMapStyle">
          {{ key }}
        </v-list-item>
      </v-list>

    </div>
  </div>
  <!-- 지도 끝 -->


  <!-- 광고 ③: 지도 아래 좌표 줄 오른쪽 728x90. 화면 높이와 상관없이 늘 보이는 유일한 자리라
       노트북(오른쪽 광고가 안 뜨는 화면)에서도 노출된다. 좌표·주소는 왼쪽에 3줄로 압축. -->
  <div v-if="bottomAd" class="map-details map-details--ad">
    <div class="coord-compact">
      <p class="coord-line"><span class="coord-label">위도</span>{{ mapStore.lat }}
        <span class="coord-label ml-3">경도</span>{{ mapStore.lng }}</p>
      <p class="coord-line" :title="mapStore.roadAddress"><span class="coord-label">도로명</span>{{ mapStore.roadAddress }}</p>
      <p class="coord-line" :title="mapStore.bunziAddress"><span class="coord-label">지번</span>{{ mapStore.bunziAddress }}</p>
    </div>
    <div class="bottom-ad">
      <AdSlot slot-id="8974567267" :width="728" :height="90"/>
    </div>
  </div>

  <v-container v-else fluid class="map-details">
    <v-row>
      <v-col cols="6" md="3">
        <div>
          <p class="text-center text-overline">위도</p>
          <p class="text-center text-body-1">{{ mapStore.lat }}</p>
        </div>
      </v-col>

      <v-col cols="6" md="3">
        <div>
          <p class="text-center text-overline">경도</p>
          <p class="text-center text-body-1">{{ mapStore.lng }}</p>
        </div>
      </v-col>

      <v-col cols="6" md="3">
        <p class="text-center text-overline">도로명주소</p>
        <p class="text-center text-body-1">{{ mapStore.roadAddress }}</p>
      </v-col>

      <v-col cols="6" md="3">
        <div>
          <p class="text-center text-overline">지번주소</p>
          <p class="text-center text-body-1">{{ mapStore.bunziAddress }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
  </div>


  <component
    :is="display.mdAndUp ? 'v-navigation-drawer' : 'v-container'"
    permanent
    :touchless="true"
    :location="display.mdAndUp ? 'right' : 'bottom'"
    :width="rightAd ? 324 : 280"
  >
    <div :class="{ 'drawer-body': rightAd }">
    <div :class="{ 'drawer-scroll': rightAd }">
    <v-expansion-panels variant="accordion" multiple v-model="openPanels" class="settings-panels">

      <!-- 반경 설정 -->
      <v-expansion-panel>
        <v-expansion-panel-title class="panel-title">
          <v-icon size="small" class="mr-2" color="info">mdi-radius-outline</v-icon>
          반경 설정
        </v-expansion-panel-title>
        <v-expansion-panel-text class="choice-text">
          <div class="choice-row">
            <v-btn
              v-for="(value, key) in mapStore.radiusArr"
              :key="key"
              size="small"
              rounded="lg"
              :color="value === mapStore.mapRadius ? 'info' : undefined"
              :variant="value === mapStore.mapRadius ? 'flat' : 'tonal'"
              @click="mapStore.changeRadius(value, $event)"
            >
              {{ key }}km
            </v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 지도 종류 -->
      <v-expansion-panel>
        <v-expansion-panel-title class="panel-title">
          <v-icon size="small" class="mr-2" color="info">mdi-layers-outline</v-icon>
          지도 종류
        </v-expansion-panel-title>
        <v-expansion-panel-text class="choice-text">
          <div class="choice-row">
            <v-btn
              v-for="(value, key) in mapStore.baseMapArr"
              :key="key"
              size="small"
              rounded="lg"
              :color="value === mapStore.baseMap ? 'info' : undefined"
              :variant="value === mapStore.baseMap ? 'flat' : 'tonal'"
              @click="mapStore.changeBaseMap(value, $event)"
            >
              {{ key }}
            </v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 출력 회사 -->
      <v-expansion-panel>
        <v-expansion-panel-title class="panel-title">
          <v-icon size="small" class="mr-2" color="info">mdi-office-building-outline</v-icon>
          출력 회사
        </v-expansion-panel-title>
        <v-expansion-panel-text class="choice-text">
          <div class="choice-row">
            <v-btn
              v-for="(value, key) in mapStore.companyArr"
              :key="key"
              size="small"
              rounded="lg"
              :color="value === mapStore.company ? 'info' : undefined"
              :variant="value === mapStore.company ? 'flat' : 'tonal'"
              @click="mapStore.changeCompany(value, $event)"
            >
              {{ key }}
            </v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 부가 설정 -->
      <v-expansion-panel>
        <v-expansion-panel-title class="panel-title">
          <v-icon size="small" class="mr-2" color="info">mdi-tune-variant</v-icon>
          부가 설정
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list nav density="compact" class="pa-0 mb-2">
            <v-list-item
              density="compact"
              rounded="lg"
              color="info"
              @click="overlay = !overlay"
            >
              도시 계획 레이어
            </v-list-item>
          </v-list>

          <v-overlay :model-value="overlay" class="align-center justify-center">
            <v-card min-width="300" rounded="lg" elevation="8">
              <v-card-title class="d-flex align-center">
                레이어 설정
              </v-card-title>
              <v-divider/>
              <v-card-text>
                <p class="text-caption text-medium-emphasis mb-2 font-weight-bold">도시계획</p>
                <v-checkbox-btn v-model="mapStore.layers" label="도로" color="info" value="lt_c_upisuq151"
                                density="compact"/>
                <v-checkbox-btn v-model="mapStore.layers" label="토지이용계획도" color="info" value="lt_c_lhblpn"
                                density="compact"/>
                <p class="text-caption text-medium-emphasis mt-3 mb-2 font-weight-bold">토지</p>
                <v-checkbox-btn v-model="mapStore.layers" label="연속지적도" color="info"
                                value="lp_pa_cbnd_bubun,lp_pa_cbnd_bonbun" density="compact"/>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn variant="tonal" color="info" @click="overlay = !overlay" prepend-icon="mdi-close">닫기</v-btn>
              </v-card-actions>
            </v-card>
          </v-overlay>

          <v-switch density="compact" color="info" v-if="mapStore.company === 'kakao'" v-model="mapStore.layerMode"
                    label="지적 편집도" hide-details class="mb-1"/>
          <v-switch density="compact" color="info" v-if="mapStore.company === 'google'" v-model="mapStore.noLabel"
                    label="명칭 없애기" hide-details class="mb-1"/>
          <v-switch density="compact" color="info" v-model="mapStore.onlyLayers" label="레이어만 출력" hide-details
                    class="mb-1"/>
          <v-switch density="compact" color="info" v-model="mapStore.addTopography" label="지형도 덧입히기" hide-details
                    class="mb-1"/>
          <v-switch density="compact" color="info" v-model="mapStore.traceMode" label="흔적 남기기" hide-details/>
        </v-expansion-panel-text>
      </v-expansion-panel>

    </v-expansion-panels>
    </div>

    <!-- 템플릿 제작 버튼 - 패널 외부 고정 -->
    <div class="capture-btn-wrap">
      <v-btn
        block
        color="success"
        variant="elevated"
        size="large"
        prepend-icon="mdi-camera"
        @click="mapStore.startCapture"
        rounded="lg"
      >
        템플릿 제작
      </v-btn>
    </div>

    <!-- 광고 ②: 설정 패널 맨 아래 고정. 템플릿 제작 버튼과 붙이지 말 것 —
         버튼 옆 광고는 오클릭을 유도해 애드센스 정책 위반이 된다 (간격 + 구분선 유지) -->
    <div v-if="rightAd" class="panel-ad">
      <AdSlot slot-id="2318705751" :width="300" :height="250"/>
    </div>
    </div>

  </component>

</template>

<script>
import { useMapStore } from '@/store/map'
import { useParcelStore } from '@/store/parcel'
import ParcelInfoCard from '@/components/map/ParcelInfoCard'
import AdSlot from '@/components/ads/AdSlot'
import '../assets/css/map.css'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

// 광고 슬롯을 띄울지는 첫 진입 시 창 크기로 한 번만 정한다.
// 창 크기 바뀔 때마다 다시 그리면 그게 곧 광고 재요청(새로고침)이라 하지 않는다.
//
// 왼쪽 패널(#menu_wrap)은 지도 위에 떠 있어서 높이 = 지도 높이 ≈ (창높이-64)*0.85-40.
//   검색폼+필지버튼 ≈ 130px 을 빼고 남는 자리에 광고가 들어가야 한다.
//   1366x768 노트북은 남는 자리가 ~430px → 300x600 은 안 들어가서 300x250.
// 오른쪽 패널은 광고를 바닥에 고정하는 대신 설정 목록이 스크롤된다.
//   처음엔 세로 목록이라 900px 이상에서만 띄웠는데 노트북에선 거의 노출이 안 됐다.
//   선택지를 가로 버튼 줄로 압축해서 700px 이상(1366x768 등)에서도 띄운다.
// 하단 좌표 줄(지도 폭 = 창폭 - 오른쪽 패널 280~324)에 728x90 + 좌표 텍스트(~220px)가 들어가려면
//   창폭 ≥ 324 + 32(여백) + 728 + 16 + 200 ≈ 1300. 그보다 좁으면 기존 4칸 레이아웃 유지.
function pickAds (display) {
  if (!display.mdAndUp) return { leftAd: null, rightAd: false, bottomAd: false }
  const h = window.innerHeight
  return {
    leftAd: h >= 1100 ? { height: 600 } : h >= 640 ? { height: 250 } : null,
    rightAd: h >= 700,
    bottomAd: window.innerWidth >= 1300,
  }
}

const STORAGE_KEY = 'mapshot_open_panels'
const DEFAULT_OPEN = [0, 1, 2, 3]

function loadPanels () {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved !== null ? JSON.parse(saved) : DEFAULT_OPEN
  } catch {
    return DEFAULT_OPEN
  }
}

export default {
  name: 'MapView',

  components: { ParcelInfoCard, AdSlot },

  setup () {
    const mapStore = useMapStore()
    const parcelStore = useParcelStore()
    return { mapStore, parcelStore }
  },

  data () {
    const display = ref(useDisplay())
    return {
      ...pickAds(display.value),
      overlay: null,
      display,
      openPanels: loadPanels(),
      mapResizeObserver: null,
    }
  },

  watch: {
    openPanels (val) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    'parcelStore.enabled' (enabled) {
      if (enabled) this.mapStore.removeRectangle()
      else this.mapStore.removeParcelMarker()
    },
    'parcelStore.parcel' (parcel) {
      if (!parcel) this.mapStore.removeParcelMarker()
    },
  },

  mounted () {
    this.mapStore.init()
    this.mapStore.addListeners()
    this.mapResizeObserver = new ResizeObserver(() => this.mapStore.map?.relayout?.())
    this.mapResizeObserver.observe(this.$refs.mapElement)
  },

  beforeUnmount () {
    this.mapResizeObserver?.disconnect()
    this.mapStore.removeParcelMarker()
    this.mapStore.removeListeners()
  },
}
</script>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  height: calc(100dvh - 64px);
  min-height: 400px;
}

.map-details {
  flex: 0 0 15%;
  display: flex;
  align-items: center;
  min-height: 96px;
  overflow-y: auto;
}

.map-details .v-row {
  align-items: center;
  width: 100%;
}

.map-details .v-col {
  overflow-wrap: anywhere;
}

/* 하단 광고 모드: 90px 광고가 잘리지 않게 위아래 여백을 줄이고 최소 높이를 맞춘다
   (기존 v-container 여백 16px 이면 90+32 > 1366x768 에서의 줄 높이 106px) */
.map-details--ad {
  min-height: 102px;
  padding: 6px 16px;
  gap: 16px;
  overflow: hidden;
}

.coord-compact {
  flex: 1 1 auto;
  min-width: 0;
}

.coord-line {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coord-label {
  display: inline-block;
  min-width: 3.2em;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.5);
}

.bottom-ad {
  flex: 0 0 728px;
  height: 90px;
}

.settings-panels {
  border-radius: 0 !important;
}

.panel-title {
  font-size: 0.85rem !important;
  font-weight: 700 !important;
  min-height: 40px !important;
}

/* 반경·지도 종류·출력 회사: 세로 목록(항목당 ~36px) 대신 가로 버튼 한 줄.
   오른쪽 광고를 노트북 화면(높이 ~700px)에서도 띄우려고 설정 영역 높이를 줄인 것 —
   세로 목록으로 되돌리면 광고가 다시 스크롤 아래로 밀린다. */
.choice-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 4px 12px 10px;
}

.choice-row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 6px;
}

.choice-row .v-btn {
  min-width: 0;
  padding: 0 4px;
  letter-spacing: 0;
  text-transform: none; /* v-btn 기본 대문자 변환 때문에 '2km' 가 '2KM' 로 보임 */
}

.capture-btn-wrap {
  padding: 12px;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}

.parcel-mode-control {
  padding: 0 8px 10px;
}

.place-results {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

/* 검색 결과가 길어져도 광고가 #menu_wrap(overflow:hidden) 밖으로 밀려나지 않게
   결과 목록만 스크롤시키고 광고는 바닥에 붙인다 */
.side-ad {
  flex: 0 0 auto;
  margin-top: auto;
  padding-top: 8px;
  text-align: center;
}

/* 오른쪽 광고가 있을 때: 설정 목록만 스크롤, 버튼+광고는 바닥 고정 */
.drawer-body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.panel-ad {
  flex: 0 0 auto;
  margin-top: 12px;
  padding: 12px;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
  text-align: center;
}

.desktop-parcel-workspace {
  flex: 1;
  min-height: 0;
}

#menu_wrap.parcel-active {
  width: 360px;
}

.mobile-parcel-toggle {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
}

.mobile-parcel-workspace {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  z-index: 3;
  height: min(420px, 68%);
  display: flex;
  align-items: flex-end;
  pointer-events: none;
}

.mobile-parcel-workspace > * {
  width: 100%;
}

@media (max-width: 959px) {
  .map-page {
    height: calc(100vh - 56px);
    height: calc(100dvh - 56px);
  }

  .map-details {
    flex-basis: 26%;
    min-height: 128px;
  }
}
</style>
