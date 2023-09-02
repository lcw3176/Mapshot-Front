<template>
  <v-container fluid>

    <div v-if="display.mdAndUp">
      <v-row>
        <v-col></v-col>
        <v-col cols="8">

          <v-tabs v-model="tab" color="success" align-tabs="center">
              <v-tab v-for="(item, i) in manuals" :key="i" :value="i" @click="nowPage = item.page">
                {{ item.title }}
              </v-tab>
            </v-tabs>
            <v-window v-model="tab">
              <v-window-item v-for="(item, i) in manuals" :key="i">
                <v-container fluid>

                  <component v-bind:is="item.page">

                  </component>

                </v-container>
              </v-window-item>
            </v-window>

        </v-col>
        <v-col></v-col>
      </v-row>

    </div>



    <div v-else>
      <v-card v-for="(item, i) in manuals" :key="i" elevation="0">
        <v-lazy>
          <component :is="item.page" class="mb-10"></component>
        </v-lazy>
      </v-card>

    </div>
  </v-container>
</template>

<script>

import BeforeUseVue from '@/components/manual/BeforeUse.vue'
import CapturePoint from '@/components/manual/CapturePoint.vue'
import ChooseRange from '@/components/manual/ChooseRange.vue'
import ChooseMapType from '@/components/manual/ChooseMapType.vue'
import ChooseCompany from '@/components/manual/ChooseCompany.vue'
import PrintResult from '@/components/manual/PrintResult.vue'
import { markRaw, ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  name: 'ManualView',


  data() {
    const display = ref(useDisplay());

    return {
      currentComponent: '0',
      manuals: [
        { page: markRaw(BeforeUseVue), title: "사용 전", },
        { page: markRaw(CapturePoint), title: "좌표 탐색" },
        { page: markRaw(ChooseRange), title: "반경 설정" },
        { page: markRaw(ChooseMapType), title: "지도 선택" },
        { page: markRaw(ChooseCompany), title: "회사 설정" },
        { page: markRaw(PrintResult), title: "결과 출력" },
      ],

      nowPage: markRaw(BeforeUseVue),
      tab: "사용 전",
      display,
    }
  },


}
</script>
