<template>
    <nav class="navbar is-light mb-6">
        <div class="container" id="navbar">
            <div class="navbar-brand">
                <router-link class="navbar-item" to="/">
                    <p class="title is-4">MAPSHOT</p>
                </router-link>

                <a role="button" class="navbar-burger" onclick="navbarBurgerClick(this)">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div class="navbar-menu" id="navbar-menu">
                <div class="navbar-start">
                    <router-link class="navbar-item" to="/manual">
                        사용법
                    </router-link>

                    <router-link class="navbar-item" to="/notice">
                        공지사항
                    </router-link>

                    <router-link class="navbar-item" to="/contact">
                        문의
                    </router-link>

                    <router-link class="navbar-item" to="/preview">
                        미리보기
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import NavbarFunction from '@/assets/js/navbar.js'

export default {
    name: 'NavbarView'
}
</script>