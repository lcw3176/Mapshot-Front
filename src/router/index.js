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
    name: 'notice',
    component: () => import(/* webpackChunkName: "manual" */ '../views/NoticeView.vue')
  },

  {
    path: '/preview',
    name: 'preview',
    component: () => import(/* webpackChunkName: "preview" */ '../views/PreviewView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
