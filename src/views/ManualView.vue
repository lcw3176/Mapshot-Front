<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="9" lg="8">
        <h1 class="manual-title">
          <v-icon icon="mdi-school-outline" color="success" class="mr-1"/>
          사용법
        </h1>

        <!-- 데스크톱: 탭으로 한 섹션씩. 모바일: 탭이 좁아서 섹션을 차례로 쌓는다 -->
        <template v-if="display.mdAndUp">
          <v-tabs v-model="tab" color="success" class="mb-4" show-arrows>
            <v-tab v-for="s in sections" :key="s.key" :value="s.key">{{ s.title }}</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item v-for="s in sections" :key="s.key" :value="s.key">
              <v-card variant="outlined" rounded="lg" class="pa-6">
                <component :is="s.component"/>
              </v-card>
            </v-window-item>
          </v-window>
        </template>

        <template v-else>
          <v-card v-for="s in sections" :key="s.key" variant="outlined" rounded="lg" class="pa-5 mb-4">
            <component :is="s.component"/>
          </v-card>
        </template>

        <p class="manual-more">
          더 궁금한 점은 <router-link to="/faq">FAQ</router-link>를 보시거나 <router-link to="/contact">문의</router-link>로 남겨 주세요.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { markRaw, ref } from 'vue'
import { useDisplay } from 'vuetify'
import GuideStart from '@/components/manual/GuideStart.vue'
import GuideTemplate from '@/components/manual/GuideTemplate.vue'
import GuideOptions from '@/components/manual/GuideOptions.vue'
import GuideCapture from '@/components/manual/GuideCapture.vue'
import GuideCityNewsMap from '@/components/manual/GuideCityNewsMap.vue'
import GuideCityNews from '@/components/manual/GuideCityNews.vue'
import '@/assets/css/guide.css'

const SECTIONS = [
  { key: 'start', title: '시작하기', component: markRaw(GuideStart) },
  { key: 'template', title: '템플릿 만들기', component: markRaw(GuideTemplate) },
  { key: 'options', title: '부가 설정', component: markRaw(GuideOptions) },
  { key: 'capture', title: '캡처·저장', component: markRaw(GuideCapture) },
  { key: 'citynews-map', title: '도시소식 지도', component: markRaw(GuideCityNewsMap) },
  { key: 'citynews', title: '도시뉴스', component: markRaw(GuideCityNews) },
]

export default {
  name: 'ManualView',

  data () {
    return {
      sections: SECTIONS,
      // ?tab=citynews-map 처럼 특정 섹션으로 바로 들어올 수 있게 한다
      tab: SECTIONS.some(s => s.key === this.$route.query.tab) ? this.$route.query.tab : 'start',
      display: ref(useDisplay()),
    }
  },
}
</script>

<style scoped>
.manual-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 700;
}

.manual-more {
  margin-top: 20px;
  color: #6b7680;
  font-size: 0.9rem;
}
</style>
