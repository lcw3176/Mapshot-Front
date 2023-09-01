<template>
    <v-card elevation="0">
        <v-card-title class="text-h5"> 반경 설정</v-card-title>
        <v-card-subtitle>
            이 값은 <strong>네이버</strong> 기준입니다. 카카오는 정확한 추정이 어렵습니다.
        </v-card-subtitle>

        <v-card-text>
            지도가 수집될 범위의 반경을 설정합니다.
        </v-card-text>
        <v-card elevation="0">
            <v-img :src="zoom" max-width="300"></v-img>

        </v-card>
        <v-card-title class="mt-10">
            1km
        </v-card-title>

        <v-card-text>
            <p>최대 확대 배율로 121장의 사진을 수집합니다.</p>
            <p>원본 그대로의 사진을 조립합니다.</p>
        </v-card-text>


        <v-card-title>
            2km
        </v-card-title>
        <v-card-text>
            <p>최대 확대 배율로 289장의 사진을 수집합니다.</p>
            <p>원본 이미지를 절반으로 축소 후 조립합니다.</p>
        </v-card-text>

        <v-card-title>
            5km
        </v-card-title>
        <v-card-text>
            <p>최대 확대보다 2단계 낮은 배율로 121장의 사진을 수집합니다.</p>
            <p>원본 그대로의 사진을 조립합니다.</p>
        </v-card-text>

        <v-card-title>
            10km
        </v-card-title>
        <v-card-text>
            <p>최대 확대보다 2단계 낮은 배율로 441장의 사진을 수집합니다.</p>
            <p>원본 이미지를 절반으로 축소 후 조립합니다.</p>
        </v-card-text>

    </v-card>
</template>

<script>
import zoom from '@/assets/img/manual/2/1.jpg'

export default {
    name: 'ChooseRange',

    data() {
        return {
            zoom: zoom
        }
    }
}
</script>