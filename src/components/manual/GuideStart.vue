<template>
  <section class="guide">
    <h2>맵샷은 이런 서비스예요</h2>
    <p class="guide-lead">
      도시계획·토목 계획도의 배경으로 쓸 큰 지도(위성·일반)를 한 번에 만들어 드려요.
      원하는 지점과 반경을 고르면 지도를 크게 펼친 '템플릿' 화면을 열어 드리고, 그 화면을 캡처해서 저장하시면 돼요.
    </p>

    <h3>이용 환경</h3>
    <p>큰 지도를 캡처하는 서비스라 <strong>PC(데스크톱)</strong>에서 쓰시는 걸 권해요. 모바일에서도 열리지만 캡처가 어려워요.</p>
    <table class="guide-table">
      <thead>
        <tr><th>브라우저</th><th>지원</th></tr>
      </thead>
      <tbody>
        <tr v-for="b in browsers" :key="b.name">
          <td>{{ b.name }}</td>
          <td>
            <v-chip size="small" :color="b.ok ? 'info' : 'error'" variant="tonal">{{ b.ok ? '지원' : '미지원' }}</v-chip>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>메뉴 한눈에 보기</h3>
    <ul>
      <li><strong>지도(홈)</strong>: 템플릿을 만들고, 도시소식을 지도에서 봐요.</li>
      <li><strong>도시뉴스</strong>: 매일 브리핑과 국토교통부 보도자료 풀이를 읽어요.</li>
      <li><strong>공지사항 · 문의 · FAQ</strong>: 서비스 소식, 문의 남기기, 자주 묻는 질문이에요.</li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'GuideStart',
  data () {
    return {
      browsers: [
        { name: '구글 크롬', ok: true },
        { name: '마이크로소프트 엣지', ok: true },
        { name: '파이어폭스', ok: true },
        { name: '삼성 모바일 인터넷', ok: true },
        { name: '인터넷 익스플로러', ok: false },
        { name: '사파리 모바일', ok: false },
      ],
    }
  },
}
</script>
