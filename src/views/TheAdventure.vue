<template>
  <div class="flexContainer">
    <div class="fullWidth marginBottomBig">
      <HeroWithTags title="adventureTitle" :tagObjects="tags" />
      <canvas id="adventureCanvas" width="600" height="300"></canvas>
    </div>
    <div class="routerView fullWidth">
      <router-view @click="viewClickHandler($event)"></router-view>
    </div>
  </div>
</template>

<script>
import * as Helper from '@/canvas/helper.js'
import { AnimationObject } from '@/canvas/elements.js'
import HeroWithTags from '@/components/HeroWithTags.vue'

export default {
  name: 'TheAdventure',
  components: {
    HeroWithTags
  },
  data () {
    return {
      loopActivated: false,
      introTexts: [],
      stepWidth: 100,
      oldMapOffset: null,
      counter: {
        animation: 0,
        increase: 0
      },
      itemPositions: [
        { x: 25, y: 218 },
        { x: 41, y: 232 },
        { x: 59, y: 224 }
      ],
      animationQueue: [],
      currentAnimation: null,
      animationStartFrame: 0,
      collectedItems: []
    }
  },
  beforeRouteEnter (to, from, next) {
    next(component => {
      if (!component.$store.state.canvasDict.watchedIntro) {
        component.$store.commit('canvasDict/addGameState', 'intro')
        component.$router.replace({ name: 'adventureIntro' })
      } else if (component.$store.state.canvasDict.gameState === 'map') {
        component.$router.replace({ name: 'adventureMap' })
      } else if (component.$store.getters['canvasDict/getDynamicLevelData'](component.currentLevel).itemsOnFloor) {
        component.$router.replace({ name: 'adventureChoose' })
        component.$store.commit('canvasDict/setQuestionKey', 'adventureChooseQuestion1')
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (this.answer === '') {
      if (!this.loopActivated) {
        this.$store.commit('vueDict/resetAdditional')
        this.$store.commit('vueDict/resetWords')
        this.$store.commit('vueDict/closeModal')
        next()
      } else if (from.name === 'adventureStatistics') {
        for (let category of this.$store.state.vueDict.categoriesChosen) {
          this.$store.commit('vueDict/increaseCategoryPlayed', category)
        }
        this.$store.commit('vueDict/transferAdditionalStat')
        window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
        this.$store.commit('vueDict/resetWords')
        next()
      } else {
        this.showMessageModal()
        next(false)
      }
    } else {
      next()
    }
  },
  created () {
    this.createWords()
  },
  mounted () {
    this.$store.commit('canvasDict/initCanvas')
    this.createIntroTexts()
    this.loopActivated = true
    this.canvasLoop(0)
  },
  beforeDestroy () {
    this.loopActivated = false
    this.$store.commit('vueDict/resetAdditional')
    this.$store.commit('vueDict/resetCorrectLatin')
    this.$store.commit('vueDict/resetCorrectForeign')
  },
  computed: {
    tags () {
      if (this.gameState.startsWith('intro')) {
        return [
          {
            nameId: 'tipName',
            valueId: 'tipValue',
            color: 'is-success'
          }
        ]
      } else if (this.gameState.startsWith('map')) {
        return [
          {
            nameId: 'level',
            valueId: this.currentLevel,
            color: 'is-info'
          },
          {
            nameId: 'steps',
            valueId: this.$store.state.canvasDict.dynamicLevelData[this.currentLevel].steps,
            color: 'is-info'
          }
        ]
      }
      return [
        {
          nameId: 'adventureCategoryTag',
          valueId: this.currentWord.category,
          color: 'is-info'
        },
        {
          nameId: 'adventureCountTag',
          valueId: this.$store.state.vueDict.words.words.length,
          color: 'is-info'
        },
        {
          nameId: 'adventureDifficultyTag',
          valueId: 'difficulty' + this.$store.state.vueDict.difficulty.toString(),
          color: this.difficultyColor
        }
      ]
    },
    difficultyColor () {
      switch (this.$store.state.vueDict.difficulty) {
        case 1:
          return 'is-success'
        case 2:
          return 'is-warning'
        default:
          return 'is-danger'
      }
    },
    currentWord () {
      return this.$store.getters['vueDict/getCurrentWord']
    },
    answer () {
      return this.$store.state.vueDict.currentModalAnswer
    },
    ctx () {
      return this.$store.state.canvasDict.context
    },
    canvasWidth () {
      return this.$store.getters['canvasDict/canvasWidth']
    },
    canvasHeight () {
      return this.$store.getters['canvasDict/canvasHeight']
    },
    currentMapPoint () {
      return this.$store.getters['canvasDict/currentMapPoint']
    },
    currentLevel () {
      return this.$store.state.canvasDict.currentLevel
    },
    gameState () {
      return this.$store.state.canvasDict.gameState
    },
    lastBackground () {
      return this.$store.getters['canvasDict/getLastBackground'](this.currentLevel)
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    viewClickHandler (object) {
      let dynLevelData = this.$store.getters['canvasDict/getDynamicLevelData'](this.currentLevel)

      switch (object.type) {
        case 'skipIntro':
          this.$store.commit('canvasDict/setWatchedIntro')
          this.$store.commit('canvasDict/addGameState', 'map')
          break
        case 'selectLevel':
          if (this.currentLevel !== 'home') {
            this.$store.commit('canvasDict/addGameState', 'level')
          }
          break
        case 'navigateToLevel':
          let startPoint = this.currentMapPoint
          let startLevel = this.currentLevel

          this.$store.commit('canvasDict/setMapPoint', object.value)
          if (object.home) {
            this.animationQueue.push(new AnimationObject('teleportHomeMap', startPoint, this.currentMapPoint))
          } else {
            let path = this.$store.getters['canvasDict/getMapPath'](startLevel + this.currentLevel)
            if (path.length > 0) {
              let startVector = path.shift()
              let lastPoint = path.pop()
              lastPoint.x = this.currentMapPoint.x
              lastPoint.y = this.currentMapPoint.y
              path.push(lastPoint)
              this.animationQueue.push(new AnimationObject('navigateOnMap', path, startPoint, startVector))
            } else {
              this.$store.commit('canvasDict/setMapOffset', Math.min(1200, Math.max(0, this.currentMapPoint.x - 300)))
            }
          }
          break
        case 'backToMap':
          this.$store.commit('canvasDict/addGameState', 'map')
          break
        case 'correctWord':
          let nextObstacle = this.$store.getters['canvasDict/getNextObstacleEvent'](this.currentLevel)
          let nextItems = this.$store.getters['canvasDict/getNextItemEvents'](this.currentLevel)

          if (dynLevelData.itemsOnFloor) {
            this.animationQueue.push(new AnimationObject('pickUpItems'))
            for (let item of nextItems) {
              this.collectedItems.push({
                id: item.id,
                spriteKey: item.spriteKey,
                animated: false,
                quantity: 1
              })
              this.$store.commit('vueDict/addStatAddit', { id: 'points', count: item.points })
            }
            this.$store.commit('canvasDict/removeItemsOnFloor', { type: 'item', field: dynLevelData.steps })
            this.$store.commit('canvasDict/setItemsOnFloor', false)
          } else if (dynLevelData.obstacleAhead) {
            this.animationQueue.push(new AnimationObject('attackObstacle'))
          } else if (dynLevelData.steps < 2) {
            this.animationQueue.push(new AnimationObject('moveFirstSteps'))
            this.$store.commit('vueDict/addStatAddit', { id: 'steps', count: 1 })

            if (nextItems.length > 0 && dynLevelData.steps + 1 === nextItems[0].field) {
              this.$store.commit('canvasDict/setItemsOnFloor', true)
            }
            if (nextObstacle && dynLevelData.steps + 2 === nextObstacle.field) {
              this.$store.commit('canvasDict/setObstacleAhead', true)
            }
          } else {
            this.animationQueue.push(new AnimationObject('moveForward'))
            this.$store.commit('vueDict/addStatAddit', { id: 'steps', count: 1 })

            if (nextItems.length > 0 && dynLevelData.steps + 1 === nextItems[0].field) {
              this.$store.commit('canvasDict/setItemsOnFloor', true)
            }
            if (nextObstacle && dynLevelData.steps + 2 === nextObstacle.field) {
              this.$store.commit('canvasDict/setObstacleAhead', true)
            }
          }
          break
        case 'wrongWord':
          if (dynLevelData.itemsOnFloor) {
            this.$store.commit('canvasDict/setEventsRegistered', { type: 'item', field: dynLevelData.steps })
            this.$store.commit('canvasDict/setItemsOnFloor', false)
          }
          break
        case 'nextWord':
          if (dynLevelData.itemsOnFloor) {
            this.$router.replace({ name: 'adventureChoose' })
            this.$store.commit('canvasDict/setQuestionKey', 'adventureChooseQuestion1')
          }
          break
        case 'chooseYes':
          this.$router.replace({ name: 'adventure' })
          this.$store.commit('canvasDict/setQuestionKey', '')
          break
        case 'chooseNo':
          this.$store.commit('canvasDict/setItemsOnFloor', false)
          this.$router.replace({ name: 'adventure' })
          this.$store.commit('canvasDict/setQuestionKey', '')
          break
        case 'abort':
          this.showMessageModal()
          break
        case 'finish':
          this.$router.replace({ name: 'adventureStatistics' })
          break
        case 'navTo':
          for (let category of this.$store.state.vueDict.categoriesChosen) {
            this.$store.commit('vueDict/increaseCategoryPlayed', category)
          }
          this.$store.commit('vueDict/transferAdditionalStat')
          window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
          this.$store.commit('vueDict/resetWords')
          this.addItemsToInventory()
          if (object.value === 'menu') {
            this.$store.commit('vueDict/setCategories', [])
            this.$store.commit('vueDict/setDifficulty', '')
            this.$store.commit('vueDict/setWordCount', 0)
            this.$router.push({ name: 'menu' })
          } else {
            this.$router.push({ name: 'category', params: { destination: 'adventure' } })
          }
          break
        default:
      }
    },
    showMessageModal () {
      this.$store.commit('vueDict/showModal', {
        name: 'message',
        title: 'adventureModalTitle',
        text: 'adventureModalText',
        color: '',
        leftIcon: 'times',
        leftText: 'adventureModalButtonLeft',
        leftColor: 'is-danger',
        rightIcon: 'check',
        rightText: 'adventureModalButtonRight',
        rightColor: 'is-success'
      })
      this.loopActivated = false
    },
    createWords () {
      let vocabs = JSON.parse(JSON.stringify(this.$store.getters['vueDict/getVocabs']))
      let length = this.$store.state.vueDict.wordCount
      let wordObjects = []

      if (vocabs.words.length === length) {
        while (vocabs.words.length > 0) {
          let random = Math.floor(Math.random() * vocabs.words.length)

          if (vocabs.words[random].difficulty <= this.$store.state.vueDict.difficulty) {
            wordObjects.push(vocabs.words.splice(random, 1)[0])
          } else {
            vocabs.words.splice(random, 1)
          }
        }
      } else {
        while (wordObjects.length < length) {
          let i = wordObjects.length
          let random = Math.floor(Math.random() * vocabs.words.length)

          if (vocabs.words[random].difficulty <= this.$store.state.vueDict.difficulty) {
            if (wordObjects.length === 0) {
              wordObjects.push(JSON.parse(JSON.stringify(vocabs.words[random])))
            } else if (wordObjects[i - 1][vocabs.latinAlphabet] !== vocabs.words[random][vocabs.latinAlphabet]) {
              wordObjects.push(JSON.parse(JSON.stringify(vocabs.words[random])))
            } else if (vocabs.words.length === 1) {
              wordObjects.push(JSON.parse(JSON.stringify(vocabs.words[random])))
            }
          }
        }
      }
      vocabs.words = wordObjects

      this.$store.commit('vueDict/setWords', vocabs)
    },
    createIntroTexts () {
      let intro = this.getText('adventureIntro')
      let texts = [{ text: '', x: this.canvasWidth / 2, y: this.canvasHeight - 50 }]

      for (let part of intro.split(' ')) {
        let measuredText = texts[texts.length - 1].text + ' ' + part
        measuredText.trim()
        if (Helper.getTextWidth(measuredText, 'intro', this.ctx).width > 400) {
          texts.push({ text: part, x: this.canvasWidth / 2, y: texts[texts.length - 1].y + 30 })
        } else {
          texts[texts.length - 1].text += ' ' + part
        }
      }

      this.introTexts = texts
    },
    addItemsToInventory () {
      for (let item of this.collectedItems) {
        let itemData = this.$store.state.vueDict.items.find(object => object.id === item.id)
        this.$store.commit('vueDict/addToInventory', {
          id: item.id,
          quantity: item.quantity,
          item: {
            id: itemData.id,
            quantity: item.quantity,
            spriteKey: itemData.spriteKey,
            durability: itemData.durability || null,
            maxDurability: itemData.durability || null
          }
        })
      }
    },
    canvasLoop (timestamp) {
      if (this.loopActivated) {
        let raf = requestAnimationFrame(newTs => this.canvasLoop(newTs))
        this.$store.commit('canvasDict/setRaf', raf)
        this.$store.commit('canvasDict/addLag', timestamp - this.$store.state.canvasDict.startTS)

        while (this.$store.state.canvasDict.lag > this.$store.state.canvasDict.refreshrate) {
          this.$store.commit('canvasDict/increaseFrameNo')

          this.canvasUpdate()

          if (this.$store.state.canvasDict.lag > this.$store.state.canvasDict.refreshrate * 5) {
            this.$store.commit('canvasDict/eliminateLag')
          } else {
            this.$store.commit('canvasDict/reduceLag')
          }
        }

        this.$store.commit('canvasDict/checkGameState')
        this.clearCanvas()
        this.canvasDraw()

        this.$store.commit('canvasDict/setStartTS', timestamp)
      }
    },
    clearCanvas () {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    },
    canvasUpdate () {
      if (this.currentAnimation && this[this.currentAnimation.type + 'Animation']) {
        this[this.currentAnimation.type + 'Animation']()
      }

      if (this[this.gameState + 'TransitionUpdate']) {
        this[this.gameState + 'TransitionUpdate']()
      } else if (this[this.gameState + 'Update']) {
        this[this.gameState + 'Update']()
      }
    },
    intromapTransitionUpdate () {
      this.transitionUpdate('map', 'adventureMap')
    },
    maplevelTransitionUpdate () {
      this.transitionUpdate('level', 'adventure')
      this.levelUpdate()
    },
    levelmapTransitionUpdate () {
      this.transitionUpdate('map', 'adventureMap')
    },
    transitionUpdate (newGameState, newPath) {
      this.counter.increase += 0.1
      this.counter.animation += this.counter.increase

      if (Math.sqrt(Math.pow(this.canvasWidth / 2, 2) + Math.pow(this.canvasHeight / 2, 2)) < this.counter.animation) {
        this.$store.commit('canvasDict/addGameState', newGameState)
        this.$router.replace({ name: newPath })
        this.counter.increase = 0
        this.counter.animation = 0
        this.animationQueue = []
        this.currentAnimation = null
      }
    },
    introUpdate () {
      for (let text of this.introTexts) {
        text.y -= 0.5
      }

      if (this.introTexts[this.introTexts.length - 1].y < -30) {
        this.$store.commit('canvasDict/setWatchedIntro')
        this.$store.commit('canvasDict/addGameState', 'map')
      }
    },
    levelUpdate () {
      if (!this.lastBackground) {
        let newBackground = this.getNewBackground(0, 0)
        this.$store.commit('canvasDict/addBackground', newBackground)

        if (newBackground.spriteKey.endsWith('background')) {
          this.$store.commit('canvasDict/addForeground', this.getForeground(newBackground))
        }
      }

      if (this.lastBackground.x + this.lastBackground.width < this.canvasWidth + 100) {
        let newX = this.lastBackground.x + this.lastBackground.width
        let newBackground = this.getNewBackground(newX, 0)
        this.$store.commit('canvasDict/addBackground', newBackground)

        if (newBackground.spriteKey.endsWith('background')) {
          this.$store.commit('canvasDict/addForeground', this.getForeground(newBackground))
        }

        this.generateNewEvents(Math.random() < this.currentMapPoint.chanceForObstacle)
      }
    },
    getNewBackground (x, y) {
      const cD = this.$store.state.canvasDict
      let max = this.currentMapPoint.backgroundChances.reduce((acc, bg) => { return acc + bg.chance }, 0)
      let random = Math.random() * max

      for (let bg of this.currentMapPoint.backgroundChances) {
        random -= bg.chance
        if (random <= 0) {
          return {
            id: bg.id,
            spriteKey: bg.spriteKey,
            x: x,
            y: y,
            width: Helper.getSpriteData(bg.spriteKey, cD).spriteWidth,
            firstField: this.lastBackground ? this.lastBackground.firstField + this.lastBackground.fieldCount : 0,
            fieldCount: bg.fieldCount
          }
        }
      }
    },
    getForeground (background) {
      let names = background.spriteKey.split('_')
      names.pop()
      names.push('foreground')
      return {
        id: background.id,
        spriteKey: names.join('_'),
        x: background.x,
        y: background.y,
        width: background.width
      }
    },
    generateNewEvents (hasObstacle) {
      const cD = this.$store.state.canvasDict
      let bgItemData = this.$store.getters['canvasDict/getBackgroundItemData'](
        this.currentLevel, this.lastBackground.id
      )

      if (hasObstacle) {
        let place = Math.floor(Math.random() * this.lastBackground.fieldCount)
        let max = this.currentMapPoint.obstacles.reduce((acc, bg) => { return acc + bg.chance }, 0)
        let random = Math.random() * max

        for (let obstacle of this.currentMapPoint.obstacles) {
          random -= obstacle.chance
          if (random <= 0) {
            let obstacleData = Helper.getSpriteData(obstacle.spriteKey, cD)
            this.$store.commit('canvasDict/addEvent', {
              type: 'obstacle',
              registered: false,
              id: obstacle.id,
              spriteKey: obstacle.spriteKey,
              x: this.lastBackground.x + this.stepWidth / 2 + place * this.stepWidth - obstacleData.spriteWidth / 2,
              y: 270 - obstacleData.spriteHeight,
              field: this.lastBackground.firstField + place,
              durability: obstacle.durability,
              items: obstacle.items
            })
            break
          }
        }
      }

      for (let field of bgItemData.foundOn) {
        let fieldNo = this.lastBackground.firstField + field - 1
        if (!this.$store.getters['canvasDict/hasFieldObstacle'](this.currentLevel, fieldNo)) {
          for (let item of bgItemData.canBeFound) {
            if (Math.random() < item.chance) {
              let itemData = this.$store.getters['vueDict/getItemObject'](item.id)
              let itemsOnField = this.$store.getters['canvasDict/getItemNoOnField'](this.currentLevel, fieldNo)
              let itemPos = this.itemPositions[itemsOnField]

              this.$store.commit('canvasDict/addEvent', {
                type: 'item',
                registered: false,
                id: item.id,
                spriteKey: 'items_' + item.id + '_onfloor',
                x: this.lastBackground.x + (field - 1) * 100 + itemPos.x,
                y: itemPos.y,
                field: fieldNo,
                points: itemData.points
              })
            }
          }
        }
      }
    },
    navigateOnMapAnimation () {
      let cA = this.currentAnimation
      if (!cA.currentPoint) {
        cA.currentPoint = cA.path.shift()
      }

      cA.vectors.toGoal = {
        x: cA.currentPoint.x - cA.playerPos.x,
        y: cA.currentPoint.y - cA.playerPos.y
      }

      let degGoal = Math.atan2(cA.vectors.toGoal.y, cA.vectors.toGoal.x) * (180 / Math.PI)
      let degPlayer = Math.atan2(cA.vectors.player.y, cA.vectors.player.x) * (180 / Math.PI)
      let distance = degGoal - degPlayer
      if (Math.abs(distance) > 180) {
        if (distance < 0) {
          distance = 360 + distance
        } else {
          distance = 360 - distance
        }
      }

      // neg distance is counterclockwise and pos distance is clockwise

      let newX = null
      let newY = null

      if (degPlayer >= 0 && degPlayer <= 90) { // south-east
        if (distance > 0) {
          newX = Math.max(cA.vectors.player.x - cA.currentPoint.force, -1)
        } else {
          newY = Math.max(cA.vectors.player.y - cA.currentPoint.force, -1)
        }
      } else if (degPlayer >= 90 && degPlayer <= 180) { // south-west
        if (distance > 0) {
          newY = Math.max(cA.vectors.player.y - cA.currentPoint.force, -1)
        } else {
          newX = Math.min(cA.vectors.player.x + cA.currentPoint.force, 1)
        }
      } else if (degPlayer <= 0 && degPlayer >= -90) { // north-east
        if (distance > 0) {
          newY = Math.min(cA.vectors.player.y + cA.currentPoint.force, 1)
        } else {
          newX = Math.max(cA.vectors.player.x - cA.currentPoint.force, -1)
        }
      } else if (degPlayer <= -90 && degPlayer >= -180) { // north-west
        if (distance > 0) {
          newX = Math.min(cA.vectors.player.x + cA.currentPoint.force, 1)
        } else {
          newY = Math.min(cA.vectors.player.y + cA.currentPoint.force, 1)
        }
      }
      if (newY !== null) {
        cA.vectors.player = { x: this.getMovementFix(newY, cA.vectors.player.x < 0), y: newY }
      } else if (newX !== null) {
        cA.vectors.player = { x: newX, y: this.getMovementFix(newX, cA.vectors.player.y < 0) }
      }

      let newDegPlayer = Math.atan2(cA.vectors.player.y, cA.vectors.player.x) * (180 / Math.PI)
      let newDistance = degGoal - newDegPlayer
      if (Math.abs(newDistance) > 180) {
        if (newDistance < 0) {
          newDistance = 360 + newDistance
        } else {
          newDistance = 360 - newDistance
        }
      }
      if ((distance < 0 && newDistance > 0) || (distance > 0 && newDistance < 0)) {
        let goalVectorLength = Math.hypot(cA.vectors.toGoal.x, cA.vectors.toGoal.y)
        cA.vectors.player = { x: cA.vectors.toGoal.x / goalVectorLength, y: cA.vectors.toGoal.y / goalVectorLength }
      }

      cA.playerPos.x += cA.vectors.player.x
      cA.playerPos.y += cA.vectors.player.y

      this.$store.commit('canvasDict/setMapOffset', Math.min(1200, Math.max(0, cA.playerPos.x - 300)))
      if (Math.hypot(cA.vectors.toGoal.x, cA.vectors.toGoal.y) < 1) {
        if (cA.path.length === 0) {
          this.currentAnimation = null
        } else {
          cA.currentPoint = null
        }
      }
    },
    teleportHomeMapAnimation () {
      let { spriteHeight } = Helper.getSpriteData('player_map_standing', this.$store.state.canvasDict)

      if (!this.currentAnimation.counter.reverse) {
        if (this.currentAnimation.counter.number > spriteHeight) {
          if (this.oldMapOffset === null) {
            this.oldMapOffset = this.$store.state.canvasDict.mapOffset
          }
          this.$store.commit(
            'canvasDict/setMapOffset',
            this.$store.state.canvasDict.mapOffset - (this.oldMapOffset / 30)
          )
          if (this.$store.state.canvasDict.mapOffset <= 0) {
            this.$store.commit('canvasDict/setMapOffset', 0)
            this.currentAnimation.counter.reverse = true
            this.oldMapOffset = null
          }
        } else {
          this.currentAnimation.counter.number += 0.8
        }
      } else {
        this.currentAnimation.counter.number -= 0.8
        if (this.currentAnimation.counter.number <= 0) {
          this.currentAnimation = null
        }
      }
    },
    moveFirstStepsAnimation () {
      this.currentAnimation.counter++

      if (this.currentAnimation.counter === 100) {
        this.$store.commit('canvasDict/incSteps', this.currentLevel)
        this.currentAnimation = null
      }
    },
    moveForwardAnimation () {
      let speed = 1

      this.currentAnimation.counter += speed
      this.$store.commit('canvasDict/moveBackground', {
        level: this.currentLevel,
        speedX: speed
      })

      if (this.currentAnimation.counter >= 100) {
        this.$store.commit('canvasDict/incSteps', this.currentLevel)
        this.$store.commit('canvasDict/correctBackgroundPos', this.currentLevel)
        this.currentAnimation = null
      }
    },
    pickUpItemsAnimation () {
      this.counter.animation += 0.4

      if (this.counter.animation >= 40) {
        this.collectedItems.forEach(item => {
          if (!item.animated) {
            item.animated = true
          }
        })
        this.counter.animation = 0
        this.currentAnimation = null
      }
    },
    attackObstacleAnimation () {
      let nextObstacle = this.$store.getters['canvasDict/getNextObstacleEvent'](this.currentLevel)
      this.counter.animation += 1

      if (this.counter.animation === 90) {
        this.$store.commit('canvasDict/reduceObstacleDurability', {
          field: nextObstacle.field,
          amount: 11
        })

        if (nextObstacle.durability <= 0) {
          this.$store.commit('canvasDict/setEventsRegistered', {
            type: 'obstacle',
            field: nextObstacle.field
          })
          this.animationQueue.push(new AnimationObject('pickUpItems'))
          for (let item of nextObstacle.items) {
            this.collectedItems.push({
              id: item.id,
              spriteKey: 'items_' + item.id + '_onfloor',
              animated: false,
              quantity: item.quantity
            })
            this.$store.commit('vueDict/addStatAddit', { id: 'points', count: item.points })
          }
          this.$store.commit('canvasDict/setObstacleAhead', false)
        }

        this.counter.animation = 0
        this.currentAnimation = null
      }
    },
    canvasDraw () {
      const cD = this.$store.state.canvasDict // read-only

      if (this[this.gameState + 'TransitionDraw']) {
        this[this.gameState + 'TransitionDraw'](cD)
      } else if (this[this.gameState + 'Draw']) {
        this[this.gameState + 'Draw'](cD)
      }
    },
    intromapTransitionDraw (cD) {
      this.transitionDraw(
        that => { Helper.drawCanvasImage(0, 0, 'background_intro', cD) },
        that => { that.mapDraw(cD) }
      )
    },
    maplevelTransitionDraw (cD) {
      this.transitionDraw(
        that => { that.mapDraw(cD) },
        that => { that.levelDraw(cD) }
      )
    },
    levelmapTransitionDraw (cD) {
      this.transitionDraw(
        that => { that.levelDraw(cD) },
        that => { that.mapDraw(cD) }
      )
    },
    transitionDraw (background, foreground) {
      background(this)
      this.ctx.save()
      Helper.clipCanvasCircle(this.canvasWidth / 2, this.canvasHeight / 2, this.counter.animation, this.ctx)
      this.ctx.clip()
      foreground(this)
      this.ctx.restore()
    },
    introDraw (cD) {
      Helper.drawCanvasImage(0, 0, 'background_intro_background', cD)

      for (let text of this.introTexts) {
        Helper.drawCanvasText(text.x, text.y, text.text, 'intro', this.ctx)
      }

      Helper.drawCanvasImage(0, 0, 'background_intro_foreground', cD)
    },
    mapDraw (cD) {
      let playerData = Helper.getSpriteData('player_map_standing', cD)

      Helper.drawCanvasImage(0 - cD.mapOffset, 0, 'background_world', cD)
      if (this.currentAnimation && this.currentAnimation.type === 'navigateOnMap') {
        Helper.drawCanvasImage(
          this.currentAnimation.playerPos.x - Math.floor(playerData.spriteWidth / 2) - cD.mapOffset,
          this.currentAnimation.playerPos.y - playerData.spriteHeight, 'player_map_standing', cD
        )
      } else if (this.currentAnimation && this.currentAnimation.type === 'teleportHomeMap') {
        if (!this.currentAnimation.counter.reverse) {
          Helper.drawCanvasImagePart(
            this.currentAnimation.start.x - Math.floor(playerData.spriteWidth / 2) - cD.mapOffset,
            this.currentAnimation.start.y - playerData.spriteHeight + this.currentAnimation.counter.number,
            'player_map_standing', cD, 0, this.currentAnimation.counter.number
          )
        } else {
          Helper.drawCanvasImagePart(
            this.currentAnimation.goal.x - Math.floor(playerData.spriteWidth / 2) - cD.mapOffset,
            this.currentAnimation.goal.y - playerData.spriteHeight + this.currentAnimation.counter.number,
            'player_map_standing', cD, 0, this.currentAnimation.counter.number
          )
        }
      } else {
        Helper.drawCanvasImage(
          this.currentMapPoint.x - Math.floor(playerData.spriteWidth / 2) - cD.mapOffset,
          this.currentMapPoint.y - playerData.spriteHeight, 'player_map_standing', cD
        )
      }
    },
    levelDraw (cD) {
      let dynLevelData = this.$store.getters['canvasDict/getDynamicLevelData'](this.currentLevel)

      for (let background of dynLevelData.background) {
        Helper.drawCanvasImage(background.x, background.y, background.spriteKey, cD)
      }

      for (let event of dynLevelData.events) {
        if (!(event.type === 'obstacle' && event.registered)) {
          Helper.drawCanvasImage(event.x, event.y, event.spriteKey, cD)
        }
        if (!dynLevelData.itemsOnFloor && dynLevelData.obstacleAhead && event.type === 'obstacle' &&
             event.field === dynLevelData.steps + 1) {
          this.healthBarDraw(event, cD)
        }
      }

      this.levelPlayerDraw(dynLevelData, cD)

      for (let foreground of dynLevelData.foreground) {
        Helper.drawCanvasImage(foreground.x, foreground.y, foreground.spriteKey, cD)
      }

      this.currentWordDraw()
    },
    healthBarDraw (event, cD) {
      let eventData = Helper.getSpriteData(event.spriteKey, cD)
      let maxDurability = this.currentMapPoint.obstacles.find(obstacle => obstacle.id === event.id).durability
      let durabilityPercent = event.durability / maxDurability

      Helper.drawCanvasRect(
        event.x + eventData.spriteWidth * 0.2, event.y + eventData.spriteHeight * 0.2, eventData.spriteWidth * 0.6, 8,
        'bar', this.ctx
      )

      if (durabilityPercent < 0.2) {
        Helper.drawCanvasRect(
          event.x + eventData.spriteWidth * 0.2, event.y + eventData.spriteHeight * 0.2,
          eventData.spriteWidth * 0.6 * durabilityPercent, 8, 'barDanger', this.ctx
        )
      } else if (durabilityPercent < 0.6) {
        Helper.drawCanvasRect(
          event.x + eventData.spriteWidth * 0.2, event.y + eventData.spriteHeight * 0.2,
          eventData.spriteWidth * 0.6 * durabilityPercent, 8, 'barWarning', this.ctx
        )
      } else {
        Helper.drawCanvasRect(
          event.x + eventData.spriteWidth * 0.2, event.y + eventData.spriteHeight * 0.2,
          eventData.spriteWidth * 0.6 * durabilityPercent, 8, 'barSuccess', this.ctx
        )
      }
    },
    levelPlayerDraw (dynLevelData, cD) {
      let playerData = Helper.getSpriteData('player_level_standing', cD)
      let items = this.collectedItems.filter(item => !item.animated)

      if (dynLevelData.steps < 2) {
        if (this.currentAnimation && this.currentAnimation.type === 'moveFirstSteps') {
          Helper.drawCanvasImage(
            dynLevelData.steps * this.stepWidth + this.stepWidth / 2 + this.currentAnimation.counter -
            Math.floor(playerData.spriteWidth / 2), 145, 'player_level_standing', cD
          )
        } else {
          Helper.drawCanvasImage(
            dynLevelData.steps * this.stepWidth + this.stepWidth / 2 - Math.floor(playerData.spriteWidth / 2),
            145, 'player_level_standing', cD
          )
        }
      } else {
        Helper.drawCanvasImage(
          this.stepWidth * 2.5 - Math.floor(playerData.spriteWidth / 2), 145, 'player_level_standing', cD
        )
      }

      for (let i = 0; i < items.length; i++) {
        let itemData = Helper.getSpriteData(items[i].spriteKey, cD)

        Helper.drawCanvasText(
          this.stepWidth * 2.5 + Math.floor(playerData.spriteWidth / 2) + 10, 165 + i * 20 - this.counter.animation,
          '+' + items[i].quantity, 'infoText', this.ctx
        )
        Helper.drawCanvasImage(
          this.stepWidth * 2.5 + Math.floor(playerData.spriteWidth / 2) + 30,
          165 + i * 20 - this.counter.animation - Math.floor(itemData.spriteHeight / 2), items[i].spriteKey, cD
        )
      }
    },
    currentWordDraw () {
      let word = this.currentWord[this.$store.state.lang]
      if (word.length > 68) {
        word = word.substring(0, 65) + '...'
      }
      Helper.drawCanvasRect(0, 0, this.canvasWidth, 30, 'standardBlur', this.ctx)
      Helper.drawCanvasText(
        this.canvasWidth / 2, 15, word, 'standard', this.ctx
      )
    },
    getMovementFix (value, neg) {
      return neg ? -Math.sqrt(1 - Math.pow(value, 2)) : Math.sqrt(1 - Math.pow(value, 2))
    }
  },
  watch: {
    answer () {
      switch (this.answer) {
        case 'buttonLeft':
          this.$store.commit('vueDict/closeModal')
          this.loopActivated = true
          this.canvasLoop(0)
          break
        case 'buttonRight':
          this.$router.push({ name: 'selection' })
          this.$store.commit('vueDict/resetAdditional')
          this.$store.commit('vueDict/resetWords')
          this.$store.commit('vueDict/closeModal')
          break
        default:
      }
    },
    currentAnimation (newState) {
      if (newState === null && this.animationQueue.length > 0) {
        this.currentAnimation = this.animationQueue.shift()
        this.animationStartFrame = this.$store.state.canvasDict.frameNo
        this.$store.commit('canvasDict/setAnimationActive', true)
      } else if (newState === null && this.animationQueue.length === 0) {
        this.animationStartFrame = 0
        this.$store.commit('canvasDict/setAnimationActive', false)
      }
    },
    animationQueue () {
      if (this.animationQueue.length > 0 && this.currentAnimation === null) {
        this.currentAnimation = this.animationQueue.shift()
        this.animationStartFrame = this.$store.state.canvasDict.frameNo
        this.$store.commit('canvasDict/setAnimationActive', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  height: calc(100% - .5rem);
  justify-content: space-between;

  .routerView {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
  }
}
</style>
