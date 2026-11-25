/* global kakao */

/**
 * 데스크톱에서는 왼쪽 패널(#menu_wrap)이 지도 위에 떠 있다. 어떤 지점을 지도 한가운데로 옮기면 패널 밑에 가려진다.
 * 패널 오른쪽에 남은 영역의 가운데에 target 이 오도록 하는 지도 중심 좌표를 돌려준다.
 * 모바일(패널이 아래 시트)이거나 패널이 없으면 target 그대로.
 *
 * @param map 카카오 지도 원본 객체(toRaw 한 것)
 * @param target kakao.maps.LatLng
 */
export function visibleCenterFor (map, target) {
  const panel = document.getElementById('menu_wrap')
  const container = document.getElementById('map')
  if (!panel || !container) return target
  const covered = panel.getBoundingClientRect().right - container.getBoundingClientRect().left
  if (covered <= 0) return target
  const proj = map.getProjection()
  const p = proj.containerPointFromCoords(target)
  return proj.coordsFromContainerPoint(new kakao.maps.Point(p.x - covered / 2, p.y))
}
