<template>
  <ins class="adsbygoogle"
       :style="{ display: 'inline-block', width: width + 'px', height: height + 'px' }"
       :data-ad-client="clientId"
       :data-ad-slot="slotId"></ins>
</template>

<script>
// 고정 크기 디스플레이 광고 슬롯.
//
// vue3-google-adsense 의 <Adsense> 를 쓰지 않는 이유:
//  - 마운트될 때마다 adsbygoogle.js 를 <script> 로 다시 꽂는다 (index.html 에서 이미 로드함)
//  - push() 를 템플릿 안 <script> 로 실행해서 언제 실행됐는지 제어가 안 된다
// 여기서는 <ins> 하나만 그리고 mounted 에서 한 번만 push 한다.
//
// 주의 (애드센스 정책):
//  - 같은 <ins> 에 push 를 두 번 하면 에러가 난다. 마운트 1회 = 새 <ins> 1개 = push 1회.
//    그래서 숨겼다 보였다 하는 곳은 v-if 가 아니라 v-show 로 감싼다 (재마운트 = 새 광고 요청).
//  - 일정 시간마다 광고를 다시 불러오는(자동 새로고침) 코드는 금지. 넣지 말 것.
//  - 크기는 애드센스의 "고정" 단위라 코드 쪽 width/height 로 정한다.
//    (300x600 단위를 좁은 화면에서 300x250 으로 내려 쓰는 게 허용됨)
export default {
  name: 'AdSlot',
  props: {
    slotId: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  data () {
    return {
      clientId: 'ca-pub-7390022674285155',
    }
  },
  mounted () {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      // 광고 차단기 등으로 실패해도 화면은 그대로 둔다
    }
  },
}
</script>
