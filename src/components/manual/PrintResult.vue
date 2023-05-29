<template>
    <v-container class="d-flex align-center flex-column">
        <v-card>

            <div class="ma-10">
                <v-img :src="option" max-height="400px"></v-img>

                <v-card-title>
                    결과 출력
                </v-card-title>
                <v-card-text>
                    <p>작업 시작 버튼을 누르면 설정된 값들을 토대로 사진을 수집합니다.</p>
                   
                </v-card-text>

                <v-card-text>
                    <p>진행 상황은 하단의 상태 막대기와 텍스트로 출력됩니다.</p>
                </v-card-text>

                <v-card-text>
                    <p>작업이 완료되면 mapshot_result 로 시작하는 이미지 링크가 생성됩니다.</p>
                </v-card-text>
               
                    
            </div>
        </v-card>
    </v-container>

</template>

<script>
export default {
    name: 'PrintResult'
}
</script>