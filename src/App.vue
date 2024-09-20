<template>
  <div v-if="loaderStore.isLoading" class="loading-container">
    <div class="loading">
      <Moon-loader/>
    </div>
  </div>

  <v-layout>
    <v-app-bar elevation="1" v-if="display.mdAndUp">

      <template v-slot:prepend>
        <v-img
          :width="170"
          aspect-ratio="16/9"
          src="/title.png"
          @click="this.$router.push('/') "
          style="cursor: pointer"
        >
        </v-img>

      </template>


      <v-spacer>

      </v-spacer>


      <div v-for="item in desktop" :key="item.title">

        <v-btn :to="item.path" variant="plain">
          {{ item.title }}
        </v-btn>

      </div>

    </v-app-bar>

    <v-bottom-navigation v-else grow>
      <v-btn v-for="item in mobile" :key="item.title" color="teal" :to="item.path">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.title }}
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
    MoonLoader
  },

  data () {
    const display = ref(useDisplay())

    return {
      appTitle: 'MAPSHOT',
      sidebar: false,
      desktop: [
        {
          title: '게시판',
          path: '/community',
          icon: 'mdi-bulletin-board'
        },
        {
          title: '사용법',
          path: '/manual',
          icon: 'mdi-school-outline'
        },
        {
          title: '공지사항',
          path: '/notice',
          icon: 'mdi-bullhorn-outline'
        },
        {
          title: '문의',
          path: '/contact',
          icon: 'mdi mdi-email-edit-outline'
        },
        {
          title: 'FAQ',
          path: '/faq',
          icon: 'mdi-frequently-asked-questions'
        },

      ],

      mobile: [
        {
          title: '홈',
          path: '/',
          icon: 'mdi-home-outline'
        },
        {
          title: '사용법',
          path: '/manual',
          icon: 'mdi-school-outline'
        },
        {
          title: '공지사항',
          path: '/notice',
          icon: 'mdi-bullhorn-outline'
        },
        {
          title: '게시판',
          path: '/community',
          icon: 'mdi-bulletin-board'
        },
      ],

      display,
    }
  },

  setup () {
    const loaderStore = useLoaderStore()

    return {
      loaderStore
    }
  },

}
</script>


<style scoped>
.loading {
  z-index: 2;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
