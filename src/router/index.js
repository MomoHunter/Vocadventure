import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import TheMenu from '@/views/TheMenu.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'menu',
    component: TheMenu,
    props: { 'gD': App.globalDict }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
