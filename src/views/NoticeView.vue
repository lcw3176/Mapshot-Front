<template>
    <div class="container mt-5">
        <NoticeListPage/>
        <NoticeListPage/>
        <NoticeListPage/>
        <NoticeListPage/>
        <NoticeListPage/>

        <Pagination/>
    </div>
   
</template>

<script>
import NoticeSummary from '@/components/notice/NoticeSummary.vue';
import Pagination from '@/components/notice/Pagination.vue';

export default {
    name: 'NoticeView',
    components: {
        NoticeSummary,
        Pagination,
    }
}
</script>


<style scoped>
@import "@/assets/css/bulma-list.css";

</style>