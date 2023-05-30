<template>
  <v-layout>
    <v-app-bar elevation="1" v-if="display.mdAndUp">
      <v-btn class="font-weight-black font-weight-bold text-h5" to="/">
        {{ appTitle }}

      </v-btn>

      <v-btn v-for="item in desktop" :key="item.title" size="large" variant="plain" :to="item.path">

        {{ item.title }}

        <v-badge v-if="item.title === '공지사항'" dot color="success">
          <v-icon></v-icon>
        </v-badge>
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

      <!-- <AdsView /> -->
    </v-main>

  </v-layout>
</template>

<script>

import AdsView from './views/AdsView'
import { useDisplay } from 'vuetify'
import { ref } from 'vue'


export default {
  components: {
    AdsView
  },

  data() {
    const display = ref(useDisplay())

    return {
      appTitle: "MAPSHOT",
      sidebar: false,
      desktop: [
        { title: "사용법", path: "/manual" },
        { title: "문의", path: "/contact" },
        { title: "공지사항", path: "/notice" },
      ],


      mobile: [
        { title: "홈", path: "/", icon: "mdi-home-outline" },
        { title: "사용법", path: "/manual", icon: "mdi-school-outline" },
        { title: "문의", path: "/contact", icon: "mdi-tooltip-question-outline" },
        { title: "공지사항", path: "/notice", icon: "mdi-bullhorn-outline" },
      ],
      display
    };
  },
}
</script>
