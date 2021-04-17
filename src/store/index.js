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
    theme: 'garium',
    size: 'normal',
    viewport: 1,
    volume: 100,
    allowUpdates: true,
    texts: Texts,
    newUpdate: false,
    updateAvailable: false,
    updateFinished: false,
    updatesWillInstall: false,
    updateSuccess: false, // will be used in menu
    updateSuccessful: false, // will be saved in localStorage
    missedUpdates: false
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
        volume: state.volume,
        allowUpdates: state.allowUpdates,
        missedUpdates: state.missedUpdates,
        updateSuccessful: state.updateSuccessful,
        status: state.vueDict.status,
        categoriesPlayed: state.vueDict.categoriesPlayed,
        activeWordPacks: state.vueDict.activeWordPacks,
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
    changeVolume (state, volume) {
      state.volume = volume
    },
    changeAllowUpdates (state, allowUpdates) {
      if (allowUpdates && state.missedUpdates) {
        state.updatesWillInstall = true
      }
      state.allowUpdates = allowUpdates
    },
    changeMissedUpdates (state, missedUpdates) {
      state.missedUpdates = missedUpdates
    },
    newUpdate (state) {
      if (state.allowUpdates) {
        state.newUpdate = true
      } else {
        state.updateAvailable = true
        state.missedUpdates = true
      }
    },
    updateFinished (state) {
      state.updateFinished = true
    },
    updateSuccessful (state) {
      state.updateSuccessful = true
    },
    updateSuccess (state) {
      state.updateSuccess = true
    },
    resetMissedUpdates (state) {
      state.missedUpdates = false
    },
    swReset (state) {
      state.newUpdate = false
      state.updateAvailable = false
      state.updateFinished = false
      state.updatesWillInstall = false
      state.updateSuccess = false
    }
  },
  actions: {
    async getDb (context, data) {
      return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(data.name, 1)

        request.onerror = e => {
          console.error('Error opening db', e)
          reject(e)
        }

        request.onsuccess = e => {
          resolve(e.target.result)
        }

        request.onupgradeneeded = e => {
          console.log('New DB will be created')
          let db = e.target.result
          db.createObjectStore(data.store, { autoIncrement: false, keyPath: 'index' })
        }
      })
    },
    async saveEntry (context, data) {
      let db = await context.dispatch('getDb', data)

      await new Promise(resolve => {
        let trans = db.transaction([data.store], 'readwrite')
        trans.oncomplete = () => {
          resolve(data.entry)
        }

        let store = trans.objectStore(data.store)
        store.put(data.entry)
      }).then(entry => {
        switch (data.name) {
          case 'wordpackdb':
            context.commit('vueDict/addWordPack', entry)
            break
          default:
        }
      })
    },
    async getEntries (context, data) {
      let db = await context.dispatch('getDb', data)

      await new Promise(resolve => {
        let trans = db.transaction([data.store], 'readonly')
        trans.oncomplete = () => {
          resolve(wordPacks)
        }

        let store = trans.objectStore(data.store)
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
    async deleteEntry (context, data) {
      let db = await context.dispatch('getDb', data)

      await new Promise(resolve => {
        let trans = db.transaction([data.store], 'readwrite')
        trans.oncomplete = () => {
          resolve(data.pack)
        }

        let store = trans.objectStore(data.store)
        store.delete(data.pack.index)
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
