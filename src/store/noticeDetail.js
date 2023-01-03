import { defineStore } from "pinia";
import axios from 'axios';

async function getData(id) {
  const response = await axios.get('https://port-0-mapshot-api-ngsnp25lbunrwi4.gksl2.cloudtype.app/api/notice/detail/' + id);
  return response.data;
}



export const useNoticeDetailStore = defineStore("noticeDetailStore", {

  state: () => ({
    notice: Object
  }),


  getters: {
    getNotice() {
      return this.notice;
    }
  },

  actions: {
    async loadPost(id) {
      this.notice = '';
      let data = await getData(id);
      this.notice = data;
    }
  }
});