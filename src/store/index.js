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
    theme: 'darkLumen',
    size: 'normal',
    viewport: 1,
    texts: Texts,
    swUpdateFound: false,
    swUpdated: false,
    db: null
  },
  getters: {
    getText: (state, getters) => (id, ...params) => {
      if (isNaN(id)) {
        let text = state.texts[state.lang][id]
        if (text) {
          if (params.length > 0) {
            for (let i = 0; i < params.length; i++) {
              let regex = new RegExp('&' + (i + 1), 'g')
              text = text.replace(regex, getters.getText(params[i]))
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
        viewport: state.viewport,
        status: state.vueDict.status,
        categoriesPlayed: state.vueDict.categoriesPlayed,
        inventory: state.vueDict.inventory,
        unlockedItems: state.vueDict.unlockedItems,
        watchedIntro: state.canvasDict.watchedIntro,
        gameState: state.canvasDict.gameState,
        mapOffset: state.canvasDict.mapOffset,
        currentLevel: state.canvasDict.currentLevel,
        currentBuilding: state.canvasDict.currentBuilding,
        character: state.canvasDict.character,
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
    },
    changeViewport (state, viewport) {
      let viewportTag = document.querySelector('[name~=viewport][content]')

      state.viewport = viewport
      viewportTag.content = 'width=device-width, initial-scale=' + viewport
    },
    swUpdateFound (state) {
      state.swUpdateFound = true
    },
    swUpdated (state) {
      state.swUpdated = true
    },
    swReset (state) {
      state.swUpdateFound = false
      state.swUpdated = false
    },
    setDb (state, db) {
      state.db = db
    }
  },
  actions: {
    async getDb (context) {
      return new Promise((resolve, reject) => {
        if (context.state.db) {
          return resolve(context.state.db)
        }

        let request = window.indexedDB.open('wordpackdb', 1)

        request.onerror = e => {
          console.error('Error opening db', e)
          reject(e)
        }

        request.onsuccess = e => {
          context.commit('setDb', e.target.result)
          resolve(e.target.result)
        }

        request.onupgradeneeded = e => {
          console.log('New DB will be created')
          let db = e.target.result
          db.createObjectStore('wordPacks', { autoIncrement: false, keyPath: 'index' })
        }
      })
    },
    async savePack (context, pack) {
      let db = await context.dispatch('getDb')

      await new Promise(resolve => {
        let trans = db.transaction(['wordPacks'], 'readwrite')
        trans.oncomplete = () => {
          resolve(pack)
        }

        let store = trans.objectStore('wordPacks')
        store.put(pack)
      }).then(wordPack => {
        context.commit('vueDict/addWordPack', wordPack)
      })
    },
    async getPacks (context) {
      let db = await context.dispatch('getDb')

      await new Promise(resolve => {
        let trans = db.transaction(['wordPacks'], 'readonly')
        trans.oncomplete = () => {
          resolve(wordPacks)
        }

        let store = trans.objectStore('wordPacks')
        let wordPacks = []

        store.openCursor().onsuccess = e => {
          let cursor = e.target.result
          if (cursor) {
            wordPacks.push(cursor.value)
            cursor.continue()
          }
        }
      }).then(wordPacks => {
        wordPacks.forEach(pack => {
          context.commit('vueDict/addWordPack', pack)
        })
      })
    },
    async deletePack (context, pack) {
      let db = await context.dispatch('getDb')

      await new Promise(resolve => {
        let trans = db.transaction(['wordPacks'], 'readwrite')
        trans.oncomplete = () => {
          resolve(pack)
        }

        let store = trans.objectStore('wordPacks')
        store.delete(pack.index)
      }).then(wordPack => {
        context.commit('vueDict/removeWordPack', (wordPack.isCustom ? 'c' : 's') + '_' + wordPack.index.toString())
      })
    }
  },
  modules: {
    vueDict: VueDict,
    canvasDict: CanvasDict
  }
})
