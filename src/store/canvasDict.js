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
      'items_stone_onfloor': [false, 601, 0, 16, 16],
      'items_wood_onfloor': [false, 601, 17, 18, 16],
      'obstacles_trunk': [false, 620, 0, 84, 95],
      'obstacles_wall': [false, 620, 96, 60, 86],
      'player_level_standing': [false, 705, 0, 55, 95],
      'player_map_standing': [false, 705, 96, 25, 43],
      'special_placeholder': [false, 761, 0, 50, 50]
    },
    // end spriteDict
    gameState: 'map',
    gameStateStash: [],
    transitions: [
      'intromap',
      'maplevel',
      'levelmap'
    ],
    animationActive: false,
    obstacleAhead: false,
    itemsOnFloor: false,
    questionKey: '',
    currentLevel: 'home',
    staticLevelData: {
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
            spriteKey: 'background_forest_background',
            chance: 1,
            fieldCount: 3,
            foundOn: [1, 2, 3],
            canBeFound: [
              { id: 'wood', chance: 0.25 },
              { id: 'stone', chance: 0.25 }
            ]
          }
        ],
        obstacles: [
          {
            id: 'forestTrunk',
            spriteKey: 'obstacles_trunk',
            durability: 20,
            chance: 1,
            items: [
              { id: 'wood', quantity: 3, points: 9 }
            ]
          },
          {
            id: 'forestWall',
            spriteKey: 'obstacles_wall',
            durability: 30,
            chance: 1,
            items: [
              { id: 'stone', quantity: 4, points: 16 }
            ]
          }
        ],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
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
        obstacles: [],
        chanceForObstacle: 0.012
      }
    },
    dynamicLevelData: {
      'home': {
        steps: 0,
        background: [
          { x: 0, y: 0, spriteKey: 'background_home' }
        ],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'forest': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
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
    currentMapPoint: (state) => {
      return state.staticLevelData[state.currentLevel]
    },
    getDynamicLevelData: (state) => (level) => {
      return state.dynamicLevelData[level]
    },
    getLastBackground: (state) => (level) => {
      let bg = state.dynamicLevelData[level].background

      if (bg.length === 0) {
        return null
      }
      return bg[bg.length - 1]
    },
    getNextObstacleEvent: (state) => (level) => {
      let events = state.dynamicLevelData[level].events.filter(
        event => event.type === 'obstacle' && !event.registered
      )
      let index = 0

      if (events.length === 0) {
        return null
      }

      for (let i = 0; i < events.length; i++) {
        if (events[i].field < events[index].field) {
          index = i
        }
      }

      return events[index]
    },
    getNextItemEvents: (state) => (level) => {
      let events = state.dynamicLevelData[level].events
      let nextItemField = events.find(event => event.type === 'item') || null

      if (events.length === 0 || !nextItemField) {
        return []
      }

      nextItemField = nextItemField.field

      for (let event of events) {
        if (event.type === 'item' && !event.registered && event.field < nextItemField) {
          nextItemField = event.field
        }
      }

      return events.filter(event => event.field === nextItemField)
    },
    getBackgroundItemData: (state) => (level, id) => {
      let background = state.staticLevelData[level].backgroundChances.find(bg => bg.id === id)

      return {
        foundOn: background.foundOn,
        canBeFound: background.canBeFound
      }
    },
    hasFieldObstacle: (state) => (level, field) => {
      let events = state.dynamicLevelData[level].events

      for (let i = 0; i < events.length; i++) {
        if (events[i].type === 'obstacle' && events[i].field === field) {
          return true
        }
      }
      return false
    },
    getItemNoOnField: (state) => (level, field) => {
      let events = state.dynamicLevelData[level].events
      let count = 0

      for (let event of events) {
        if (event.type === 'item' && event.field === field) {
          count++
        }
      }

      return count
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
    setAnimationActive (state, bool) {
      state.animationActive = bool
    },
    addGameState (state, gameState) {
      state.gameStateStash.push(gameState)
    },
    checkGameState (state) {
      if (state.gameStateStash.length > 0) {
        let newState = state.gameStateStash.shift()
        if (state.transitions.includes(state.gameState + newState)) {
          state.gameState = state.gameState + newState
        } else {
          state.gameState = newState
        }
      }
    },
    setMapPoint (state, point) {
      state.currentLevel = point
    },
    unlockLevel (state, level) {
      if (!state.dynamicLevelData[level]) {
        state.dynamicLevelData[level] = {
          steps: 0,
          background: [],
          foreground: [],
          events: [],
          itemsOnFloor: false,
          obstacleAhead: false
        }
      }
    },
    addBackground (state, background) {
      state.dynamicLevelData[state.currentLevel].background.push(background)
    },
    addForeground (state, foreground) {
      state.dynamicLevelData[state.currentLevel].foreground.push(foreground)
    },
    addEvent (state, event) {
      state.dynamicLevelData[state.currentLevel].events.push(event)
    },
    setObstacleAhead (state, bool) {
      state.dynamicLevelData[state.currentLevel].obstacleAhead = bool
    },
    setItemsOnFloor (state, bool) {
      state.dynamicLevelData[state.currentLevel].itemsOnFloor = bool
    },
    removeItemsOnFloor (state, object) {
      state.dynamicLevelData[state.currentLevel].events = state.dynamicLevelData[state.currentLevel].events.filter(
        event => event.type !== object.type || event.field !== object.field
      )
    },
    reduceObstacleDurability (state, object) {
      let event = state.dynamicLevelData[state.currentLevel].events.find(
        event => event.type === 'obstacle' && event.field === object.field
      )

      event.durability = Math.max(event.durability - object.amount, 0)
    },
    setEventsRegistered (state, object) {
      let events = state.dynamicLevelData[state.currentLevel].events.filter(
        event => event.type === object.type && event.field === object.field
      )

      for (let event of events) {
        event.registered = true
      }
    },
    setQuestionKey (state, key) {
      state.questionKey = key
    },
    moveBackground (state, object) {
      let dynLevelData = state.dynamicLevelData[object.level]

      for (let background of dynLevelData.background) {
        background.x -= object.speedX || 0
        background.y -= object.speedY || 0
      }

      for (let foreground of dynLevelData.foreground) {
        foreground.x -= object.speedX || 0
        foreground.y -= object.speedY || 0
      }

      for (let event of dynLevelData.events) {
        event.x -= object.speedX || 0
        event.y -= object.speedY || 0
      }
    },
    correctBackgroundPos (state, level) {
      let dynLevelData = state.dynamicLevelData[level]

      for (let background of dynLevelData.background) {
        background.x = Math.round(background.x / 100) * 100
      }

      for (let foreground of dynLevelData.foreground) {
        foreground.x = Math.round(foreground.x / 100) * 100
      }
    },
    removeBackgrounds (state, level) {
      let removedBackground = state.dynamicLevelData[level].background.shift()
      if (removedBackground.spriteKey.endsWith('background')) {
        state.dynamicLevelData[level].foreground.shift()
      }
    },
    incSteps (state, level) {
      state.dynamicLevelData[level].steps++
    }
  },
  actions: {

  }
}
