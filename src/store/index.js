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
    theme: 'bulma',
    size: 'normal'
  },
  getters: {
    getText: (state) => (id) => {
      if (isNaN(id)) {
        return Texts[state.lang][id] || id
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
        status: state.vueDict.status,
        categoriesPlayed: state.vueDict.categoriesPlayed,
        inventory: state.vueDict.inventory,
        unlockedItems: state.vueDict.unlockedItems,
        watchedIntro: state.canvasDict.watchedIntro,
        gameState: state.canvasDict.gameState,
        mapOffset: state.canvasDict.mapOffset,
        currentLevel: state.canvasDict.currentLevel,
        currentBuilding: state.canvasDict.currentBuilding,
        currentEquippedItem: state.canvasDict.currentEquippedItem,
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
    }
  },
  modules: {
    vueDict: VueDict,
    canvasDict: CanvasDict
  }
})
