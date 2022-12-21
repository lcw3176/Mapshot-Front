<template>

  <div class="container is-fluid mt-5">
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
                    <form id="searchPlaces" @submit.prevent="searchPlaces">
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
    let mapContainer = document.getElementById('map'),
      mapOption = {
        center: new kakao.maps.LatLng(37.56813070741759, 126.97899146359276),
        level: 7
      };

    this.map = new kakao.maps.Map(mapContainer, mapOption);

    this.markers = [];
    this.ps = new kakao.maps.services.Places();
    this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

  },

  data(){

    return {
      map: '',
      markers: [],
      ps: '',
      infowindow: '',
    }
  },

  methods: {

    placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {

        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        this.displayPlaces(data);

        // 페이지 번호를 표출합니다
        this.displayPagination(pagination);

      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

      } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

      }
    },

    displayPlaces(places) {

      let listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds(),
        listStr = '';

      // 검색 결과 목록에 추가된 항목들을 제거합니다
      this.removeAllChildNods(listEl);

      // 지도에 표시되고 있는 마커를 제거합니다
      this.removeMarker();

      for (let i = 0; i < places.length; i++) {

        // 마커를 생성하고 지도에 표시합니다
        let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
          marker = this.addMarker(placePosition, i),
          itemEl = this.getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        fragment.appendChild(itemEl);
      }

      // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
      listEl.appendChild(fragment);
      menuEl.scrollTop = 0;

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      this.map.setBounds(bounds);
    },

    getListItem(index, places) {

      var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
          '<div class="info">' +
          '   <h5>' + places.place_name + '</h5>';

      if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
          '   <span class="jibun gray">' + places.address_name + '</span>';
      } else {
        itemStr += '    <span>' + places.address_name + '</span>';
      }

      itemStr += '  <span class="tel">' + places.phone + '</span>' +
        '</div>';

      el.innerHTML = itemStr;
      el.className = 'item';

      return el;
    },

    addMarker(position, idx, title) {
      var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions = {
          spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage
        });

      marker.setMap(this.map); // 지도 위에 마커를 표출합니다
      this.markers.push(marker);  // 배열에 생성된 마커를 추가합니다

      return marker;
    },

    searchPlaces() {

      let keyword = document.getElementById('keyword').value;

      if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
      }

      this.ps.keywordSearch(keyword, this.placesSearchCB);
    },

    removeAllChildNods(el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    },

    displayInfowindow(marker, title) {
      var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

      infowindow.setContent(content);
      infowindow.open(map, marker);
    },

    displayPagination(pagination) {
      var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

      // 기존에 추가된 페이지번호를 삭제합니다
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
          el.className = 'on';
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            }
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    },

    removeMarker() {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    }

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