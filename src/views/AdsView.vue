<template>
    <div class="container is-fluid mt-5">
      <div class="columns pr-5 pl-5 has-text-centered">
  
        <div class="column">
          <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-OPghfSGHOLdGJdlJ" data-ad-width="300"
            data-ad-height="250"></ins>

        </div>
  
  
        <div class="column">
          <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-1f22sNeH6puxNSbl" data-ad-width="300"
            data-ad-height="250"></ins>
        </div>
  
        <div class="column">
          <ins class="kakao_ad_area" style="display:none;" data-ad-unit="DAN-HEHh99g6pdekjkfQ" data-ad-width="300"
            data-ad-height="250"></ins>
        </div>
  
      </div>
  
    </div>

</template>


<script>

export default {
    name: 'AdsView',

    mounted() {
      const plugin = document.createElement("script");
      plugin.setAttribute(
        "src",
        "//t1.daumcdn.net/kas/static/ba.min.js"
      );
      plugin.async = true;
      document.head.appendChild(plugin);
    }

}
</script>
