/**
 * 미리보기(분홍) 사각형 계산. 서버 템플릿(mapshot-api src/main/resources/templates/*.html)의 줌·캔버스 크기와 짝이다.
 * 템플릿의 줌·크기를 바꾸면 여기 SPEC 도 같이 바꾼다.
 *
 * - 한 변 길이: 세 회사 모두 같다. 네이버·구글(웹 메르카토르)의 땅 길이에 카카오 캔버스를 맞춰 두었다
 *   (kakao.html 의 1.19432 * cos(위도)).
 * - 모양: 미리보기 지도(카카오) 화면에 반듯한 정사각형으로 그린다. 카카오 출력과는 정확히 같다.
 *   네이버·구글 출력은 화면 위가 진북이라, 카카오 TM 화면(중앙경선 127°E)에 옮기면 동쪽에서 조금 기운다
 *   (부산·강릉 약 1.2°, 울릉 약 2.4°). 기운 칸이 더 어색하다고 판단해(2026-11-26) 반듯하게 그리고 이 차이는 감수한다.
 *   그 대신 동쪽 지역 네이버·구글 칸은 모서리가 조금 어긋난다(울릉 10km 약 560m, 1km 약 70m).
 *
 * 예전에는 mapshot.min.js 의 Tile 이 고정 위경도 폭을 써서 실제 출력과 2~10% 어긋났다(2026-11-25 실측).
 */

const SPEC = {
  1: { mercatorZoom: 18, goalWidth: 5000 },
  2: { mercatorZoom: 17, goalWidth: 4000 },
  5: { mercatorZoom: 16, goalWidth: 5000 },
  10: { mercatorZoom: 15, goalWidth: 5000 },
}

const DEG = Math.PI / 180

// 웹 메르카토르 기준 출력 한 변의 땅 길이(m). 템플릿의 1.19432 * cos(위도) 와 같은 값이다.
function sideMeters (spec, lat) {
  return spec.goalWidth * 156543.03392804097 * Math.cos(lat * DEG) / Math.pow(2, spec.mercatorZoom)
}

// ---- 카카오 TM(EPSG:5181: GRS80, 중앙경선 127°E, 원점위도 38°N, k=1) 변환. Snyder, Map Projections (1987) 8장 ----
// 카카오 SDK 의 좌표 변환(containerPointFromCoords)은 화면 정수 픽셀로 반올림돼 미리보기 레벨에서 수십 m 씩 틀어진다.
// 그래서 직접 계산한다. 단위는 m(카카오 내부 WCONGNAMUL 은 이 값의 2.5배라 비율만 쓰는 여기선 상관없다).
const A = 6378137
const F = 1 / 298.257222101
const E2 = F * (2 - F)
const EP2 = E2 / (1 - E2)
const LON0 = 127 * DEG
const LAT0 = 38 * DEG

function meridianArc (phi) {
  const e4 = E2 * E2
  const e6 = e4 * E2
  return A * ((1 - E2 / 4 - 3 * e4 / 64 - 5 * e6 / 256) * phi -
    (3 * E2 / 8 + 3 * e4 / 32 + 45 * e6 / 1024) * Math.sin(2 * phi) +
    (15 * e4 / 256 + 45 * e6 / 1024) * Math.sin(4 * phi) -
    (35 * e6 / 3072) * Math.sin(6 * phi))
}
const M0 = meridianArc(LAT0)

function tmForward (lat, lng) {
  const phi = lat * DEG
  const sin = Math.sin(phi)
  const cos = Math.cos(phi)
  const t = Math.tan(phi) ** 2
  const c = EP2 * cos * cos
  const a = (lng * DEG - LON0) * cos
  const n = A / Math.sqrt(1 - E2 * sin * sin)
  const x = n * (a + (1 - t + c) * a ** 3 / 6 + (5 - 18 * t + t * t + 72 * c - 58 * EP2) * a ** 5 / 120)
  const y = meridianArc(phi) - M0 + n * Math.tan(phi) * (a * a / 2 + (5 - t + 9 * c + 4 * c * c) * a ** 4 / 24 +
    (61 - 58 * t + t * t + 600 * c - 330 * EP2) * a ** 6 / 720)
  return [x, y]
}

function tmInverse (x, y) {
  const m = M0 + y
  const mu = m / (A * (1 - E2 / 4 - 3 * E2 * E2 / 64 - 5 * E2 ** 3 / 256))
  const e1 = (1 - Math.sqrt(1 - E2)) / (1 + Math.sqrt(1 - E2))
  const phi1 = mu + (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu) +
    (21 * e1 * e1 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu) +
    (151 * e1 ** 3 / 96) * Math.sin(6 * mu) + (1097 * e1 ** 4 / 512) * Math.sin(8 * mu)
  const sin = Math.sin(phi1)
  const cos = Math.cos(phi1)
  const c1 = EP2 * cos * cos
  const t1 = Math.tan(phi1) ** 2
  const n1 = A / Math.sqrt(1 - E2 * sin * sin)
  const r1 = A * (1 - E2) / Math.pow(1 - E2 * sin * sin, 1.5)
  const d = x / n1
  const lat = phi1 - (n1 * Math.tan(phi1) / r1) * (d * d / 2 - (5 + 3 * t1 + 10 * c1 - 4 * c1 * c1 - 9 * EP2) * d ** 4 / 24 +
    (61 + 90 * t1 + 298 * c1 + 45 * t1 * t1 - 252 * EP2 - 3 * c1 * c1) * d ** 6 / 720)
  const lng = LON0 + (d - (1 + 2 * t1 + c1) * d ** 3 / 6 +
    (5 - 2 * c1 + 28 * t1 - 3 * c1 * c1 + 8 * EP2 + 24 * t1 * t1) * d ** 5 / 120) / cos
  return [lat / DEG, lng / DEG]
}

// TM 평면에서 중심 ± 반 변인 정사각형 = 카카오 화면에서 반듯한 사각형.
function kakaoCorners (spec, lat, lng) {
  const [x, y] = tmForward(lat, lng)
  const h = sideMeters(spec, lat) / 2
  return [tmInverse(x - h, y + h), tmInverse(x + h, y + h), tmInverse(x + h, y - h), tmInverse(x - h, y - h)]
}

/**
 * 미리보기 칸의 네 모서리(북서, 북동, 남동, 남서 순, [lat, lng])를 돌려준다.
 * @param {number} radiusLevel Radius.level (1 | 2 | 5 | 10)
 */
export function captureCorners (radiusLevel, lat, lng) {
  const spec = SPEC[radiusLevel]
  if (!spec || !Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return kakaoCorners(spec, lat, lng)
}
