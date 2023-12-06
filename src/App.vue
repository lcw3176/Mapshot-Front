<template>
  <div v-if="loaderStore.isLoading" class="loading-container">
    <div class="loading">
      <Moon-loader />
    </div>
  </div>

  <v-layout>
    <v-app-bar elevation="1" v-if="display.mdAndUp">

      <v-btn class="font-weight-bold text-h5" size="x-large" variant="plain" to="/">
        {{ appTitle }}

      </v-btn>

      <v-spacer>

      </v-spacer>



      <v-btn v-for="item in desktop" :key="item.title" size="x-large" variant="plain" class="font-weight-bold text-h6" :to="item.path">

        {{ item.title }}

      </v-btn>
    </v-app-bar>

    <v-bottom-navigation v-else grow>
      <v-btn v-for="item in mobile" :key="item.title" color="teal" :to="item.path">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </v-bottom-navigation>



    <v-main>
      <router-view></router-view>

      <AdsView />
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

  data() {
    const display = ref(useDisplay())

    return {
      appTitle: "MAPSHOT",
      sidebar: false,
      desktop: [
        { title: "사용법", path: "/manual" },
        { title: "공지사항", path: "/notice" },
        { title: "문의", path: "/contact" },
        { title: "FAQ", path: "/faq" },
      ],


      mobile: [
        { title: "홈", path: "/", icon: "mdi-home-outline" },
        { title: "사용법", path: "/manual", icon: "mdi-school-outline" },
        { title: "공지사항", path: "/notice", icon: "mdi-bullhorn-outline" },
        { title: "문의", path: "/contact", icon: "mdi-tooltip-question-outline" },
        { title: "FAQ", path: "/faq" , icon: "mdi-frequently-asked-questions"},
      ],

      display,
    };
  },

  setup() {
    const loaderStore = useLoaderStore();

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
