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
      'background_forest_cobwebs': [false, 0, 602, 600, 300],
      'background_forest_foreground': [false, 0, 903, 300, 300],
      'background_home': [false, 0, 1204, 600, 300],
      'background_home_old': [false, 0, 1505, 600, 300],
      'background_intro': [false, 0, 1806, 600, 300],
      'background_intro_background': [false, 0, 2107, 600, 300],
      'background_intro_foreground': [false, 0, 2408, 600, 300],
      'background_plains_background': [false, 0, 2709, 300, 300],
      'background_plains_foreground': [false, 0, 3010, 300, 300],
      'background_snow': [false, 0, 3311, 300, 300],
      'background_universe': [false, 0, 3612, 600, 300],
      'background_world': [false, 0, 3913, 1800, 300],
      'background_world_old': [false, 0, 4214, 600, 300],
      'items_beequeen': [false, 1801, 0, 50, 50],
      'items_beequeen_s': [false, 1801, 51, 20, 20],
      'items_branch': [false, 1801, 72, 50, 50],
      'items_branch_s': [false, 1801, 123, 20, 20],
      'items_cobwebs': [false, 1801, 144, 50, 50],
      'items_cobwebs_s': [false, 1801, 195, 20, 20],
      'items_dirt': [false, 1801, 216, 50, 50],
      'items_dirt_s': [false, 1801, 267, 20, 20],
      'items_glassbottle': [false, 1801, 288, 39, 61],
      'items_glassbottle_s': [false, 1801, 350, 13, 20],
      'items_goblinblood': [false, 1801, 371, 29, 71],
      'items_goblinblood_s': [false, 1801, 443, 9, 21],
      'items_goblinkingcrown': [false, 1801, 465, 50, 50],
      'items_goblinkingcrown_s': [false, 1801, 516, 20, 20],
      'items_hand': [false, 1801, 537, 50, 50],
      'items_hand_s': [false, 1801, 588, 20, 20],
      'items_honey': [false, 1801, 609, 50, 50],
      'items_honey_s': [false, 1801, 660, 20, 20],
      'items_leather': [false, 1801, 681, 50, 50],
      'items_leatherarmor': [false, 1801, 732, 55, 95],
      'items_leather_s': [false, 1801, 828, 20, 20],
      'items_mushroom': [false, 1801, 849, 50, 50],
      'items_mushroom_s': [false, 1801, 900, 20, 20],
      'items_noarmor': [false, 1801, 921, 76, 60],
      'items_pebble': [false, 1801, 982, 50, 50],
      'items_pebble_s': [false, 1801, 1033, 20, 20],
      'items_pelt': [false, 1801, 1054, 50, 50],
      'items_pelt_s': [false, 1801, 1105, 20, 19],
      'items_pickledmushrooms': [false, 1801, 1125, 50, 50],
      'items_pickledmushrooms_s': [false, 1801, 1176, 20, 20],
      'items_plastic': [false, 1801, 1197, 50, 50],
      'items_plastic_s': [false, 1801, 1248, 20, 20],
      'items_rubbish': [false, 1801, 1269, 50, 50],
      'items_rubbish_random': [false, 1801, 1320, 50, 50],
      'items_rubbish_s': [false, 1801, 1371, 20, 20],
      'items_stone': [false, 1801, 1392, 50, 50],
      'items_stoneaxe': [false, 1801, 1443, 50, 50],
      'items_stoneaxe_s': [false, 1801, 1494, 20, 20],
      'items_stonepickaxe': [false, 1801, 1515, 37, 37],
      'items_stonepickaxe_s': [false, 1801, 1553, 20, 20],
      'items_stoneshovel': [false, 1801, 1574, 35, 35],
      'items_stoneshovel_s': [false, 1801, 1610, 20, 20],
      'items_stonesword': [false, 1801, 1631, 25, 26],
      'items_stonesword_s': [false, 1801, 1658, 20, 20],
      'items_stone_s': [false, 1801, 1679, 20, 20],
      'items_string': [false, 1801, 1700, 50, 50],
      'items_string_s': [false, 1801, 1751, 20, 20],
      'items_treeseed': [false, 1801, 1772, 50, 50],
      'items_treeseed_random': [false, 1801, 1823, 50, 50],
      'items_treeseed_s': [false, 1801, 1874, 20, 20],
      'items_tree_basic': [false, 1801, 1895, 50, 50],
      'items_tree_sakura': [false, 1801, 1946, 50, 50],
      'items_wood': [false, 1801, 1997, 50, 50],
      'items_wood_s': [false, 1801, 2048, 20, 20],
      'obstacles_bear': [false, 1878, 0, 90, 54],
      'obstacles_beenest': [false, 1878, 55, 44, 76],
      'obstacles_deer': [false, 1878, 132, 81, 87],
      'obstacles_goblin': [false, 1878, 220, 71, 75],
      'obstacles_goblinking': [false, 1878, 296, 232, 182],
      'obstacles_goblin_d': [false, 1878, 479, 87, 80],
      'obstacles_net': [false, 1878, 560, 36, 79],
      'obstacles_rubbishheap': [false, 1878, 640, 88, 70],
      'obstacles_trunk': [false, 1878, 711, 84, 95],
      'obstacles_wall': [false, 1878, 807, 60, 86],
      'player_level_standing': [false, 2111, 0, 55, 95],
      'player_map_standing': [false, 2111, 96, 25, 43],
      'special_placeholder': [false, 2167, 0, 50, 50]
    },
    // end spriteDict
    gameState: 'map',
    gameStateStash: [],
    mapOffset: 0,
    transitions: [
      'intromap',
      'maplevel',
      'maphome',
      'homemap',
      'levelmap'
    ],
    animationActive: false, // blocks navigation animation at init on adventure
    collectableItems: [],
    questionKey: '',
    playerHealth: 100,
    currentLevel: 'home',
    currentBuilding: 'house',
    character: {
      main: {
        map: 'player_map_standing',
        level: 'player_level_standing'
      },
      hand: 'hand',
      armor: 'noarmor',
      pos: {
        map: { x: 45, y: 100 },
        level: { x: 50, y: 145 }
      }
    },
    unlockedBuildings: ['house'],
    collectedItems: [],
    collectables: [],
    homePointData: {
      'greenhouse': {
        x: 117,
        y: 239,
        left: false,
        right: 'house'
      },
      'house': {
        x: 300,
        y: 239,
        left: 'greenhouse',
        right: 'launchpad'
      },
      'launchpad': {
        x: 493,
        y: 239,
        left: 'house',
        right: false
      }
    },
    paths: {
      'housegreenhouse': [
        { x: 0, y: 1 },
        { x: 140, y: 265, force: 0.015 },
        { x: 0, y: 0, force: 0.02 }
      ],
      'greenhousehouse': [
        { x: 1, y: 0 },
        { x: 0, y: 0, force: 0.05 }
      ],
      'houselaunchpad': [
        { x: 1, y: 0 },
        { x: 0, y: 0, force: 0.05 }
      ],
      'launchpadhouse': [
        { x: -1, y: 0 },
        { x: 0, y: 0, force: 0.05 }
      ],
      'homeforest': [
        { x: 1, y: 0 },
        { x: 100, y: 100, force: 0.05 },
        { x: 0, y: 0, force: 0.05 }
      ],
      'foresthome': [
        { x: -0.7071, y: 0.7071 },
        { x: 75, y: 170, force: 0.03 },
        { x: 0, y: 0, force: 0.03 }
      ],
      'forestplains': [
        { x: 1, y: 0 }, // startvector
        { x: 200, y: 80, force: 0.02 },
        { x: 250, y: 250, force: 0.02 },
        { x: 0, y: 0, force: 0.2 } // placeholder for goalpoint
      ],
      'plainsforest': [
        { x: -1, y: 0 },
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
            foundOn: {
              items: [1, 2, 3],
              obstacles: [1, 2, 3]
            },
            canBeFound: {
              items: [
                { id: 'branch', chance: 0.07 },
                { id: 'pebble', chance: 0.07 },
                { id: 'dirt', chance: 0.03 },
                { id: 'mushroom', chance: 0.055 },
                { id: 'cobwebs', chance: 0.07 },
                { id: 'treeseed', chance: 0.01 }
              ],
              obstacles: [
                /* { id: 'forestTrunk', chance: 0.03 },
                { id: 'forestWall', chance: 0.03 },
                { id: 'forestNet', chance: 0.03 },
                { id: 'forestRubbishHeap', chance: 0.03 },
                { id: 'forestBeeNest', chance: 0.03 },
                { id: 'forestDeer', chance: 0.03 }, */
                { id: 'forestBear', chance: 0.3 },
                { id: 'forestGoblin', chance: 0.03 }
              ]
            }
          },
          {
            id: 'forestBasic2',
            spriteKey: 'background_forest_2',
            chance: 1,
            fieldCount: 2,
            foundOn: {
              items: [1, 2],
              obstacles: [1, 2]
            },
            canBeFound: {
              items: [
                { id: 'branch', chance: 0.07 },
                { id: 'pebble', chance: 0.07 },
                { id: 'dirt', chance: 0.03 },
                { id: 'mushroom', chance: 0.055 },
                { id: 'cobwebs', chance: 0.07 },
                { id: 'treeseed', chance: 0.01 }
              ],
              obstacles: [
                /* { id: 'forestTrunk', chance: 0.03 },
                { id: 'forestWall', chance: 0.03 },
                { id: 'forestNet', chance: 0.03 },
                { id: 'forestRubbishHeap', chance: 0.03 },
                { id: 'forestBeeNest', chance: 0.03 },
                { id: 'forestDeer', chance: 0.03 }, */
                { id: 'forestBear', chance: 0.3 },
                { id: 'forestGoblin', chance: 0.03 }
              ]
            }
          },
          {
            id: 'forestCobwebs',
            spriteKey: 'background_forest_cobwebs',
            chance: 0.3,
            fieldCount: 6,
            foundOn: {
              items: [1, 2, 3, 4, 5, 6],
              obstacles: [1, 2, 3, 4, 5, 6]
            },
            canBeFound: {
              items: [
                { id: 'branch', chance: 0.05 },
                { id: 'pebble', chance: 0.05 },
                { id: 'dirt', chance: 0.02 },
                { id: 'mushroom', chance: 0.05 },
                { id: 'cobwebs', chance: 0.2 },
                { id: 'cobwebs', chance: 0.1 },
                { id: 'cobwebs', chance: 0.04 },
                { id: 'treeseed', chance: 0.01 }
              ],
              obstacles: [
                /* { id: 'forestTrunk', chance: 0.02 },
                { id: 'forestWall', chance: 0.02 },
                { id: 'forestNet', chance: 0.08 },
                { id: 'forestRubbishHeap', chance: 0.02 },
                { id: 'forestBeeNest', chance: 0.02 },
                { id: 'forestDeer', chance: 0.02 }, */
                { id: 'forestBear', chance: 0.2 },
                { id: 'forestGoblin', chance: 0.02 }
              ]
            }
          }
        ],
        obstacles: [
          {
            id: 'forestTrunk',
            spriteKey: 'obstacles_trunk',
            bottomY: 265,
            durability: 8,
            items: [
              { id: 'wood', quantity: 3 }
            ]
          },
          {
            id: 'forestWall',
            spriteKey: 'obstacles_wall',
            bottomY: 265,
            durability: 13,
            items: [
              { id: 'stone', quantity: 4 }
            ]
          },
          {
            id: 'forestNet',
            spriteKey: 'obstacles_net',
            bottomY: 265,
            durability: 6,
            items: [
              { id: 'string', quantity: 2 }
            ]
          },
          {
            id: 'forestRubbishHeap',
            spriteKey: 'obstacles_rubbishheap',
            bottomY: 255,
            durability: 7,
            items: [
              { id: 'rubbish', quantity: 3 }
            ]
          },
          {
            id: 'forestBeeNest',
            spriteKey: 'obstacles_beenest',
            bottomY: 225,
            durability: 7,
            items: [
              { id: 'honey', quantity: 2 },
              { id: 'beequeen', quantity: 1, chance: 0.03 }
            ]
          },
          {
            id: 'forestDeer',
            spriteKey: 'obstacles_deer',
            bottomY: 240,
            durability: 9,
            power: 1,
            items: [
              { id: 'leather', quantity: 1 }
            ]
          },
          {
            id: 'forestBear',
            spriteKey: 'obstacles_bear',
            bottomY: 240,
            durability: 16,
            power: 3,
            approaches: true,
            items: [
              { id: 'pelt', quantity: 1 }
            ]
          },
          {
            id: 'forestGoblin',
            spriteKey: 'obstacles_goblin',
            bottomY: 240,
            destroyedBottomY: 265,
            durability: 12,
            power: 2,
            items: [
              { id: 'goblinblood', quantity: 1 }
            ]
          },
          {
            id: 'forestGoblinking',
            spriteKey: 'obstacles_goblinking',
            centerX: 140,
            bottomY: 240,
            durability: 36,
            boss: true,
            unlocks: [
              'plains'
            ],
            power: 6,
            items: [
              { id: 'goblinkingcrown', quantity: 1, collectable: true }
            ]
          }
        ]
      },
      'plains': {
        x: 330,
        y: 170,
        tc: false,
        cl: 'forest',
        cc: 'home',
        cr: 'desert',
        bc: false,
        backgroundChances: [
          {
            id: 'plainsBasic',
            spriteKey: 'background_plains_background',
            chance: 1,
            fieldCount: 3,
            foundOn: {
              items: [1, 2, 3],
              obstacles: [1, 2, 3]
            },
            canBeFound: []
          }
        ],
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
        itemsFound: [],
        background: [
          { x: 0, y: 0, spriteKey: 'background_home' }
        ],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false,
        lootableObstacle: false,
        bossSpawned: false
      },
      'forest': {
        steps: 0,
        itemsFound: [],
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false,
        lootableObstacle: false,
        bossSpawned: false
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
    getSpriteData: (state) => (spriteKey, checkExists = false) => {
      if (checkExists) {
        return !!(state.spriteDict[spriteKey])
      } else {
        let spriteData = state.spriteDict[spriteKey]
        if (!spriteData) {
          console.error('Wrong key: ', spriteKey)
          spriteData = state.spriteDict['special_placeholder']
        }
        return { spriteWidth: spriteData[3], spriteHeight: spriteData[4], full: spriteData, key: spriteKey }
      }
    },
    currentMapPoint: (state) => {
      return state.staticLevelData[state.currentLevel]
    },
    currentHomePoint: (state) => {
      return state.homePointData[state.currentBuilding]
    },
    getMapPath: (state) => (path) => {
      return JSON.parse(JSON.stringify(state.paths[path] || []))
    },
    getDynamicLevelData: (state) => (level) => {
      return state.dynamicLevelData[level]
    },
    getFirstBackground: (state) => (level) => {
      let bg = state.dynamicLevelData[level].background

      if (bg.length === 0) {
        return null
      }
      return bg[0]
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
      let nextItemField = events.find(event => event.type === 'item' && !event.registered) || null

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
    },
    getObstacleOnField: (state) => (field) => {
      let events = state.dynamicLevelData[state.currentLevel].events.filter(event => event.field === field)

      if (events.length > 0) {
        return events[0]
      }

      return false
    },
    getObstacleObject: (state) => (level, id) => {
      return state.staticLevelData[level].obstacles.find(obstacle => obstacle.id === id)
    },
    getBossObject: (state) => (level) => {
      return state.staticLevelData[level].obstacles.find(obstacle => obstacle.boss)
    },
    isAlreadyCollected: (state) => (itemId) => {
      return state.collectables.includes(itemId)
    },
    getAdventureCopies: (state) => {
      return {
        gameState: state.gameState,
        mapOffset: state.mapOffset,
        playerHealth: state.playerHealth,
        currentLevel: state.currentLevel,
        currentBuilding: state.currentBuilding,
        character: state.character,
        unlockedBuildings: state.unlockedBuildings,
        dynamicLevelData: JSON.parse(JSON.stringify(state.dynamicLevelData))
      }
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
    changeDynamicLevelData (state, dynamicLevelData) {
      state.dynamicLevelData = dynamicLevelData
    },
    setAnimationActive (state, bool) {
      state.animationActive = bool
    },
    setMapOffset (state, offset) {
      state.mapOffset = offset
    },
    changeGameState (state, gameState) {
      state.gameState = gameState
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
    setLevel (state, point) {
      state.currentLevel = point
    },
    changeUnlockedBuilding (state, buildings) {
      state.unlockedBuildings = buildings
    },
    setBuilding (state, point) {
      state.currentBuilding = point
    },
    unlockBuilding (state, building) {
      state.unlockedBuildings.push(building)
    },
    resetLevel (state, level) {
      state.dynamicLevelData[level] = {
        steps: 0,
        itemsFound: [],
        background: [],
        foreground: [],
        events: [],
        itemsOnFloor: false,
        obstacleAhead: false,
        lootableObstacle: false,
        bossSpawned: false
      }
    },
    unlockLevel (state, level) {
      if (!state.dynamicLevelData[level]) {
        state.dynamicLevelData[level] = {
          steps: 0,
          itemsFound: [],
          background: [],
          foreground: [],
          events: [],
          itemsOnFloor: false,
          obstacleAhead: false,
          lootableObstacle: false,
          bossSpawned: false
        }
      }
    },
    setCharacter (state, character) {
      state.character = character
    },
    setEquippedItem (state, itemId) {
      state.character.hand = itemId
    },
    setEquippedArmor (state, itemId) {
      state.character.armor = itemId
    },
    setCharacterPosition (state, object) {
      if (object.x) {
        state.character.pos[object.type].x = object.x
      }
      if (object.y) {
        state.character.pos[object.type].y = object.y
      }
    },
    addFoundItem (state, item) {
      let itemObj = state.dynamicLevelData[state.currentLevel].itemsFound.find(obj => obj.id === item.id)
      if (itemObj) {
        itemObj.quantity += item.quantity
      } else {
        state.dynamicLevelData[state.currentLevel].itemsFound.push(item)
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
    setEventY (state, object) {
      let event = state.dynamicLevelData[state.currentLevel].events.find(event =>
        event.type === object.event.type && event.id === object.event.id && event.field === object.event.field
      )

      event.y = object.newY
    },
    setEventX (state, object) {
      let event = state.dynamicLevelData[state.currentLevel].events.find(event =>
        event.type === object.event.type && event.id === object.event.id && event.field === object.event.field
      )

      event.x = object.newX
    },
    setEventField (state, object) {
      let event = state.dynamicLevelData[state.currentLevel].events.find(event =>
        event.type === object.event.type && event.id === object.event.id && event.field === object.event.field
      )

      event.field = object.newField
    },
    setObstacleAhead (state, bool) {
      state.dynamicLevelData[state.currentLevel].obstacleAhead = bool
    },
    setItemsOnFloor (state, bool) {
      state.dynamicLevelData[state.currentLevel].itemsOnFloor = bool
    },
    setLootableObstacle (state, bool) {
      state.dynamicLevelData[state.currentLevel].lootableObstacle = bool
    },
    setBossSpawned (state, bool) {
      state.dynamicLevelData[state.currentLevel].bossSpawned = bool
    },
    removeItemsOnFloor (state, object) {
      state.dynamicLevelData[state.currentLevel].events = state.dynamicLevelData[state.currentLevel].events.filter(
        event => { return event.type !== object.type || event.field !== object.field }
      )
    },
    removeFirstEvent (state) {
      state.dynamicLevelData[state.currentLevel].events.shift()
    },
    removeEvents (state) {
      state.dynamicLevelData[state.currentLevel].events = state.dynamicLevelData[state.currentLevel].events.filter(
        event => event.x > -200
      )
    },
    reduceObstacleDurability (state, object) {
      let event = state.dynamicLevelData[state.currentLevel].events.find(
        event => { return event.type === 'obstacle' && event.field === object.field }
      )

      event.durability = Math.max(event.durability - object.amount, 0)
    },
    setEventsRegistered (state, object) {
      let events = state.dynamicLevelData[state.currentLevel].events.filter(
        event => { return event.type === object.type && event.field === object.field }
      )

      for (let event of events) {
        event.registered = true
      }
    },
    setCollectableItems (state, key) {
      state.collectableItems = key
    },
    setQuestionKey (state, key) {
      state.questionKey = key
    },
    setPlayerHealth (state, amount) {
      state.playerHealth = amount
    },
    changePlayerHealth (state, amount) {
      state.playerHealth = Math.max(Math.min(state.playerHealth + amount, 100), 0)
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
    },
    changeCollectables (state, collectables) {
      state.collectables = collectables
    },
    addCollectable (state, itemId) {
      state.collectables.push(itemId)
    },
    setCollectedItems (state, items) {
      state.collectedItems = items
    },
    setAdventureCopies (state, copies) {
      state.gameState = copies.gameState
      state.mapOffset = copies.mapOffset
      state.playerHealth = copies.playerHealth
      state.currentLevel = copies.currentLevel
      state.currentBuilding = copies.currentBuilding
      state.character = copies.character
      state.unlockedBuildings = copies.unlockedBuildings
      state.dynamicLevelData = copies.dynamicLevelData
    }
  },
  actions: {

  }
}
