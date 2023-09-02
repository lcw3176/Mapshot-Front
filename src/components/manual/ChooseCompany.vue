<template>
    <v-card elevation="0">
        <v-card-title class="text-h5"> 회사 설정</v-card-title>
        <v-card elevation="0">
            <v-img :src="company"></v-img>

        </v-card>

        <v-card-text>
            출력할 지도의 회사 종류를 설정합니다. 네이버, 카카오, 구글 3가지가 존재합니다.
        </v-card-text>
       
    </v-card>
</template>

<script>
import company from '@/assets/img/manual/company.jpg'

export default {
    name: 'ChooseCompany',

    data() {
        return {
            company: company
        }
    }
}
</script>