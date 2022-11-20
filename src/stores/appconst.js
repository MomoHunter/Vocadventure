import { defineStore } from 'pinia'
import { useSavestateStore } from './savestate'
import { useAppDynStore } from './appdyn'

import TargetLanguages from '@/data/TargetLanguages.js'
import Themes from '@/data/Themes.json'

const textObj = import.meta.globEager('../data/translations/*.json')
const vocabs = import.meta.globEager('../data/wordpacks/*.json')

export const useAppConstStore = defineStore({
  id: 'appconst',
  state: () => ({
    texts: Object.fromEntries(
      Object.entries(textObj).map(entry => {
        entry[0] = entry[0].substring(
          entry[0].lastIndexOf('/') + 1,
          entry[0].lastIndexOf('.')
        )
        return entry
      })
    ),
    targetLanguages: TargetLanguages,
    sizeClasses: {
      general: {
        small: 'is-small',
        normal: 'is-normal',
        large: 'is-large',
        giga: 'is-giga'
      },
      style: {
        small: 0.8,
        normal: 1,
        large: 1.4,
        giga: 2
      }
    },
    themes: Themes,
    vocabulary: Object.values(vocabs),
    kanaSvg: null,
    achievements: [
      {
        id: 'story',
        color: 'consumables',
        icon: 'wrench',
        entries: [
          {
            id: 'startGame',
            maxValue: 1,
            unlocked: null,
            xp: 100
          }
        ]
      },
      {
        id: 'general',
        color: 'armor',
        icon: 'eye',
        entries: [
          {
            id: 'randomAck',
            maxValue: 50000,
            unlocked: null,
            xp: 45000
          }
        ]
      }
    ]
  }),
  getters: {
    /**
     * automatically translates text with a text id
     * @param {Object} state state of pinia store component
     * @param {String} id the text id
     * @param {Any} params parameters that should get inserted into the text at & positions
     */
    getText: (state) => (id, ...params) => {
      const savestate = useSavestateStore()
      const appConst = useAppConstStore()
      if (isNaN(id)) {
        let text = state.texts[savestate.app.lang][id]
        if (text) {
          if (params.length > 0) {
            for (let i = 0; i < params.length; i++) {
              let regex = new RegExp('&' + (i + 1), 'g')
              text = text.replace(regex, appConst.getText(params[i]))
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
    /**
     * Returns the size class for the globally selected size
     * @param {Object} state state of pinia store component
     * @param {String} type the type of the size
     */
    getSizeClass: (state) => (type) => {
      const savestate = useSavestateStore()
      return state.sizeClasses[type][savestate.app.size]
    },
    getWordpackKey: (state) => (wordpack) => {
      return (wordpack.isCustom ? 'c' : 's') + '_' + wordpack.index.toString()
    },
    getWordpack: (state) => (key, copy = true) => {
      const keyParts = key.split('_')
      const foundWordpack = state.vocabulary.find(wordpack =>
        ((!wordpack.isCustom && keyParts[0] === 's') || (wordpack.isCustom && keyParts[0] === 'c')) &&
        wordpack.index === parseInt(keyParts[1])
      )
      if (foundWordpack) {
        if (copy) {
          return JSON.parse(JSON.stringify(foundWordpack))
        }
        return foundWordpack
      }
      return null
    },
    getCategory: (state) => (key, copy = true) => {
      const appConst = useAppConstStore()
      const keyParts = key.split('_')
      const wordpack = appConst.getWordpack(`${keyParts[0]}_${keyParts[1]}`, false)
      
      if (!wordpack) {
        return null
      }
      return wordpack.categories.find(category => {
        return category.index === parseInt(keyParts[2])
      })
    },
    /**
     * Collects the available categories and evaluates the correct name for the currently selected language
     * @param {Object} state state of pinia store component
     * @returns Array with objects {key, name} where key consists of
     *          if pack is custom, then c, else s (for standard)
     *          index of pack
     *          index of category
     *          the above is separated by _
     */
    getAvailableCategories: (state) => {
      const savestate = useSavestateStore()
      const appConst = useAppConstStore()
      const supportedPacks = state.vocabulary.filter(wordpack => {
        return wordpack.targetLanguage === savestate.app.targetLanguage &&
          savestate.app.activeWordpacks.includes(appConst.getWordpackKey(wordpack)) &&
          wordpack.supportedLanguages.includes(savestate.app.lang)
      })

      return supportedPacks.flatMap(wordpack => {
        let keyStart = appConst.getWordpackKey(wordpack) + '_'
        let categoryName = '[' + wordpack.tag + '] '

        return wordpack.categories.map(category => {
          return {
            key: keyStart + category.index,
            name: categoryName + category[savestate.app.lang]
          }
        })
      })
    },
    /**
     * Searches for the name of a category
     * @param {Object} state state of pinia store component
     * @param {String} key the key of the category, definition can be found by 'getCategories' under 'returns'
     */
    getCategoryName: (state) => (key) => {
      const appConst = useAppConstStore()
      const categories = appConst.getAvailableCategories
      const foundCategory = categories.find((category) => category.key === key)

      if (foundCategory) {
        return foundCategory.name
      }
      return key
    },
    /**
     * Evaluates the average difficulty of a specified category
     * @param {Object} state state of pinia store component
     * @param {String} key the key of the category, definition can be found by 'getCategories' under 'returns'
     */
    getCategoryDifficulty: (state) => (key) => {
      const appConst = useAppConstStore()
      const category = appConst.getCategory(key, false)

      return category.words.reduce((acc, word) => {
        return acc + word.difficulty
      }, 0) / category.words.length
    },
    /**
     * Collects all words included in the chosen categories that are at most the chosen difficulty
     * @param {Object} state state of pinia store component
     * @returns a copy of all the words of the chosen categories that are at most the chosen difficulty
     */
    getFullVocabs: (state) => (difficultyFilter = true) => {
      const savestate = useSavestateStore()
      const appDyn = useAppDynStore()
      const appConst = useAppConstStore()
      const targetLangInfo = state.targetLanguages[savestate.app.targetLanguage]
      let wordObjects = []

      for (let categoryKey of appDyn.categoriesChosen) {
        const category = appConst.getCategory(categoryKey)

        for (let i = 0; i < category.words.length; i++) {
          if (!difficultyFilter || category.words[i].difficulty <= appDyn.wordDifficulty) {
            let wordCopy = JSON.parse(JSON.stringify(category.words[i]))
            // categoryKey and index are for the training and kanji write page to filter unwanted words out
            wordCopy.categoryKey = categoryKey
            wordCopy.index = i
            wordObjects.push(wordCopy)
          }
        }
      }

      return {
        words: wordObjects,
        signs: JSON.parse(JSON.stringify(targetLangInfo.signs)),
        mainAlphabet: appDyn.reversedType ? targetLangInfo.foreignAlphabet : savestate.app.lang,
        latinAlphabet: appDyn.reversedType ? savestate.app.lang : targetLangInfo.latinAlphabet,
        foreignAlphabet: appDyn.reversedType ? '' : targetLangInfo.foreignAlphabet,
        // lang for tts
        lang: targetLangInfo.lang
      }
    },
    getSearchedWords: (state) => (type, searchString) => {
      const savestate = useSavestateStore()
      const appConst = useAppConstStore()
      let foundWords = []
      state.vocabulary.forEach((wordpack) => {
        if (wordpack.targetLanguage === savestate.app.targetLanguage &&
            savestate.app.activeWordpacks.includes(appConst.getWordpackKey(wordpack))) {
          wordpack.categories.forEach((category) => {
            category.words.forEach((word) => {
              let regex = new RegExp('.*' + searchString.toLowerCase().split('').join('.{0,3}') + '.*')
              if (word[type] && word[savestate.app.lang] && regex.test(word[type].toLowerCase())) {
                foundWords.push({
                  category: `[${wordpack.tag}] ${category[savestate.app.lang]}`,
                  word: JSON.parse(JSON.stringify(word)),
                  weight: appConst.getLevenshteinDistance(searchString.toLowerCase(), word[type].toLowerCase())
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
  },
  actions: {
    addWordpack: (wordpack) => {
      const appConst = useAppConstStore()
      appConst.vocabulary.push(wordpack)
      appConst.vocabulary.sort((wordpack1, wordpack2) => {
        if (wordpack1.isCustom && !wordpack2.isCustom) {
          return 1
        } else if (!wordpack1.isCustom && wordpack2.isCustom) {
          return -1
        } else {
          if (wordpack1.index > wordpack2.index) {
            return 1
          } else if (wordpack1.index < wordpack2.index) {
            return -1
          } else {
            return 0
          }
        }
      })
    },
    deleteWordpack: (key, deactivateWords = true) => {
      const savestate = useSavestateStore()
      const appConst = useAppConstStore()
      const keyParts = key.split('_')
      appConst.vocabulary = appConst.vocabulary.filter(wordpack =>
        !(((!wordpack.isCustom && keyParts[0] === 's') || (wordpack.isCustom && keyParts[0] === 'c')) &&
        wordpack.index === parseInt(keyParts[1]))
      )
      if (deactivateWords) {
        savestate.app.deactivatedWords = savestate.app.deactivatedWords.filter((word) => !word.category.startsWith(key))
      }
    }
  }
})