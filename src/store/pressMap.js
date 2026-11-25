import { defineStore } from 'pinia'
import axios from 'axios'
import dayjs from 'dayjs'

const api = axios.create()
const apiUrl = process.env.VUE_APP_API_URL

// 이 카카오맵 레벨(숫자가 클수록 넓게 봄)부터는 시군구 마커가 겹쳐 읽을 수 없어 시도 단위로 묶는다.
export const SIDO_LEVEL = 12

export const PERIODS = [7, 30, 90]

// 사흘 안에 올라온 소식은 '새 소식' 점을 찍는다.
const NEW_DAYS = 3

/**
 * 지도 '도시소식' 레이어 상태.
 *
 * 서버(GET /news/map)는 보도자료(items)를 한 번만 내려주고, 지도 마커(regions)와 전국 목록(nationalIds)은
 * id 로만 가리킨다. 여기서는
 *  - 줌 레벨에 맞춰 마커를 시군구/시도 단위로 묶고(markers)
 *  - 지금 지도에 보이는 마커나 사용자가 고른 마커 기준으로 목록을 만든다(listItems).
 */
export const usePressMapStore = defineStore('pressMap', {

  state: () => ({
    enabled: false,
    days: 30,
    isLoading: false,
    isError: false,
    data: null,
    loadedDays: null,

    mapLevel: 7,
    // 지도 범위 안에 들어온 마커 key. null 이면 아직 계산 전(전체로 취급)
    visibleKeys: null,
    // 사용자가 누른 마커 { key, label, itemIds }
    selected: null,
    expandedId: null,
    showNational: false,
  }),

  getters: {
    itemsById (state) {
      const map = new Map()
      for (const item of state.data?.items ?? []) map.set(item.id, item)
      return map
    },

    /** 현재 줌에 맞춘 마커. 시도 단위로 묶을 때는 같은 보도자료가 한 번만 세지도록 id 를 합친다. */
    markers (state) {
      const regions = state.data?.regions ?? []
      if (state.mapLevel < SIDO_LEVEL) {
        return regions.map(r => ({
          key: r.code,
          label: r.label,
          lat: r.lat,
          lng: r.lng,
          itemIds: r.itemIds,
        }))
      }
      const bySido = new Map()
      for (const r of regions) {
        const key = 'sido:' + r.sido
        const g = bySido.get(key) ?? { key, label: r.sido, points: [], ids: new Set(), anchor: null }
        if (r.level === 'SIDO') g.anchor = { lat: r.lat, lng: r.lng }
        g.points.push(r)
        r.itemIds.forEach(id => g.ids.add(id))
        bySido.set(key, g)
      }
      return [...bySido.values()].map(g => {
        const anchor = g.anchor ?? {
          lat: g.points.reduce((s, p) => s + p.lat, 0) / g.points.length,
          lng: g.points.reduce((s, p) => s + p.lng, 0) / g.points.length,
        }
        return { key: g.key, label: g.label, lat: anchor.lat, lng: anchor.lng, itemIds: [...g.ids] }
      })
    },

    /** 목록에 보일 보도자료: 고른 마커 > 지도에 보이는 마커 순. 최신순 */
    listItems () {
      let ids
      if (this.selected) {
        ids = this.selected.itemIds
      } else {
        const visible = this.visibleKeys
        ids = this.markers
          .filter(m => visible === null || visible.includes(m.key))
          .flatMap(m => m.itemIds)
      }
      return this.sortedItems(new Set(ids))
    },

    nationalItems () {
      return this.sortedItems(new Set(this.data?.nationalIds ?? []))
    },

    totalCount (state) {
      return state.data?.items?.length ?? 0
    },
  },

  actions: {
    sortedItems (idSet) {
      return [...idSet]
        .map(id => this.itemsById.get(id))
        .filter(Boolean)
        .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    },

    isNew (item) {
      return item.publishedAt && dayjs().diff(dayjs(item.publishedAt), 'day') < NEW_DAYS
    },

    async toggle () {
      this.enabled = !this.enabled
      if (this.enabled && (this.data === null || this.loadedDays !== this.days)) {
        await this.load()
      }
      if (!this.enabled) {
        this.selected = null
        this.expandedId = null
      }
    },

    async load () {
      this.isLoading = true
      this.isError = false
      try {
        const res = await api.get(apiUrl + '/news/map', { params: { days: this.days } })
        this.data = res.data
        this.loadedDays = this.days
        this.selected = null
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },

    async changeDays (days) {
      if (this.days === days && this.data) return
      this.days = days
      await this.load()
    },

    select (marker) {
      if (this.selected?.key === marker.key) {
        this.selected = null
        return
      }
      this.selected = { key: marker.key, label: marker.label, itemIds: marker.itemIds }
      this.expandedId = null
    },

    clearSelection () {
      this.selected = null
    },

    toggleExpanded (id) {
      this.expandedId = this.expandedId === id ? null : id
    },
  },
})
