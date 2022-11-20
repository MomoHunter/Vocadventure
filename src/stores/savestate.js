import { defineStore } from 'pinia'
import { useAppConstStore } from './appconst'
import { useAppDynStore } from './appdyn'

export const useSavestateStore = defineStore({
  id: 'savestate',
  state: () => ({
    version: '0.2.0',
    app: {
      lang: 'german',
      targetLanguage: 'japanese',
      theme: 'garium',
      size: 'normal',
      viewport: 1,
      volume: 100,
      status: [
        { id: 'points', count: 0, additional: 0 },
        { id: 'vocabs', count: 0, additional: 0 },
        { id: 'streak', count: 0, additional: 0 }
      ],
      allowUpdates: true,
      missedUpdates: false,
      updateSuccessful: false,
      activeWordpacks: ['s_1', 's_2', 's_3', 's_4'],
      categoriesStats: [], // { key: 's_1_1', count: 1, lastPlayed: 1649786083212, proficiency (last 20): [0.87, 0.56, 1] }
      deactivatedWords: [], // { categoryKey: 's_1_5', index: 23 }
      writeKanjiAnimationSpeed: 13
    },
    game: {
      storyFragment: 0,
      storyPart: 1,
      gameState: 'story'
    }
  }),
  getters: {
    getCategoryStats: (state) => (key) => {
      const data = state.app.categoriesStats.find(category => category.key === key)
      return data || { key: key, count: 0, lastPlayed: 0, proficiency: [] }
    },
    isWordDeactivated: (state) => (categoryKey, index) => {
      return state.app.deactivatedWords.findIndex((word) =>
        word.categoryKey === categoryKey && word.index === index
      ) !== -1
    }
  },
  actions: {
    saveData () {
      console.log(JSON.stringify(this.app))
      console.log(JSON.stringify(this.game))
      // window.localStorage.setItem('globalDict', JSON.stringify(this))
    },
    loadData () {
      const savestate = useSavestateStore()
      const appDyn = useAppDynStore()
      const data = window.localStorage.getItem('globalDict')

      if (data) {
        if (data.updateSuccessful) {
          if (navigator.serviceWorker) {
            navigator.serviceWorker.getRegistration().then((registration) => {
              if (registration && registration.waiting) {
                this.app.updateSuccessful = true
              } else {
                appDyn.updateSuccess = true
                savestate.saveData()
              }
            })
          }
        }
      }
    },
    deleteData () {
      // window.localStorage.removeItem('globalDict')
    },
    changeTheme (newTheme) {
      const appConst = useAppConstStore()

      this.app.theme = newTheme
      document.getElementById('cssHook').href = appConst.themes[newTheme]
    },
    changeViewport (newViewport) {
      let viewportTag = document.querySelector('[name~=viewport][content]')

      this.app.viewport = newViewport
      viewportTag.content = `width=device-width, initial-scale=${newViewport}`
    },
    changeAllowUpdates (allowUpdates) {
      const appDyn = useAppDynStore()

      if (allowUpdates && this.app.missedUpdates) {
        appDyn.updatesWillInstall = true
      }
      this.app.allowUpdates = allowUpdates
    }
  }
})