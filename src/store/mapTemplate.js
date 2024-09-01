import { defineStore } from "pinia";
import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_URL;

async function requestImage(queryString) {
  try {
    const response = await axios.get(apiUrl + '/image/template/kakao?lat=37.58224966162435&lng=126.95018587731077' +
      '&level=2&type=satellite_base&layerMode=false&neLat=37.59984094126859&neLng=126.97296587731077');

    return response.data;
  } catch (error) {

    return [];
  }

}



export const useMapTemplateStore = defineStore("mapTemplate", {
  state: () => ({
    template: '',

  }),

  getters: {

  },

  actions: {
    async test () {
      let template = await requestImage();

      const newWindow = window.open("/templateSketch.html", "_blank");
      if (newWindow) {
        newWindow.loadContent(template);
      } else {
        alert("새 창을 열 수 없습니다. 팝업이 차단되었을 수 있습니다.");

      }
    }
  }

})
