<template>
    <v-card elevation="0">
        <v-card-title class="text-h5"> 지도 종류</v-card-title>
        <v-card-text>
            수집할 지도의 종류를 설정합니다. 기본값은 위성으로 설정됩니다.
        </v-card-text>
        <v-card elevation="0">
            <v-img :src="maptypes" max-width="300"></v-img>

        </v-card>
        <v-card-title class="mt-10">
            일반
        </v-card-title>

        <v-card-text>
            <p>일반 지도로 설정됩니다.</p>
        </v-card-text>


        <v-card-title>
            위성
        </v-card-title>
        <v-card-text>
            <p>위성 지도로 설정됩니다.</p>
            <p>위치나 지물 명칭이 나오지 않습니다.</p>
        </v-card-text>

        <v-card-title>
            하이브리드
        </v-card-title>
        <v-card-text>
            <p>위성 지도로 설정됩니다.</p>
            <p>위치와 지물 명칭들이 나옵니다.</p>
        </v-card-text>


    </v-card>
</template>

<script>

import maptypes from '@/assets/img/manual/3/1.jpg'

export default {
    name: 'ChooseMapType',

    data() {
        return {
            maptypes: maptypes
        }
    }
}
</script>