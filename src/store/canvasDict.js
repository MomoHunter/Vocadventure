export default {
  namespaced: true,
  state: {
    canvas: null,
    context: null,
    lag: 0,
    startTS: 0,
    refreshrate: 1000 / 60,
    frameNo: 0
  },
  getters: {
    canvasWidth: (state) => {
      return state.canvas.width
    },
    canvasHeight: (state) => {
      return state.canvas.height
    }
  },
  mutations: {
    initCanvas (state) {
      if (!state.canvas) {
        state.canvas = document.getElementById('adventureCanvas')
        state.context = state.canvas.getContext('2d')
      }
    },
    setStartTS (state, startTS) {
      state.startTS = startTS
    },
    addLag (state, lag) {
      state.lag += lag
    },
    reduceLag (state) {
      state.lag -= state.refreshrate
    },
    eliminateLag (state) {
      state.lag %= state.refreshrate
    },
    increaseFrameNo (state) {
      state.frameNo++
    }
  },
  actions: {

  }
}
