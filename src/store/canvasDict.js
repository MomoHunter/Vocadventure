import Spritesheet from '@/assets/Spritesheet.png'
import GameObjects from '@/data/GameObjects.json'

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
      'background_home_old_2': [false, 0, 1806, 600, 300],
      'background_intro': [false, 0, 2107, 600, 300],
      'background_intro_1': [false, 0, 2408, 600, 300],
      'background_intro_2': [false, 0, 2709, 600, 300],
      'background_intro_3': [false, 0, 3010, 600, 300],
      'background_intro_4': [false, 0, 3311, 600, 300],
      'background_intro_5': [false, 0, 3612, 600, 300],
      'background_intro_6': [false, 0, 3913, 600, 300],
      'background_intro_7': [false, 0, 4214, 600, 300],
      'background_intro_8': [false, 0, 4515, 600, 300],
      'background_intro_background': [false, 0, 4816, 600, 300],
      'background_intro_foreground': [false, 0, 5117, 600, 300],
      'background_plains_background': [false, 0, 5418, 300, 300],
      'background_plains_foreground': [false, 0, 5719, 300, 300],
      'background_snow': [false, 0, 6020, 300, 300],
      'background_universe': [false, 0, 6321, 600, 300],
      'background_world': [false, 0, 6622, 1800, 300],
      'background_world_old': [false, 0, 6923, 600, 300],
      'buildings_tent': [false, 1801, 0, 64, 60],
      'buildings_woodenhouse1': [false, 1801, 61, 61, 91],
      'items_beequeen': [false, 1866, 0, 50, 50],
      'items_beequeen_s': [false, 1866, 51, 20, 20],
      'items_berries': [false, 1866, 72, 50, 50],
      'items_berries_s': [false, 1866, 123, 20, 20],
      'items_bonfire': [false, 1866, 144, 50, 50],
      'items_branch': [false, 1866, 195, 50, 50],
      'items_branch_s': [false, 1866, 246, 20, 20],
      'items_clay': [false, 1866, 267, 50, 50],
      'items_claybowl': [false, 1866, 318, 50, 50],
      'items_clay_s': [false, 1866, 369, 20, 20],
      'items_cobwebs': [false, 1866, 390, 50, 50],
      'items_cobwebs_s': [false, 1866, 441, 20, 20],
      'items_crystal': [false, 1866, 462, 50, 50],
      'items_crystalaxe': [false, 1866, 513, 50, 50],
      'items_crystalchip': [false, 1866, 564, 50, 50],
      'items_crystalchip_s': [false, 1866, 615, 20, 20],
      'items_crystalpickaxe': [false, 1866, 636, 50, 50],
      'items_crystalshovel': [false, 1866, 687, 50, 50],
      'items_crystalsword': [false, 1866, 738, 50, 50],
      'items_crystal_s': [false, 1866, 789, 20, 20],
      'items_dirt': [false, 1866, 810, 50, 50],
      'items_dirt_s': [false, 1866, 861, 20, 20],
      'items_flower_1': [false, 1866, 882, 50, 50],
      'items_flower_1_s': [false, 1866, 933, 20, 20],
      'items_flower_2': [false, 1866, 954, 50, 50],
      'items_flower_2_s': [false, 1866, 1005, 20, 20],
      'items_flower_3': [false, 1866, 1026, 50, 50],
      'items_flower_3_s': [false, 1866, 1077, 20, 20],
      'items_flower_4': [false, 1866, 1098, 50, 50],
      'items_flower_4_s': [false, 1866, 1149, 20, 20],
      'items_flower_5': [false, 1866, 1170, 50, 50],
      'items_flower_5_s': [false, 1866, 1221, 20, 20],
      'items_flower_6': [false, 1866, 1242, 50, 50],
      'items_flower_6_s': [false, 1866, 1293, 20, 20],
      'items_glassbottle': [false, 1866, 1314, 39, 61],
      'items_glassbottle_s': [false, 1866, 1376, 13, 20],
      'items_goblinblood': [false, 1866, 1397, 29, 71],
      'items_goblinblood_s': [false, 1866, 1469, 9, 21],
      'items_goblinkingcrown': [false, 1866, 1491, 50, 50],
      'items_goblinkingcrown_s': [false, 1866, 1542, 20, 20],
      'items_grassbundle': [false, 1866, 1563, 50, 50],
      'items_grassbundle_s': [false, 1866, 1614, 20, 20],
      'items_hand': [false, 1866, 1635, 50, 50],
      'items_hand_s': [false, 1866, 1686, 20, 20],
      'items_honey': [false, 1866, 1707, 50, 50],
      'items_honey_s': [false, 1866, 1758, 20, 20],
      'items_leather': [false, 1866, 1779, 50, 50],
      'items_leatherarmor': [false, 1866, 1830, 55, 95],
      'items_leather_s': [false, 1866, 1926, 20, 20],
      'items_meat': [false, 1866, 1947, 50, 50],
      'items_meat_s': [false, 1866, 1998, 20, 20],
      'items_milk': [false, 1866, 2019, 50, 50],
      'items_milk_s': [false, 1866, 2070, 20, 20],
      'items_mushroom': [false, 1866, 2091, 50, 50],
      'items_mushroom_s': [false, 1866, 2142, 20, 20],
      'items_noarmor': [false, 1866, 2163, 76, 60],
      'items_pebble': [false, 1866, 2224, 50, 50],
      'items_pebble_s': [false, 1866, 2275, 20, 20],
      'items_pelt': [false, 1866, 2296, 50, 50],
      'items_pelt_s': [false, 1866, 2347, 20, 19],
      'items_pickledmushrooms': [false, 1866, 2367, 50, 50],
      'items_pickledmushrooms_s': [false, 1866, 2418, 20, 20],
      'items_plastic': [false, 1866, 2439, 50, 50],
      'items_plastic_s': [false, 1866, 2490, 20, 20],
      'items_rubbish': [false, 1866, 2511, 50, 50],
      'items_rubbish_random': [false, 1866, 2562, 50, 50],
      'items_rubbish_s': [false, 1866, 2613, 20, 20],
      'items_slimeball': [false, 1866, 2634, 50, 50],
      'items_slimeball_s': [false, 1866, 2685, 20, 20],
      'items_stone': [false, 1866, 2706, 50, 50],
      'items_stoneaxe': [false, 1866, 2757, 50, 50],
      'items_stoneaxe_s': [false, 1866, 2808, 20, 20],
      'items_stonepickaxe': [false, 1866, 2829, 37, 37],
      'items_stonepickaxe_s': [false, 1866, 2867, 20, 20],
      'items_stoneshovel': [false, 1866, 2888, 35, 35],
      'items_stoneshovel_s': [false, 1866, 2924, 20, 20],
      'items_stonesword': [false, 1866, 2945, 25, 26],
      'items_stonesword_s': [false, 1866, 2972, 20, 20],
      'items_stone_s': [false, 1866, 2993, 20, 20],
      'items_string': [false, 1866, 3014, 50, 50],
      'items_string_s': [false, 1866, 3065, 20, 20],
      'items_treeseed': [false, 1866, 3086, 50, 50],
      'items_treeseed_random': [false, 1866, 3137, 50, 50],
      'items_treeseed_s': [false, 1866, 3188, 20, 20],
      'items_tree_basic': [false, 1866, 3209, 50, 50],
      'items_tree_sakura': [false, 1866, 3260, 50, 50],
      'items_wood': [false, 1866, 3311, 50, 50],
      'items_woodenbucket': [false, 1866, 3362, 50, 50],
      'items_woodenbucket_s': [false, 1866, 3413, 20, 20],
      'items_wood_s': [false, 1866, 3434, 20, 20],
      'obstacles_bear': [false, 1943, 0, 90, 54],
      'obstacles_beenest': [false, 1943, 55, 44, 76],
      'obstacles_berrybush': [false, 1943, 132, 96, 82],
      'obstacles_claypit': [false, 1943, 215, 86, 86],
      'obstacles_cow': [false, 1943, 302, 100, 100],
      'obstacles_crystalpillar': [false, 1943, 403, 40, 93],
      'obstacles_crystals': [false, 1943, 497, 83, 77],
      'obstacles_deer': [false, 1943, 575, 81, 87],
      'obstacles_goblin': [false, 1943, 663, 71, 75],
      'obstacles_goblinking': [false, 1943, 739, 232, 182],
      'obstacles_goblin_d': [false, 1943, 922, 87, 80],
      'obstacles_net': [false, 1943, 1003, 36, 79],
      'obstacles_rubbishheap': [false, 1943, 1083, 88, 70],
      'obstacles_slime': [false, 1943, 1154, 27, 25],
      'obstacles_trunk': [false, 1943, 1180, 84, 95],
      'obstacles_wall': [false, 1943, 1276, 60, 86],
      'player_level_standing': [false, 2176, 0, 55, 95],
      'player_map_standing': [false, 2176, 96, 25, 43],
      'special_placeholder': [false, 2232, 0, 50, 50],
      'UI_HUD_bottom': [false, 2283, 0, 600, 50],
      'UI_word': [false, 2283, 51, 600, 50]
    },
    // end spriteDict
    gameState: 'home',
    gameStateStash: [],
    mapOffset: 0,
    transitions: [
      'introhome',
      'maplevel',
      'maphome',
      'homemap',
      'levelmap'
    ],
    animationActive: false, // blocks navigation animation at init on adventure
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
        map: { x: 291, y: 243 },
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
        x: 291,
        y: 243,
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
                { id: 'forestTrunk', chance: 0.03 },
                { id: 'forestWall', chance: 0.03 },
                { id: 'forestNet', chance: 0.03 },
                { id: 'forestRubbishHeap', chance: 0.03 },
                { id: 'forestBeeNest', chance: 0.03 },
                { id: 'forestDeer', chance: 0.03 },
                { id: 'forestBear', chance: 0.03 },
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
                { id: 'forestTrunk', chance: 0.03 },
                { id: 'forestWall', chance: 0.03 },
                { id: 'forestNet', chance: 0.03 },
                { id: 'forestRubbishHeap', chance: 0.03 },
                { id: 'forestBeeNest', chance: 0.03 },
                { id: 'forestDeer', chance: 0.03 },
                { id: 'forestBear', chance: 0.03 },
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
                { id: 'forestTrunk', chance: 0.02 },
                { id: 'forestWall', chance: 0.02 },
                { id: 'forestNet', chance: 0.08 },
                { id: 'forestRubbishHeap', chance: 0.02 },
                { id: 'forestBeeNest', chance: 0.02 },
                { id: 'forestDeer', chance: 0.02 },
                { id: 'forestBear', chance: 0.02 },
                { id: 'forestGoblin', chance: 0.02 }
              ]
            }
          }
        ],
        obstacles: GameObjects.filter(obj => obj.categories.includes('obstacle') && obj.categories.includes('forest'))
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
            canBeFound: {
              items: [
                { id: 'grassbundle', chance: 0.02 },
                { id: 'crystalchip', chance: 0.02 },
                { id: 'flower', chance: 0.02 }
              ],
              obstacles: [
                { id: 'plainsCrystals', chance: 0.02 },
                { id: 'plainsCrystalPillar', chance: 0.016 },
                { id: 'plainsClayPit', chance: 0.02 },
                { id: 'plainsCow', chance: 0.03 },
                { id: 'plainsSlime', chance: 0.03 },
                { id: 'plainsBerryBush', chance: 0.03 }
              ]
            }
          }
        ],
        obstacles: GameObjects.filter(obj => obj.categories.includes('obstacle') && obj.categories.includes('plains'))
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
        obstacles: []
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
        obstacles: []
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
        obstacles: []
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
        obstacles: []
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
        obstacles: []
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
        obstacles: []
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
        obstacles: []
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
        obstacles: []
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
        obstacles: []
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
        obstacles: []
      }
    },
    dynamicLevelData: {
      'home': {
        steps: 0,
        itemsFound: [],
        background: [
          { x: 200, y: 0, spriteKey: 'buildings_tent' }
        ],
        foreground: [],
        events: [],
        killedEnemies: [],
        itemsOnFloor: false,
        obstacleAhead: false,
        lootableObstacle: false,
        collectableObstacle: false,
        bossSpawned: false
      },
      'forest': {
        steps: 0,
        itemsFound: [],
        background: [],
        foreground: [],
        events: [],
        killedEnemies: [],
        itemsOnFloor: false,
        obstacleAhead: false,
        lootableObstacle: false,
        collectableObstacle: false,
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
        event => event.type === 'obstacle' && !event.registered && state.dynamicLevelData[level].steps < event.field
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
      let events = state.dynamicLevelData[state.currentLevel].events.filter(event =>
        event.field === field && event.type === 'obstacle'
      )

      if (events.length > 0) {
        return events[0]
      }

      return false
    },
    getObstacleObject: (state) => (level, id) => {
      return state.staticLevelData[level].obstacles.find(obstacle => obstacle.id === id)
    },
    getLootableObstacleObject: (state, getters) => {
      const lootableObstacle = getters.getObstacleOnField(state.dynamicLevelData[state.currentLevel].steps)
      if (lootableObstacle) {
        let lootableObstacleObject = getters.getObstacleObject(state.currentLevel, lootableObstacle.id)
        if (lootableObstacleObject.lootableItems) {
          return lootableObstacleObject
        }
      }
      return null
    },
    getCollectableObstacleObject: (state, getters) => {
      const collectableObstacle = getters.getObstacleOnField(state.dynamicLevelData[state.currentLevel].steps + 1)
      if (collectableObstacle) {
        let collectableObstacleObject = getters.getObstacleObject(state.currentLevel, collectableObstacle.id)
        if (collectableObstacleObject.collectableItems) {
          return collectableObstacleObject
        }
      }
      return null
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
        character: JSON.parse(JSON.stringify(state.character)),
        unlockedBuildings: state.unlockedBuildings,
        collectedItems: JSON.parse(JSON.stringify(state.collectedItems)),
        collectables: JSON.parse(JSON.stringify(state.collectables)),
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
        killedEnemies: [],
        itemsOnFloor: false,
        obstacleAhead: false,
        lootableObstacle: false,
        collectableObstacle: false,
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
          killedEnemies: [],
          itemsOnFloor: false,
          obstacleAhead: false,
          lootableObstacle: false,
          collectableObstacle: false,
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
    setCollectableObstacle (state, bool) {
      state.dynamicLevelData[state.currentLevel].collectableObstacle = bool
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
    addKilledEnemy (state, id) {
      let entry = state.dynamicLevelData[state.currentLevel].killedEnemies.find(enemy => { return enemy.id === id })

      if (entry) {
        entry.amount += 1
      } else {
        state.dynamicLevelData[state.currentLevel].killedEnemies.push({ id: id, amount: 1 })
      }
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
    addCollectedItem (state, item) {
      let foundItem = state.collectedItems.find(collectedItem => collectedItem.id === item.id && !collectedItem.animated)
      if (foundItem) {
        foundItem.quantity += item.quantity
      } else {
        state.collectedItems.push(item)
      }
    },
    setCollectedItemsAnimated (state) {
      for (let item of state.collectedItems) {
        if (!item.animated) {
          item.animated = true
        }
      }
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
      state.collectedItems = copies.collectedItems
      state.collectables = copies.collectables
      state.dynamicLevelData = copies.dynamicLevelData
    }
  },
  actions: {

  }
}
