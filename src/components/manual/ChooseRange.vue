<template>
  <v-card elevation="0">
    <v-card elevation="0">
      <v-img :src="range"></v-img>

    </v-card>

    <p>
      지도가 수집될 범위의 반경을 설정합니다.
    </p>
    <br>
    <p>
      1km, 2km, 5km, 10km 4가지가 존재하며 반경이 넓어질수록 사진의 화질은 낮아집니다.
    </p>

  </v-card>
</template>

<script>
import range from '@/assets/img/manual/range.jpg'

export default {
  name: 'ChooseRange',

  data () {
    return {
      range: range
    }
  }
}
</script>
