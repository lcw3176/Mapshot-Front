/* global kakao */

/**
 * 도시소식 마커(카카오 CustomOverlay) 관리.
 * 마커는 '지역명 + 건수' 라벨 하나. 핀 아이콘 대신 글자로 둔 건, 시군구 단위 대략 위치라
 * 정확한 지점을 가리키는 핀처럼 보이면 오해를 사기 때문이다.
 */
export function createPressOverlays (map, onSelect) {
  let overlays = []
  let pendingFrame = null

  function clear () {
    if (pendingFrame !== null) {
      cancelAnimationFrame(pendingFrame)
      pendingFrame = null
    }
    overlays.forEach(o => o.setMap(null))
    overlays = []
  }

  /**
   * 같은 순간에 여러 번 불려도(켤 때 + 데이터 도착 + 선택 변경) 다음 프레임에 한 번만 그린다.
   * 카카오가 아직 지도에 붙이는 중인 CustomOverlay 를 같은 틱에 setMap(null) 로 떼면 내부에 지도 없는
   * 오버레이가 남아, 드래그할 때마다 'Cannot read properties of null' 이 나며 지도가 움직이지 않았다.
   */
  function render (markers, selectedKey) {
    if (pendingFrame !== null) cancelAnimationFrame(pendingFrame)
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = null
      draw(markers, selectedKey)
    })
  }

  function draw (markers, selectedKey) {
    overlays.forEach(o => o.setMap(null))
    overlays = []
    for (const m of markers) {
      const el = document.createElement('button')
      el.type = 'button'
      el.className = 'press-marker' + (m.key === selectedKey ? ' is-selected' : '')
      el.setAttribute('aria-label', `${m.label} 소식 ${m.itemIds.length}건`)

      const name = document.createElement('span')
      name.className = 'press-marker__name'
      name.textContent = m.label
      const count = document.createElement('span')
      count.className = 'press-marker__count'
      count.textContent = m.itemIds.length

      el.append(name, count)
      // 지도 클릭(캡처 범위 지정)으로 번지지 않게 막는다
      el.addEventListener('click', e => {
        e.stopPropagation()
        onSelect(m)
      })
      el.addEventListener('mousedown', e => e.stopPropagation())
      el.addEventListener('touchstart', e => e.stopPropagation(), { passive: true })

      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(m.lat, m.lng),
        content: el,
        yAnchor: 0.5,
        xAnchor: 0.5,
        zIndex: m.key === selectedKey ? 4 : 3,
        clickable: true,
      })
      overlay.setMap(map)
      overlays.push(overlay)
    }
  }

  /** 지도 범위 안에 들어온 마커 key 목록 */
  function visibleKeys (markers) {
    const bounds = map.getBounds()
    return markers
      .filter(m => bounds.contain(new kakao.maps.LatLng(m.lat, m.lng)))
      .map(m => m.key)
  }

  return { render, clear, visibleKeys }
}
