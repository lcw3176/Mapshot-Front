import { defineStore } from "pinia";
import axios from 'axios';
import dayjs from 'dayjs';

const apiUrl = process.env.VUE_APP_API_URL;

async function getContent(id) {
  const response = await axios.get(apiUrl + '/post/detail/' + id);
  return response.data;
}

async function registerPost(post) {
  try{
    const response = await axios.post(apiUrl + '/post/register', {
      title: post.title,
      content: post.content,
      password: post.password,
      writer: post.writer,
    });

    return true;

  } catch (e){

    return false;
  }


}


async function getContentList(id) {
  const response = await axios.get(apiUrl + '/post/' + id);
  return response.data;
}



export const useCommunityStore = defineStore("communityStore", {

  state: () => ({
    post: Object,
    posts: [],
    lastLoadedId: 0,
  }),


  getters: {

  },

  actions: {
    async loadSinglePost(id) {
      this.post = await getContent(id);
    },

    async loadPostList(id) {
      this.posts = await getContentList(id);
    },

    async register() {
      this.post.writer = (Math.random() + 1).toString(36).substring(7);

      let success = await registerPost(this.post);

      if(success){
        alert("등록 완료되었습니다.");
        window.location.href = "/community";
      } else {
        alert("등록에 실패했습니다.");
      }
    },


    formatDate(dateString) {
      const date = dayjs(dateString);

      return date.format('YYYY.MM.DD HH:mm');
    },
  }
});
