import { defineStore } from 'pinia'
import { useAppConstStore } from './appconst'

export const useIndexedDBStore = defineStore({
  id: 'indexeddb',
  state: () => ({
  }),
  getters: {
  },
  actions: {
    async getDb (data, version = null) {
      return new Promise((resolve, reject) => {
        let request = null
        if (version) {
          request = window.indexedDB.open(data.name, version)
        } else {
          request = window.indexedDB.open(data.name)
        }

        request.onerror = e => {
          console.error('Error opening db', e)
          reject(e)
        }

        request.onsuccess = e => {
          let db = e.target.result
          if (!db.objectStoreNames.contains(data.store)) {
            resolve(this.getDb(data, db.version + 1))
          } else {
            resolve(db)
          }
        }

        request.onupgradeneeded = e => {
          console.log('New DB will be created')
          let db = e.target.result
          db.createObjectStore(data.store, { autoIncrement: false, keyPath: 'index' })
        }
      })
    },
    async saveEntry (data) {
      const appConst = useAppConstStore()
      let db = await this.getDb(data)

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
            appConst.addWordpack(entry)
            break
          default:
        }
      })
    },
    async getEntries (data) {
      const appConst = useAppConstStore()
      let db = await this.getDb(data)

      await new Promise(resolve => {
        let trans = db.transaction([data.store], 'readonly')
        trans.oncomplete = () => {
          resolve(loadedInfo)
        }

        let store = trans.objectStore(data.store)
        let loadedInfo = []

        store.openCursor().onsuccess = e => {
          let cursor = e.target.result
          if (cursor) {
            switch (data.name) {
              case 'wordpackdb':
                loadedInfo.push(cursor.value)
                break
              default:
            }
            cursor.continue()
          }
        }
      }).then(loadedInfo => {
        switch (data.name) {
          case 'wordpackdb':
            loadedInfo.forEach(wordpack => {
              appConst.addWordpack(wordpack)
            })
            break
          default:
        }
      })
    },
    async deleteEntry (data) {
      const appConst = useAppConstStore()
      let db = await this.getDb(data)

      await new Promise(resolve => {
        let trans = db.transaction([data.store], 'readwrite')
        trans.oncomplete = () => {
          resolve(data.entry)
        }

        let store = trans.objectStore(data.store)
        store.delete(data.entry.index)
      }).then(entry => {
        switch (data.name) {
          case 'wordpackdb':
            appConst.deleteWordpack(appConst.getWordpackKey(entry))
            break
          default:
        }
      })
    }
  }
})