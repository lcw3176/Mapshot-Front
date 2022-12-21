<template>
  <NavbarView/>
  <router-view class="container is-fluid"/>
</template>

<script>
// @ is an alias to /src
import NavbarView from './views/NavbarView'
import NavbarFunction from './assets/js/navbar.js'

export default {
  components: {
    NavbarView
  }
}
</script>

<style>

@import "./assets/css/style.css";

</style>