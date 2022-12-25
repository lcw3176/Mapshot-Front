<template>
    <div>
        <div class="card-content">

            <div class="content">
                <p>현재 지원중인 브라우저 목록입니다.</p>
                <p>만약 서비스 이용에 어려움이 있다면, 호환 브라우저 목록을 확인해 주세요.</p>
            </div>

        </div>

        <div class="card-content columns">
            <figure class="content column is-half">
                <div class="media-content mt-5">
                    <p class="title is-5">확인된 호환 브라우저</p>
                    <ul>
                        <li v-for="(item, index) in support" :key="index">{{ item }}</li>
                    </ul>
                </div>
            </figure>

            <figure class="content column">
                <div class="media-content mt-5">
                    <p class="title is-5 has-text-danger">지원하지 않는 브라우저</p>
                    <ul>
                        <li v-for="(item, index) in noSupported" :key="index">{{ item }}</li>
                    </ul>
                </div>

            </figure>
        </div>
    </div>
</template>


<script>
export default {
    name: 'BeforeUse',

    data() {
        return{
            noSupported: ["인터넷 익스플로러", "사파리 모바일", "카카오 인앱 브라우저"],
            support: ["구글 크롬", "마이크로소프트 엣지", "파이어폭스", "삼성 모바일 인터넷"],
        }
      
    }
}
</script>