import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import axios from 'axios'

const api = axios.create({
  headers: { 'Cache-Control': 'no-cache' },
})

const apiUrl = process.env.VUE_APP_API_URL

async function getRecent () {
  const response = await api.get(apiUrl + '/news/recent')
  return response.data
}

export const useNewsStore = defineStore('newsStore', {

  state: () => ({
    articles: [],
    activeKeyword: '전체',
    isLoading: false,
    isError: false,
  }),

  getters: {
    // 수집된 기사에서 키워드 목록을 뽑아 '전체' 와 함께 반환
    keywords (state) {
      const set = new Set(
        state.articles.map((a) => a.keyword).filter((k) => !!k)
      )
      return ['전체', ...set]
    },

    // 현재 선택된 키워드로 필터링된 기사 목록
    filteredArticles (state) {
      if (state.activeKeyword === '전체') {
        return state.articles
      }
      return state.articles.filter((a) => a.keyword === state.activeKeyword)
    },
  },

  actions: {
    async loadRecent () {
      this.isLoading = true
      this.isError = false
      try {
        this.articles = await getRecent()
      } catch (e) {
        this.isError = true
        this.articles = []
      } finally {
        this.isLoading = false
      }
    },

    setKeyword (keyword) {
      this.activeKeyword = keyword
    },

    formatDate (dateString) {
      if (!dateString) {
        return ''
      }
      return dayjs(dateString).format('YYYY.MM.DD HH:mm')
    },

    /**
     * 백엔드 요약 고정 포맷을 화면용 구조로 파싱.
     * 형식: [핵심] ... / [내용] - ... / [시사점] ...
     * 포맷을 벗어나면 raw 로 폴백한다.
     */
    parseSummary (summary) {
      const empty = { core: '', points: [], implication: '', raw: '' }
      if (!summary || !summary.trim()) {
        return empty
      }

      const text = summary.trim()
      const hasMarker = /\[핵심\]|\[내용\]|\[시사점\]/.test(text)
      if (!hasMarker) {
        return { ...empty, raw: text }
      }

      const section = (label, nextLabels) => {
        const next = nextLabels.length
          ? `(?=\\[(?:${nextLabels.join('|')})\\]|$)`
          : '(?=$)'
        const re = new RegExp(`\\[${label}\\]([\\s\\S]*?)${next}`)
        const m = text.match(re)
        return m ? m[1].trim() : ''
      }

      const core = section('핵심', ['내용', '시사점'])
      const contentBlock = section('내용', ['시사점'])
      const implication = section('시사점', [])

      const points = contentBlock
        .split('\n')
        .map((line) => line.replace(/^[\s]*[-•]\s*/, '').trim())
        .filter((line) => line.length > 0)

      return { core, points, implication, raw: '' }
    },
  },
})
