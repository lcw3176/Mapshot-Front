<template>
  <section class="guide">
    <h2>부가 설정</h2>
    <p class="guide-lead">오른쪽 패널 맨 아래 <strong>부가 설정</strong>을 펼치면 나와요. 필요한 것만 켜서 쓰세요.</p>

    <h3>도시 계획 레이어</h3>
    <p>
      <strong>도시 계획 레이어</strong>를 누르면 <strong>도로 · 토지이용계획도 · 연속지적도</strong> 중에서 덧입힐 레이어를 고를 수 있어요.
      브이월드(공간정보 오픈플랫폼)가 제공하는 정보를 써요.
    </p>
    <ul>
      <li><strong>레이어만 출력</strong>: 지도 사진 없이 고른 레이어만으로 이미지를 만들어요.</li>
      <li><strong>지형도 덧입히기</strong>: 지형(등고선 음영)을 함께 덧입혀요.</li>
    </ul>

    <h3>흔적 남기기</h3>
    <p>템플릿을 만든 위치를 지도 위에 흰 사각형으로 표시해 둬요. 어디까지 만들었는지 확인할 때 좋아요. 다른 정보는 저장하지 않아요.</p>

    <h3>회사별 옵션</h3>
    <table class="guide-table">
      <thead>
        <tr><th>회사</th><th>옵션</th><th>설명</th></tr>
      </thead>
      <tbody>
        <tr><td>카카오</td><td>지적 편집도</td><td>지적 편집도를 덧입혀서 불러와요.</td></tr>
        <tr><td>구글</td><td>명칭 없애기</td><td>지도에 표시되는 지명·상호를 빼고 그려요.</td></tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: 'GuideOptions',
}
</script>
