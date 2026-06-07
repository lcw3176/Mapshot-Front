import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import axios from 'axios'

const api = axios.create({
  headers: { 'Cache-Control': 'no-cache' },
})

const apiUrl = process.env.VUE_APP_API_URL

async function getRecent () {
  // LLM이 요약해 발행한 '도시뉴스' 게시글 목록(경량).
  // 형식: [{ id, title, preview, viewCount, createdDate }] — 본문/출처는 상세에서 받음
  const response = await api.get(apiUrl + '/news/recent')
  return response.data
}

async function getDetail (id) {
  // 상세 조회 시 서버에서 조회수가 1 증가한다.
  const response = await api.get(apiUrl + '/news/' + id)
  return response.data
}

export const useNewsStore = defineStore('newsStore', {

  state: () => ({
    posts: [],
    post: null,
    isLoading: false,
    isError: false,
    isDetailLoading: false,
    isDetailError: false,
  }),

  actions: {
    async loadRecent () {
      this.isLoading = true
      this.isError = false
      try {
        this.posts = await getRecent()
      } catch (e) {
        this.isError = true
        this.posts = []
      } finally {
        this.isLoading = false
      }
    },

    async loadDetail (id) {
      this.isDetailLoading = true
      this.isDetailError = false
      this.post = null
      try {
        this.post = await getDetail(id)
      } catch (e) {
        this.isDetailError = true
        this.post = null
      } finally {
        this.isDetailLoading = false
      }
    },

    formatDate (dateString) {
      if (!dateString) {
        return ''
      }
      return dayjs(dateString).format('YYYY.MM.DD HH:mm')
    },
  },
})
