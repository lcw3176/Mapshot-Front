<template>
    <v-card elevation="0">
        <v-card-title class="text-h5 mb-10">'서버 에러입니다' 문구 출력</v-card-title>

        <v-card-text>
            네트워크 환경이 원활하지 않거나 광고 차단 프로그램(AdBlock, Tampermonkey...) 동작 시 발생할 수 있습니다.
        </v-card-text>

        <v-card-text>
            만약 정상적인 상황에서 해당 에러가 발생한다면 조금만 양해해 주세요.
            무료로 운영되는 서비스라 서버 사양을 올리기가 힘듭니다... ㅠㅠ
        </v-card-text>
       

    </v-card>
</template>

<script>

export default {
    name: 'ServerError',

}
</script>