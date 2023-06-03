<template>
    <v-card elevation="0" class="ml-10">
        <v-card-title class="text-h5">좌표 탐색</v-card-title>
        <v-card-text>

            지도에 원하는 위치를 클릭하면 해당 지점이 사진의 중심 좌표로 지정되며, 보라색으로 사진이 캡쳐될 범위가 표시됩니다
        </v-card-text>

        <v-card elevation="0">
            <v-img :src="coor" max-width="800"></v-img>
            <v-card-text>
                * 지도를 <strong>왼쪽 클릭</strong>하여 중심 좌표 설정을 마무리해야 원활한 진행이 가능합니다.
            </v-card-text>
        </v-card>


        <v-card-title class="text-h5 mt-10">위치 검색</v-card-title>
        <v-card-text>

            키워드를 통해 원하는 장소를 찾거나, 임의로 지도를 움직여 탐색도 가능합니다.
        </v-card-text>

        <v-card>
            <v-img :src="location" max-width="800"></v-img>
            <v-card-text>
                * 마우스 우클릭 시, 캡쳐될 범위가 표시되는 보라색 영역이 화면에서 사라집니다.
            </v-card-text>
        </v-card>

    </v-card>
</template>

<script>
import coor from '@/assets/img/manual/1/1.jpg'
import location from '@/assets/img/manual/1/2.jpg'

export default {
    name: 'CapturePoint',

    data() {
        return {
            coor: coor,
            location: location
        }
    }
}
</script>