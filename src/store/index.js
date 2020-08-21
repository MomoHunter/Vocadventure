import Vue from 'vue'
import Vuex from 'vuex'
import VueDict from '@/store/vueDict.js'
import CanvasDict from '@/store/canvasDict.js'
import Texts from '@/data/Texts.json'
import SizeClasses from '@/data/SizeClasses.json'
import Themes from '@/data/Themes.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    version: '0.1.0',
    lang: 'german',
    targetLanguage: 'japanese',
    theme: 'darkLumen',
    size: 'normal',
    viewport: 1
  },
  getters: {
    getText: (state) => (id, ...params) => {
      if (isNaN(id)) {
        let text = Texts[state.lang][id]
        if (text) {
          if (params.length > 0) {
            for (let i = 0; i < params.length; i++) {
              let regex = new RegExp('&' + (i + 1), 'g')
              text = text.replace(regex, params[i])
            }
          }
          return text
        } else {
          return id
        }
      } else {
        return id.toString()
      }
    },
    getSizeClass: (state) => (type) => {
      return SizeClasses[type][state.size]
    },
    getSaveData: (state) => {
      return {
        version: state.version,
        lang: state.lang,
        targetLanguage: state.targetLanguage,
        theme: state.theme,
        size: state.size,
        viewport: state.viewport,
        status: state.vueDict.status,
        categoriesPlayed: state.vueDict.categoriesPlayed,
        inventory: state.vueDict.inventory,
        unlockedItems: state.vueDict.unlockedItems,
        watchedIntro: state.canvasDict.watchedIntro,
        gameState: state.canvasDict.gameState,
        mapOffset: state.canvasDict.mapOffset,
        currentLevel: state.canvasDict.currentLevel,
        currentBuilding: state.canvasDict.currentBuilding,
        character: state.canvasDict.character,
        unlockedBuildings: state.canvasDict.unlockedBuildings,
        collectables: state.canvasDict.collectables,
        playerHealth: state.canvasDict.playerHealth,
        dynamicLevelData: state.canvasDict.dynamicLevelData
      }
    }
  },
  mutations: {
    changeLanguage (state, language) {
      state.lang = language
    },
    changeTargetLanguage (state, language) {
      state.targetLanguage = language
    },
    changeTheme (state, theme) {
      state.theme = theme
      document.getElementById('cssHook').href = process.env.BASE_URL + Themes[theme]
    },
    changeSize (state, size) {
      state.size = size
    },
    changeViewport (state, viewport) {
      let viewportTag = document.querySelector('[name~=viewport][content]')

      state.viewport = viewport
      viewportTag.content = 'width=device-width, initial-scale=' + viewport
    }
  },
  modules: {
    vueDict: VueDict,
    canvasDict: CanvasDict
  }
})
