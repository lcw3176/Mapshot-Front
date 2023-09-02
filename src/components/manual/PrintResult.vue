<template>
    <v-card elevation="0">

        <v-card-title class="text-h5">
            결과 출력
        </v-card-title>

        <v-card elevation="0">
            <v-img :src="start"></v-img>
        </v-card>
        
        <v-card-text>
            회사 설정에 따른 다양한 부가 설정을 선택할 수 있습니다. (네이버: 도시 계획 레이어, 카카오: 지적 편집도) 
        </v-card-text>

        <v-card-text>
            작업 시작 버튼을 누르면 설정된 값들을 토대로 사진을 수집합니다.
        </v-card-text>

        <v-card-text>
            진행 상황은 하단의 상태 막대기와 텍스트로 출력되며, 작업이 완료되면 mapshot_ 으로 시작하는 이미지 링크가 생성됩니다.
        </v-card-text>
        
    </v-card>
</template>

<script>
import start from '@/assets/img/manual/start.jpg'

export default {
    name: 'PrintResult',

    data()  {
        return {
            start 
        }
    }
}
</script>