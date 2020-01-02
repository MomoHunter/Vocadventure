import Vue from 'vue'
import Vuex from 'vuex'
import Texts from '@/data/Texts.json'
import SizeClasses from '@/data/SizeClasses.json'
import bulmaTheme from '@/sass/bulma.module.scss'
import darklyTheme from '@/sass/darkly.module.scss'
import ceruleanTheme from '@/sass/cerulean.module.scss'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: 'german',
    theme: 'darkly',
    size: 'normal',
    status: [
      { id: 'points', count: 0 },
      { id: 'steps', count: 0 },
      { id: 'coins', count: 0 }
    ],
    showModal: false,
    themes: {
      bulma: bulmaTheme,
      darkly: darklyTheme,
      cerulean: ceruleanTheme
    }
  },
  getters: {
    getText: (state) => (id) => {
      return Texts[state.lang][id]
    },
    getSizeClass: (state) => (type) => {
      return SizeClasses[type][state.size]
    },
    theme: (state) => {
      return state.themes[state.theme]
    }
  },
  mutations: {
    changeLanguage (state, language) {
      state.lang = language
    },
    changeTheme (state, theme) {
      state.theme = theme
    },
    changeSize (state, size) {
      state.size = size
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
