<template>
  <v-container fluid>
    <v-row class="text-center">

      <v-col id="adOne">
        <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-OPghfSGHOLdGJdlJ" data-ad-width="300"
          data-ad-height="250"></ins>
        
      </v-col>


      <v-col id="adTwo">
        <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-1f22sNeH6puxNSbl" data-ad-width="300"
          data-ad-height="250"></ins>
      </v-col>

      <v-col id="adThree">
        <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-HEHh99g6pdekjkfQ" data-ad-width="300"
          data-ad-height="250"></ins>
      </v-col>

    </v-row>
  </v-container>
</template>


<script>

export default {
  name: 'AdsView',

  mounted() {
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
</script>
