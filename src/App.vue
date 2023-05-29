<template>
  <v-layout>


    <v-app-bar elevation="1"  v-if="display.mdAndUp">
          <v-btn class="font-weight-black font-weight-bold text-h5" to="/">
              {{ appTitle }}

            </v-btn>

            <v-btn v-for="item in menuItems" :key="item.title" size="large" variant="plain" :to="item.path">
              {{ item.title }}
            </v-btn>
      <v-container is-fluid>
        <v-row>
          <v-col>

          </v-col>

          <v-col cols="10">

           

          </v-col>

          <v-col>

          </v-col>
        </v-row>


      </v-container>

    </v-app-bar>

    <v-bottom-navigation v-else grow>
      <v-btn v-for="item in menuItems" :key="item.title" color="teal">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </v-bottom-navigation>


    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- <v-content> -->
    <!-- <AdsView/> -->
    <!-- </v-content> -->
  </v-layout>
</template>

<script>

import NavbarView from './views/NavbarView'
import AdsView from './views/AdsView'
import { useDisplay } from 'vuetify'
import { ref } from 'vue'


export default {
  components: {
    NavbarView,
    AdsView
  },



  data() {
    const display = ref(useDisplay())

    return {
      appTitle: "MAPSHOT",
      sidebar: false,
      menuItems: [
        { title: "사용법", path: "/manual", icon: "mdi-school-outline" },
        { title: "공지사항", path: "/notice", icon: "mdi-bullhorn-outline" },
        { title: "문의", path: "/contact", icon: "mdi-tooltip-question-outline" },
      ],

      display
    };
  },
}
</script>
