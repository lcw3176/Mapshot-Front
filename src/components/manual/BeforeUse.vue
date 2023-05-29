<template>
    <v-container class="d-flex align-center flex-column">
        <v-card>
            <div class="ma-10">
                <v-card-text>
                    현재 지원중인 브라우저 목록입니다.
                    만약 서비스 이용에 어려움이 있다면, 호환 브라우저 목록을 확인해 주세요.
                </v-card-text>

                <v-list>
                    <v-list-subheader>확인된 호환 브라우저</v-list-subheader>

                    <v-list-item v-for="(item, index) in support" :key="index" :value="item" active-color="success">
                        <v-list-item-title v-text="item"></v-list-item-title>
                    </v-list-item>
                </v-list>

                <v-list>
                    <v-list-subheader>지원하지 않는 브라우저</v-list-subheader>

                    <v-list-item v-for="(item, index) in noSupported" :key="index" :value="item" active-color="error">
                        <v-list-item-title v-text="item"></v-list-item-title>
                    </v-list-item>
                </v-list>

            </div>

        </v-card>
    </v-container>
</template>


<script>
export default {
    name: 'BeforeUse',

    data() {
        return {
            noSupported: ["인터넷 익스플로러", "사파리 모바일", "카카오 인앱 브라우저"],
            support: ["구글 크롬", "마이크로소프트 엣지", "파이어폭스", "삼성 모바일 인터넷"],
        }

    }
}
</script>