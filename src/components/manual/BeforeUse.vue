<template>
    <v-card elevation="0" class="ml-10">
        <v-card-title class="text-h5">사용 전</v-card-title>
        <v-card-text>
            현재 지원중인 브라우저 목록입니다.
            만약 서비스 이용에 어려움이 있다면, 호환 브라우저 목록을 확인해 주세요.
        </v-card-text>

        <v-sheet :max-width="500">
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            이름
                        </th>
                        <th class="text-left">
                            호환여부
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in browser" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.status }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-sheet>

    </v-card>
</template>


<script>
export default {
    name: 'BeforeUse',

    data() {
        return {
            browser: [
            { name: "구글 크롬", status: "O" },
                { name: "마이크로소프트 엣지", status: "O" },
                { name: "파이어폭스", status: "O" },
                { name: "삼성 모바일 인터넷", status: "O" },
                { name: "인터넷 익스플로러", status: "X" },
                { name: "사파리 모바일", status: "X" },
                { name: "카카오 인앱 브라우저", status: "X" },
               
            ],
        }

    }
}
</script>