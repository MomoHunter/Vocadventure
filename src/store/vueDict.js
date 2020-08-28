import Vocabulary from '@/data/Vocabulary.js'
import GameObjects from '@/data/GameObjects.json'

export default {
  namespaced: true,
  state: {
    status: [
      { id: 'points', count: 0, additional: 0 },
      { id: 'steps', count: 0, additional: 0 },
      { id: 'coins', count: 0, additional: 0 }
    ],
    heights: {},
    categoriesChosen: [],
    categoriesPlayed: [],
    writeKanji: null,
    trainingStash: null,
    boughtItems: [],
    currentShopPage: 1,
    currentInventoryPage: 1,
    difficulty: 0,
    wordCount: 0,
    reversed: false,
    items: GameObjects.filter(
      obj => obj.categories.includes('item') ||
             obj.categories.includes('material') ||
             obj.categories.includes('material2')
    ),
    upgrades: GameObjects.filter(obj => obj.categories.includes('upgrade')),
    inventory: [],
    unlockedItems: [],
    itemUnlocks: {
      'branch': ['wood'],
      'pebble': ['stone'],
      'cobwebs': ['string'],
      'treeseed': ['randomtree'],
      'wood': ['woodenbucket'],
      'stone': ['stonepickaxe', 'stoneaxe', 'stonesword', 'stoneshovel'],
      'honey': ['pickledmushrooms'],
      'leather': ['leatherarmor'],
      'rubbish': ['randomrubbish'],
      'glass': ['glassbottle'],
      'crystalchip': ['crystal'],
      'crystal': ['crystalsword', 'crystalshovel', 'crystalpickaxe', 'crystalaxe'],
      'grassbundle': ['bonfire'],
      'clay': ['claybowl']
    },
    currentUpgradeLevels: {
      'house': 'nohouse',
      'launchpad': 'foundation',
      'greenhouse': 'greenhouse'
    },
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
    getHeight: (state) => (type) => {
      return state.heights[type] || 0
    },
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
    },
    getAdventureCopies: (state) => {
      return {
        inventory: JSON.parse(JSON.stringify(state.inventory)),
        unlockedItems: state.unlockedItems,
        currentUpgradeLevels: JSON.parse(JSON.stringify(state.currentUpgradeLevels))
      }
    },
    getUpgradeObject: (state) => (id) => {
      return state.upgrades.find(upgrade => upgrade.id === id) || null
    },
    getNextUpgradeObject: (state, getters) => (id) => {
      let upgradeObject = getters.getUpgradeObject(id)

      if (upgradeObject.nextUpgrade) {
        return getters.getUpgradeObject(upgradeObject.nextUpgrade)
      }
      return null
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
    transferAdditionalStat (state, reset = true) {
      state.status.forEach(entry => {
        entry.count += entry.additional
        if (reset) {
          entry.additional = 0
        }
      })
    },
    resetAdditional (state) {
      state.status.forEach(entry => {
        entry.additional = 0
      })
    },
    setHeight (state, object) {
      state.heights[object.type] = object.value
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
    setBoughtItems (state, boughtItems) {
      state.boughtItems = boughtItems
    },
    setCurrentShopPage (state, newPage) {
      state.currentShopPage = newPage
    },
    setCurrentInventoryPage (state, newPage) {
      state.currentInventoryPage = newPage
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
    unlockItem (state, keyItemId) {
      let newRecipes = state.itemUnlocks[keyItemId]
      if (newRecipes) {
        if (!state.unlockedItems.includes(keyItemId)) {
          for (let newItemId of newRecipes) {
            state.items.find(item => item.id === newItemId).unlocked = true
          }
          state.unlockedItems.push(keyItemId)
        }
      }
    },
    addToInventory (state, object) {
      if (object.quantity > 0) {
        let item = state.inventory.find(item => item.id === object.id)
        if (item) {
          item.quantity += object.quantity
        } else {
          state.inventory.push(object)
        }
      } else {
        let itemObject = state.inventory.find(item => item.id === object.id)
        if (itemObject.quantity + object.quantity < 0) {
          itemObject.quantity += object.quantity
        } else if (itemObject.quantity + object.quantity === 0) {
          state.inventory = state.inventory.filter(item => item.id !== itemObject.id)
        } else {
          itemObject.quantity += object.quantity
        }
      }
    },
    setCurrentUpgradeLevel (state, object) {
      state.currentUpgradeLevels[object.currentBuilding] = object.newValue
    },
    reduceItemDurability (state, itemId) {
      let itemData = state.inventory.find(item => item.id === itemId)

      itemData.durability -= 1

      if (itemData.durability <= 0) {
        itemData.quantity -= 1
        itemData.durability = state.items.find(item => item.id === itemId).durability
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
    },
    setAdventureCopies (state, copies) {
      state.inventory = copies.inventory
      state.unlockedItems = copies.unlockedItems
      state.currentUpgradeLevels = copies.currentUpgradeLevels
    }
  },
  actions: {
  }
}
