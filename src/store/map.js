import { defineStore } from "pinia";
import { NaverTile, LatLng, Radius } from "../assets/js/mapshot.min.js"


export const useMapStore = defineStore("map", {

  state: () => ({
    map: '',
    markers: [],
    ps: '',
    infowindow: '',
    geocoder: '',
    lat: 37.56813070741759,
    lng: 126.97899146359276,
    roadAddress: '',
    bunziAddress: '',
    coor: '',
    rectangle: null,
    naverTile: '',
    mapRadius: '',
  }),


  getters: {
    getLat() {
      return this.lat;
    },

    getLng() {
      return this.lng;
    },

    getRoadAddress() {
      return this.roadAddress;
    },

    getBunziAddress() {
      return this.bunziAddress;
    },

    getRadius(){
      return this.mapRadius;
    }

  },

  actions: {
    async init() {

      let mapContainer = document.getElementById('map'),
        mapOption = {
          center: new kakao.maps.LatLng(this.lat, this.lng),
          level: 7
        };

      this.map = new kakao.maps.Map(mapContainer, mapOption);
      this.map.addListener('click', this.mapOnClick);
      this.geocoder = new kakao.maps.services.Geocoder();
      this.markers = [];
      this.ps = new kakao.maps.services.Places();
      this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

      this.naverTile = new NaverTile();
      this.coor = new LatLng();
      this.mapRadius = Radius.One;

    },

    async mapOnClick(mouseEvent) {

      // 클릭한 위도, 경도 정보를 가져옵니다 
      let latlng = mouseEvent.latLng;

      this.lat = latlng.getLat();
      this.lng = latlng.getLng();
      this.coor.init(this.lat, this.lng);

      this.searchDetailAddrFromCoords(mouseEvent.latLng, this.insertAddressStr);


      if (this.rectangle != null) {
        this.rectangle.setMap(null);
      }

      this.naverTile.setLevel(this.mapRadius);
      // proxyProfile.setCenter(coor);

      let sw = this.naverTile.getSW(this.mapRadius, this.coor);
      let ne = this.naverTile.getNE(this.mapRadius, this.coor);

      this.rectangle = new kakao.maps.Rectangle({
        bounds: new kakao.maps.LatLngBounds(new kakao.maps.LatLng(sw.getY(), sw.getX()), new kakao.maps.LatLng(ne.getY(), ne.getX())),
        strokeWeight: 4,
        strokeColor: '#FF3DE5',
        strokeOpacity: 1,
        strokeStyle: 'shortdashdot',
        fillColor: '#FF8AEF',
        fillOpacity: 0.8
      });

      this.rectangle.setMap(this.map);

    },

    async insertAddressStr(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        this.roadAddress = !!result[0].road_address ? result[0].road_address.address_name : '';
        this.bunziAddress = result[0].address.address_name;

      }
    },

    async changeRadius(numberOfRadius, event){
      switch(numberOfRadius){
        case 1:
          this.mapRadius = Radius.One;
          break;
        case 2:
          this.mapRadius = Radius.Two;
          break;
        case 5:
          this.mapRadius = Radius.Five;
          break;
        case 10:
          this.mapRadius = Radius.Ten;
          break;
        default:
          break;

      }
    },

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
    },

    searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      this.geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    },

    searchDetailAddrFromCoords(coords, callback) {
      // 좌표로 법정동 상세 주소 정보를 요청합니다
      this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    },

  }
});