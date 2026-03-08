<template>
  <v-overlay :model-value="loaderStore.isLoading" class="align-center justify-center" z-index="9999" persistent>
    <Moon-loader color="#43A047" size="60px"/>
  </v-overlay>

  <v-layout>
    <v-app-bar elevation="2" v-if="display.mdAndUp">

      <template v-slot:prepend>
        <v-img
          :width="180"
          aspect-ratio="16/9"
          src="/title.png"
          @click="this.$router.push('/')"
          style="cursor: pointer"
        />
      </template>

      <v-spacer/>

      <v-btn
        v-for="item in desktop"
        :key="item.title"
        :to="item.path"
        :prepend-icon="item.icon"
        variant="text"
        rounded="lg"
        class="mx-1"
      >
        {{ item.title }}
      </v-btn>


    </v-app-bar>

    <v-bottom-navigation v-else grow bg-color="surface" elevation="4">
      <v-btn v-for="item in mobile" :key="item.title" color="success" :to="item.path">
        <v-icon>{{ item.icon }}</v-icon>
        <span style="font-size:0.65rem">{{ item.title }}</span>
      </v-btn>
    </v-bottom-navigation>

    <v-main>
      <router-view></router-view>
      <AdsView v-if="display.mdAndUp"/>
    </v-main>

  </v-layout>
</template>

<script>
import AdsView from './views/AdsView'
import { useLoaderStore } from '@/store/loader'
import { useDisplay } from 'vuetify'
import { ref } from 'vue'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'

export default {
  components: {
    AdsView,
    MoonLoader,
  },

  setup () {
    const loaderStore = useLoaderStore()
    return { loaderStore }
  },

  data () {
    const display = ref(useDisplay())

    return {
      display,
      desktop: [
        { title: '사용법', path: '/manual', icon: 'mdi-school-outline' },
        { title: '공지사항', path: '/notice', icon: 'mdi-bullhorn-outline' },
        { title: '문의', path: '/contact', icon: 'mdi-email-edit-outline' },
        { title: 'FAQ', path: '/faq', icon: 'mdi-frequently-asked-questions' },
      ],
      mobile: [
        { title: '홈', path: '/', icon: 'mdi-home-outline' },
        { title: '사용법', path: '/manual', icon: 'mdi-school-outline' },
        { title: '공지사항', path: '/notice', icon: 'mdi-bullhorn-outline' },
        { title: '문의', path: '/contact', icon: 'mdi-email-edit-outline' },
      ],
    }
  },
}
</script>
