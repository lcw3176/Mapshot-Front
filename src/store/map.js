import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { LatLng, Radius } from '@/assets/js/mapshot.min'
import { captureCorners } from '@/assets/js/captureBounds'
import { usePressMapStore } from '@/store/pressMap'

const apiUrl = process.env.VUE_APP_API_URL
const MAP_SETTINGS_KEY = 'mapshot_map_settings'

const SAVEABLE_KEYS = ['baseMap', 'company', 'layers', 'layerMode', 'traceMode', 'noLabel', 'onlyLayers', 'addTopography']

/** 장소 검색 결과 번호 마커(파란 핀 + 흰 숫자) SVG data URI. 목록의 번호 표시(map.css .markerbg)와 같은 색 */
function numberedMarkerSrc (n) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">' +
    '<path d="M15 39C15 39 2 24.5 2 14.5a13 13 0 0 1 26 0C28 24.5 15 39 15 39z" fill="#1e88e5" stroke="#fff" stroke-width="2"/>' +
    '<text x="15" y="19" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#fff">' +
    n + '</text></svg>'
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
}

export const useMapStore = defineStore('map', {

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
    mapRadius: '',
    baseMap: '',
    company: '',
    layers: [],
    layerMode: false,
    traceMode: false,
    inProgress: false,
    noLabel: false,
    onlyLayers: false,
    addTopography: false,

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

  getters: {},

  actions: {
    async init () {

      let mapContainer = document.getElementById('map'),
        mapOption = {
          center: new kakao.maps.LatLng(37.56813070741759, 126.97899146359276),
          level: 7
        }

      // 카카오 객체는 markRaw 로 넣는다. Pinia 상태에 그냥 넣으면 반응형 프록시로 감싸져서, 카카오 내부 배열이
      // 프록시로 바뀌고 이벤트 처리 중 'Cannot read properties of null' 이 난다(도시소식을 켜고 드래그하면
      // 지도가 안 움직였다). 지도 객체는 바뀌는지 추적할 필요가 없으니 반응성을 끈다.
      this.map = markRaw(new kakao.maps.Map(mapContainer, mapOption))
      this.geocoder = new kakao.maps.services.Geocoder()
      this.markers = []
      this.ps = new kakao.maps.services.Places()
      this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 })

      this.coor = new LatLng()
      this.mapRadius = Radius.Two
      this.baseMap = ''

      this.currentMapStyle = this.baseMapStyles['일반']

      // 기본값 할당 이후에 저장된 값으로 덮어씀
      this.loadSettings()

      // 설정 변경 시 자동 저장 (loadSettings 이후 등록)
      this.$subscribe((mutation, state) => {
        this.saveSettings()
      })
    },

    saveSettings () {
      const radiusKey = Object.entries(this.radiusArr).find(([, v]) => v === this.mapRadius)?.[0] ?? null
      const data = { mapRadiusKey: radiusKey }
      SAVEABLE_KEYS.forEach(k => { data[k] = this[k] })
      localStorage.setItem(MAP_SETTINGS_KEY, JSON.stringify(data))
    },

    loadSettings () {
      try {
        const raw = localStorage.getItem(MAP_SETTINGS_KEY)
        if (!raw) return
        const saved = JSON.parse(raw)

        if (saved.mapRadiusKey != null && this.radiusArr[saved.mapRadiusKey]) {
          this.mapRadius = this.radiusArr[saved.mapRadiusKey]
        }

        SAVEABLE_KEYS.forEach(k => {
          if (saved[k] !== undefined) this[k] = saved[k]
        })
      } catch {
        // 저장된 값이 손상된 경우 무시
      }
    },

    async addListeners () {
      this.map.addListener('click', this.mapOnClick)
      this.map.addListener('rightclick', this.removeRectangle)
    },

    async removeListeners () {
      this.map.removeListener('click', this.mapOnClick)
      this.map.removeListener('rightclick', this.removeRectangle)
    },

    async startCapture () {
      if (!this.rectangle) {
        alert('먼저 지도에서 캡처 범위를 선택해 주세요.')
        return
      }

      if (this.isEmpty(this.coor.getX()) || this.isEmpty(this.coor.getY())) {
        alert('먼저 지도를 클릭해서 좌표 설정을 진행해 주세요')
        return
      }

      if (this.isEmpty(this.mapRadius)) {
        alert('반경을 선택해 주세요.')
        return
      }

      if (this.isEmpty(this.baseMap)) {
        alert('지도 종류를 선택해 주세요.')
        return
      }

      if (this.isEmpty(this.company) && !this.onlyLayers) {
        alert('출력 회사를 선택해 주세요.')
        return
      }

      if (this.onlyLayers && this.isEmpty(this.layers)) {
        alert('레이어를 선택해 주세요')
        return
      }

      if (this.traceMode) {
        await this.makeTrace()
      }

      if (this.onlyLayers) {
        await this.makeLayerTemplate()
        return
      }

      if (this.company === 'kakao') {
        await this.makeKakaoTemplate()
      } else if (this.company === 'google') {
        await this.makeGoogleTemplate()
      } else if (this.company === 'naver') {
        await this.makeNaverTemplate()
      }

    },

    async makeKakaoTemplate () {

      let layer = this.layers.join(',')
      let centerLat = this.coor.getY()
      let centerLng = this.coor.getX()

      const params = new URLSearchParams({
        lat: centerLat,
        lng: centerLng,
        level: this.mapRadius.level,
        type: this.baseMap,
        layerMode: this.layerMode,
        topography: this.addTopography,
        layer: layer
      })

      const newWindow = window.open(apiUrl + '/map/' + this.company + '?' + params.toString())

      if (!newWindow) {
        alert('새 창을 열 수 없습니다. 팝업이 차단되었을 수 있습니다.')
      }
    },

    async makeNaverTemplate () {

      let layer = this.layers.join(',')
      let centerLat = this.coor.getY()
      let centerLng = this.coor.getX()

      const params = new URLSearchParams({
        lat: centerLat,
        lng: centerLng,
        level: this.mapRadius.level,
        type: this.baseMap,
        topography: this.addTopography,
        layer: layer
      })

      const newWindow = window.open(apiUrl + '/map/' + this.company + '?' + params.toString())

      if (!newWindow) {
        alert('새 창을 열 수 없습니다. 팝업이 차단되었을 수 있습니다.')
      }
    },

    async makeGoogleTemplate () {

      let layer = this.layers.join(',')
      let centerLat = this.coor.getY()
      let centerLng = this.coor.getX()

      const params = new URLSearchParams({
        lat: centerLat,
        lng: centerLng,
        level: this.mapRadius.level,
        type: this.baseMap,
        noLabel: this.noLabel,
        topography: this.addTopography,
        layer: layer
      })

      const newWindow = window.open(apiUrl + '/map/' + this.company + '?' + params.toString())

      if (!newWindow) {
        alert('새 창을 열 수 없습니다. 팝업이 차단되었을 수 있습니다.')
      }
    },

    async makeLayerTemplate () {
      let layer = this.layers.join(',')
      let centerLat = this.coor.getY()
      let centerLng = this.coor.getX()

      const params = new URLSearchParams({
        lat: centerLat,
        lng: centerLng,
        level: this.mapRadius.level,
        type: this.baseMap,
        layerMode: this.layerMode,
        topography: this.addTopography,
        layer: layer
      })

      const newWindow = window.open(apiUrl + '/map/layer?' + params.toString())

      if (!newWindow) {
        alert('새 창을 열 수 없습니다. 팝업이 차단되었을 수 있습니다.')
      }
    },

    async makeTrace () {
      let traceRec = new kakao.maps.Polygon({
        path: this.rectangle.getPath(),
        strokeWeight: 4,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeStyle: 'shortdot',
        fillColor: '#ecf4f3',
        fillOpacity: 0.8
      })
      traceRec.setMap(this.map)
    },

    async removeRectangle () {
      if (this.rectangle != null) {
        this.rectangle.setMap(null)
        this.rectangle = null
      }
    },

    async mapOnClick (mouseEvent) {
      // 도시소식을 보는 동안에는 지도 클릭이 캡처 범위(분홍 사각형)를 잡지 않게 한다.
      // 라벨을 누르거나 지도를 옮기다 실수로 클릭해도 범위가 바뀌지 않아야 소식 보기에 집중할 수 있다.
      if (usePressMapStore().enabled) {
        return
      }

      // 클릭한 위도, 경도 정보를 가져옵니다
      let latlng = mouseEvent.latLng

      this.lat = latlng.getLat()
      this.lng = latlng.getLng()

      this.searchDetailAddrFromCoords(mouseEvent.latLng, this.insertAddressStr)

      this.coor.init(this.lat, this.lng)

      this.drawCaptureArea()
    },

    // 분홍 사각형 = 출력될 땅 범위(captureBounds.js). 반경이 바뀌면 다시 그린다.
    // 미리보기 지도(카카오 TM)에서 반듯한 사각형이 되도록 Rectangle(위경도 사각형) 대신 Polygon 으로 그린다.
    drawCaptureArea () {
      this.removeRectangle()

      if (this.isEmpty(this.lat) || this.isEmpty(this.lng) || this.isEmpty(this.mapRadius)) {
        return
      }

      const corners = captureCorners(this.mapRadius.level, this.lat, this.lng)
      if (!corners) {
        return
      }

      this.rectangle = new kakao.maps.Polygon({
        path: corners.map(([lat, lng]) => new kakao.maps.LatLng(lat, lng)),
        strokeWeight: 4,
        strokeColor: '#FF3DE5',
        strokeOpacity: 1,
        strokeStyle: 'shortdashdot',
        fillColor: '#FF8AEF',
        fillOpacity: 0.8
      })

      this.rectangle.setMap(this.map)
    },

    // 설정이 바뀌면 이미 잡아 둔 범위만 다시 그린다(우클릭으로 지운 범위를 되살리지 않게).
    redrawCaptureArea () {
      if (this.rectangle) {
        this.drawCaptureArea()
      }
    },

    async insertAddressStr (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        this.roadAddress = !!result[0].road_address ? result[0].road_address.address_name : ''
        this.bunziAddress = result[0].address.address_name
      }
    },

    async changeRadius (rad, event) {
      this.mapRadius = rad
      this.redrawCaptureArea()
    },

    async changeBaseMap (map, event) {
      this.baseMap = map
    },

    async changeCompany (company, event) {
      this.company = company
    },

    async changeMapStyle (mapStyle) {
      this.currentMapStyle = mapStyle
      this.map.setMapTypeId(this.currentMapStyle)
    },

    isEmpty (input) {
      return typeof input === 'undefined' ||
        input === null ||
        input === '' ||
        input === 'null' ||
        input.length === 0 ||
        (typeof input === 'object' && !Object.keys(input).length)
    },

    // 이하 카카오 지도 api 문서 코드
    placesSearchCB (data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {

        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        this.displayPlaces(data)

        // 페이지 번호를 표출합니다
        this.displayPagination(pagination)

      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.')
        return

      } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.')
        return

      }
    },

    displayPlaces (places) {

      let listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds()

      // 검색 결과 목록에 추가된 항목들을 제거합니다
      this.removeAllChildNods(listEl)

      // 지도에 표시되고 있는 마커를 제거합니다
      this.removeMarker()

      for (let i = 0; i < places.length; i++) {

        // 마커를 생성하고 지도에 표시합니다
        let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
          marker = this.addMarker(placePosition, i),
          itemEl = this.getListItem(i, places[i]) // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition)

        fragment.appendChild(itemEl)
      }

      // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
      listEl.appendChild(fragment)
      menuEl.scrollTop = 0

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      this.map.setBounds(bounds)
    },

    getListItem (index, places) {

      var el = document.createElement('li'),
        itemStr = '<img class="markerbg" alt="" src="' + numberedMarkerSrc(index + 1) + '">' +
          '<div class="info">' +
          '   <h5>' + places.place_name + '</h5>'

      if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
          '   <span class="jibun gray">' + places.address_name + '</span>'
      } else {
        itemStr += '    <span>' + places.address_name + '</span>'
      }

      itemStr += '  <span class="tel">' + places.phone + '</span>' +
        '</div>'

      el.innerHTML = itemStr
      el.className = 'item'

      return el
    },

    addMarker (position, idx, title) {
      // 예전엔 카카오 공식 장소 검색 예제의 번호 마커 스프라이트(t1.daumcdn.net/.../marker_number_blue.png)를 썼다.
      // 2026-11 카카오가 SDK 외 리소스 직접 호출·저장을 제한한다고 공지해서, 예제 이미지도 쓰지 않고 직접 그린 SVG 로 바꿨다.
      const markerImage = new kakao.maps.MarkerImage(
          numberedMarkerSrc(idx + 1),
          new kakao.maps.Size(30, 40),
          { offset: new kakao.maps.Point(15, 40) } // 핀 끝이 좌표에 오게
        ),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage
        })

      marker.setMap(this.map) // 지도 위에 마커를 표출합니다
      this.markers.push(marker)  // 배열에 생성된 마커를 추가합니다

      return marker
    },

    searchPlaces () {

      let keyword = document.getElementById('keyword').value

      if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!')
        return false
      }

      this.ps.keywordSearch(keyword, this.placesSearchCB)
    },

    removeAllChildNods (el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild)
      }
    },

    displayInfowindow (marker, title) {
      var content = '<div style="padding:5px;z-index:1;">' + title + '</div>'

      infowindow.setContent(content)
      infowindow.open(map, marker)
    },

    displayPagination (pagination) {
      var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i

      // 기존에 추가된 페이지번호를 삭제합니다
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild)
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a')
        el.href = '#'
        el.innerHTML = i

        if (i === pagination.current) {
          el.className = 'on'
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i)
            }
          })(i)
        }

        fragment.appendChild(el)
      }
      paginationEl.appendChild(fragment)
    },

    removeMarker () {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null)
      }
      this.markers = []
    },

    searchAddrFromCoords (coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      this.geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)
    },

    searchDetailAddrFromCoords (coords, callback) {
      // 좌표로 법정동 상세 주소 정보를 요청합니다
      this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback)
    },

  }
})
