import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import axios from 'axios'

const api = axios.create({
  headers: { 'Cache-Control': 'no-cache' },
})

const apiUrl = process.env.VUE_APP_API_URL

async function getRecent () {
  // 원본 기사가 아니라 LLM이 요약해 발행한 '도시뉴스' 게시글이 내려온다.
  // 형식: [{ id, title, content(HTML), sources:[{title,url}], viewCount, createdDate }]
  const response = await api.get(apiUrl + '/news/recent')
  return response.data
}

export const useNewsStore = defineStore('newsStore', {

  state: () => ({
    posts: [],
    isLoading: false,
    isError: false,
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

    formatDate (dateString) {
      if (!dateString) {
        return ''
      }
      return dayjs(dateString).format('YYYY.MM.DD HH:mm')
    },
  },
})
