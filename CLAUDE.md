# Mapshot-Front 작업 가이드

기획·결정·공통 규칙은 이 레포에 두지 않는다. **[mapshot-planning](https://github.com/lcw3176/mapshot-planning)** 에 있다.

## 작업 순서

1. 시작 전에 mapshot-planning 에서 확인한다.
   - `rules/common-rules.md`: 두 레포 공통 규칙(광고 정책, 외부 데이터, 위치정보 등)
   - `architecture/overview.md`: 전체 구성
   - `plans/<기획 폴더>/`: 지금 하는 기능의 기획서. 없으면 새 기능은 기획 폴더부터 만든다.
2. 이 레포에서는 코드만 고친다. 기획서·결정 기록·설계 메모를 `docs/` 나 루트에 새로 만들지 않는다.
3. 작업하면서 무언가를 정했으면 mapshot-planning 에 남긴다.
   - 그 기획 안의 결정이면 `plans/<기획>/README.md` 의 '결정' 절
   - 다른 기획에도 영향을 주면 `decisions/YYYY-MM-DD-주제.md`
4. PR 본문에는 무엇을 왜 바꿨는지와 화면을 쓰고, 상세 기획은 mapshot-planning 링크로 건다.

## 이 레포에서 알아둘 것

- 브랜치: `feat/*` → `master`
- 로컬 실행: `npm run serve` (8081). `/map`, `/news`, `/notice`, `/post`, `/admin` 은 `localhost:8080`(API)로 프록시된다(`vue.config.js`).
- `public/index.html` 에 전역 `* { font-size: calc(1rem * var(--scale-factor)) }` 규칙이 있어 글자 크기가 상속되지 않는다. 컴포넌트에서 글자 요소마다 크기를 직접 준다.
- 카카오맵 오버레이처럼 `#map` 안에 그려지는 요소는 scoped 스타일이 닿지 않는다. `src/assets/css/map.css` 에 `.map_wrap #map ...` 접두로 쓴다.
- 광고(`AdSlot`)는 숨겼다 보였다 할 때 `v-if` 가 아니라 `v-show` 로 감싼다. 이유는 `AdSlot.vue` 주석과 공통 규칙 참고.
