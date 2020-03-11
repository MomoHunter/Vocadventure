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
      'background_forest_background': [false, 0, 0, 300, 300],
      'background_forest_foreground': [false, 0, 301, 300, 300],
      'background_home': [false, 0, 602, 600, 300],
      'background_intro': [false, 0, 903, 600, 300],
      'background_intro_background': [false, 0, 1204, 600, 300],
      'background_intro_foreground': [false, 0, 1505, 600, 300],
      'background_snow': [false, 0, 1806, 300, 300],
      'background_universe': [false, 0, 2107, 600, 300],
      'background_world': [false, 0, 2408, 600, 300],
      'obstacles_trunk': [false, 601, 0, 84, 95],
      'obstacles_wall': [false, 601, 96, 60, 86],
      'player_standing': [false, 686, 0, 25, 43],
      'special_placeholder': [false, 712, 0, 50, 50]
    },
    // end spriteDict
    inLevel: false,
    gameState: 'map',
    currentLevel: 'home',
    levels: {
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
        br: 'volcano',
        backgroundChances: [
          {
            id: 'forestBasic',
            spriteKey: 'background_forest',
            chance: 1,
            foundOn: [1, 2, 3],
            canBefound: [
              { id: 'woodBranch', chance: 0.025 },
              { id: 'stone', chance: 0.025 }
            ]
          }
        ],
        obstacles: [
          {
            id: 'forestTrunk',
            spriteKey: 'obstacles_trunk',
            durability: 20,
            items: [
              { id: 'wood', chance: 1 }
            ]
          },
          {
            id: 'forestWall',
            spriteKey: 'obstacles_wall',
            durability: 30,
            items: [
              { id: 'stone', chance: 1 }
            ]
          }
        ]
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
        br: 'mines',
        backgroundChances: [],
        obstacles: []
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
        br: false,
        backgroundChances: [],
        obstacles: []
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
        br: false,
        backgroundChances: [],
        obstacles: []
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
        br: false,
        backgroundChances: [],
        obstacles: []
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
        br: false,
        backgroundChances: [],
        obstacles: []
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
        br: 'spacestation',
        backgroundChances: [],
        obstacles: []
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
        br: false,
        backgroundChances: [],
        obstacles: []
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
        br: false,
        backgroundChances: [],
        obstacles: []
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
        br: false,
        backgroundChances: [],
        obstacles: []
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
        br: false,
        backgroundChances: [],
        obstacles: []
      }
    },
    unlockedLevels: ['home', 'forest'],
    backgrounds: {
      'home': [
        { x: 0, y: 0, spriteKey: 'background_home' }
      ]
    }
  },
  getters: {
    canvasWidth: (state) => {
      return state.canvas.width
    },
    canvasHeight: (state) => {
      return state.canvas.height
    },
    currentMapPoint: (state) => {
      return state.levels[state.currentLevel]
    },
    getBackgrounds: (state) => (level) => {
      return state.backgrounds[level]
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
    setGameState (state, gameState) {
      state.gameState = gameState
    },
    setInLevel (state, bool) {
      state.inLevel = bool
    },
    setMapPoint (state, point) {
      state.currentLevel = point
    },
    unlockLevel (state, level) {
      if (!state.unlockedLevels.includes(level)) {
        state.unlockedLevels.push(level)
      }
    },
    initLevel (state, level) {
      state.backgrounds[level] = []
    }
  },
  actions: {

  }
}
