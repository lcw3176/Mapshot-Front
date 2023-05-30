<template>
  <v-container is-fluid>

    <v-navigation-drawer floating permanent location="right" width="300">
      <v-list nav>

        <v-list-subheader>
          반경 설정
        </v-list-subheader>

        <v-divider></v-divider>
        <v-list-item v-for="(value, key) in mapStore.radiusArr" :key="key" :value="value" active-color="info"
          @click="mapStore.changeRadius(value, $event)" density="compact">
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
        <v-list-item density="compact" v-if="mapStore.company === 'naver'" @click="overlay = !overlay" active-color="info">
          도시 계획 레이어
        </v-list-item>

        <v-overlay :model-value="overlay" class="align-center justify-center">
          <v-card>
            <v-card-title>도로계획</v-card-title>
            <v-divider></v-divider>
            <v-card-item>
              <v-checkbox-btn label="여기에 레이어" color="info"/>
              <v-checkbox-btn label="목록들 추가" color="info"/>

            </v-card-item>
            <v-container fluid>
              
            </v-container>
          </v-card>
        </v-overlay>

        <v-container fluid>

          <v-switch density="compact" color="info" v-if="mapStore.company === 'kakao'" @click="mapStore.changeLayerMode" v-model="mapStore.isLayerMode"
            label="지적 편집도" />
            
          <v-switch density="compact" color="info" @click="mapStore.changeTraceMode" v-model="mapStore.isTraceMode"
            label="흔적 남기기" />
          
          <v-btn class="outlined" block color="success" @click="mapStore.startCapture">작업 시작</v-btn>
        </v-container>


      </v-list>


    </v-navigation-drawer>
    <v-container fluid class="pa-10">
      <!-- 지도 -->
      <div class="map_wrap">
        <div id="map" @contextmenu.prevent style="width:100%;height:100%;position:relative;overflow:hidden;"></div>

        <div id="menu_wrap" class="bg_white">
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
      </div>
      <!-- 지도 끝 -->


      <v-row>
        <v-col>
          <div>
            <p class="text-center font-weight-bold">위도</p>
            <p class="text-center">{{ mapStore.getLat }}</p>
          </div>
        </v-col>

        <v-col>
          <div>
            <p class="text-center font-weight-bold">경도</p>
            <p class="text-center">{{ mapStore.getLng }}</p>
          </div>
        </v-col>

        <v-col>
          <p class="text-center font-weight-bold">도로명주소</p>
          <p class="text-center">서울시</p>
          <!-- <p class="title is-6">{{ mapStore.getRoadAddress }}</p> -->
        </v-col>

        <v-col>
          <div>
            <p class="text-center font-weight-bold">지번주소</p>
            <p class="text-center">{{ mapStore.getBunziAddress }}</p>
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-10">
        <v-progress-linear height="15" v-if="!mapStore.isProgressLoading" :color="mapStore.isError ? 'error' : 'info'"
          rounded model-value="100" v-model="mapStore.getProgressBarValue" :max="mapStore.getProgressBarMax" />

        <v-progress-linear v-else height="15" model-value="100" color="info" rounded />
      </v-row>

      <v-row>

        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item>
            완료 {{ mapStore.statusMessage }}
          </v-breadcrumbs-item>

          <v-breadcrumbs-divider />

          <v-breadcrumbs-item>
            mapshot_result {{ mapStore.mapDownloadName }}
          </v-breadcrumbs-item>
          <!-- <ul class="columns">
            <li class="column is-four-fifths"><span>완료 {{ mapStore.statusMessage }}</span></li>
            <li class="column">
              <span class="icon is-small ml-2">
                  <i class="fas fa-link"></i>
              </span>
              <a :href="mapStore.mapDownloadLink" :download="mapStore.mapDownloadName">
                <span>mapshot_result {{ mapStore.mapDownloadName }}</span>
              </a>
            </li>
          </ul> -->
        </v-breadcrumbs>
      </v-row>

    </v-container>
    <!-- 
    <div class="columns">
      <div class="column is-three-quarters">
        <div class="box">
          <div class="field">
            
            <div class="map_wrap">
              <div id="map" @contextmenu.prevent style="width:100%;height:100%;position:relative;overflow:hidden;"></div>

              <div id="menu_wrap" class="bg_white">
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
            </div>
            
          </div>


          <div class="columns level">
            <div class="column is-3 level-item has-text-centered">
              <div>
                <p class="heading">위도</p>
                <p class="title is-5">{{ mapStore.getLat }}</p>
              </div>
            </div>

            <div class="column is-3 level-item has-text-centered">
              <div>
                <p class="heading">경도</p>
                <p class="title is-5">{{ mapStore.getLng }}</p>
              </div>
            </div>

            <div class="column is-3 level-item has-text-centered">
              <div>
                <p class="heading">도로명주소</p>
                <p class="title is-6">{{ mapStore.getRoadAddress }}</p>
              </div>
            </div>

            <div class="column is-3 level-item has-text-centered">
              <div>
                <p class="heading">지번주소</p>
                <p class="title is-6">{{ mapStore.getBunziAddress }}</p>
              </div>
            </div>
          </div>

        </div>

        <progress v-if="!mapStore.isProgressLoading" :class="mapStore.isError ? 'progress is-danger' : 'progress is-info'"
          :value="mapStore.getProgressBarValue" :max="mapStore.getProgressBarMax"></progress>
        <progress v-else max="100" class="progress is-info"></progress>


        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul class="columns">
            <li class="column is-four-fifths"><span>{{ mapStore.statusMessage }}</span></li>
            <li class="column">
              <span class="icon is-small ml-2">
                <i class="fas fa-link"></i>
              </span>
              <a :href="mapStore.mapDownloadLink" :download="mapStore.mapDownloadName">
                <span>{{ mapStore.mapDownloadName }}</span>
              </a>
            </li>
          </ul>
        </nav>

      </div>


      <div class="column">
        <div class="box">
          <div class="menu">
            <p class="title is-6 mb-1">
              반경
            </p>
            <ul class="menu-list">
              <li class="menu-seperator"></li>
              <li v-for="(value, key) in mapStore.radiusArr" :key="key">
                <a @click="mapStore.changeRadius(value, $event)" :class="{ 'is-active': mapStore.getRadius === value }">{{
                  key }}km</a>
              </li>

            </ul>
            <p class="title is-6 mt-2 mb-1">
              종류
            </p>
            <ul class="menu-list">
              <li class="menu-seperator"></li>
              <li v-for="(value, key) in mapStore.baseMapArr" :key="key">
                <a @click="mapStore.changeBaseMap(value, $event)" :class="{ 'is-active': mapStore.getBaseMap === value }">{{
                  key }}</a>
              </li>
            </ul>

            <p class="title is-6 mt-2 mb-1">
              출력
            </p>
            <ul class="menu-list">
              <li class="menu-seperator"></li>
              <li v-for="(value, key) in mapStore.companyArr" :key="key">
                <a @click="mapStore.changeCompany(value, $event)" :class="{ 'is-active': mapStore.getCompany === value }">{{
                  key }}</a>
              </li>
            </ul>

            <p class="title is-6 mt-2 mb-1">
              옵션
            </p>

            <ul class="menu-list">
              <li class="menu-seperator"></li>
              <li><a @click="mapStore.changeTraceMode" :class="{ 'is-active': mapStore.isTraceMode }">흔적 남기기</a></li>
              <li><a @click="mapStore.changeLayerMode" :class="{ 'is-active': mapStore.isLayerMode }">지적 편집도</a></li>
            </ul>


            <p class="title is-6 mt-2 mb-1">
              수집
            </p>

            <ul class="menu-list">
              <li class="menu-seperator"></li>
              <button class="button is-outlined" @click="mapStore.startCapture">작업 시작</button>
            </ul>
          </div>
        </div>
      </div>
    </div> -->

  </v-container>
