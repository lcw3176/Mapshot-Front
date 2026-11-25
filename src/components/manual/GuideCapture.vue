<template>
  <section class="guide">
    <h2>캡처해서 저장하기</h2>
    <p class="guide-lead">
      템플릿 탭에서 지도가 <strong>다 그려진 뒤</strong> 페이지 전체를 캡처하면 큰 이미지 한 장으로 저장돼요.
      아래 두 방법 중 편한 걸 쓰세요.
    </p>

    <h3>방법 1. 캡처 확장 프로그램</h3>
    <p>설치해 두면 버튼 한 번으로 페이지 전체가 저장돼요. 엣지·웨일 등 크롬 계열 브라우저에서도 쓸 수 있어요.</p>
    <div class="guide-tools">
      <div class="guide-tool">
        <span class="guide-tool-name">GoFullPage (BETA)</span>
        <p>
          화질이 좋고 사용법 자료가 많아 먼저 권해요. 정식 버전이 2026년 8월부터 웹 스토어에서 내려가 있어서,
          같은 개발사가 올려 둔 BETA 버전을 안내해 드려요. 기능은 같아요.
        </p>
        <v-btn :href="links.gofullpage" target="_blank" rel="noopener noreferrer"
               size="small" variant="tonal" color="success" prepend-icon="mdi-open-in-new">
          크롬 웹 스토어에서 설치
        </v-btn>
      </div>
      <div class="guide-tool">
        <span class="guide-tool-name">FireShot</span>
        <p>전체 페이지를 PNG·JPG·PDF 로 저장할 수 있어요. GoFullPage 가 잘 안 될 때 써 보세요.</p>
        <v-btn :href="links.fireshot" target="_blank" rel="noopener noreferrer"
               size="small" variant="tonal" color="success" prepend-icon="mdi-open-in-new">
          크롬 웹 스토어에서 설치
        </v-btn>
      </div>
    </div>
    <p>설치한 뒤 템플릿 탭에서 지도가 다 그려지면 확장 프로그램 아이콘을 눌러 저장하면 돼요.</p>

    <h3>방법 2. 크롬 내장 기능 (설치 없이)</h3>
    <ol>
      <li><span class="guide-kbd">F12</span> (맥은 <span class="guide-kbd">Cmd</span> + <span class="guide-kbd">Option</span> + <span class="guide-kbd">I</span>)로 개발자 도구를 열어요.</li>
      <li><span class="guide-kbd">Ctrl</span> + <span class="guide-kbd">Shift</span> + <span class="guide-kbd">P</span> (맥은 <span class="guide-kbd">Cmd</span> + <span class="guide-kbd">Shift</span> + <span class="guide-kbd">P</span>)를 눌러요.</li>
      <li><strong>screenshot</strong>을 입력하고 <strong>Capture full size screenshot</strong>을 골라요.</li>
      <li>전체 페이지가 PNG 파일로 다운로드 폴더에 저장돼요.</li>
    </ol>

    <p class="guide-warn">
      캡처한 이미지에 있는 지도 회사의 로고와 저작권 표시는 지우지 말아 주세요.
      생성된 화면을 저장하거나 캡처해 쓰는 것은 이용자 책임이며, 각 지도 회사의 이용 조건을 따라 주세요.
    </p>
  </section>
</template>

<script>
// 설치 링크는 FAQ(components/faq/HowToCapture.vue)와 같은 것을 쓴다. 바뀌면 두 곳을 같이 고친다.
export default {
  name: 'GuideCapture',
  data () {
    return {
      links: {
        gofullpage: 'https://chromewebstore.google.com/detail/kehafhfdnkhdgbnpeofmhmbibmpnjaof',
        fireshot: 'https://chromewebstore.google.com/detail/take-webpage-screenshots/mcbpblocgmgfnpjjppndjkmgjaogfceg',
      },
    }
  },
}
</script>
