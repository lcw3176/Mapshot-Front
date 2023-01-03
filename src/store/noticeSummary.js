import { defineStore } from "pinia";
import axios from 'axios';

async function getData(id){
    const response = await axios.get('https://port-0-mapshot-api-ngsnp25lbunrwi4.gksl2.cloudtype.app/api/notice/summary/' + id);
    return response.data;
}



export const useNoticeSummaryStore = defineStore("noticeSummaryStore", {

  state: () => ({
    notices: [],
    lastLoadedId: 0,
  }),


  getters: {
    getNotices(){
        return this.notices;
    }
  },

  actions: {
    async infiniteHandler($state) {
        let data = await getData(this.lastLoadedId);

        if (this.lastLoadedId != 1) {

            data.forEach(element => {
                this.notices.push(element);
                this.lastLoadedId = element.id;
            });
            
            $state.loaded();
        } else {
            $state.complete();
        }

    }
  }
});