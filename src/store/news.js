import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import axios from 'axios'

const api = axios.create({
  headers: { 'Cache-Control': 'no-cache' },
})

const apiUrl = process.env.VUE_APP_API_URL

/**
 * 도시뉴스는 두 갈래다(mapshot-planning plans/2026-11-city-news-map/explainer.md).
 *  - briefing: 하루 1편, 뉴스 기사를 LLM 이 묶어 요약한 브리핑
 *  - press: 국토부 보도자료 1건 = 글 1편인 '보도자료 풀이'
 */
export const TRACKS = [
  { value: 'briefing', label: '브리핑', desc: '도시공학·도시계획 뉴스를 모아 AI가 하루 한 편으로 요약해 드려요' },
  { value: 'press', label: '보도자료 풀이', desc: '국토교통부 보도자료를 한 건씩 핵심만 정리해 드려요' },
]

async function getPage (track, page) {
  // 게시글 목록 한 페이지(10건). 형식: { posts: [{ id, title, preview, createdDate, track }], page, totalPages, totalElements }
  // 예전 /news/recent 는 최신 30건만 줘서 그보다 오래된 글을 볼 수 없었다.
  const response = await api.get(apiUrl + '/news/list', { params: { track, page } })
  return response.data
}

async function getDetail (id) {
  // 상세 조회 시 서버에서 조회수가 증가한다(어드민 집계용, 사용자에겐 비노출).
  const response = await api.get(apiUrl + '/news/' + id)
  return response.data
}

export const useNewsStore = defineStore('newsStore', {

  state: () => ({
    track: 'briefing',
    page: 1,
    totalPages: 0,
    posts: [],
    post: null,
    isLoading: false,
    isError: false,
    isDetailLoading: false,
    isDetailError: false,
  }),

  actions: {
    async loadRecent (track, page = 1) {
      if (track) this.track = track
      this.page = page
      this.isLoading = true
      this.isError = false
      try {
        const data = await getPage(this.track, this.page)
        this.posts = data.posts
        this.totalPages = data.totalPages
      } catch (e) {
        this.isError = true
        this.posts = []
        this.totalPages = 0
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
