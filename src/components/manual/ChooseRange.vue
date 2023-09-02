<template>
    <v-card elevation="0">
        <v-card-title class="text-h5"> 반경 설정</v-card-title>
        <v-card elevation="0">
            <v-img :src="range"></v-img>

        </v-card>

        <v-card-text>
            지도가 수집될 범위의 반경을 설정합니다.
        </v-card-text>
        
        <v-card-text>
            1km, 2km, 5km, 10km 4가지가 존재하며 반경이 넓어질수록 사진의 화질은 낮아집니다.
        </v-card-text>

    </v-card>
</template>

<script>
import range from '@/assets/img/manual/range.jpg'

export default {
    name: 'ChooseRange',

    data() {
        return {
            range: range
        }
    }
}
</script>