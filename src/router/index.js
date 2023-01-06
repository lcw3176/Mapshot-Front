import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'map',
    component: () => import(/* webpackChunkName: "map" */ '../views/MapView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/ContactView.vue')
  },
  {
    path: '/manual',
    name: 'manual',
    component: () => import(/* webpackChunkName: "manual" */ '../views/ManualView.vue')
  },

  {
    path: '/notice',
    name: 'noticeSummary',
    component: () => import(/* webpackChunkName: "noticeSummary" */ '../views/NoticeSummaryView.vue')
  },

  {
    path: '/notice/detail/:postNumber',
    name: 'noticeDetail',
    component: () => import(/* webpackChunkName: "noticeDetail" */ '../views/NoticeDetailView.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
