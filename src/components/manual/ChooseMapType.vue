<template>
  <v-card elevation="0">
    <v-card elevation="0">
      <v-img :src="maptypes"></v-img>

    </v-card>

    <p>
      수집할 지도의 종류를 설정합니다.
    </p>
    <br>
    <p>
      도형, 기호 등으로 도식화된 일반 지도, 위성 사진으로만 구성된 위성 지도, 위성 지도에 위치와 지물 명칭이 같이 표시되는 하이브리드 3가지가 존재합니다.
    </p>

  </v-card>
</template>

<script>

import maptypes from '@/assets/img/manual/type.jpg'

export default {
  name: 'ChooseMapType',

  data () {
    return {
      maptypes: maptypes
    }
  }
}
</script>
