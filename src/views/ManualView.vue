<template>
    <v-container is-fluid>
        <v-card elevation="0">
            <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
                <v-tab v-for="(item, i) in manuals" :value="i">
                    {{ item.title }}
                </v-tab>
            </v-tabs>
            <v-window v-model="tab">
                <v-window-item v-for="(item, i) in manuals" :value="i">
                    <component :is=item.page></component>
                </v-window-item>
            </v-window>
        </v-card>

    </v-container>
</template>

<script>

import BeforeUseVue from '@/components/manual/BeforeUse.vue'
import CapturePoint from '@/components/manual/CapturePoint.vue'
import ChooseRange from '@/components/manual/ChooseRange.vue'
import ChooseMapType from '@/components/manual/ChooseMapType.vue'
import ChooseCompany from '@/components/manual/ChooseCompany.vue'
import ExternalOption from '@/components/manual/ExternalOption.vue'
import PrintResult from '@/components/manual/PrintResult.vue'
import { markRaw } from 'vue'

export default {
    name: 'ManualView',

    
    data() {

        return {
            currentComponent: '0',
            manuals: [
                { page: markRaw(BeforeUseVue), title: "사용 전", },
                { page: markRaw(CapturePoint), title: "좌표 탐색" },
                { page: markRaw(ChooseRange), title: "반경 설정" },
                { page: markRaw(ChooseMapType), title: "지도 종류" },
                { page: markRaw(ChooseCompany), title: "회사 설정" },
                { page: markRaw(ExternalOption), title: "부가 설정" },
                { page: markRaw(PrintResult), title: "결과 출력" },
            ],

            tab: null,
        }
    },

    methods: {
        swapComponent: function (component) {
            this.currentComponent = component;
        },
    }
}
</script>
