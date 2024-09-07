<template>
  <v-card elevation="0">

    <v-card-title class="text-h5">
      결과 출력
    </v-card-title>

    <v-card elevation="0">
      <v-img :src="start"></v-img>
    </v-card>

    <v-card-text>
      다양한 부가 설정과 함께 최종 이미지 템플릿을 선택할 수 있습니다. 작업 시작 버튼을 누르면 설정된 값들을 토대로 지도 템플릿을 제작해줍니다.
    </v-card-text>
    <v-card-text>
      본 서비스는 위성 지도 이미지의 템플릿을 제공하는 기능만 수행합니다.
    </v-card-text>

    <v-card-text>
      이 서비스에서 생성된 이미지를 저장하거나 캡처하는 행위는 전적으로 사용자의 책임 하에
      이루어집니다. 당사는 이와 관련된 어떠한 법적 책임이나 손해에 대해 책임지지 않음을 알려드립니다.
    </v-card-text>
  </v-card>
</template>

<script>
import start from '@/assets/img/manual/start.jpg'

export default {
  name: 'PrintResult',

  data () {
    return {
      start
    }
  }
}
</script>
