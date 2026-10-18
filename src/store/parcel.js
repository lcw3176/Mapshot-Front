import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create()

const apiUrl = process.env.VUE_APP_API_URL

/**
 * 브이월드 호출량을 아끼려고 지킨 규칙:
 * - hover 미리보기 없음. 사용자가 "필지 정보 보기"를 켠 상태에서 명시적으로 클릭했을 때만 호출한다.
 * - 요청이 진행 중이면 새 요청을 받지 않는다(중복 클릭 방지).
 * - 같은 좌표를 다시 클릭하면 이미 받아둔 결과를 그대로 쓴다.
 *
 * 서버는 PNU 단위로 캐시하므로 여기서 좌표 단위로 한 번 더 막아주면 왕복 자체가 줄어든다.
 */
export const useParcelStore = defineStore('parcel', {

  state: () => ({
    // 필지 조회 모드. 꺼져 있으면 지도 클릭이 캡쳐 범위 지정으로만 동작한다.
    enabled: false,

    parcel: null,
    isLoading: false,
    errorMessage: '',
    question: '',
    answer: null,
    messages: [],
    answerError: '',
    isAsking: false,
    selectedPoint: null,
    parcelRequestId: 0,
    questionRequestId: 0,

    // 직전에 조회한 좌표. 같은 필지 반복 클릭 시 재호출을 막는다.
    lastQueriedKey: '',
  }),

  getters: {
    /**
     * 용도지역/지구/구역을 한 줄로 합친 표기.
     * 필지 하나에 여러 개가 걸리는 경우가 흔해서(예: 제2종일반주거지역 + 지구단위계획구역) 목록을 이어붙인다.
     */
    landUseSummary (state) {
      if (!state.parcel?.landUses?.length) return ''
      return state.parcel.landUses.map(it => it.name).filter(Boolean).join(', ')
    },
  },

  actions: {
    toggle () {
      this.enabled = !this.enabled

      if (!this.enabled) {
        this.clear()
      }
    },

    clear () {
      this.parcelRequestId += 1
      this.questionRequestId += 1
      this.parcel = null
      this.isLoading = false
      this.isAsking = false
      this.errorMessage = ''
      this.lastQueriedKey = ''
      this.question = ''
      this.answer = null
      this.messages = []
      this.answerError = ''
      this.selectedPoint = null
    },

    /**
     * 클릭 좌표의 필지 속성을 조회한다.
     *
     * @param lat 위도
     * @param lng 경도
     */
    async load (lat, lng) {
      if (!this.enabled || this.isLoading) {
        return
      }

      // 소수점 6자리면 약 10cm 단위라 사실상 같은 지점의 재클릭을 걸러낸다.
      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`

      if (key === this.lastQueriedKey && this.parcel) {
        return
      }

      const requestId = ++this.parcelRequestId
      this.questionRequestId += 1
      this.isAsking = false
      this.isLoading = true
      this.errorMessage = ''
      this.selectedPoint = { lat, lng }

      try {
        const response = await api.get(apiUrl + '/parcel', { params: { lat, lng } })
        if (requestId !== this.parcelRequestId || !this.enabled) return
        this.parcel = response.data
        this.lastQueriedKey = key
        this.question = ''
        this.answer = null
        this.messages = []
        this.answerError = ''
      } catch (e) {
        if (requestId !== this.parcelRequestId || !this.enabled) return
        logParcelError('parcel-lookup', e)
        this.parcel = null
        this.lastQueriedKey = ''
        this.errorMessage = resolveErrorMessage(e)
        this.selectedPoint = null
      } finally {
        if (requestId === this.parcelRequestId) this.isLoading = false
      }
    },
    async ask (input) {
      const question = input.trim()
      const pnu = this.parcel?.pnu
      if (!pnu || !question || this.isAsking) return

      const requestId = ++this.questionRequestId
      this.isAsking = true
      this.answer = null
      this.answerError = ''
      this.question = ''
      const message = { id: Date.now(), question, answer: null, error: '' }
      this.messages.push(message)
      try {
        const response = await api.post(`${apiUrl}/parcel/${encodeURIComponent(pnu)}/ask`, { question })
        if (requestId === this.questionRequestId && this.parcel?.pnu === pnu) {
          message.answer = response.data
          this.answer = response.data
        }
      } catch (e) {
        logParcelError('parcel-question', e)
        if (requestId === this.questionRequestId && this.parcel?.pnu === pnu) {
          message.error = resolveErrorMessage(e, true)
          this.answerError = message.error
        }
      } finally {
        if (requestId === this.questionRequestId) this.isAsking = false
      }
    },
  },
})

function logParcelError (operation, e) {
  const data = e?.response?.data
  console.error('[Mapshot API]', {
    operation,
    status: e?.response?.status || 'network',
    source: data?.source || (e?.response ? 'server' : 'browser-or-network'),
    stage: data?.stage || 'unknown',
    code: data?.code || '',
    upstreamStatus: data?.upstreamStatus || '',
    requestId: e?.response?.headers?.['x-request-id'] || data?.requestId || '',
  })
}

function resolveErrorMessage (e, question = false) {
  const status = e?.response?.status
  const id = e?.response?.headers?.['x-request-id'] || e?.response?.data?.requestId
  const requestId = id ? ` (요청 ID: ${id})` : ''
  if (status === 404) return `해당 위치에는 필지 정보가 없습니다. (도로, 하천 등)${requestId}`
  if (status === 429) return `조회 요청이 많습니다. 잠시 후 다시 시도해 주세요.${requestId}`
  if (status === 403) return `접근이 거부되었습니다(403). CORS 또는 서버 접근 설정을 확인해 주세요.${requestId}`
  if (status === 502 && e?.response?.data?.source === 'vworld') {
    return `브이월드 조회가 실패했습니다. 잠시 후 다시 시도해 주세요.${requestId}`
  }
  if (!e?.response) return '서버 연결에 실패했습니다. 개발자 도구의 네트워크 오류와 CORS 설정을 확인해 주세요.'
  return `${question ? '답변' : '필지 정보'}을 불러오지 못했습니다. (${status})${requestId}`
}
