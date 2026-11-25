<template>
  <li class="press-item" :class="{ 'is-open': open }">
    <button type="button" class="press-item__head" :aria-expanded="open" @click="$emit('toggle')">
      <span v-if="isNew" class="press-item__new" title="최근 사흘 안에 올라온 소식"></span>
      <span class="press-item__title">{{ item.title }}</span>
      <span class="press-item__meta">
        <span v-if="regionText" class="press-item__regions">{{ regionText }}</span>
        <span v-if="item.department" class="press-item__dept">{{ item.department }}</span>
      </span>
    </button>

    <div v-if="open" class="press-item__body">
      <ul v-if="item.subtitles?.length" class="press-item__points">
        <li v-for="(s, i) in item.subtitles" :key="i">{{ s }}</li>
      </ul>
      <p v-else class="press-item__empty">요약이 없는 보도자료예요. 원문에서 내용을 확인해 주세요.</p>

      <div class="press-item__actions">
        <a :href="item.url" target="_blank" rel="noopener" class="press-item__link">
          <v-icon size="14" class="mr-1">mdi-open-in-new</v-icon>{{ item.sourceName }} 원문 보기
        </a>
        <button v-if="item.regions?.length" type="button" class="press-item__link" @click="$emit('locate')">
          <v-icon size="14" class="mr-1">mdi-crosshairs-gps</v-icon>지도에서 보기
        </button>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'PressItem',
  props: {
    item: { type: Object, required: true },
    open: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
  },
  emits: ['toggle', 'locate'],
  computed: {
    regionText () {
      const regions = this.item.regions ?? []
      if (!regions.length) return ''
      const names = regions.slice(0, 3).map(r => r.label)
      return regions.length > 3 ? `${names.join(', ')} 외 ${regions.length - 3}곳` : names.join(', ')
    },
  },
}
</script>

<style scoped>
.press-item {
  list-style: none;
  border-bottom: 1px solid #e7ebee;
}

.press-item__head {
  position: relative;
  display: block;
  width: 100%;
  padding: 10px 12px 10px 14px;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.press-item__head:hover {
  background: #f4f7f9;
}

.press-item__head:focus-visible {
  outline: 2px solid #039be5;
  outline-offset: -2px;
}

.press-item__new {
  position: absolute;
  left: 5px;
  top: 16px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e8a317;
}

.press-item__title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  color: #1b2a35;
}

.is-open .press-item__title {
  -webkit-line-clamp: unset;
}

.press-item__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 8px;
  margin-top: 4px;
  font-size: 11px;
  line-height: 1.4;
  color: #6b7780;
}

/* index.html 의 전역 '* { font-size }' 규칙이 상속을 이기므로 글자 요소마다 크기를 직접 준다 */
.press-item__meta > span {
  font-size: 11px;
}

.press-item__regions {
  color: #1b3a4b;
  font-weight: 700;
}

.press-item__body {
  padding: 0 12px 12px 14px;
}

.press-item__points {
  margin: 0;
  padding: 0 0 0 10px;
  border-left: 2px solid #1b3a4b;
}

.press-item__points li {
  list-style: none;
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #33424d;
}

.press-item__points li:last-child {
  margin-bottom: 0;
}

.press-item__empty {
  margin: 0;
  font-size: 12px;
  color: #6b7780;
}

.press-item__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin-top: 10px;
}

.press-item__link {
  display: inline-flex;
  align-items: center;
  padding: 0;
  font-size: 12px;
  font-weight: 700;
  color: #0277bd;
  background: none;
  border: 0;
  cursor: pointer;
  text-decoration: none;
}

.press-item__link:hover {
  text-decoration: underline;
}

.press-item__link:focus-visible {
  outline: 2px solid #039be5;
  outline-offset: 2px;
}
</style>
