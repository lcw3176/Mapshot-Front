import { createRouter, createWebHistory } from 'vue-router'
import { useLoaderStore } from '@/store/loader'

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
  },

  {
    path: '/faq',
    name: 'faq',
    component: () => import(/* webpackChunkName: "faq" */ '../views/FAQView.vue')
  },

  {
    path: '/community',
    name: 'community',
    component: () => import(/* webpackChunkName: "community" */ '../views/CommunityView.vue')
  },

  {
    path: '/community/:postNumber',
    name: 'communityPost',
    component: () => import(/* webpackChunkName: "communityPost" */ '../views/CommunityPostView.vue'),
    props: true
  },

  {
    path: '/community/register',
    name: 'communityRegister',
    component: () => import(/* webpackChunkName: "communityRegister" */ '../views/CommunityRegisterView.vue')
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  },

  {
    path: '/404',
    name: 'notFound',
    component: () => import(/* webpackChunkName: "notFound" */ '../views/NotFoundView.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const loaderStore = useLoaderStore()

  loaderStore.isLoading = true

  setTimeout(() => {
    next()
  }, 1)

})
router.afterEach(() => {
  const loaderStore = useLoaderStore()
  loaderStore.isLoading = false
})

export default router
