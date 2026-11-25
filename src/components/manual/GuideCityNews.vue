<template>
  <section class="guide">
    <h2>도시뉴스</h2>
    <p class="guide-lead">상단 메뉴의 <em>도시뉴스</em>에서 두 가지 글을 볼 수 있어요.</p>

    <h3>브리핑</h3>
    <p>
      매일 오전, 도시공학·도시계획 관련 뉴스를 모아 AI가 한 편으로 요약해요. 분야별로 묶어서 보여주고,
      요약에 쓴 기사는 출처 링크로 바로 확인할 수 있어요.
    </p>

    <h3>보도자료 풀이 <span class="guide-new">NEW</span></h3>
    <p>
      국토교통부 보도자료를 한 건씩 <strong>요약 · 핵심 · 대상 지역 · 일정</strong>으로 정리해요.
      길고 어려운 보도자료 원문(PDF)을 다 읽지 않아도 무슨 내용인지 바로 알 수 있어요.
    </p>
    <ul>
      <li>대상 지역이 있는 소식은 <em>맵샷 지도에서 ○○ 보기</em>로 그 지역을 지도에서 바로 열 수 있어요.</li>
      <li>글 아래 <em>원문 보기</em>로 국토교통부 원문을 확인할 수 있어요.</li>
    </ul>

    <p class="guide-warn">
      도시뉴스의 글은 AI가 원문을 바탕으로 정리한 거라 틀린 부분이 있을 수 있어요. 숫자·날짜 같은 중요한 내용은 원문을 기준으로 확인해 주세요.
    </p>
  </section>
</template>

<script>
export default {
  name: 'GuideCityNews',
}
</script>
