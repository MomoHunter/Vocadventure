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
    difficulty: '',
    wordCount: 0,
    items: Items,
    inventory: [],
    unlockedItems: new Set(),
    showModals: {
      name: ''
    },
    currentModalAnswer: ''
  },
  getters: {
    getCategories: (state, getters, rootState) => {
      return Object.keys(Vocabulary[rootState.targetLanguage].words)
    },
    getVocabs: (state, getters, rootState) => {
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
        latinAlphabet: vocabs.latinAlphabet,
        foreignAlphabet: vocabs.foreignAlphabet
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
    getCoins: (state) => {
      return state.status.find(status => status.id === 'coins')
    },
    getItemObject: (state) => (id) => {
      return state.items.find(item => item.id === id)
    },
    getInventoryObject: (state) => (id) => {
      return state.inventory.find(item => item.id === id)
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
    showModal (state, options) {
      state.showModals = options
    },
    changeInventory (state, inventory) {
      state.inventory = inventory
    },
    unlockItem (state, item) {
      state.items.find(item => item.id === item).unlocked = true
      state.unlockedItems.add(item)
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
    }
  },
  actions: {
  }
}
