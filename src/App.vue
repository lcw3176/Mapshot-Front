<template>
  <NavbarView/>
  <router-view/>
  <AdsView/>
</template>

<script>
// @ is an alias to /src
import NavbarView from './views/NavbarView'
import AdsView from './views/AdsView'

export default {
  components: {
    NavbarView,
    AdsView
  }
}
</script>
