<template>
  <v-container fluid>
    <v-row class="text-center">

      <v-col>
        <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-OPghfSGHOLdGJdlJ" data-ad-width="300"
          data-ad-height="250"></ins>

      </v-col>


      <v-col>
        <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-1f22sNeH6puxNSbl" data-ad-width="300"
          data-ad-height="250"></ins>
      </v-col>

      <v-col>
        <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-HEHh99g6pdekjkfQ" data-ad-width="300"
          data-ad-height="250"></ins>
      </v-col>

    </v-row>
  </v-container>
</template>


<script>

export default {
  name: 'AdsView',

  setup() {
    const plugin = document.createElement("script");
    plugin.setAttribute(
      "src",
      "//t1.daumcdn.net/kas/static/ba.min.js"
    );
    plugin.async = true;
    document.head.appendChild(plugin);
  }

}
</script>
