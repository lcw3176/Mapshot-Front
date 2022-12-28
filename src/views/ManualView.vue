<template>
    <div class="container ">
        <div class="container tabs is-boxed mt-5">
            <ul>
                <li v-for="(value, key) in manuals" :key="key" :class="{'is-active': currentComponent === key}">
                    <a @click="swapComponent(key)">{{ value }}</a>
                </li>
            </ul>
        </div>

        <div class="container is-fluid card">
            <BeforeUseVue class="container is-fluid" v-if="currentComponent === '0'"/>
            <CapturePoint class="container is-fluid" v-if="currentComponent === '1'"/>
            <ChooseRange class="container is-fluid" v-if="currentComponent === '2'"/>
            <ChooseMapType class="container is-fluid" v-if="currentComponent === '3'"/>
            <ChooseCompany class="container is-fluid" v-if="currentComponent === '4'"/>
            <Option class="container is-fluid" v-if="currentComponent === '5'"/>
            <PrintResult class="container is-fluid" v-if="currentComponent === '6'"/>
        </div>

    </div>

</template>

<script>

import BeforeUseVue from '@/components/manual/BeforeUse.vue'
import CapturePoint from '@/components/manual/CapturePoint.vue'
import ChooseRange from '@/components/manual/ChooseRange.vue'
import ChooseMapType from '@/components/manual/ChooseMapType.vue'
import ChooseCompany from '@/components/manual/ChooseCompany.vue'
import Option from '@/components/manual/Option.vue'
import PrintResult from '@/components/manual/PrintResult.vue'

export default {
    name: 'ManualView',
    components: {
        BeforeUseVue,
        CapturePoint,
        ChooseRange,
        ChooseMapType,
        ChooseCompany,
        Option,
        PrintResult
    },

    data() {

        return {
            currentComponent: '0',
            manuals: {
                '0': '사용 전',
                '1': '좌표 탐색',
                '2': '반경 설정',
                '3': '지도 종류',
                '4': '회사 설정',
                '5': '부가 설정',
                '6': '결과 출력'
            }
        }
    },

    methods: {
        swapComponent: function (component) {
            this.currentComponent = component;
        },
    }
}
</script>
