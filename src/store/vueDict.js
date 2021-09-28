import TargetLanguages from '@/data/TargetLanguages.js'
import JapaneseVocabs from '@/data/JapaneseVocabs.json'
import GreekVocabs from '@/data/GreekVocabs.json'
import NorwegianVocabs from '@/data/NorwegianVocabs.json'
import GermanVocabs from '@/data/GermanVocabs.json'
import GameObjects from '@/data/GameObjects.json'

export default {
  namespaced: true,
  state: {
    status: [
      { id: 'points', count: 0, additional: 0 },
      { id: 'vocabs', count: 0, additional: 0 },
      { id: 'coins', count: 0, additional: 0 }
    ],
    categoriesChosen: [],
    categoriesPlayed: [],
    writeKanji: null,
    trainingStash: null,
    deactivatedWords: [],
    destination: '',
    boughtItems: [],
    currentShopPage: 1,
    currentInventoryPage: 1,
    targetLanguages: TargetLanguages,
    vocabulary: [
      JapaneseVocabs,
      GreekVocabs,
      NorwegianVocabs,
      GermanVocabs
    ],
    activeWordPacks: ['s_1', 's_2', 's_3', 's_4'],
    selectedWordPackKey: '',
    selectedWordPack: null,
    selectedWordPackCategoriesScroll: 0,
    selectedWordPackCategoryIndex: -1,
    selectedWordPackWordIndex: -1,
    selectedWordPackChanged: false,
    difficulty: 1,
    wordCount: 10,
    reversed: false,
    items: GameObjects.filter(
      obj => obj.categories.includes('item') ||
             obj.categories.includes('shop') ||
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
    getWordPackKey: (state) => (wordPack) => {
      return (wordPack.isCustom ? 'c' : 's') + '_' + wordPack.index.toString()
    },
    getCategoryKey: (state, getters) => (wordPack, index) => {
      return getters.getWordPackKey(wordPack) + '_' + index
    },
    /**
     * Collects the available categories and evaluates the correct name for the currently selected language
     * @param {Object} state state of vuex store component vueDict
     * @param {Object} getters all getters of vuex store component vueDict
     * @param {Object} rootState rootstate of vuex store
     * @returns Array with objects {id, categoryName} where id consists of
     *          if pack is custom, then c, else s (for standard)
     *          index of pack
     *          index of category
     *          the above is separated by _
     */
    getCategories: (state, getters, rootState) => {
      let supportedPacks = state.vocabulary.filter(pack => {
        return pack.targetLanguage === rootState.targetLanguage &&
          state.activeWordPacks.includes(getters.getWordPackKey(pack)) &&
          pack.supportedLanguages.includes(rootState.lang)
      })

      return supportedPacks.flatMap(pack => {
        let id = getters.getWordPackKey(pack) + '_'
        let categoryName = '[' + pack.tag + '] '

        return pack.categories.map(category => {
          return {
            id: id + category.index,
            categoryName: categoryName + category[rootState.lang]
          }
        })
      })
    },
    /**
     * Evaluates the average difficulty of a specified category
     * @param {Object} state state of vuex store component vueDict
     * @param {String} id the id of the category, definition can be found by 'getCategories' under 'returns'
     */
    getCategoryDifficulty: (state) => (id) => {
      let keyParts = id.split('_')
      let wordPack = state.vocabulary.find(pack => {
        if ((!pack.isCustom && keyParts[0] === 's') || (pack.isCustom && keyParts[0] === 'c')) {
          return pack.index === parseInt(keyParts[1])
        }
        return false
      })
      let category = wordPack.categories.find(category => {
        return category.index === parseInt(keyParts[2])
      })

      return category.words.reduce((acc, word) => {
        return acc + word.difficulty
      }, 0) / category.words.length
    },
    /**
     * collects all words included in the categories of the categoriesChosen list
     * @param {Object} state state of vuex store component vueDict
     * @param {Object} getters all getters of vuex store component vueDict
     * @param {Object} rootState rootstate of vuex store
     */
    getFullVocabs: (state, getters, rootState) => {
      let wordObjects = []
      let targetLangInfo = state.targetLanguages[rootState.targetLanguage]

      for (let category of state.categoriesChosen) {
        let keyParts = category.split('_')
        let wordPack = state.vocabulary.find(pack => {
          if ((!pack.isCustom && keyParts[0] === 's') || (pack.isCustom && keyParts[0] === 'c')) {
            return pack.index === parseInt(keyParts[1])
          }
          return false
        })
        let foundCategory = wordPack.categories.find(entry => {
          return entry.index === parseInt(keyParts[2])
        })
        for (let i = 0; i < foundCategory.words.length; i++) {
          let wordCopy = JSON.parse(JSON.stringify(foundCategory.words[i]))
          // category and index are for the kanji write page
          wordCopy.category = category
          wordCopy.index = i
          wordObjects.push(wordCopy)
        }
      }

      return {
        words: wordObjects,
        signs: JSON.parse(JSON.stringify(targetLangInfo.signs)),
        mainAlphabet: state.reversed ? targetLangInfo.foreignAlphabet : rootState.lang,
        latinAlphabet: state.reversed ? rootState.lang : targetLangInfo.latinAlphabet,
        foreignAlphabet: state.reversed ? '' : targetLangInfo.foreignAlphabet,
        // lang for tts
        lang: targetLangInfo.lang
      }
    },
    getVocabsWithCategories: (state, getters, rootState) => (isShuffled) => {
      let objects = {}
      let targetLangInfo = TargetLanguages[rootState.targetLanguage]

      for (let category of state.categoriesChosen) {
        let keyParts = category.split('_')
        let wordPack = state.vocabulary.find(pack => {
          if ((!pack.isCustom && keyParts[0] === 's') || (pack.isCustom && keyParts[0] === 'c')) {
            return pack.index === parseInt(keyParts[1])
          }
          return false
        })
        objects[category] = JSON.parse(JSON.stringify(wordPack.categories.find(entry => {
          return entry.index === parseInt(keyParts[2])
        }).words))
      }

      if (isShuffled) {
        for (let category in objects) {
          let wordsShuffled = []

          for (let i = 0; i < objects[category].length; i++) {
            objects[category][i].index = i
          }

          while (objects[category].length > 0) {
            let random = Math.floor(Math.random() * objects[category].length)
            wordsShuffled.push(objects[category].splice(random, 1)[0])
          }

          objects[category] = wordsShuffled
        }
      }

      return {
        words: objects,
        latinAlphabet: targetLangInfo.latinAlphabet,
        foreignAlphabet: targetLangInfo.foreignAlphabet,
        lang: targetLangInfo.lang
      }
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
    getSearchedWords: (state, getters, rootState) => (type, searchString) => {
      let foundWords = []
      state.vocabulary.forEach((wordPack) => {
        if (wordPack.targetLanguage === rootState.targetLanguage &&
            state.activeWordPacks.includes(getters.getWordPackKey(wordPack))) {
          wordPack.categories.forEach((category) => {
            category.words.forEach((word) => {
              let regex = new RegExp('.*' + searchString.toLowerCase().split('').join('.{0,3}') + '.*')
              if (word[type] && word[rootState.lang] && regex.test(word[type].toLowerCase())) {
                foundWords.push({
                  category: '[' + wordPack.tag + '] ' + category[rootState.lang],
                  word: JSON.parse(JSON.stringify(word)),
                  weight: getters.getLevenshteinDistance(searchString.toLowerCase(), word[type].toLowerCase())
                })
              }
            })
          })
        }
      })

      return foundWords.sort((a, b) => {
        if (a.weight > b.weight) {
          return 1
        } else if (a.weight < b.weight) {
          return -1
        }
        return 0
      })
    },
    getLevenshteinDistance: (state) => (word1, word2) => {
      let d = new Array(word1.length + 1).fill(0).map(() => new Array(word2.length + 1).fill(0))

      for (let i = 0; i <= word1.length; i++) {
        d[i][0] = i
      }
      for (let j = 0; j <= word2.length; j++) {
        d[0][j] = j
      }

      for (let i = 1; i <= word1.length; i++) {
        for (let j = 1; j <= word2.length; j++) {
          let cost = 0
          if (word1[i] !== word2[j]) {
            cost = 5
          }

          // this is where the magic happens
          d[i][j] = Math.min(d[i - 1][j] + 5, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)

          if (i > 1 && j > 1 && word1[i] === word2[j - 1] && word1[i - 1] === word2[j]) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 0.5)
          }
        }
      }

      return d[word1.length][word2.length]
    },
    getCategoryPlayed: (state) => (id) => {
      let data = state.categoriesPlayed.find(entry => entry.id === id)
      return data || { id: id, count: 0 }
    },
    isWordDeactivated: (state) => (category, index) => {
      let foundIndex = state.deactivatedWords.findIndex(word => word.category === category && word.index === index)
      return foundIndex !== -1
    },
    getCoins: (state) => {
      return state.status.find(status => status.id === 'coins')
    },
    getSelectedWordPack: (state) => {
      let keyParts = state.selectedWordPackKey.split('_')
      let wordPack = state.vocabulary.find(pack =>
        ((!pack.isCustom && keyParts[0] === 's') || (pack.isCustom && keyParts[0] === 'c')) &&
        pack.index === parseInt(keyParts[1])
      )
      if (wordPack) {
        return JSON.parse(JSON.stringify(wordPack))
      }
      return null
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
    setWriteKanji (state, object) {
      state.writeKanji = object
    },
    setTrainingStash (state, object) {
      state.trainingStash = object
    },
    changeDeactivatedWords (state, deactivatedWords) {
      state.deactivatedWords = deactivatedWords
    },
    addDeactivatedWord (state, object) {
      state.deactivatedWords.push(object)
    },
    removeDeactivatedWord (state, object) {
      let foundIndex = state.deactivatedWords.findIndex(
        word => word.category === object.category && word.index === object.index
      )

      if (foundIndex !== -1) {
        state.deactivatedWords.splice(foundIndex, 1)
      }
    },
    removeDeactivatedWordsByCategory (state, category) {
      state.deactivatedWords = state.deactivatedWords.filter(word => !word.category.startsWith(category))
    },
    setDestination (state, destination) {
      state.destination = destination
    },
    addWordPack (state, pack) {
      state.vocabulary.push(pack)
      state.vocabulary.sort((wordPack1, wordPack2) => {
        if (wordPack1.isCustom && !wordPack2.isCustom) {
          return 1
        } else if (!wordPack1.isCustom && wordPack2.isCustom) {
          return -1
        } else {
          if (wordPack1.index > wordPack2.index) {
            return 1
          } else if (wordPack1.index < wordPack2.index) {
            return -1
          } else {
            return 0
          }
        }
      })
    },
    removeWordPack (state, key) {
      let keyParts = key.split('_')
      state.vocabulary = state.vocabulary.filter(pack =>
        !(((!pack.isCustom && keyParts[0] === 's') || (pack.isCustom && keyParts[0] === 'c')) &&
        pack.index === parseInt(keyParts[1]))
      )
    },
    changeActiveWordPacks (state, packKeys) {
      state.activeWordPacks = packKeys
    },
    activateWordPack (state, key) {
      if (!state.activeWordPacks.includes(key)) {
        state.activeWordPacks.push(key)
      }
    },
    deactivateWordPack (state, key) {
      state.activeWordPacks = state.activeWordPacks.filter(wordPackKey => wordPackKey !== key)
    },
    setSelectedWordPackKey (state, packKey) {
      state.selectedWordPackKey = packKey
    },
    setSelectedWordPack (state, pack) {
      state.selectedWordPack = pack
    },
    setSelectedWordPackCategoryIndex (state, index) {
      state.selectedWordPackCategoryIndex = index
    },
    setSelectedWordPackWordIndex (state, index) {
      state.selectedWordPackWordIndex = index
    },
    setSelectedWordPackCategoriesScroll (state, scroll) {
      state.selectedWordPackCategoriesScroll = scroll
    },
    setSelectedWordPackChanged (state, changed) {
      state.selectedWordPackChanged = changed
    },
    addWordToSelectedPack (state, wordObject) {
      state.selectedWordPack.categories.find(category => category.index === state.selectedWordPackCategoryIndex)
        .words.push(wordObject)
    },
    updateWordInSelectedPack (state, wordObject) {
      state.selectedWordPack.categories.find(category => category.index === state.selectedWordPackCategoryIndex)
        .words[state.selectedWordPackWordIndex] = wordObject
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
    /**
     * Adds the latinWord, inputs and result
     * @param {Object} state vueDict State
     * @param {Object} latinWord { inputValue, result }
     */
    addCorrectLatin (state, latinWord) {
      state.correctLatinWords.push(latinWord)
    },
    /**
     * Adds the foreignWord, inputs and result
     * @param {Object} state vueDict State
     * @param {Object} latinWord { inputValue, result }
     */
    addCorrectForeign (state, foreignWord) {
      state.correctForeignWords.push(foreignWord)
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
