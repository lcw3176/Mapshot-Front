<template>
    <v-card elevation="0">
        <v-card-title class="text-h5">사용 전</v-card-title>

        <v-card-subtitle>환경</v-card-subtitle>
        <v-card-text>
            본 사이트는 데스크탑 환경에 맞게 이루어져 있습니다.
            원활한 서비스 이용을 위해서는 모바일 사용을 지양해 주세요.
        </v-card-text>

        <v-card-subtitle>브라우저</v-card-subtitle>
        <v-card-text>
            현재 지원중인 브라우저 목록입니다.
            만약 서비스 이용에 어려움이 있다면, 호환 브라우저 목록을 확인해 주세요.
        </v-card-text>

        <v-sheet>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            이름
                        </th>
                        <th class="text-left">
                            지원 여부
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in browser" :key="item.name">
                        <td>{{ item.name }}</td>

                        
                        <td>
                            <v-chip :color="item.status === 'O' ? 'info' : 'error'">
                                {{ item.status }}
                            </v-chip>
                               </td>
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