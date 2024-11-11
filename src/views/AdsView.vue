<template>
  <v-container fluid>
    <v-row class="text-center">

      <v-col>
        <Adsense adStyle="display:block"
                 format="autorelaxed"
                 clientId="ca-pub-7390022674285155"
                 slotId="6113438353">
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
