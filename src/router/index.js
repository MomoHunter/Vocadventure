import Vue from 'vue'
import VueRouter from 'vue-router'
import TheMenu from '@/views/TheMenu.vue'
import SelectionCategory from '@/views/SelectionCategory.vue'
import SelectionCount from '@/views/SelectionCount.vue'
import TheTraining from '@/views/TheTraining.vue'
import TheWriteKanji from '@/views/TheWriteKanji.vue'
import TheAdventure from '@/views/TheAdventure.vue'
import AdventureIntro from '@/views/AdventureIntro.vue'
import AdventureMapNavigation from '@/views/AdventureMapNavigation.vue'
import AdventureHome from '@/views/AdventureHome.vue'
import AdventureInputs from '@/views/AdventureInputs.vue'
import AdventureChoose from '@/views/AdventureChoose.vue'
import AdventureStatistics from '@/views/AdventureStatistics.vue'
import AdventurePlaceholder from '@/views/AdventurePlaceholder.vue'
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
        'adventure',
        'adventureInputs'
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
    component: TheAdventure,
    children: [
      {
        path: '',
        name: 'adventure',
        component: AdventureInputs,
        meta: {
          forward: []
        }
      },
      {
        path: 'intro',
        name: 'adventureIntro',
        component: AdventureIntro,
        meta: {
          forward: []
        }
      },
      {
        path: 'map',
        name: 'adventureMap',
        component: AdventureMapNavigation,
        meta: {
          forward: []
        }
      },
      {
        path: 'home',
        name: 'adventureHome',
        component: AdventureHome,
        meta: {
          forward: []
        }
      },
      {
        path: 'choose',
        name: 'adventureChoose',
        component: AdventureChoose,
        meta: {
          forward: []
        }
      },
      {
        path: 'statistics',
        name: 'adventureStatistics',
        component: AdventureStatistics,
        meta: {
          forward: []
        }
      },
      {
        path: 'placeholder',
        name: 'adventurePlaceholder',
        component: AdventurePlaceholder,
        meta: {
          forward: []
        }
      }
    ],
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
