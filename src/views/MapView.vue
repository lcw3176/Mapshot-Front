<template>


  <v-alert
    title="알림"
    type="info"
    variant="tonal"
  >지도 생성 방식이 변경되었습니다. <a href="https://kmapshot.com/notice/detail/36">공지사항</a>을 확인해주세요.
  </v-alert>

  <!-- 지도 -->
  <div class="map_wrap">
    <div id="map" @contextmenu.prevent style="width:100%;height:100%;position:relative;overflow:hidden;"></div>

    <div id="menu_wrap" class="bg_white" v-if="display.mdAndUp">
      <div class="option">
        <div>
          <form id="searchPlaces" @submit.prevent="mapStore.searchPlaces">
            키워드 : <input type="text" id="keyword" size="15">
            <button type="submit">검색하기</button>
          </form>
        </div>
      </div>
      <hr>
      <ul id="placesList"></ul>
      <div id="pagination"></div>
    </div>
    <div class="custom_typecontrol">
      <v-list theme="dark">
        <v-list-item v-for="(value, key) in mapStore.baseMapStyles" :key="key" :value="value" active-color="info"
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


  <component :is=" display.mdAndUp ? 'v-navigation-drawer' : 'v-container'" permanent touchless="true"
             :location="display.mdAndUp ? 'right' : 'bottom'" width="300">
    <v-list nav>

      <v-list-subheader>
        반경 설정
      </v-list-subheader>

      <v-divider></v-divider>
      <v-list-item v-for="(value, key) in mapStore.radiusArr" :key="key" :value="value" active-color="info"
                   @click="mapStore.changeRadius(value, $event)" density="compact"
                   :active="value === mapStore.mapRadius">
        {{ key }}km
      </v-list-item>
    </v-list>

    <v-list>


      <v-list-subheader>
        지도 종류
      </v-list-subheader>

      <v-divider></v-divider>
      <v-list-item v-for="(value, key) in mapStore.baseMapArr" :key="key" :value="value" active-color="info"
                   @click="mapStore.changeBaseMap(value, $event)" density="compact">
        {{ key }}
      </v-list-item>
    </v-list>

    <v-list>


      <v-list-subheader>
        출력 회사
      </v-list-subheader>

      <v-divider></v-divider>
      <v-list-item v-for="(value, key) in mapStore.companyArr" :key="key" :value="value" active-color="info"
                   @click="mapStore.changeCompany(value, $event)" density="compact">
        {{ key }}
      </v-list-item>

    </v-list>
    <v-list>
      <v-list-subheader>
        부가 설정
      </v-list-subheader>

      <v-divider></v-divider>
      <v-list-item density="compact" @click="overlay = !overlay"
                   active-color="info">
        도시 계획 레이어
      </v-list-item>

      <v-overlay :model-value="overlay" class="align-center justify-center">
        <v-card>
          <v-container>
            <v-card-title>도시계획</v-card-title>
            <v-divider></v-divider>
            <v-card-item>
              <v-checkbox-btn v-model="mapStore.layers" label="도로" color="info" value="lt_c_upisuq151"/>
              <v-checkbox-btn v-model="mapStore.layers" label="토지이용계획도" color="info" value="lt_c_lhblpn"/>
            </v-card-item>

            <v-card-title>토지</v-card-title>
            <v-divider></v-divider>
            <v-card-item>
              <v-checkbox-btn v-model="mapStore.layers" label="연속지적도" color="info"
                              value="lp_pa_cbnd_bubun,lp_pa_cbnd_bonbun"/>
            </v-card-item>

            <v-card-actions>
              <v-btn variant="text" color="info" @click="overlay = !overlay">닫기</v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-overlay>

      <v-container fluid>
        <v-switch density="compact" color="info" v-if="mapStore.company === 'kakao'" v-model="mapStore.layerMode"
                  label="지적 편집도"/>

        <v-switch density="compact" color="info" v-if="mapStore.company === 'google'" v-model="mapStore.noLabel"
                  label=" 지형지물 명칭 없애기"/>


        <v-switch density="compact" color="info" v-model="mapStore.onlyLayers" label="레이어만 출력하기"/>

        <v-switch density="compact" color="info" v-model="mapStore.traceMode" label="흔적 남기기"/>

        <v-btn class="outlined" block color="success" @click="mapStore.startCapture">템플릿 제작</v-btn>
      </v-container>


    </v-list>


  </component>


</template>

<script>
import { useMapStore } from '@/store/map'
import '../assets/css/map.css'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  name: 'MapView',

  setup () {
    const mapStore = useMapStore()

    return {
      mapStore
    }
  },

  data () {
    const display = ref(useDisplay())

    return {
      overlay: null,
      display
    }
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