</template>

<script>
import { useMapStore } from '../store/map.js'

export default {
  name: 'MapView',


  setup() {
    const mapStore = useMapStore();


    return {
      mapStore
    }
  },

  data() {
    return {
      overlay: null,
    }
  }

  // mounted() {
  //   this.mapStore.init();
  //   this.mapStore.addListeners();

  //   document.body.addEventListener('naverTileOnLoadStart', this.mapStore.naverTileOnLoadStart);
  //   document.body.addEventListener('naverTileOnProgress', this.mapStore.naverTileOnProgress);
  //   document.body.addEventListener('naverTileOnError', this.mapStore.naverTileOnError);
  //   document.body.addEventListener('proxyTileOnError', this.mapStore.proxyTileOnError);
  // },

  // beforeDestroy() {
  //   this.mapStore.removeListeners();

  //   document.body.removeEventListener('naverTileOnLoadStart', this.mapStore.naverTileOnLoadStart);
  //   document.body.removeEventListener('naverTileOnProgress', this.mapStore.naverTileOnProgress);
  //   document.body.removeEventListener('naverTileOnError', this.mapStore.naverTileOnError);
  //   document.body.removeEventListener('proxyTileOnError', this.mapStore.proxyTileOnError);
  // },
}
</script>

<style scoped>
@import "../assets/css/map.css";
</style>
