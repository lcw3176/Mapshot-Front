<template>
  <section class="guide">
    <h2>도시소식 지도 <span class="guide-new">NEW</span></h2>
    <p class="guide-lead">
      국토교통부 보도자료를 대상 지역에 맞춰 지도 위에 보여드려요. 지금 보고 있는 동네에 어떤 사업·정책 소식이 있는지 바로 확인할 수 있어요.
    </p>

    <ol class="guide-steps">
      <li>
        <strong>켜기</strong>
        지도 왼쪽 패널의 <strong>도시소식 보기</strong>를 누르면 지역마다 <strong>지역명 + 건수</strong> 라벨이 나타나요.
        모바일에서는 지도 위 <strong>도시소식</strong> 버튼을 눌러요.
      </li>
      <li>
        <strong>기간 고르기</strong>
        최근 7일 · 30일 · 90일 중에서 골라요. 왼쪽 목록에는 지금 지도에 보이는 지역의 소식이 날짜별로 나와요.
      </li>
      <li>
        <strong>지역 고르기</strong>
        라벨을 누르면 그 지역 소식만 보여요. 다시 전체를 보려면 목록 위 <strong>전체 지역 보기</strong>를 눌러요.
        지도를 넓게 보면 시·도 단위로 묶이고, 확대하면 시·군·구 단위로 나뉘어요.
      </li>
      <li>
        <strong>소식 읽기</strong>
        소식을 누르면 핵심 내용이 펼쳐져요. <strong>도시뉴스에서 읽기</strong>를 누르면 새 탭에서 정리된 글을 볼 수 있고,
        <strong>원문</strong>은 국토교통부 원문으로, <strong>지도에서 보기</strong>는 그 지역으로 지도를 옮겨요.
      </li>
    </ol>

    <ul>
      <li>최근 사흘 안에 올라온 소식에는 노란 점이 붙어요.</li>
      <li>새 보도자료는 매시 정각에 확인해서 올려요.</li>
      <li>특정 지역이 없는 전국 단위 소식(제도·통계 등)은 지도 대신 도시뉴스의 <strong>보도자료 풀이</strong>에서 볼 수 있어요.</li>
    </ul>

    <p class="guide-note">
      라벨 위치는 시·군·구를 대표하는 대략적인 위치예요. 정확한 사업 위치는 원문을 확인해 주세요.
      도시소식을 켠 동안에는 지도를 클릭해도 캡처 범위가 바뀌지 않아요.
    </p>
  </section>
</template>

<script>
export default {
  name: 'GuideCityNewsMap',
}
</script>
