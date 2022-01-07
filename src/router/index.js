import Vue from 'vue'
import VueRouter from 'vue-router'
import TheMenu from '@/views/TheMenu.vue'
import SelectionCategory from '@/views/SelectionCategory.vue'
import SelectionCount from '@/views/SelectionCount.vue'
import ThePackages from '@/views/ThePackages.vue'
import PackagesEdit from '@/views/PackagesEdit.vue'
import PackagesEditCategories from '@/views/PackagesEditCategories.vue'
import PackagesEditWord from '@/views/PackagesEditWord.vue'
import TheTraining from '@/views/TheTraining.vue'
import TheWriteKanji from '@/views/TheWriteKanji.vue'
import TheDictionary from '@/views/TheDictionary.vue'
import TheAdventure from '@/views/TheAdventure.vue'
import AdventureStory from '@/views/AdventureStory.vue'
import AdventureMapNavigation from '@/views/AdventureMapNavigation.vue'
import AdventureHome from '@/views/AdventureHome.vue'
import AdventureInputs from '@/views/AdventureInputs.vue'
import AdventureChoose from '@/views/AdventureChoose.vue'
import AdventureStatistics from '@/views/AdventureStatistics.vue'
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
        'dictionary',
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
        'packages',
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
    path: '/packages',
    name: 'packages',
    component: ThePackages,
    meta: {
      forward: [
        'packagesEdit'
      ]
    }
  },
  {
    path: '/packages/edit',
    name: 'packagesEdit',
    component: PackagesEdit,
    meta: {
      forward: [
        'packagesEditCategories'
      ]
    }
  },
  {
    path: '/packages/edit/categories',
    name: 'packagesEditCategories',
    component: PackagesEditCategories,
    meta: {
      forward: [
        'packagesEditWord'
      ]
    }
  },
  {
    path: '/packages/edit/word',
    name: 'packagesEditWord',
    component: PackagesEditWord,
    meta: {
      forward: []
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
    path: '/dictionary',
    name: 'dictionary',
    component: TheDictionary,
    meta: {
      forward: [
        'packages',
        'dictionaryDetails'
      ]
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
          forward: [],
          delay: [
            'adventureMap'
          ]
        }
      },
      {
        path: 'story',
        name: 'adventureStory',
        component: AdventureStory,
        meta: {
          forward: [],
          delay: [
            'adventureHome'
          ]
        }
      },
      {
        path: 'map',
        name: 'adventureMap',
        component: AdventureMapNavigation,
        meta: {
          forward: [],
          delay: [
            'adventureHome',
            'adventure'
          ]
        }
      },
      {
        path: 'home',
        name: 'adventureHome',
        component: AdventureHome,
        meta: {
          forward: [],
          delay: [
            'adventureMap'
          ]
        }
      },
      {
        path: 'choose',
        name: 'adventureChoose',
        component: AdventureChoose,
        meta: {
          forward: [],
          delay: []
        }
      },
      {
        path: 'statistics',
        name: 'adventureStatistics',
        component: AdventureStatistics,
        meta: {
          forward: [],
          delay: []
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
      forward: [
        'packages'
      ]
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
