<template>


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
              @click="mapStore.changeMapStyle(value)" density="compact" :active="value === mapStore.currentMapStyle">
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
      <v-container fluid>
        <v-row class="pl-10 pr-10 mt-5">
          <v-progress-linear height="15" v-if="mapStore.inProgress" color="info" stream rounded
                             v-model="mapStore.progressBarValue" :max="mapStore.progressBarMax"
                             :indeterminate="mapStore.progressBarLoading" />

          <v-progress-linear v-else height="15" model-value="0" color="info" rounded />
        </v-row>

        <v-row class="pl-10 pr-10">
          <v-breadcrumbs divider="/">
            <v-breadcrumbs-item>
              {{ mapStore.statusMessage }}
            </v-breadcrumbs-item>

            <v-breadcrumbs-divider v-if="mapStore.statusMessage !== ''" />

            <v-breadcrumbs-item>
              <v-btn v-if="mapStore.mapDownloadLink !== ''" prepend-icon="mdi-link" variant="plain"
                     :href="mapStore.mapDownloadLink" :download="mapStore.mapDownloadName">
                {{ mapStore.mapDownloadName }}
              </v-btn>
            </v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-row>
      </v-container>


    <component :is=" display.mdAndUp ? 'v-navigation-drawer' : 'v-container'" permanent touchless="true" :location="display.mdAndUp ? 'right' : 'bottom'" width="300">
      <v-list nav>

        <v-list-subheader>
          반경 설정
        </v-list-subheader>

        <v-divider></v-divider>
        <v-list-item v-for="(value, key) in mapStore.radiusArr" :key="key" :value="value" active-color="info"
          @click="mapStore.changeRadius(value, $event)" density="compact" :active="value === mapStore.mapRadius">
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
        <v-list-item density="compact" v-if="mapStore.company === 'naver'" @click="overlay = !overlay"
          active-color="info">
          도시 계획 레이어
        </v-list-item>

        <v-overlay :model-value="overlay" class="align-center justify-center">
          <v-card>
            <v-container>
              <v-card-title>도시계획</v-card-title>
              <v-divider></v-divider>
              <v-card-item>
                <v-checkbox-btn v-model="mapStore.layers" label="도로" color="info" value="lt_c_upisuq151" />
                <v-checkbox-btn v-model="mapStore.layers" label="토지이용계획도" color="info" value="lt_c_lhblpn" />
              </v-card-item>

              <v-card-title>토지</v-card-title>
              <v-divider></v-divider>
              <v-card-item>
                <v-checkbox-btn v-model="mapStore.layers" label="연속지적도" color="info"
                  value="lp_pa_cbnd_bubun,lp_pa_cbnd_bonbun" />
              </v-card-item>

              <v-card-actions>
                <v-btn variant="text" color="info" @click="overlay = !overlay">닫기</v-btn>
              </v-card-actions>
            </v-container>
          </v-card>
        </v-overlay>

        <v-container fluid>
          <v-switch density="compact" color="info" v-if="mapStore.company === 'kakao'" v-model="mapStore.layerMode"
            label="지적 편집도" />

          <v-switch density="compact" color="info" v-if="mapStore.company === 'naver'" v-model="mapStore.onlyLayers"
            label="레이어만 출력하기" />

          <v-switch density="compact" color="info" v-if="mapStore.company === 'google'" v-model="mapStore.noLabel"
            label=" 지형지물 명칭 없애기"/>

          <v-radio-group v-if="mapStore.onlyLayers" inline v-model="mapStore.layerExtension">
            <v-radio label="PNG" value="image/png"></v-radio>
            <v-radio label="JPG" value="image/jpeg"></v-radio>
          </v-radio-group>

          <v-switch density="compact" color="info" v-model="mapStore.traceMode" label="흔적 남기기" />

          <v-btn class="outlined" block color="success" @click="mapStore.startCapture">작업 시작</v-btn>
        </v-container>


      </v-list>


    </component>


</template>

<script>
import { useMapStore } from '../store/map.js'
import "../assets/css/map.css"
import { ref } from 'vue'
import { useDisplay } from 'vuetify'


export default {
  name: 'MapView',


  setup() {
    const mapStore = useMapStore();

    return {
      mapStore
    }
  },

  data() {
    const display = ref(useDisplay());


    return {
      overlay: null,
      display
    }
  },

  mounted() {
    this.mapStore.init();
    this.mapStore.addListeners();

    document.body.addEventListener('naverTileOnLoadStart', this.mapStore.naverTileOnLoadStart);
    document.body.addEventListener('naverTileOnProgress', this.mapStore.naverTileOnProgress);
    document.body.addEventListener('naverTileOnError', this.mapStore.naverTileOnError);
    document.body.addEventListener('proxyTileOnError', this.mapStore.proxyTileOnError);
  },

  beforeUnmount() {
    this.mapStore.removeListeners();

    document.body.removeEventListener('naverTileOnLoadStart', this.mapStore.naverTileOnLoadStart);
    document.body.removeEventListener('naverTileOnProgress', this.mapStore.naverTileOnProgress);
    document.body.removeEventListener('naverTileOnError', this.mapStore.naverTileOnError);
    document.body.removeEventListener('proxyTileOnError', this.mapStore.proxyTileOnError);
  },
}
</script>
