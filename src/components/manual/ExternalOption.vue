<template>
    <v-container class="d-flex align-center flex-column">
        <v-card>

            <div class="ma-10">
                <v-img :src="option" max-height="400px"></v-img>

                <v-card-title>
                    옵션
                </v-card-title>
                <v-card-text>
                    <p>부가적인 설정 창입니다.</p>
                </v-card-text>


                <v-card-title>
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
            </div>
        </v-card>
    </v-container>
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