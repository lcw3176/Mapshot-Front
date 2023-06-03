<template>
    <v-card elevation="0" class="ml-10">

        <v-card-title class="text-h5">
            결과 출력
        </v-card-title>

        <v-card-text>
            <p>마지막 결과물을 확인하는 단계입니다.</p>
        </v-card-text>

        <v-card-text>
            <p>작업 시작 버튼을 누르면 설정된 값들을 토대로 사진을 수집합니다.</p>

        </v-card-text>

        <v-card-text>
            <p>진행 상황은 하단의 상태 막대기와 텍스트로 출력되며,</p>
        </v-card-text>

        <v-card-text>
            <p>작업이 완료되면 mapshot_ 으로 시작하는 이미지 링크가 생성됩니다.</p>
        </v-card-text>


    </v-card>
</template>

<script>
export default {
    name: 'PrintResult'
}
</script>