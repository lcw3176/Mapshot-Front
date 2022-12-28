<template>
    <div class="container is-fluid mt-5 mb-5">
        <div class="pagination is-centered" role="navigation" aria-label="pagination">
            <a th:if="${pageResponse.hasPrevious}" class="pagination-previous"
                th:href="@{'/notice/' + ${pageResponse.previousPage}}">
                <i class="fas fa-arrow-left"></i>
            </a>
            <a th:if="${pageResponse.hasNext}" class="pagination-next"
                th:href="@{'/notice/' + ${pageResponse.nextPage}}">
                <i class="fas fa-arrow-right"></i>
            </a>
            <ul class="pagination-list">
                <li th:each="num : ${#numbers.sequence(pageResponse.startPage, pageResponse.lastPage)}">
                    <a class="pagination-link" th:href="@{'/notice/' + ${num}}" th:text="${num}"
                        th:classappend="${pageResponse.nowPage == num} ? 'is-current': ''"></a>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>

export default {
    name: 'Pagination',
}

</script>
