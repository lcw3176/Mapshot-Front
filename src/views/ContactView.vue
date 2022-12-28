<template>
    <!-- <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
    <script type="text/javascript" th:src="@{/js/contact.js}"></script> -->

    <form class="container mt-5" id="contact-form">
        <input type="hidden" name="contact_number">
        <div class="field">
            <label class="label">카테고리</label>
            <div class="control">
                <div class="select">
                    <select name="to_name">
                        <option>오류 / 버그</option>
                        <option>기능 추가</option>
                        <option>사용법</option>
                        <option>기타</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="field">
            <label class="label">답신 메일</label>
            <div class="control has-icons-left has-icons-right">
                <input class="input" type="email" placeholder="답장 받으실 메일을 적어주세요" name="from_name">
                <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                </span>
            </div>
        </div>

        <div class="field">
            <label class="label">내용</label>
            <div class="control">
                <textarea class="textarea" rows="10" placeholder="내용을 적어주세요" name="message"></textarea>
            </div>
        </div>

        <div class="field is-grouped">
            <div class="control">
                <button id="submitButton" type="submit" class="button is-link">전송하기</button>
            </div>
        </div>

    </form>
</template>


<script>
export default {
    name: 'ContactView'
}
</script>