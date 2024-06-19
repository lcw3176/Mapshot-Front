<template>
  <v-container fluid>
    <v-row class="text-center">

      <v-col>
        <Adsense adStyle="display:inline-block;width:1200px;height:600px"
                 client="ca-pub-7390022674285155"
                 slot="6197100774">
        </Adsense>
      </v-col>

    </v-row>

  </v-container>
</template>


<script>

import { Adsense } from 'vue3-google-adsense';

export default {
  name: 'AdsView',

  components:{
    Adsense
  }


}
</script>
