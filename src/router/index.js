import { createRouter, createWebHistory } from 'vue-router'

import TheMenu from '@/views/TheMenu.vue'
import SelectionCategory from '@/views/SelectionCategory.vue'
import SelectionCount from '@/views/SelectionCount.vue'
import PackagesOverview from '@/views/PackagesOverview.vue'
import PackagesEdit from '@/views/PackagesEdit.vue'
import PackagesEditCategories from '@/views/PackagesEditCategories.vue'
import PackagesEditWord from '@/views/PackagesEditWord.vue'
import TheTraining from '@/views/TheTraining.vue'
import WriteKanjiOverview from '@/views/WriteKanjiOverview.vue'
import WriteKanjiPractice from '@/views/WriteKanjiPractice.vue'
import TheDictionary from '@/views/TheDictionary.vue'
import TheAchievements from '@/views/TheAchievements.vue'
import TheAdventure from '@/views/TheAdventure.vue'
import AdventureInputs from '@/views/AdventureInputs.vue'
import AdventureStory from '@/views/AdventureStory.vue'
import TheSettings from '@/views/TheSettings.vue'
import TheCredits from '@/views/TheCredits.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'menu',
      component: TheMenu,
      meta: {
        forward: [
          'category',
          'dictionary',
          'achievements',
          'settings'
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
          'adventure'
        ]
      }
    },
    {
      path: '/packages',
      name: 'packages',
      component: PackagesOverview,
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
      path: '/kanji',
      name: 'writeKanji',
      component: WriteKanjiOverview,
      meta: {
        forward: [
          'writeKanjiPractice',
          'writeKanjiQuiz'
        ]
      }
    },
    {
      path: '/kanji/practice',
      name: 'writeKanjiPractice',
      component: WriteKanjiPractice,
      meta: {
        forward: []
      }
    },
    // {
    //   path: '/kanji/quiz',
    //   name: 'writeKanjiQuiz',
    //   component: WriteKanjiQuiz,
    //   meta: {
    //     forward: []
    //   }
    // },
    {
      path: '/dictionary',
      name: 'dictionary',
      component: TheDictionary,
      meta: {
        forward: [
          'packages'
        ]
      }
    },
    {
      path: '/achievements',
      name: 'achievements',
      component: TheAchievements,
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
        }
        // {
        //   path: 'map',
        //   name: 'adventureMap',
        //   component: AdventureMapNavigation,
        //   meta: {
        //     forward: [],
        //     delay: [
        //       'adventureHome',
        //       'adventure'
        //     ]
        //   }
        // },
        // {
        //   path: 'home',
        //   name: 'adventureHome',
        //   component: AdventureHome,
        //   meta: {
        //     forward: [],
        //     delay: [
        //       'adventureMap'
        //     ]
        //   }
        // },
        // {
        //   path: 'choose',
        //   name: 'adventureChoose',
        //   component: AdventureChoose,
        //   meta: {
        //     forward: [],
        //     delay: []
        //   }
        // },
        // {
        //   path: 'statistics',
        //   name: 'adventureStatistics',
        //   component: AdventureStatistics,
        //   meta: {
        //     forward: [],
        //     delay: []
        //   }
        // }
      ],
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
          'credits',
          'packages'
        ]
      }
    },
    {
      path: '/credits',
      name: 'credits',
      component: TheCredits,
      meta: {
        forward: []
      }
    }
  ]
})

export default router
