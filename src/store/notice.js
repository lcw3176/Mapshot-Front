import { defineStore } from "pinia";
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'

async function getContent(id) {
  const response = await axios.get('https://port-0-mapshot-api-ngsnp25lbunrwi4.gksl2.cloudtype.app/api/notice/detail/' + id);
  return response.data;
}


async function getSummary(id){
    const response = await axios.get('https://port-0-mapshot-api-ngsnp25lbunrwi4.gksl2.cloudtype.app/api/notice/summary/' + id);
    return response.data;
}

dayjs.locale('ko')


export const useNoticeStore = defineStore("noticeStore", {

  state: () => ({
    notice: Object,
    notices: [],
    lastLoadedId: 0,
  }),


  getters: {
    getNotice() {
      return this.notice;
    },

    getNotices(){
        return this.notices;
    }
  },

  actions: {
    async loadPost(id) {
      this.notice = '';
      let data = await getContent(id);
      this.notice = data;
    },

    async infiniteHandler($state) {
        let data = await getSummary(this.lastLoadedId);

        if (this.lastLoadedId != 1) {

            data.forEach(element => {
                this.notices.push(element);
                this.lastLoadedId = element.id;
            });
            
            $state.loaded();
        } else {
            $state.complete();
        }

    },

    formatDate(dateString) {
        const date = dayjs(dateString);

        return date.format('YYYY.MM.DD hh:ss');
    },

    getNoticeTypeClass(noticeType) {
        switch (noticeType) {
            case '업데이트':
                return 'tag is-info mb-2';
            case '점검예정':
                return 'tag is-warning mb-2';
            case '오류수정':
                return 'tag is-danger mb-2';
        }
    },
  }
});