<template>
    <v-card elevation="0" class="ml-10">
        <v-card-title class="text-h5"> 회사 설정</v-card-title>
        <v-card-text>
            출력할 지도의 종류를 설정합니다.
        </v-card-text>
        <v-card elevation="0">
            <v-img :src="company" max-width="500"></v-img>

        </v-card>

        <v-card-title class="mt-10">
            네이버
        </v-card-title>

        <v-card-text>

            <p>출력 결과물이 네이버 지도를 통해서 생성됩니다.</p>
        </v-card-text>


        <v-card-title>
            카카오
        </v-card-title>
        <v-card-text>
            <p>출력 결과물이 카카오 지도를 통해서 생성됩니다.</p>
        </v-card-text>

    </v-card>
</template>

<script>
import company from '@/assets/img/manual/4/1.jpg'

export default {
    name: 'ChooseCompany',

    data() {
        return {
            company: company
        }
    }
}
</script>