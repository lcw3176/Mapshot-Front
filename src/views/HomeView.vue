<template>

  <div class="container mt-5">
      <div class="columns">
        <div class="column is-three-quarters">
          <div class="box">
            <div class="field">
              <!-- 지도 -->
              <div class="map_wrap">
                <div id="map" style="width:100%;height:100%;position:relative;overflow:hidden;"></div>

                <div id="menu_wrap" class="bg_white">
                  <div class="option">
                    <div>
                      <form id="searchPlaces">
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
                  <p class="title is-5" id="lat"></p>
                </div>
              </div>

              <div class="column is-3 level-item has-text-centered">
                <div>
                  <p class="heading">경도</p>
                  <p class="title is-5" id="lng"></p>
                </div>
              </div>

              <div class="column is-3 level-item has-text-centered">
                <div>
                  <p class="heading">도로명주소</p>
                  <p class="title is-6" id="load-address"></p>
                </div>
              </div>

              <div class="column is-3 level-item has-text-centered">
                <div>
                  <p class="heading">지번주소</p>
                  <p class="title is-6" id="bunzi-address"></p>
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
                <li><a class="zoom" onclick="setZoomLevel(1, this)">1km</a></li>
                <li><a class="zoom" onclick="setZoomLevel(2, this)">2km</a></li>
                <li><a class="zoom" onclick="setZoomLevel(5, this)">5km</a></li>
                <li><a class="zoom" id="default_click_level" onclick="setZoomLevel(10, this)">10km</a></li>
              </ul>
              <p class="title is-6 mt-2 mb-1">
                종류
              </p>
              <ul class="menu-list">
                <li class="menu-seperator"></li>
                <li><a class="map" onclick="setBaseMap('basic', this)">일반</a></li>
                <li><a class="map" id="default_click_map" onclick="setBaseMap('satellite_base', this)">위성</a></li>
                <li><a class="map" onclick="setBaseMap('satellite', this)">하이브리드</a></li>
              </ul>

              <p class="title is-6 mt-2 mb-1">
                출력
              </p>
              <ul class="menu-list">
                <li class="menu-seperator"></li>
                <li><a id="naver" class="company" onclick="setCompany('naver')">네이버</a></li>
                <li><a id="kakao" class="company" onclick="setCompany('kakao')">카카오</a></li>
              </ul>

              <p class="title is-6 mt-2 mb-1">
                옵션
              </p>

              <ul class="menu-list">
                <li class="menu-seperator"></li>
                <li><a id="setTrace" onclick="setTraceMode(this)">흔적 남기기</a></li>
                <li><a id="setLayer" onclick="setLayerMode(this)">지적 편집도</a></li>
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


export default {
  name: 'HomeView',
  mounted() {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(37.56813070741759, 126.97899146359276), // 지도의 중심좌표
        level: 7 // 지도의 확대 레벨
    };

    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption); 
  }
}
</script>

<style scoped>
@import "../assets/css/map.css";
</style>

  <!-- <script type="text/javascript" th:src="@{/js/canvas-toBlob.js}"></script>
  <script type="text/javascript" th:src="@{/js/mapshot.min.js}"></script>
  <script type="text/javascript" th:src="@{/js/app.js}"></script>
  <script type="text/javascript" th:src="@{/js/map.js}"></script>
  <script type="text/javascript" th:src="@{/js/sock.min.js}"></script>
  <script type="text/javascript" th:src="@{/js/stomp.min.js}"></script> -->