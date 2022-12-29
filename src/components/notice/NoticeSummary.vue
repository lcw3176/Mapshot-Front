<template>

    <div class="container is-fluid">

        <div class="tile is-ancestor" v-for="notice in notices" v-bind:key="notice.id">
            <div class="tile is-vertical">
                <div class="tile">
                    <div class="tile is-parent is-vertial">
                        <article class="tile is-child notification">
                            <p :class="notice.category == '업데이트' ? 'title has-text-info' : 'title has-text-danger'">
                                {{ notice.category}}
                            </p>
                            <p class="subtitle">{{ notice.title }}</p>
                            <p>{{ notice.date }}</p>
                        </article>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <InfiniteLoading @infinite="infiniteHandler" />

</template>



<script>
import InfiniteLoading from 'v3-infinite-loading';


export default {
    name: 'NoticeSummary',
    data() {
        return {
            notices: [],
            loadNum: 0
        }
    },

    components: {
        InfiniteLoading
    },

    methods: {

        testData() {
            let dataArr = [];
            for (let i = 0; i < 10; i++) {
                let data = new Object();

                if (i % 2 === 0) {
                    data.id = this.loadNum;
                    data.category = '업데이트';
                    data.title = '사이트 개편 안내';
                    data.date = '12.12.29';

                } else {
                    data.id = this.loadNum;
                    data.category = '점검예정';
                    data.title = '서비스 점검 안내';
                    data.date = '12.12.12';

                }


                dataArr.push(data);
            }


            return dataArr;
        },

        async infiniteHandler($state) {
            let data = this.testData();
            if (this.loadNum < 100) {

                data.forEach(element => {
                    this.notices.push(element);
                });

                this.loadNum++;
                console.log(this.loadNum);
                $state.loaded();
            } else {
                $state.complete();
            }

        }
    }
}
</script>
