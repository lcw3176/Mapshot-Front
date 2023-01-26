import { defineStore } from "pinia";
import { Proxy, Naver, NaverTile, ProxyTile, LatLng, Radius } from "../assets/js/mapshot.min.js";
import axios from 'axios';

async function requsetImage(queryString) {
  const response = await axios.get('https://api.kmapshot.com/image/queue' + queryString);

  if(response.status !== 200){
    return [];
  }

  return response.data;
}


export const useMapStore = defineStore("map", {

  state: () => ({
    map: '',
    markers: [],
    ps: '',
    infowindow: '',
    geocoder: '',
    lat: '',
    lng: '',
    roadAddress: '',
    bunziAddress: '',
    coor: '',
    rectangle: null,
    naverTile: '',
    mapRadius: '',
    baseMap: '',
    company: '',
    layerMode: false,
    traceMode: false,
    inProgress: false,
    mapDownloadLink: '',
    mapDownloadName: '',
    statusMessage: '',
    error: false,
    naverProfile: '',
    proxyProfile: '',
    proxyTile: '',

    radiusArr: {
      1: Radius.One,
      2: Radius.Two,
      5: Radius.Five,
      10: Radius.Ten,
    },

    baseMapArr: {
      '일반': 'basic',
      '위성': 'satellite_base',
      '하이브리드': 'satellite',
    },

    companyArr: {
      '네이버': 'naver',
      '카카오': 'kakao',
    },

    progressBarValue: 0,
    progressBarMax: 100,
    progressBarLoading: false,
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

    getRadius() {
      return this.mapRadius;
    },

    getBaseMap() {
      return this.baseMap;
    },

    getCompany() {
      return this.company;
    },

    isLayerMode() {
      return this.layerMode;
    },

    isTraceMode() {
      return this.traceMode;
    },

    isError() {
      return this.error;
    },

    getProgressBarValue() {
      return this.progressBarValue;
    },

    getProgressBarMax() {
      return this.progressBarMax;
    },

    isProgressLoading() {
      return this.progressBarLoading;
    }

  },

  actions: {
    async init() {

      let mapContainer = document.getElementById('map'),
        mapOption = {
          center: new kakao.maps.LatLng(37.56813070741759, 126.97899146359276),
          level: 7
        };

      this.map = new kakao.maps.Map(mapContainer, mapOption);
      this.geocoder = new kakao.maps.services.Geocoder();
      this.markers = [];
      this.ps = new kakao.maps.services.Places();
      this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

      this.naverTile = new NaverTile();
      this.coor = new LatLng();
      this.mapRadius = Radius.Two;
      this.baseMap = this.baseMapArr['위성'];

      this.naverProfile = new Naver();
      this.naverProfile.setKey("ny5d4sdo0e");
      this.naverProfile.setMapType(this.baseMap);

      this.proxyProfile = new Proxy();
      this.proxyProfile.setProxyUrl("https://api.kmapshot.com/image/storage");
      this.proxyProfile.setCompanyType(this.companyArr['카카오']);
      this.proxyProfile.setMapType(this.baseMap);

      this.proxyTile = new ProxyTile();

    },

    async addListeners(){
      this.map.addListener('click', this.mapOnClick);
      this.map.addListener('rightclick', this.removeRectangle);
    },

    async removeListeners(){
      this.map.removeListener('click', this.mapOnClick);
      this.map.removeListener('rightclick', this.removeRectangle);
    },

    async startCapture() {
      if(this.inProgress){
        alert("현재 작업이 진행중입니다.");
        return;
      }

      if(this.company === ''){
        alert("출력 회사를 선택해 주세요.");
        return;
      }
      
      this.error = false;
      this.inProgress = true;

      if (this.traceMode) {
        this.makeTrace();
      }

      if (this.company === "naver") {
        this.naverCapture();
      }

      if (this.company === "kakao") {
        this.kakaoCapture();
      }
      
    },

    async makeTrace(){
      let traceRec = new kakao.maps.Rectangle({
        bounds: this.rectangle.getBounds(),
        strokeWeight: 4,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeStyle: 'shortdot',
        fillColor: '#ecf4f3',
        fillOpacity: 0.8
      });
      traceRec.setMap(this.map);
    },

    async proxyTileOnError(event) {
      this.statusMessage = "서버 에러입니다. 잠시 후 다시 시도해주세요.";
      this.error = true;
      this.inProgress = false;
      this.value = 100;
    },

    async naverTileOnLoadStart(event) {
      this.progressBarMax = event.detail.total;
      this.progressBarValue = 0;
    },

    async naverTileOnProgress() {
      this.progressBarValue += 1;
      this.statusMessage = this.progressBarValue + "/" + this.progressBarMax + " 수집 완료";
    },


    async naverTileOnError() {
      this.error = true;
      this.naverTileOnProgress();
    },


    async naverCapture() {
      this.naverProfile.setLevel(this.mapRadius);
      let fileName = this.bunziAddress;

      this.naverTile.draw(this.coor, this.mapRadius, this.naverProfile, (canvas) => {
        canvas.toBlob((blob) => {
          this.mapDownloadLink = URL.createObjectURL(blob);
          this.onCaptureEnded(fileName);

        }, "image/jpeg");

      });
    },

    async kakaoCapture() {
      this.progressBarLoading = true;
      let fileName = this.bunziAddress;
      let expectedEndTime = new Date();
      expectedEndTime.setSeconds(expectedEndTime.getSeconds() + 30);

      this.statusMessage = "지도 생성중 입니다. 예상 완료시간 -> " + expectedEndTime.toLocaleTimeString();


      const defaultBlockSize = 1000;
      this.proxyProfile.setRadius(this.mapRadius);

      let canvas = document.createElement("canvas");

      canvas.width = this.proxyProfile.getWidth();
      canvas.height = this.proxyProfile.getWidth();

      let ctx = canvas.getContext("2d");
      let sideBlockCount = parseInt(this.proxyProfile.getWidth() / defaultBlockSize);
      let maxCount = sideBlockCount * sideBlockCount;
      let count = 0;

      let data = await requsetImage(this.proxyProfile.getQueryString());

      this.progressBarLoading = false;
      this.progressBarMax = 100;

      if(data.length === 0){
        this.proxyTileOnError();
        return;
      }

      
      for (let i = 0; i < data.length; i++) {
        let json = data[i];

        ((_json) =>{
          
          this.proxyTile.requestImage(this.proxyProfile, _json.uuid, (loadedImage) => {
            ctx.drawImage(loadedImage, 0, 0, loadedImage.width, loadedImage.width,
              _json.x, _json.y, defaultBlockSize, defaultBlockSize);
            count++;
            this.statusMessage = parseInt((count / maxCount) * 100).toString() + " / 100";
            this.progressBarValue = count / maxCount * 100;

            if (count === maxCount) {
              canvas.toBlob((blob) => {
                this.mapDownloadLink = URL.createObjectURL(blob);
                this.progressBarValue = 100;
                this.onCaptureEnded(fileName);

              }, "image/jpeg");
            }
          })
        })(json);
      }
    },

    async onCaptureEnded(fileName){
      this.mapDownloadName = "mapshot_" + fileName + ".jpg";
      this.statusMessage = "완료되었습니다. 생성된 링크를 확인하세요";
      this.inProgress = false;
    },

    async removeRectangle() {
      if (this.rectangle != null) {
        this.rectangle.setMap(null);
      }
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
      this.proxyProfile.setCenter(this.coor);

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

    async changeRadius(rad, event) {
      this.mapRadius = rad;
    },

    async changeBaseMap(map, event) {
      this.baseMap = map;
      this.naverProfile.setMapType(map);
      this.proxyProfile.setMapType(map);
    },

    async changeCompany(company, event) {
      this.company = company;

      if (this.company !== this.companyArr['카카오'] && this.layerMode) {
        this.layerMode = false;
      }
    },

    async changeTraceMode() {
      this.traceMode = !this.traceMode;
    },

    async changeLayerMode() {
      if (this.company !== this.companyArr['카카오']) {
        alert("지적 편집도는 카카오 지도만 사용 가능합니다");
        return;
      }

      this.layerMode = !this.layerMode;
      this.proxyProfile.setLayerMode(this.layerMode);
    },

    // 이하 카카오 지도 api 문서 코드
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
        bounds = new kakao.maps.LatLngBounds();

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