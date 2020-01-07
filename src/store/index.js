import Vue from 'vue'
import Vuex from 'vuex'
import Texts from '@/data/Texts.json'
import Vocabulary from '@/data/Vocabulary.js'
import SizeClasses from '@/data/SizeClasses.json'
import Themes from '@/data/Themes.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    version: '0.1.0',
    lang: 'german',
    targetLanguage: 'japanese',
    theme: 'bulma',
    size: 'normal',
    status: [
      { id: 'points', count: 0 },
      { id: 'steps', count: 0 },
      { id: 'coins', count: 0 }
    ],
    showModal: false
  },
  getters: {
    getText: (state) => (id) => {
      return Texts[state.lang][id]
    },
    getSizeClass: (state) => (type) => {
      return SizeClasses[type][state.size]
    },
    getVocabs: (state) => {
      return Vocabulary[state.targetLanguage]
    },
    getSaveData: (state) => {
      return {
        version: state.version,
        lang: state.lang,
        targetLanguage: state.targetLanguage,
        theme: state.theme,
        size: state.size,
        status: state.status
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
    changeStatus (state, status) {
      state.status = status
    },
    showModal (state) {
      state.showModal = true
    },
    closeModal (state) {
      state.showModal = false
    }
  },
  actions: {
  },
  modules: {
  }
})
