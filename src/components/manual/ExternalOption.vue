<template>
    <v-card elevation="0" class="ml-10">
        <v-card-title class="text-h5"> 옵션</v-card-title>
        <v-card-text>
            <p>부가적인 기능을 설정합니다.</p>
        </v-card-text>
        <v-card elevation="0">
            <v-img :src="option" max-width="500"></v-img>

        </v-card>



        <v-card-title class="mt-10">
            흔적 남기기
        </v-card-title>

        <v-card-text>

            <p>수집한 위치에 표시를 남깁니다.</p>
        </v-card-text>


        <v-card-title>
            지적 편집도
        </v-card-title>
        <v-card-text>
            <p>지적 편집도를 덧입혀서 불러옵니다. 이 기능은 카카오 지도만 가능합니다.</p>
        </v-card-text>

    </v-card>

</template>

<script>

import option from '@/assets/img/manual/5/1.jpg'

export default {
    name: 'ExternalOption',

    data() {
        return {
            option: option
        }
    }
}
</script>