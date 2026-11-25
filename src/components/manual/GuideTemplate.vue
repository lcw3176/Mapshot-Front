<template>
  <section class="guide">
    <h2>템플릿 만들기</h2>
    <p class="guide-lead">지도 화면에서 다섯 단계면 끝나요. 고른 설정은 브라우저에 저장돼 다음에 들어와도 그대로예요.</p>

    <ol class="guide-steps">
      <li>
        <strong>위치 찾기</strong>
        왼쪽 위 <em>장소 검색</em>에 주소나 장소 이름을 넣고 '검색하기'를 누르거나, 지도를 끌어서 원하는 곳으로 옮겨요.
      </li>
      <li>
        <strong>중심 지점 클릭</strong>
        지도를 <strong>왼쪽 클릭</strong>하면 그 지점이 이미지의 중심이 되고, <span class="pink">분홍색 사각형</span>으로 캡처될 범위가 표시돼요.
        지도 아래에 위도·경도와 주소도 나와요. 오른쪽 클릭하면 사각형이 지워져요.
      </li>
      <li>
        <strong>반경 고르기</strong>
        1km · 2km · 5km · 10km 중에서 골라요. 반경이 넓을수록 한 화면에 넓은 땅이 담기는 대신 세밀함은 줄어요
        (카카오 기준 1km는 1픽셀에 약 0.5m, 10km는 약 4m).
      </li>
      <li>
        <strong>지도 종류 · 출력 회사 고르기</strong>
        지도 종류는 <em>일반</em>(도로·기호 지도), <em>위성</em>(사진만), <em>하이브리드</em>(사진 + 지명) 중에서,
        출력 회사는 <em>네이버 · 카카오 · 구글</em> 중에서 골라요. 회사마다 위성 사진을 찍은 시기와 지명 표기가 달라요.
      </li>
      <li>
        <strong>템플릿 제작</strong>
        오른쪽 아래 초록색 <em>템플릿 제작</em> 버튼을 누르면 새 탭이 열리고 지도가 점점 커지며 그려져요.
        다 그려질 때까지 몇 초에서 수십 초가 걸려요. 다 그려지면 <em>캡처·저장</em> 탭의 방법으로 저장해 주세요.
      </li>
    </ol>

    <p class="guide-note">
      도시소식을 켜 둔 동안에는 지도를 클릭해도 캡처 범위가 바뀌지 않아요. 템플릿을 만들 땐 도시소식을 꺼 주세요.
    </p>
  </section>
</template>

<script>
export default {
  name: 'GuideTemplate',
}
</script>

<style scoped>
.pink {
  color: #d81b9c;
  font-weight: 700;
}
</style>
