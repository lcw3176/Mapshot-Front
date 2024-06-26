import { defineStore } from "pinia";
import { Proxy, Naver, Layer, NaverTile, LatLng, Radius } from "../assets/js/mapshot.min.js";
import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_URL;

async function requestImage(queryString) {
  try {
    const response = await axios.get(apiUrl + '/image/generate' + queryString, {responseType: 'blob'});

    return response.data;
  } catch (error) {

    return [];
  }

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
    layers: [],
    layerProfile: '',
    onlyLayers: false,
    layerExtension: 'image/jpeg',
    noLabel: false,

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
      '구글': 'google',
    },

    progressBarValue: 0,
    progressBarMax: 100,
    progressBarLoading: false,

    baseMapStyles: {
      '일반': kakao.maps.MapTypeId.ROADMAP,
      '위성': kakao.maps.MapTypeId.SKYVIEW,
    },

    currentMapStyle: '',
  }),


  getters: {

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
      this.baseMap = '';
      // this.baseMap = this.baseMapArr['위성'];

      this.naverProfile = new Naver();
      this.naverProfile.setKey("ny5d4sdo0e");
      // this.naverProfile.setMapType(this.baseMap);

      this.proxyProfile = new Proxy();
      // this.proxyProfile.setProxyUrl(apiUrl + "/image/storage");
      // this.proxyProfile.setCompanyType(this.companyArr['카카오']);
      // this.proxyProfile.setMapType(this.baseMap);

      // this.proxyTile = new ProxyTile();

      this.layerProfile = new Layer();
      this.layerProfile.setUrl("https://pkhb969vta.execute-api.ap-northeast-2.amazonaws.com/default/vworld");

      this.currentMapStyle = this.baseMapStyles['일반']
    },

    async addListeners() {
      this.map.addListener('click', this.mapOnClick);
      this.map.addListener('rightclick', this.removeRectangle);
    },

    async removeListeners() {
      this.map.removeListener('click', this.mapOnClick);
      this.map.removeListener('rightclick', this.removeRectangle);
    },

    async startCapture() {
      if (this.coor.getX() == undefined || this.coor.getY() == undefined) {
        alert("먼저 지도를 클릭해서 좌표 설정을 진행해 주세요");
        return;
      }

      if (this.mapRadius === '' || this.mapRadius === undefined) {
        alert("반경을 선택해 주세요.");
        return;
      }

      if (this.baseMap === '' || this.baseMap === undefined) {
        alert("지도 종류를 선택해 주세요.");
        return;
      }

      if (this.company === '' || this.company === undefined) {
        alert("출력 회사를 선택해 주세요.");
        return;
      }

      if (this.inProgress) {
        alert("현재 작업이 진행중입니다.");
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

      if (this.company === "kakao" || this.company === "google") {
        this.proxyCapture();
      }
    },

    async makeTrace() {
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
      let addLayers = false;

      if (this.layers.length > 0) {
        addLayers = true;
        this.layerProfile.setLayer(this.layers);
      }

      let fileName = this.bunziAddress;

      if (this.onlyLayers) {
        let imageExtension = this.layerExtension;

        this.naverTile.drawLayers(this.coor, this.mapRadius, this.layerProfile, null, (layerCanvas) => {
          layerCanvas.toBlob((blob) => {
            this.mapDownloadLink = URL.createObjectURL(blob);

            if (imageExtension === "image/png") {
              this.onCaptureEnded(fileName, "png");
            } else {
              this.onCaptureEnded(fileName, "jpg");
            }

          }, imageExtension);
        });
      } else {
        this.naverTile.draw(this.coor, this.mapRadius, this.naverProfile, (canvas) => {
          if (addLayers) {
            this.naverTile.drawLayers(this.coor, this.mapRadius, this.layerProfile, canvas, (layerCanvas) => {
              layerCanvas.toBlob((blob) => {
                this.mapDownloadLink = URL.createObjectURL(blob);
                this.onCaptureEnded(fileName, "jpg");

              }, "image/jpeg");
            });
          } else {
            canvas.toBlob((blob) => {
              this.mapDownloadLink = URL.createObjectURL(blob);
              this.onCaptureEnded(fileName, "jpg");

            }, "image/jpeg");
          }

        });
      }
    },

    async proxyCapture() {
      this.progressBarValue = 0;
      this.progressBarMax = 100;

      this.progressBarLoading = true;
      let fileName = this.bunziAddress;
      let expectedEndTime = new Date();
      expectedEndTime.setSeconds(expectedEndTime.getSeconds() + 60);

      this.statusMessage = "지도 생성중 입니다. 예상 완료시간 -> " + expectedEndTime.toLocaleTimeString();

      this.proxyProfile.setRadius(this.mapRadius);
      this.proxyProfile.setLayerMode(this.layerMode);
      this.proxyProfile.setNoLabel(this.noLabel);


      let data = await requestImage(this.proxyProfile.getQueryString());

      this.progressBarLoading = false;


      if (data.length === 0) {
        this.proxyTileOnError();
        return;
      }

      this.mapDownloadLink = URL.createObjectURL(data);
      this.onCaptureEnded(fileName, "jpg");
    },

    async proxyTileOnError() {
      this.statusMessage = "서버 에러입니다. 잠시 후 다시 시도해주세요.";
      this.error = true;
      this.inProgress = false;
    },

    async onCaptureEnded(fileName, type) {
      this.mapDownloadName = "mapshot_" + fileName + "." + type;
      this.statusMessage = "완료되었습니다. 생성된 링크를 확인해 주세요";
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

      if(this.company !== "naver"){
        this.proxyProfile.setCompanyType(this.company);
      }

      if (this.company !== this.companyArr['카카오'] && this.layerMode) {
        this.layerMode = false;
      }

    },

    async changeMapStyle(mapStyle) {
      this.currentMapStyle = mapStyle;
      this.map.setMapTypeId(this.currentMapStyle);
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
