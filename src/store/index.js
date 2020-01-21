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
    categoriesChosen: [],
    categoriesPlayed: [],
    difficulty: '',
    wordCount: 0,
    showModal: false
  },
  getters: {
    getText: (state) => (id) => {
      if (isNaN(id)) {
        return Texts[state.lang][id]
      } else {
        return id.toString()
      }
    },
    getSizeClass: (state) => (type) => {
      return SizeClasses[type][state.size]
    },
    getCategories: (state) => {
      return Object.keys(Vocabulary[state.targetLanguage].words)
    },
    getVocabs: (state) => {
      let wordObjects = []
      let vocabs = Vocabulary[state.targetLanguage]

      for (let category of state.categoriesChosen) {
        vocabs.words[category].forEach(word => {
          let wordCopy = JSON.parse(JSON.stringify(word))
          wordCopy.category = category
          wordObjects.push(wordCopy)
        }, this)
      }

      return {
        words: wordObjects,
        latinAlphabet: vocabs.latinAlphabet,
        foreignAlphabet: vocabs.foreignAlphabet
      }
    },
    getShuffledVocabs: (state, getters) => {
      let vocabs = getters.getVocabs
      let wordsShuffled = []

      while (vocabs.words.length > 0) {
        let random = Math.floor(Math.random() * vocabs.words.length)
        wordsShuffled.push(vocabs.words.splice(random, 1)[0])
      }

      vocabs.words = wordsShuffled

      return vocabs
    },
    getCategoryPlayed: (state) => (id) => {
      let data = state.categoriesPlayed.find(entry => entry.id === id)
      return data || { id: id, count: 0 }
    },
    getSaveData: (state) => {
      return {
        version: state.version,
        lang: state.lang,
        targetLanguage: state.targetLanguage,
        theme: state.theme,
        size: state.size,
        status: state.status,
        categoriesPlayed: state.categoriesPlayed
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
    changeCategoriesPlayed (state, categoriesPlayed) {
      state.categoriesPlayed = categoriesPlayed
    },
    addCategory (state, category) {
      state.categoriesChosen.push(category)
    },
    removeCategory (state, category) {
      state.categoriesChosen = state.categoriesChosen.filter(entry => entry !== category)
    },
    setCategories (state, categories) {
      state.categoriesChosen = categories
    },
    increaseCategoryPlayed (state, id) {
      let data = state.categoriesPlayed.find(entry => entry.id === id)

      if (data) {
        data.count++
      } else {
        state.categoriesPlayed.push({ id: id, count: 1 })
      }
    },
    setDifficulty (state, difficulty) {
      state.difficulty = difficulty
    },
    setWordCount (state, count) {
      state.wordCount = count
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
