import Vue from 'vue'
import Vuex from 'vuex'
import Texts from '@/data/Texts.json'
import SizeClasses from '@/data/SizeClasses.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: 'Deutsch',
    size: 'normal',
    status: [
      { id: 'points', count: 0 },
      { id: 'steps', count: 0 },
      { id: 'coins', count: 0 }
    ]
  },
  getters: {
    getText: (state) => (id) => {
      return Texts[state.lang][id]
    },
    getSizeClass: (state) => (type) => {
      return SizeClasses[type][state.size]
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
