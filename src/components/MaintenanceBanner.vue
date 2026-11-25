<template>
  <v-alert
    v-if="visible"
    type="warning"
    variant="tonal"
    density="compact"
    rounded="0"
    closable
    class="maintenance-banner"
    @click:close="dismiss"
  >
    <div class="maintenance-banner__text">{{ message }}</div>
  </v-alert>
</template>

<script>
// 서버 점검/순단 예고 배너.
//
// 왜 API가 아니라 빌드 환경변수로 켜나:
//   알려야 하는 상황 자체가 "API가 죽는 시간"이라, 배너 문구를 API에서 받아오면
//   정작 필요할 때 안 뜬다. 프론트(Cloudflare Pages) 환경변수만으로 켜고 끈다.
//
//   VUE_APP_MAINTENANCE_MESSAGE  배너 문구. 비어 있으면 배너 없음.
//   VUE_APP_MAINTENANCE_END      (선택) ISO 시각, 예) 2026-11-27T02:00:00+09:00
//                                이 시각이 지나면 재배포 없이 자동으로 숨는다.
//                                점검 끝나고 환경변수 지우는 걸 잊어도 배너가 남지 않게.
//
// 닫기(X)는 같은 문구에 대해 이 탭 세션 동안만 기억한다(sessionStorage).
// 문구가 바뀌면 다시 뜬다.
const MESSAGE = (process.env.VUE_APP_MAINTENANCE_MESSAGE || '').trim()
const END = process.env.VUE_APP_MAINTENANCE_END || ''
const STORAGE_KEY = 'maintenance-banner-dismissed'

function isExpired () {
  if (!END) return false
  const end = new Date(END).getTime()
  // 날짜 형식이 잘못됐으면 숨기지 않고 보여준다(알림 누락보다 낫다).
  return !Number.isNaN(end) && Date.now() > end
}

function wasDismissed () {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === MESSAGE
  } catch (e) {
    return false
  }
}

export default {
  name: 'MaintenanceBanner',

  data () {
    return {
      message: MESSAGE,
      visible: MESSAGE !== '' && !isExpired() && !wasDismissed(),
    }
  },

  methods: {
    dismiss () {
      this.visible = false
      try {
        sessionStorage.setItem(STORAGE_KEY, MESSAGE)
      } catch (e) {
        // 저장 못 해도 이번 화면에선 닫힌 상태 유지
      }
    },
  },
}
</script>

<style scoped>
.maintenance-banner__text {
  white-space: pre-line;
  word-break: keep-all;
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
