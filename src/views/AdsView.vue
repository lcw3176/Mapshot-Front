<template>
  <v-container fluid>
    <v-row class="text-center" v-if="display.mdAndUp">

      <v-col>
        <div id="adOne">
          <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-5wPT27aGQHQre4DP" data-ad-width="320"
            data-ad-height="100"></ins>
        </div>

      </v-col>


      <v-col>

        <div id="adTwo">
          <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-PHtjbTNT6UriScBj" data-ad-width="320"
            data-ad-height="50"></ins>
        </div>
      </v-col>


      <v-col>
        <div id="adThree">
          <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-jQc4S43mgtM6ZqRE" data-ad-width="728"
            data-ad-height="90"></ins>

        </div>

      </v-col>



    </v-row>


    <v-row class="text-center" v-else>

      <!-- <v-col>
        <div id="adOne">
          <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-HEHh99g6pdekjkfQ" data-ad-width="300"
            data-ad-height="250"></ins>

        </div>

        <div id="adTwo">
          <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-1f22sNeH6puxNSbl" data-ad-width="300"
            data-ad-height="250"></ins>
        </div>

      </v-col>

      <v-col id="adThree">
        <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-OPghfSGHOLdGJdlJ" data-ad-width="300"
          data-ad-height="250"></ins>
      </v-col> -->

    </v-row>
  </v-container>
</template>


<script>

import { useDisplay } from 'vuetify'
import { ref } from 'vue'

export default {
  name: 'AdsView',

  data() {
    const display = ref(useDisplay())

    return {
      display,
    };
  },

  mounted() {

    if (this.display.mdAndUp) {
      let adOne = document.createElement("script");
      adOne.setAttribute(
        "src",
        "//t1.daumcdn.net/kas/static/ba.min.js"
      );
      adOne.async = true;
      document.getElementById("adOne").appendChild(adOne);

      let adTwo = document.createElement("script");
      adTwo.setAttribute(
        "src",
        "//t1.daumcdn.net/kas/static/ba.min.js"
      );
      adTwo.async = true;
      document.getElementById("adTwo").appendChild(adTwo);

      let adThree = document.createElement("script");
      adThree.setAttribute(
        "src",
        "//t1.daumcdn.net/kas/static/ba.min.js"
      );
      adThree.async = true;
      document.getElementById("adThree").appendChild(adThree);
    }

  }

}
</script>
