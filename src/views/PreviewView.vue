<template>
    <div :class="$isMobile() ? 'container is-fluid' : 'container'">
        <PreviewMap/>
    </div>
   
</template>

<script>
import PreviewMap from '@/components/preview/PreviewMap.vue';

export default {
    components: {
        PreviewMap
    }
}
</script>
