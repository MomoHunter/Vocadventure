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
      'background_forest_2': [false, 0, 0, 200, 300],
      'background_forest_background': [false, 0, 301, 300, 300],
      'background_forest_foreground': [false, 0, 602, 300, 300],
      'background_home': [false, 0, 903, 600, 300],
      'background_intro': [false, 0, 1204, 600, 300],
      'background_intro_background': [false, 0, 1505, 600, 300],
      'background_intro_foreground': [false, 0, 1806, 600, 300],
      'background_snow': [false, 0, 2107, 300, 300],
      'background_universe': [false, 0, 2408, 600, 300],
      'background_world': [false, 0, 2709, 1800, 300],
      'background_world_old': [false, 0, 3010, 600, 300],
      'items_stone_onfloor': [false, 1801, 0, 16, 16],
      'items_wood_onfloor': [false, 1801, 17, 18, 16],
      'obstacles_trunk': [false, 1820, 0, 84, 95],
      'obstacles_wall': [false, 1820, 96, 60, 86],
      'player_level_standing': [false, 1905, 0, 55, 95],
      'player_map_standing': [false, 1905, 96, 25, 43],
      'special_placeholder': [false, 1961, 0, 50, 50]
    },
    // end spriteDict
    gameState: 'map',
    gameStateStash: [],
    mapOffset: 0,
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
    paths: {
      'forestplains': [
        { x: 1, y: 0 }, // startvector
        { x: 200, y: 80, force: 0.02 },
        { x: 250, y: 250, force: 0.02 },
        { x: 0, y: 0, force: 0.2 }
      ]
    },
    staticLevelData: {
      'home': {
        x: 45,
        y: 100,
        tc: false,
        cl: false,
        cc: false,
        cr: 'forest',
        bc: false
      },
      'forest': {
        x: 136,
        y: 170,
        tc: false,
        cl: 'home',
        cc: 'home',
        cr: 'plains',
        bc: false,
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
          },
          {
            id: 'forestBasic2',
            spriteKey: 'background_forest_2',
            chance: 1,
            fieldCount: 2,
            foundOn: [1, 2],
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
      'plains': {
        x: 330,
        y: 170,
        tc: false,
        cl: 'forest',
        cc: 'home',
        cr: 'desert',
        bc: false,
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'desert': {
        x: 535,
        y: 155,
        tc: false,
        cl: 'plains',
        cc: 'home',
        cr: 'mountain',
        bc: false,
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'mountain': {
        x: 715,
        y: 100,
        tc: false,
        cl: 'desert',
        cc: 'home',
        cr: 'snow',
        bc: false,
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'snow': {
        x: 880,
        y: 130,
        tc: false,
        cl: 'mountain',
        cc: 'home',
        cr: 'mines',
        bc: false,
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'mines': {
        x: 1050,
        y: 125,
        tc: false,
        cl: 'snow',
        cc: 'home',
        cr: 'city',
        bc: 'volcano',
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'volcano': {
        x: 975,
        y: 265,
        tc: 'mines',
        cl: false,
        cc: 'home',
        cr: false,
        bc: false,
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'city': {
        x: 1290,
        y: 180,
        tc: 'cemetry',
        cl: 'mines',
        cc: 'home',
        cr: 'beach',
        bc: 'spacestation',
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'cemetry': {
        x: 1220,
        y: 55,
        tc: false,
        cl: false,
        cc: 'home',
        cr: false,
        bc: 'city',
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'spacestation': {
        x: 1390,
        y: 275,
        tc: 'city',
        cl: false,
        cc: 'home',
        cr: false,
        bc: false,
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'beach': {
        x: 1500,
        y: 150,
        tc: false,
        cl: 'city',
        cc: 'home',
        cr: 'underwater',
        bc: false,
        backgroundChances: [],
        obstacles: [],
        chanceForObstacle: 0.012
      },
      'underwater': {
        x: 1750,
        y: 150,
        tc: false,
        cl: 'beach',
        cc: 'home',
        cr: false,
        bc: false,
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
      },
      'plains': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'mountain': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'desert': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'snow': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'mines': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'volcano': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'city': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'cemetry': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'spacestation': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'beach': {
        steps: 0,
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false
      },
      'underwater': {
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
    getMapPath: (state) => (path) => {
      return JSON.parse(JSON.stringify(state.paths[path] || []))
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
    setMapOffset (state, offset) {
      state.mapOffset = offset
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
