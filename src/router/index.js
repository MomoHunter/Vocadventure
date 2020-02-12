import Vue from 'vue'
import VueRouter from 'vue-router'
import TheMenu from '@/views/TheMenu.vue'
import SelectionCategory from '@/views/SelectionCategory.vue'
import SelectionCount from '@/views/SelectionCount.vue'
import TheTraining from '@/views/TheTraining.vue'
import TheWriteKanji from '@/views/TheWriteKanji.vue'
import TheAdventure from '@/views/TheAdventure.vue'
import TheShop from '@/views/TheShop.vue'
import TheDetails from '@/views/TheDetails.vue'
import TheInventory from '@/views/TheInventory.vue'
import TheSettings from '@/views/TheSettings.vue'
import TheNotFound from '@/views/TheNotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'menu',
    component: TheMenu,
    meta: {
      forward: [
        'settings',
        'category',
        'shop'
      ]
    }
  },
  {
    path: '/category/:destination',
    name: 'category',
    component: SelectionCategory,
    meta: {
      forward: [
        'selection',
        'training',
        'writeKanji'
      ]
    }
  },
  {
    path: '/selection',
    name: 'selection',
    component: SelectionCount,
    meta: {
      forward: [
        'adventure'
      ]
    }
  },
  {
    path: '/training',
    name: 'training',
    component: TheTraining,
    meta: {
      forward: [
        'writeKanji'
      ]
    }
  },
  {
    path: '/writeKanji',
    name: 'writeKanji',
    component: TheWriteKanji,
    meta: {
      forward: []
    }
  },
  {
    path: '/adventure',
    name: 'adventure',
    component: TheAdventure,
    meta: {
      forward: []
    }
  },
  {
    path: '/shop',
    name: 'shop',
    component: TheShop,
    meta: {
      forward: [
        'inventory',
        'details'
      ]
    }
  },
  {
    path: '/details/:item',
    name: 'details',
    component: TheDetails,
    meta: {
      forward: []
    }
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: TheInventory,
    meta: {
      forward: []
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: TheSettings,
    meta: {
      forward: []
    }
  },
  {
    path: '*',
    component: TheNotFound,
    meta: {
      forward: [
        'menu'
      ]
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
