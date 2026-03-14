<template>


  <!-- 지도 -->
  <div class="map_wrap">
    <div id="map" @contextmenu.prevent style="width:100%;height:100%;position:relative;overflow:hidden;"></div>

    <div id="menu_wrap" v-if="display.mdAndUp">
      <v-form id="searchPlaces" @submit.prevent="mapStore.searchPlaces" class="pa-2">
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
      <v-divider/>
      <ul id="placesList"></ul>
      <div id="pagination"></div>
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


  <v-container fluid>
    <v-row>
      <v-col>
        <div>
          <p class="text-center text-overline">위도</p>
          <p class="text-center text-body-1">{{ mapStore.lat }}</p>
        </div>
      </v-col>

      <v-col>
        <div>
          <p class="text-center text-overline">경도</p>
          <p class="text-center text-body-1">{{ mapStore.lng }}</p>
        </div>
      </v-col>

      <v-col>
        <p class="text-center text-overline">도로명주소</p>
        <p class="text-center text-body-1">{{ mapStore.roadAddress }}</p>
      </v-col>

      <v-col>
        <div>
          <p class="text-center text-overline">지번주소</p>
          <p class="text-center text-body-1">{{ mapStore.bunziAddress }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>


  <component
    :is="display.mdAndUp ? 'v-navigation-drawer' : 'v-container'"
    permanent
    touchless="true"
    :location="display.mdAndUp ? 'right' : 'bottom'"
    width="280"
  >
    <v-expansion-panels variant="accordion" multiple v-model="openPanels" class="settings-panels">

      <!-- 반경 설정 -->
      <v-expansion-panel>
        <v-expansion-panel-title class="panel-title">
          <v-icon size="small" class="mr-2" color="info">mdi-radius-outline</v-icon>
          반경 설정
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list nav density="compact" class="pa-0">
            <v-list-item
              v-for="(value, key) in mapStore.radiusArr"
              :key="key"
              :value="value"
              color="info"
              rounded="lg"
              @click="mapStore.changeRadius(value, $event)"
              density="compact"
              :active="value === mapStore.mapRadius"
            >
              {{ key }}km
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 지도 종류 -->
      <v-expansion-panel>
        <v-expansion-panel-title class="panel-title">
          <v-icon size="small" class="mr-2" color="info">mdi-layers-outline</v-icon>
          지도 종류
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list nav density="compact" class="pa-0">
            <v-list-item
              v-for="(value, key) in mapStore.baseMapArr"
              :key="key"
              :value="value"
              color="info"
              rounded="lg"
              @click="mapStore.changeBaseMap(value, $event)"
              density="compact"
              :active="value === mapStore.baseMap"
            >
              {{ key }}
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 출력 회사 -->
      <v-expansion-panel>
        <v-expansion-panel-title class="panel-title">
          <v-icon size="small" class="mr-2" color="info">mdi-office-building-outline</v-icon>
          출력 회사
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list nav density="compact" class="pa-0">
            <v-list-item
              v-for="(value, key) in mapStore.companyArr"
              :key="key"
              :value="value"
              color="info"
              rounded="lg"
              @click="mapStore.changeCompany(value, $event)"
              density="compact"
              :active="value === mapStore.company"
            >
              {{ key }}
            </v-list-item>
          </v-list>
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

  </component>

</template>

<script>
import { useMapStore } from '@/store/map'
import '../assets/css/map.css'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

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

  setup () {
    const mapStore = useMapStore()
    return { mapStore }
  },

  data () {
    const display = ref(useDisplay())
    return {
      overlay: null,
      display,
      openPanels: loadPanels(),
    }
  },

  watch: {
    openPanels (val) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
  },

  mounted () {
    this.mapStore.init()
    this.mapStore.addListeners()
  },

  beforeUnmount () {
    this.mapStore.removeListeners()
  },
}
</script>

<style scoped>
.settings-panels {
  border-radius: 0 !important;
}

.panel-title {
  font-size: 0.85rem !important;
  font-weight: 700 !important;
  min-height: 40px !important;
}

.capture-btn-wrap {
  padding: 12px;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}
</style>
