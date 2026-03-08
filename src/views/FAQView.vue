<template>
  <v-container fluid>

    <div v-if="display.mdAndUp">
      <v-row>
        <v-col></v-col>
        <v-col cols="8">

          <v-tabs v-model="tab" color="success" align-tabs="center">
            <v-tab v-for="(item, i) in faqs" :key="i" :value="i">
              {{ item.title }}
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item v-for="(item, i) in faqs" :key="i">
              <v-container fluid>
                <component v-bind:is="item.page"/>
              </v-container>
            </v-window-item>
          </v-window>

          <!-- 콘텐츠 하단 인라인 광고 -->
          <v-row justify="center" class="mt-4">
            <v-col cols="12">
              <Adsense
                adStyle="display:block"
                format="auto"
                :fullWidthResponsive="true"
                clientId="ca-pub-7390022674285155"
                slotId="6113438353"
              />
            </v-col>
          </v-row>

        </v-col>
        <v-col></v-col>
      </v-row>
    </div>

    <div v-else>
      <v-card v-for="(item, i) in faqs" :key="i" elevation="0">
        <v-lazy>
          <component :is="item.page" class="mb-10"/>
        </v-lazy>
      </v-card>

      <!-- 모바일 인라인 광고 -->
      <Adsense
        adStyle="display:block"
        format="auto"
        :fullWidthResponsive="true"
        clientId="ca-pub-7390022674285155"
        slotId="6113438353"
      />
    </div>

  </v-container>
</template>


<script>

import GreyTile from '@/components/faq/GreyTile.vue'
import HowToCapture from '@/components/faq/HowToCapture.vue'
import { Adsense } from 'vue3-google-adsense'

import { markRaw, ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  name: 'FAQView',
  components: { Adsense },

  data () {
    const display = ref(useDisplay())

    return {
      faqs: [
        {
          page: markRaw(HowToCapture),
          title: '캡쳐는 어떻게 하나요?',
        },

        {
          page: markRaw(GreyTile),
          title: '회색 타일이 섞여요',
        },

      ],
      
      display,
      tab: '캡쳐는 어떻게 하나요?',
    }
  },

  methods: {}

}
</script>
