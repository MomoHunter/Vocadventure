import Vocabulary from '@/data/Vocabulary.js'
import Items from '@/data/Items.json'

export default {
  namespaced: true,
  state: {
    status: [
      { id: 'points', count: 0, additional: 0 },
      { id: 'steps', count: 0, additional: 0 },
      { id: 'coins', count: 0, additional: 0 }
    ],
    categoriesChosen: [],
    categoriesPlayed: [],
    writeKanji: null,
    trainingStash: null,
    difficulty: 0,
    wordCount: 0,
    reversed: false,
    items: Items,
    inventory: [],
    unlockedItems: [],
    vocabs: {},
    currentWordIndex: 0,
    correctLatinWords: [],
    correctForeignWords: [],
    showModals: {
      name: ''
    },
    currentModalAnswer: '',
    transitionActive: false
  },
  getters: {
    getCategories: (state, getters, rootState) => {
      return Object.keys(Vocabulary[rootState.targetLanguage].words)
    },
    getCategoryDifficulty: (state, getters, rootState) => (id) => {
      let category = Vocabulary[rootState.targetLanguage].words[id]

      return category.reduce((acc, word) => {
        return acc + word.difficulty
      }, 0) / category.length
    },
    getFullVocabs: (state, getters, rootState) => {
      let wordObjects = []
      let vocabs = Vocabulary[rootState.targetLanguage]

      for (let category of state.categoriesChosen) {
        vocabs.words[category].forEach((word, index) => {
          let wordCopy = JSON.parse(JSON.stringify(word))
          wordCopy.category = category
          wordCopy.index = index
          wordObjects.push(wordCopy)
        }, this)
      }

      return {
        words: wordObjects,
        signs: JSON.parse(JSON.stringify(vocabs.signs)),
        mainAlphabet: state.reversed ? vocabs.foreignAlphabet : rootState.lang,
        latinAlphabet: state.reversed ? rootState.lang : vocabs.latinAlphabet,
        foreignAlphabet: state.reversed ? '' : vocabs.foreignAlphabet,
        lang: vocabs.lang
      }
    },
    getVocabsWithCategories: (state, getters, rootState) => {
      let objects = {}
      let vocabs = Vocabulary[rootState.targetLanguage]

      for (let category of state.categoriesChosen) {
        objects[category] = JSON.parse(JSON.stringify(vocabs.words[category]))
      }

      return {
        words: objects,
        latinAlphabet: vocabs.latinAlphabet,
        foreignAlphabet: vocabs.foreignAlphabet,
        lang: vocabs.lang
      }
    },
    getShuffledVocabs: (state, getters) => {
      let vocabs = getters.getFullVocabs
      let wordsShuffled = []

      while (vocabs.words.length > 0) {
        let random = Math.floor(Math.random() * vocabs.words.length)
        wordsShuffled.push(vocabs.words.splice(random, 1)[0])
      }

      vocabs.words = wordsShuffled

      return vocabs
    },
    getVocabsWithDifficulty: (state, getters) => {
      let vocabs = getters.getFullVocabs
      let words = vocabs.words.filter(vocab => vocab.difficulty <= state.difficulty)

      return {
        words: words,
        signs: vocabs.signs,
        latinAlphabet: vocabs.latinAlphabet,
        foreignAlphabet: vocabs.foreignAlphabet,
        lang: vocabs.lang
      }
    },
    getCategoryPlayed: (state) => (id) => {
      let data = state.categoriesPlayed.find(entry => entry.id === id)
      return data || { id: id, count: 0 }
    },
    getCoins: (state) => {
      return state.status.find(status => status.id === 'coins')
    },
    getItemObject: (state) => (id) => {
      return state.items.find(item => item.id === id)
    },
    getInventoryObject: (state) => (id) => {
      return state.inventory.find(item => item.id === id)
    },
    getCurrentWord: (state) => {
      return state.vocabs.words[state.currentWordIndex]
    }
  },
  mutations: {
    changeStatus (state, status) {
      state.status = status
    },
    addStat (state, object) {
      state.status.find(entry => entry.id === object.id).count += object.quantity
    },
    addStatAddit (state, object) {
      state.status.find(entry => entry.id === object.id).additional += object.count
    },
    transferAdditionalStat (state) {
      state.status.forEach(entry => {
        entry.count += entry.additional
        entry.additional = 0
      })
    },
    resetAdditional (state) {
      state.status.forEach(entry => {
        entry.additional = 0
      })
    },
    setWriteKanji (state, object) {
      state.writeKanji = object
    },
    setTrainingStash (state, object) {
      state.trainingStash = object
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
    setReversed (state, bool) {
      state.reversed = bool
    },
    setVocabs (state, vocabs) {
      state.vocabs = vocabs
    },
    resetVocabs (state) {
      state.vocabs = {}
      state.currentWordIndex = 0
    },
    setKeyboardSigns (state, data) {
      state.vocabs.signs[data.name] = data.signs
    },
    incCurrentWord (state) {
      state.currentWordIndex++
    },
    addCorrectLatin (state, bool) {
      state.correctLatinWords.push(bool)
    },
    addCorrectForeign (state, bool) {
      state.correctForeignWords.push(bool)
    },
    resetCorrectLatin (state) {
      state.correctLatinWords = []
    },
    resetCorrectForeign (state) {
      state.correctForeignWords = []
    },
    showModal (state, options) {
      state.showModals = options
    },
    changeInventory (state, inventory) {
      state.inventory = inventory
    },
    unlockItem (state, itemId) {
      if (!state.unlockedItems.includes(itemId)) {
        state.items.find(item => item.id === itemId).unlocked = true
        state.unlockedItems.push(itemId)
      }
    },
    addToInventory (state, object) {
      if (object.quantity > 0) {
        let item = state.inventory.find(item => item.id === object.id)
        if (item) {
          item.quantity += object.quantity
        } else {
          state.inventory.push(object.item)
        }
      } else {
        state.inventory.find(item => item.id === object.id).quantity += object.quantity
      }
    },
    modalAnswer (state, answer) {
      if (answer === 'close') {
        state.showModals = {
          name: ''
        }
      } else {
        state.currentModalAnswer = answer
      }
    },
    closeModal (state) {
      state.showModals = {
        name: ''
      }
      state.currentModalAnswer = ''
    },
    changeTransitionActive (state, bool) {
      state.transitionActive = bool
    }
  },
  actions: {
  }
}
