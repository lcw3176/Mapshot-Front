<template>
    <div>
        <div class="column is-half">

            <div class="media-content mt-5">
                <p class="title is-5">반경 설정</p>
                <p>지도가 수집될 범위의 반경입니다.</p>
                <p>기본값은 10km로 설정됩니다.</p>
                <p>이 값은 <strong>네이버</strong> 기준입니다. 카카오와 구글은 정확한 추정이 어렵습니다.</p>
            </div>

        </div>


        <div class="card-image columns columns mt-5">
            <figure class="image is-256x256 column is-half">
                <img :src="zoom">
            </figure>
            <div class="column">
                <div class="media-content mt-5">
                    <p class="subtitle is-5">1km</p>
                    <p>최대 확대 배율로 121장의 사진을 수집합니다.</p>
                    <p>원본 그대로의 사진을 조립합니다.</p>
                </div>


                <div class="media-content mt-5">
                    <p class="subtitle is-5">2km</p>
                    <p>최대 확대 배율로 289장의 사진을 수집합니다.</p>
                    <p>원본 이미지를 절반으로 축소 후 조립합니다.</p>
                </div>


                <div class="media-content mt-5">
                    <p class="subtitle is-5">5km</p>
                    <p>최대 확대보다 2단계 낮은 배율로 121장의 사진을 수집합니다.</p>
                    <p>원본 그대로의 사진을 조립합니다.</p>
                </div>


                <div class="media-content mt-5">
                    <p class="subtitle is-5">10km</p>
                    <p>최대 확대보다 2단계 낮은 배율로 441장의 사진을 수집합니다.</p>
                    <p>원본 이미지를 절반으로 축소 후 조립합니다.</p>
                </div>
            </div>

        </div>
        <div class="card-content">


        </div>
    </div>
</template>

<script>
import zoom from '@/assets/img/manual/2/1.jpg'

export default {
    name: 'ChooseRange',

    data(){
        return {
            zoom: zoom
        }
    }
}
</script>