<template>
    <v-card elevation="0">
        <v-card-title class="text-h5">지도 선택</v-card-title>
        <v-card elevation="0">
            <v-img :src="maptypes"></v-img>

        </v-card>

        <v-card-text>
            수집할 지도의 종류를 설정합니다. 도형, 기호 등으로 도식화된 일반 지도, 위성 지도, 
            위성 지도에 위치와 지물 명칭이 같이 표시되는 하이브리드 3가지가 존재합니다.
        </v-card-text>


    </v-card>
</template>

<script>

import maptypes from '@/assets/img/manual/type.jpg'

export default {
    name: 'ChooseMapType',

    data() {
        return {
            maptypes: maptypes
        }
    }
}
</script>