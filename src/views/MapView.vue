<template>

  <div :class="$isMobile() ? 'container is-fluid' : 'container'">
    <div class="columns">
      <div class="column is-three-quarters">
        <div class="box">
          <div class="field">
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

        <progress class="progress is-success" id="progressBar" value="0" max="100"></progress>


        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul class="columns">
            <li class="column is-four-fifths"><span id="captureStatus"></span></li>
            <li class="column">
              <a href="" id="resultHref">
                <span class="icon is-small">
                  <i class="fas fa-link"></i>
                </span>
                <span id="resultSpan"></span>
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
              <li  v-for="(value, key) in mapStore.radiusArr" :key="key">
                <a @click="mapStore.changeRadius(value, $event)" :class="{'is-active': mapStore.getRadius === value}">{{ key }}km</a>
              </li>

            </ul>
            <p class="title is-6 mt-2 mb-1">
              종류
            </p>
            <ul class="menu-list">
              <li class="menu-seperator"></li>
                 <li  v-for="(value, key) in mapStore.baseMapArr" :key="key">
                <a @click="mapStore.changeBaseMap(value, $event)" :class="{'is-active': mapStore.getBaseMap === value}">{{ key }}</a>
              </li>
            </ul>

            <p class="title is-6 mt-2 mb-1">
              출력
            </p>
            <ul class="menu-list">
              <li class="menu-seperator"></li>
              <li  v-for="(value, key) in mapStore.companyArr" :key="key">
                <a @click="mapStore.changeCompany(value, $event)" :class="{'is-active': mapStore.getCompany === value}">{{ key }}</a>
              </li>
            </ul>

            <p class="title is-6 mt-2 mb-1">
              옵션
            </p>

            <ul class="menu-list">
              <li class="menu-seperator"></li>
              <li><a @click="mapStore.changeTraceMode" :class="{'is-active': mapStore.isTradeMode}">흔적 남기기</a></li>
              <li><a @click="mapStore.changeLayerMode" :class="{'is-active': mapStore.isLayerMode}">지적 편집도</a></li>
            </ul>


            <p class="title is-6 mt-2 mb-1">
              수집
            </p>

            <ul class="menu-list">
              <li class="menu-seperator"></li>
              <button class="button is-outlined" onclick="startCapture()">작업 시작</button>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import {useMapStore} from '../store/map.js'

export default {
  name: 'MapView',

  mounted(){
    this.mapStore.init();
  },

  setup(){
    const mapStore = useMapStore();

    return {
      mapStore
    }
  },

  methods: {

  }
}
</script>

<style scoped>
@import "../assets/css/map.css";
</style>
