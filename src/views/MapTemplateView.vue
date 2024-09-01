<template>
 <div>
  <button @click="mapTemplateStore.test()">hello</button>
 </div>

</template>

<script>
import { useMapTemplateStore } from '@/store/mapTemplate'

export default {
  name: 'MapTemplateView',


  setup() {
    const mapTemplateStore = useMapTemplateStore();

    return {
      mapTemplateStore
    }
  },


}
</script>
