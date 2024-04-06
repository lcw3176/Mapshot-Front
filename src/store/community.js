import { defineStore } from "pinia";
import axios from 'axios';
import dayjs from 'dayjs';

const apiUrl = process.env.VUE_APP_API_URL;


async function getPost(id) {
  const response = await axios.get(apiUrl + '/post/detail/' + id);
  return response.data;
}

async function registerPost(post) {
  try{
    await axios.post(apiUrl + '/post/register', {
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


async function getPostList(id) {
  const response = await axios.get(apiUrl + '/post/' + id);
  return response.data;
}

async function deletePost(id, password) {
  try{
    await axios.get(apiUrl + '/post/delete/' + id + '?password=' + password);

    return true;

  } catch (e){

    return false;
  }

}



export const useCommunityStore = defineStore("communityStore", {

  state: () => ({
    post: Object,
    posts: [],
    lastLoadedId: 0,
    loading: false,
    password: '',
  }),


  getters: {

  },

  actions: {

    async loadSinglePost(id) {
      this.loading = true;


      this.post = '';
      this.post = await getPost(id);

      this.loading = false;
    },

    async loadPostList(id) {
      this.loading = true;

      this.posts = '';
      this.posts = await getPostList(id);

      this.loading = false;
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

    async delete(){
      let success = await deletePost(this.post.id, this.password);

      if(success){
        alert("삭제 완료되었습니다.");
        window.location.href = "/community";
      } else {
        alert("삭제에 실패했습니다.");
      }
    },

    formatDate(dateString) {
      const date = dayjs(dateString);

      return date.format('YYYY.MM.DD HH:mm');
    },
  }
});
