import { defineStore } from "pinia";
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'

async function getContent(id) {
  const response = await axios.get('https://api.kmapshot.com/notice/detail/' + id);
  return response.data;
}


async function getSummary(id) {
  const response = await axios.get('https://api.kmapshot.com/notice/summary/' + id);
  return response.data;
}

dayjs.locale('ko')


export const useNoticeStore = defineStore("noticeStore", {

  state: () => ({
    notice: Object,
    notices: [],
    lastLoadedId: 0,
    loading: false,
  }),


  getters: {
    getNotice() {
      return this.notice;
    },

    getNotices() {
      return this.notices;
    },

    isLoading() {
      return this.loading;
    }
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

      return date.format('YYYY.MM.DD hh:ss');
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