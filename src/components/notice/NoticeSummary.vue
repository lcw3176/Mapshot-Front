<template>

    <div class="container mt-5">
        <div class="list">
            <div class="list-item box">
                <div class="list-item-image">
                    <span class="tag is-info">업데이트</span>
                </div>

                <div class="list-item-content">
                    <a href="/notice(post=${post.id})">
                        <div class="list-item-title">사이트 개편 안내</div>
                    </a>
                    <div class="list-item-description">23.01.01
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>


<script>

export default {
    name: 'NoticeSummary',
}
</script>
