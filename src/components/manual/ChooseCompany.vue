<template>
  <v-card elevation="0">
    <v-card elevation="0">
      <v-img :src="company"></v-img>

    </v-card>

    <p>
      출력할 지도의 회사 종류를 설정합니다. 네이버, 카카오, 구글 3가지가 존재합니다.
    </p>

  </v-card>
</template>

<script>
import company from '@/assets/img/manual/company.jpg'

export default {
  name: 'ChooseCompany',

  data () {
    return {
      company: company
    }
  }
}
</script>
