import { defineStore } from "pinia";
import dayjs from 'dayjs';

import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';

const api = axios.create({
  headers: { 'Cache-Control': 'no-cache' },
  adapter: cacheAdapterEnhancer(axios.getAdapter(axios.defaults.adapter)),
});

const apiUrl = process.env.VUE_APP_API_URL;

api.interceptors.response.use(
  (response) => {

    return response;
  },
  (err) => {
    if(err.response.status === 404){
      window.location.href = "/404";
    }

    return Promise.reject(err);
  }
);

async function getContent(id) {
  const response = await api.get(apiUrl + '/notice/' + id);
  return response.data;
}


async function getSummary(id) {
  const response = await api.get(apiUrl + '/notice?page=' + id);
  return response.data;
}



export const useNoticeStore = defineStore("noticeStore", {

  state: () => ({
    notice: Object,
    notices: [],
    nowPage: 0,
    loading: false,
    totalPage: 0,
  }),


  getters: {

  },

  actions: {
    async loadPost(id) {
      this.loading = true;

      this.notice = '';
      this.notice = await getContent(id);

      this.loading = false;
    },

    async loadPostList(id) {
      this.loading = true;

      this.notices = '';
      let data = await getSummary(id);

      this.totalPage = data.totalPage;
      this.notices = data.notices;

      this.loading = false;
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
