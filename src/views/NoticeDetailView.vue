<template>
    <div :class="$isMobile() ? 'container is-fluid' : 'container'">
        <NoticeDetail :postNumber="postNumber"/>
    </div>
   
</template>

<script>
import NoticeDetail from '@/components/notice/NoticeDetail.vue';

export default {
    name: 'NoticeDetailView',
    components: {
        NoticeDetail,
    },

    props: {
        postNumber: Number
    }
}
</script>