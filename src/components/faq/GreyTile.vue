<template>
  <v-card elevation="0">
        <v-card-title class="text-h5">회색 타일 섞임 현상</v-card-title>

        <v-card elevation="0">
            <v-img :src="greytile" max-height="500"></v-img>
        </v-card>

        <v-card-text>
            종종 지도 결과물에 회색 타일이 섞인 채 생성되는 경우가 존재합니다.
        </v-card-text>

        <v-card-text>
            해당 현상 발생 시 중심 좌표를 살짝만 이동해주셔서 다시 캡쳐를 시도해 주세요.
        </v-card-text>
       

    </v-card>
</template>

<script>
import greytile from '@/assets/img/faq/greytile.jpg'

export default {
    name: 'GreyTile',

    data() {
        return {
            greytile: greytile
        }
    }
}
</script>