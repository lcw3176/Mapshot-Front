<template>
    <v-container is-fluid>
        <v-navigation-drawer
        permanent
        location="left"
      >

        <v-list nav>
          <v-list-item v-for="(item, i) in manuals" :value="i" :title="item.title" color="success" @click="nowPage = item.page"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <component :is=nowPage></component>

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

            nowPage: markRaw(BeforeUseVue),
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
