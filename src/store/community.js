import { defineStore } from "pinia";
import dayjs from 'dayjs';

import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';

const api = axios.create({
  headers: { 'Cache-Control': 'no-cache' },
  adapter: cacheAdapterEnhancer(axios.getAdapter(axios.defaults.adapter)),
});


const apiUrl = process.env.VUE_APP_API_URL;


async function getPost(id) {
  const response = await api.get(apiUrl + '/post/' + id);
  return response.data;
}

async function registerPost(post) {
  try{
    await api.post(apiUrl + '/post/register', {
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
  const response = await api.get(apiUrl + '/post?page=' + id);

  return response.data;
}

async function deletePost(id, password) {
  try{
    await api.get(apiUrl + '/post/delete/' + id + '?password=' + password);

    return true;

  } catch (e){

    return false;
  }

}


async function getComments(page, postId) {
  const response = await api.get(apiUrl + '/comment?page=' + page + '&postId=' + postId);

  return response.data;
}



async function registerComment(comment) {
  try{
    await api.post(apiUrl + '/comment/register', {
      content: comment.content,
      password: comment.password,
      writer: comment.writer,
      postId: comment.postId,
    });

    return true;

  } catch (e){

    return false;
  }

}


async function deleteComment(id, password) {
  try{
    await api.get(apiUrl + '/comment/delete/' + id + '?password=' + password);

    return true;

  } catch (e){

    return false;
  }

}



export const useCommunityStore = defineStore("communityStore", {

  state: () => ({
    post: Object,
    posts: [],

    comment: {
      password: '',
      content: '',
      postId: '',
      writer: '',
    },
    comments: [],
    commentPage: 1,
    commentTotalPage: 1,
    commentPassword: '',
    removeCommentId: '',

    nowPage: 1,
    loading: false,
    password: '',
    totalPage: 0,
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
      let data = await getPostList(id);

      this.totalPage = data.totalPage;
      this.posts = data.posts;

      this.loading = false;
    },

    async loadComments(page, id) {
      this.loading = true;

      this.comments = '';
      let data = await getComments(page, id);

      this.commentTotalPage = data.totalPage;
      this.comments = data.comments;

      this.loading = false;
    },


    async registerPost() {
      this.post.writer = (Math.random() + 1).toString(36).substring(7);

      let success = await registerPost(this.post);

      if(success){
        alert("등록 완료되었습니다.");
        window.location.href = "/community";
      } else {
        alert("등록에 실패했습니다.");
      }
    },

    async deletePost(){
      let success = await deletePost(this.post.id, this.password);

      if(success){
        alert("삭제 완료되었습니다.");
        window.location.href = "/community";
      } else {
        alert("삭제에 실패했습니다.");
      }
    },


    async registerComment(postId) {
      this.comment.writer = (Math.random() + 1).toString(36).substring(7);
      this.comment.postId = postId;

      let success = await registerComment(this.comment);

      if(success){
        location.reload();
      } else {
        alert("등록에 실패했습니다.");
      }
    },


    async deleteComment(){
      let success = await deleteComment(this.removeCommentId, this.commentPassword);

      if(success){
        alert("삭제 완료되었습니다.");
        window.location.href = "/community/" + this.post.id;
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
