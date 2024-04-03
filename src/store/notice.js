import { defineStore } from "pinia";
import axios from 'axios';
import dayjs from 'dayjs';

const apiUrl = process.env.VUE_APP_API_URL;

async function getContent(id) {
  const response = await axios.get(apiUrl + '/notice/detail/' + id);
  return response.data;
}


async function getSummary(id) {
  const response = await axios.get(apiUrl + '/notice/list/' + id);
  return response.data;
}



export const useNoticeStore = defineStore("noticeStore", {

  state: () => ({
    notice: Object,
    notices: [],
    lastLoadedId: 0,
    loading: false,
  }),


  getters: {

  },

  actions: {
    async loadPost(id) {
      this.notice = '';
      this.loading = true;

      let data = await getContent(id);
      this.notice = data;

      this.loading = false;
    },

    async infiniteHandler($state) {
      if (this.lastLoadedId === 1) {
        return;
      }
      this.loading = true;

      let data = await getSummary(this.lastLoadedId);

      this.loading = false;

      if (this.lastLoadedId != 1) {

        data.forEach(element => {
          this.notices.push(element);
          this.lastLoadedId = element.id;
        });

        $state.loaded();
      } else {

      }

    },

    formatDate(dateString) {
      const date = dayjs(dateString);

      return date.format('YYYY.MM.DD HH:mm');
    },

    getNoticeTypeClass(noticeType) {
      switch (noticeType) {
        case '업데이트':
          return 'success';
        case '점검예정':
          return 'warning';
        case '오류수정':
          return 'error';
      }
    },
  }
});