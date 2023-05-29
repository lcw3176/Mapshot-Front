<template>
    <v-container class="d-flex align-center flex-column">
        <v-card>

            <div class="ma-10">
                <v-img :src="company" max-height="400px"></v-img>

                <v-card-title>
                    회사 설정
                </v-card-title>
                <v-card-text>
                    출력될 지도의 종류입니다.
                </v-card-text>


                <v-card-title>
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
            </div>
        </v-card>
    </v-container>
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