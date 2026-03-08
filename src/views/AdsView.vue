<template>
  <v-container fluid class="ads-container pa-2">
    <!-- 반응형 디스플레이 광고 (데스크탑/모바일 모두) -->
    <v-row justify="center" class="my-1">
      <v-col cols="12" class="text-center pa-1">
        <Adsense
          adStyle="display:block"
          format="auto"
          :fullWidthResponsive="true"
          clientId="ca-pub-7390022674285155"
          slotId="6113438353"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Adsense } from 'vue3-google-adsense'

export default {
  name: 'AdsView',
  components: { Adsense },
}
</script>

<style scoped>
.ads-container {
  min-height: 100px;
}
</style>
