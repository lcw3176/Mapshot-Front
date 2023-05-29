<template>
    <v-container class="d-flex align-center flex-column">
        <v-card>

            <div class="ma-10">
                <v-img :src="maptypes" max-height="400px"></v-img>

                <v-card-title>
                    지도 종류
                </v-card-title>
                <v-card-text>
                    수집될 지도의 종류입니다. 기본값은 위성으로 설정됩니다.
                </v-card-text>


                <v-card-title>
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

            </div>


        </v-card>
    </v-container>
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