<template>
    <v-card elevation="0">
        <v-card-title class="text-h5">좌표 탐색</v-card-title>

        <v-card elevation="0">
            <v-img :src="main" cover></v-img>
        </v-card>

        <v-card-text>
            지도의 원하는 위치에 마우스 클릭을 하면 해당 지점이 캡쳐할 사진의 중심 좌표로 지정되며, 
            보라색으로 대략적인 범위가 표시됩니다
        </v-card-text>

        <v-card-text>
            지도를 <strong>왼쪽 클릭</strong>하여 중심 좌표 설정을 마무리해야 원활한 진행이 가능합니다.
        </v-card-text>
       

    </v-card>
</template>

<script>
import main from '@/assets/img/manual/main.jpg'

export default {
    name: 'CapturePoint',

    data() {
        return {
            main: main,
        }
    }
}
</script>