<template>
    <div>
        <div class="column is-half">
            <div class="media-content mt-5">
                <p class="title is-5">결과 출력</p>
            </div>
        </div>

        <div class="card-content">

            <div class="content">
                <p>작업 시작 버튼을 누르면 설정된 값들을 토대로 사진을 수집합니다.</p>
                <p>진행 상황은 하단의 상태 막대기와 텍스트로 출력됩니다.</p>
                <p>작업이 완료되면 mapshot_result 로 시작하는 이미지 링크가 생성됩니다.</p>
            </div>

        </div>

        <div class="card-content">

        </div>
    </div>
</template>

<script>
export default {
    name: 'PrintResult'
}
</script>