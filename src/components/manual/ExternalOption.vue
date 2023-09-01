<template>
    <v-card elevation="0">
        <v-card-title class="text-h5"> 옵션</v-card-title>
        <v-card-text>
            <p>부가적인 기능을 설정합니다.</p>
        </v-card-text>

        <v-card-title>
            공통 옵션
        </v-card-title>

        <v-card-title>
            흔적 남기기
        </v-card-title>

        <v-card-text>
            <p>수집한 위치에 표시를 남깁니다. 지도 상에 하얀색 바탕의 사각형이 색칠되며, 다른 별도의 정보는 저장되지 않습니다.</p>
        </v-card-text>


        <v-card-title class="mt-5">
            네이버 전용 옵션
        </v-card-title>

        <v-card elevation="0">
            <v-img :src="naverOption" max-width="300"></v-img>
        </v-card>


        
        <v-card-title class="mt-10">
            도시 계획 레이어
        </v-card-title>

        <v-card-text>
            도시 계획 레이어를 위성 이미지에 덧입혀서 제작합니다.
            브이월드에서 제공하는 정보를 이용하고 있으며, 
            현재는 도로, 토지이용계획도, 연속지적도를 지원합니다.
        </v-card-text>

        <v-card-title>
            레이어만 출력하기
        </v-card-title>

        <v-card-text>
            기존 위성 이미지에 덧입히지 않고 레이어로만 이루어진 이미지를 출력합니다.
        </v-card-text>

        <v-card-title class="mt-5">
            카카오 전용 옵션
        </v-card-title>

        <v-card elevation="0"> 
            <v-img :src="kakaoOption" max-width="300"></v-img>
        </v-card>

        <v-card-title  class="mt-10">
            지적 편집도
        </v-card-title>
        <v-card-text>
            <p>지적 편집도를 덧입혀서 불러옵니다.</p>
        </v-card-text>

    </v-card>

</template>

<script>

import naverOption from '@/assets/img/manual/5/1.jpg'
import kakaoOption from '@/assets/img/manual/5/2.jpg'

export default {
    name: 'ExternalOption',

    data() {
        return {
            naverOption,
            kakaoOption
        }
    }
}
</script>