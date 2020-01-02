import Vue from 'vue'
import VueRouter from 'vue-router'
import TheMenu from '@/views/TheMenu.vue'
import TheSettings from '@/views/TheSettings.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'menu',
    component: TheMenu,
    meta: {
      forward: [
        'settings',
        'selection',
        'shop'
      ]
    }
  },
  {
    path: '/selection/:destination',
    name: 'selection'
  },
  {
    path: '/settings',
    name: 'settings',
    component: TheSettings,
    meta: {
      forward: []
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
