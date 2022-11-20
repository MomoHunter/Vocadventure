import { defineStore } from 'pinia'
import Spritesheet from '@/assets/spritesheet.png'
import SpriteDict from '@/canvas/spritedict.json'

const fragments = import.meta.globEager('../canvas/fragments/*.js')

export const useGameConstStore = defineStore({
  id: 'gameconst',
  state: () => ({
    refreshrate: 1000 / 60,
    fragments: Object.values(fragments),
    spritesheet: new Image(),
    spriteDict: SpriteDict
  }),
  getters: {
  },
  actions: {
    initSpritesheet () {
      this.spritesheet.src = Spritesheet
    }
  }
})