import Spritesheet from '@/assets/Spritesheet.png'

export default {
  namespaced: true,
  state: {
    canvas: null,
    context: null,
    raf: null,
    lag: 0,
    startTS: 0,
    refreshrate: 1000 / 60,
    frameNo: 0,
    animationStartFrame: 0,
    watchedIntro: false,
    spritesheet: new Image(),
    // start spriteDict
    // The following code is auto-generated, don't change it!
    /**
     * Maps a Sprite-Key to Location Information regarding the Sprite-Sheet as a key-value-dict.
     * @type {Object.<string, [boolean, number, number|Array<number>, number, number]>}
     * Each value's array has the contents: isAnimated, x-pos, y-pos, width, height.
     * If isAnimated is true, y-pos is an array, otherwise just a single number.
     */
    spriteDict: {
      'background_forest': [false, 0, 0, 300, 300],
      'background_home': [false, 0, 301, 600, 300],
      'background_intro': [false, 0, 602, 600, 300],
      'background_intro_background': [false, 0, 903, 600, 300],
      'background_intro_foreground': [false, 0, 1204, 600, 300],
      'background_snow': [false, 0, 1505, 300, 300],
      'background_universe': [false, 0, 1806, 600, 300],
      'background_world': [false, 0, 2107, 600, 300],
      'player_standing': [false, 601, 0, 25, 43],
      'special_placeholder': [false, 627, 0, 50, 50]
    },
    // end spriteDict
    inLevel: false,
    currentMapPoint: 'home',
    mapPoints: {
      'home': {
        x: 64,
        y: 67,
        tl: false,
        tc: false,
        tr: false,
        cl: false,
        cc: false,
        cr: 'forest',
        bl: false,
        bc: false,
        br: false
      },
      'forest': {
        x: 164,
        y: 67,
        tl: false,
        tc: false,
        tr: false,
        cl: 'home',
        cc: 'home',
        cr: false,
        bl: false,
        bc: 'snow',
        br: 'volcano'
      },
      'snow': {
        x: 168,
        y: 167,
        tl: false,
        tc: 'forest',
        tr: false,
        cl: false,
        cc: 'home',
        cr: false,
        bl: 'plains',
        bc: false,
        br: 'mines'
      },
      'plains': {
        x: 67,
        y: 243,
        tl: false,
        tc: false,
        tr: 'snow',
        cl: false,
        cc: 'home',
        cr: 'desert',
        bl: false,
        bc: false,
        br: false
      },
      'desert': {
        x: 166,
        y: 260,
        tl: false,
        tc: false,
        tr: false,
        cl: 'plains',
        cc: 'home',
        cr: false,
        bl: false,
        bc: false,
        br: false
      },
      'volcano': {
        x: 277,
        y: 125,
        tl: 'forest',
        tc: false,
        tr: false,
        cl: false,
        cc: 'home',
        cr: 'city',
        bl: false,
        bc: false,
        br: false
      },
      'mines': {
        x: 273,
        y: 217,
        tl: 'snow',
        tc: false,
        tr: 'city',
        cl: false,
        cc: 'home',
        cr: false,
        bl: false,
        bc: false,
        br: false
      },
      'city': {
        x: 410,
        y: 157,
        tl: false,
        tc: 'cemetry',
        tr: false,
        cl: 'volcano',
        cc: 'home',
        cr: false,
        bl: 'mines',
        bc: false,
        br: 'spacestation'
      },
      'cemetry': {
        x: 407,
        y: 56,
        tl: false,
        tc: false,
        tr: false,
        cl: false,
        cc: 'home',
        cr: 'underwater',
        bl: false,
        bc: 'city',
        br: false
      },
      'spacestation': {
        x: 468,
        y: 242,
        tl: 'city',
        tc: false,
        tr: false,
        cl: false,
        cc: 'home',
        cr: 'beach',
        bl: false,
        bc: false,
        br: false
      },
      'beach': {
        x: 550,
        y: 245,
        tl: false,
        tc: 'underwater',
        tr: false,
        cl: 'spacestation',
        cc: 'home',
        cr: false,
        bl: false,
        bc: false,
        br: false
      },
      'underwater': {
        x: 546,
        y: 58,
        tl: false,
        tc: false,
        tr: false,
        cl: 'cemetry',
        cc: 'home',
        cr: false,
        bl: false,
        bc: 'beach',
        br: false
      }
    }
  },
  getters: {
    canvasWidth: (state) => {
      return state.canvas.width
    },
    canvasHeight: (state) => {
      return state.canvas.height
    },
    currentPoint: (state) => {
      return state.mapPoints[state.currentMapPoint]
    }
  },
  mutations: {
    initCanvas (state) {
      state.canvas = document.getElementById('adventureCanvas')
      state.context = state.canvas.getContext('2d')
    },
    setSpritesheet (state) {
      state.spritesheet.src = Spritesheet
    },
    setRaf (state, raf) {
      state.raf = raf
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
    },
    setWatchedIntro (state) {
      state.watchedIntro = true
    },
    setInLevel (state, bool) {
      state.inLevel = bool
    },
    setMapPoint (state, point) {
      state.currentMapPoint = point
    }
  },
  actions: {

  }
}
