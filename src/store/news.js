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

async function getRecent (track) {
  // 게시글 목록(경량). 형식: [{ id, title, preview, createdDate, track }] — 본문/출처는 상세에서 받음
  const response = await api.get(apiUrl + '/news/recent', { params: { track } })
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
    posts: [],
    post: null,
    isLoading: false,
    isError: false,
    isDetailLoading: false,
    isDetailError: false,
  }),

  actions: {
    async loadRecent (track) {
      if (track) this.track = track
      this.isLoading = true
      this.isError = false
      try {
        this.posts = await getRecent(this.track)
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
