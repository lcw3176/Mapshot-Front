<template>
  <v-card elevation="0">
    <v-card-title class="text-h5">회색 타일이 섞여요</v-card-title>

    <v-card elevation="0">
      <v-img :src="greytile" max-height="500"></v-img>
    </v-card>

    <br>
    <p>
      종종 지도 결과물에 회색 타일이 섞인 채 생성되는 경우가 존재합니다.
    </p>

    <br>
    <p>
      해당 현상 발생 시 Ctrl + 휠을 통해 브라우저의 확대 수준을 조절하거나, 잠시만 기다려 주시면 로딩이 완료됩니다.
    </p>


  </v-card>
</template>

<script>
import greytile from '@/assets/img/faq/greytile.jpg'

export default {
  name: 'GreyTile',

  data () {
    return {
      greytile: greytile
    }
  }
}
</script>
