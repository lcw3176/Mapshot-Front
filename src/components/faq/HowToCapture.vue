<!--
  캡쳐 확장 프로그램 링크 관리 메모 (2026-09-02)

  - 원래 1순위였던 GoFullPage(fdpohaocaechififmbbbbbknoalclacl)는 2026-08-11 저작권 이슈로
    크롬 웹 스토어에서 내려갔고, 기존 링크는 "empty-title" 빈 페이지로 리다이렉트됩니다.
    보안 문제는 아니며 개발사(Full Page LLC)가 복구 중이지만 시점은 미정입니다.
    그동안 같은 개발사가 올린 "GoFullPage BETA"(kehafhfdnkhdgbnpeofmhmbibmpnjaof)로 대체했습니다.
    → 정식 복구되면 BETA 링크를 원래 ID로 되돌리면 됩니다. (blog.gofullpage.com 참고)
  - FireShot(mcbpblocgmgfnpjjppndjkmgjaogfceg)은 정상 운영 중이라 그대로 두었습니다.
  - 스토어 리스팅은 언제든 내려갈 수 있어서, 설치가 필요 없는 크롬 내장 방법을 예비로 같이 안내합니다.
-->
<template>
  <v-card elevation="0">
    <v-card-title class="text-h5">캡쳐는 어떻게 하나요?</v-card-title>

    <br>
    <p>
      '크롬 웹 스토어'에 접속하시면 여러가지 캡쳐 관련 확장 프로그램들이 존재하는데요,
      반드시 크롬 브라우저가 아니어도 엣지, 웨일 등 대부분의 브라우저에서 사용 가능합니다.
    </p>

    <br>
    <p>
      대표적으로 2가지 프로그램을 추천드리는데요,
      GoFullPage 라는 프로그램과 FireShot 이라는 프로그램을 추천드립니다. 링크는 다음과 같습니다.
    </p>

    <br>
    <p>
      GoFullPage (BETA)
      - <a href="https://chromewebstore.google.com/detail/kehafhfdnkhdgbnpeofmhmbibmpnjaof" target="_blank" rel="noopener">
      https://chromewebstore.google.com/detail/kehafhfdnkhdgbnpeofmhmbibmpnjaof
    </a>
    </p>
    <p class="text-caption text-medium-emphasis">
      기존에 안내드리던 GoFullPage 정식 버전은 2026년 8월부터 크롬 웹 스토어에서 일시적으로 내려간 상태입니다.
      위 링크는 같은 개발사가 그 사이 이용하실 수 있도록 올려둔 BETA 버전으로, 기능은 동일합니다.
    </p>

    <br>
    <p>
      FireShot
      - <a href="https://chromewebstore.google.com/detail/take-webpage-screenshots/mcbpblocgmgfnpjjppndjkmgjaogfceg" target="_blank" rel="noopener">
      https://chromewebstore.google.com/detail/take-webpage-screenshots/mcbpblocgmgfnpjjppndjkmgjaogfceg
    </a>
    </p>
    <br>
    <p>
      해당 프로그램들을 이용하시면 jpg, png 등의 확장자로 웹 페이지를 고화질로 캡쳐하실 수 있습니다.
      템플릿 제작 버튼 누르시고 지도 타일 로딩이 전부 완료된 후, 위의 프로그램들을 이용해서 페이지 전체 캡쳐를 진행하시면 예전처럼 큰 사진을 만드실 수 있을 거에요.
      화질은 첫 번째로 추천 드린 프로그램이 조금 더 우수합니다. 그리고 참조할만한 레퍼런스도 첫 번째 프로그램이 훨씬 많아서, 되도록이면 첫 번째 프로그램 사용을 추천드려요.
    </p>

    <br>
    <p>
      확장 프로그램 설치가 어려우시다면, 크롬에 기본으로 들어있는 전체 페이지 캡쳐 기능을 이용하셔도 됩니다.
      지도 타일 로딩이 끝난 뒤 아래 순서대로 진행해 주세요.
    </p>
    <ol class="pl-6">
      <li>키보드에서 <b>F12</b> (맥은 <b>Cmd + Option + I</b>)를 눌러 개발자 도구를 엽니다.</li>
      <li>이어서 <b>Ctrl + Shift + P</b> (맥은 <b>Cmd + Shift + P</b>)를 누릅니다.</li>
      <li>입력창에 <b>screenshot</b> 이라고 치면 나오는 항목 중 <b>Capture full size screenshot</b> 을 선택합니다.</li>
      <li>전체 페이지가 png 파일로 다운로드 폴더에 저장됩니다.</li>
    </ol>


  </v-card>
</template>

<script>

export default {
  name: 'HowToCapture',

  data () {
    return {}
  }
}
</script>
