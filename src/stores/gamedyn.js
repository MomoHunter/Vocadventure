import { defineStore } from 'pinia'

export const useGameDynStore = defineStore({
  id: 'gamedyn',
  state: () => ({
    vocabs: null,
    canvas: null,
    context: null,
    loopActivated: false,
    raf: null,
    lag: 0,
    startTS: 0,
    frameNo: 0,
    storyWritesText: true
  }),
  getters: {
    getCanvasWidth: (state) => {
      return state.canvas.width
    },
    getCanvasHeight: (state) => {
      return state.canvas.height
    }
  },
  actions: {
    initCanvas () {
      this.canvas = document.getElementById('adventure-canvas')
      this.context = this.canvas.getContext('2d')
    }
  }
})