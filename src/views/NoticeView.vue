<template>
    <div :class="$isMobile() ? 'container is-fluid' : 'container'">
        <NoticeSummary/>
    </div>
   
</template>

<script>
import NoticeSummary from '@/components/notice/NoticeSummary.vue';

export default {
    name: 'NoticeView',
    components: {
        NoticeSummary,
    },
}
</script>