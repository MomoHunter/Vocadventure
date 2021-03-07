<template>
  <div class="flexContainer">
    <div class="fullWidth marginBottomBig">
      <HeroWithTags title="adventureTitle" :tagObjects="tags" />
      <canvas id="adventureCanvas" width="600" height="300"></canvas>
    </div>
    <div class="routerView fullWidth">
      <transition :enter-active-class="enterTransition" :leave-active-class="leaveTransition" mode="out-in">
        <router-view @click="viewClickHandler($event)"></router-view>
      </transition>
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
      currentIntroPart: 1,
      stepWidth: 100,
      oldMapOffset: null,
      transition: {
        reversed: false,
        progress: 0,
        increase: 10,
        delay: 0
      },
      itemPositions: [
        { x: 25, y: 218 },
        { x: 41, y: 232 },
        { x: 59, y: 224 }
      ],
      animationQueue: [],
      currentAnimation: null,
      newAnimations: [],
      transitionFunction: null,
      animationStartFrame: 0,
      enterTransition: '',
      leaveTransition: '',
      vueDictCopy: null,
      canvasDictCopy: null,
      dead: false,
      noRouting: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(component => {
      if (!component.noRouting) {
        let dynLevelData = component.$store.getters['canvasDict/getDynamicLevelData'](component.currentLevel)
        if (!component.$store.state.canvasDict.watchedIntro) {
          component.$store.commit('canvasDict/addGameState', 'intro')
          component.$router.replace({ name: 'adventureIntro' })
        } else if (component.$store.state.canvasDict.gameState === 'map') {
          component.$router.replace({ name: 'adventureMap' })
        } else if (component.$store.state.canvasDict.gameState === 'home') {
          component.$router.replace({ name: 'adventureHome' })
        } else if (dynLevelData.itemsOnFloor) {
          component.$router.replace({ name: 'adventureChoose' })
          component.$store.commit('canvasDict/setQuestionKey', 'adventureChooseQuestion1')
        } else if (dynLevelData.lootableObstacle) {
          component.$router.replace({ name: 'adventureChoose' })
          component.$store.commit('canvasDict/setQuestionKey', 'adventureChooseQuestion2')
        }
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
        this.$store.commit('vueDict/resetVocabs')
        this.$store.commit('vueDict/closeModal')
        next()
      } else if (this.dead) {
        this.$store.commit('canvasDict/changeGameState', 'map')
        this.$store.commit('canvasDict/resetLevel', this.currentLevel)
        this.$store.commit('vueDict/transferAdditionalStat')
        this.$store.commit('vueDict/resetVocabs')
        this.$store.commit('canvasDict/setCollectedItems', [])
        next()
      } else if (from.name === 'adventureStatistics') {
        this.$store.commit('vueDict/transferAdditionalStat')
        this.$store.commit('vueDict/resetVocabs')
        this.$store.commit('canvasDict/setCollectedItems', [])
        next()
      } else {
        this.showMessageModal()
        next(false)
      }
    } else {
      this.$store.commit('vueDict/setAdventureCopies', this.vueDictCopy)
      this.$store.commit('canvasDict/setAdventureCopies', this.canvasDictCopy)
      next()
    }
  },
  created () {
    this.createWords()
    this.vueDictCopy = this.$store.getters['vueDict/getAdventureCopies']
    this.canvasDictCopy = this.$store.getters['canvasDict/getAdventureCopies']
  },
  mounted () {
    this.$store.commit('canvasDict/initCanvas')
    this.transition.progress = Math.hypot(this.canvasWidth / 2, this.canvasHeight / 2)
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
          }
        ]
      } else if (this.gameState.startsWith('home')) {
        return [
          {
            nameId: 'building',
            valueId: this.$store.state.canvasDict.currentBuilding,
            color: 'is-info'
          }
        ]
      }
      return [
        {
          nameId: 'adventureCategoryTag',
          valueId: this.getCategory(this.currentWord.category),
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
    currentHomePoint () {
      return this.$store.getters['canvasDict/currentHomePoint']
    },
    currentLevel () {
      return this.$store.state.canvasDict.currentLevel
    },
    currentBuilding () {
      return this.$store.state.canvasDict.currentBuilding
    },
    gameState () {
      return this.$store.state.canvasDict.gameState
    },
    firstBackground () {
      return this.$store.getters['canvasDict/getFirstBackground'](this.currentLevel)
    },
    lastBackground () {
      return this.$store.getters['canvasDict/getLastBackground'](this.currentLevel)
    },
    equippedItem () {
      return this.$store.state.canvasDict.character.hand
    },
    character () {
      return this.$store.state.canvasDict.character
    },
    collectedItems () {
      return this.$store.state.canvasDict.collectedItems
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    getCategory (id) {
      return this.$store.getters['vueDict/getCategories'].find(category => {
        return category.id === id
      }, this).categoryName
    },
    viewClickHandler (object) {
      let dynLevelData = this.$store.getters['canvasDict/getDynamicLevelData'](this.currentLevel)
      let nextObstacle = this.$store.getters['canvasDict/getNextObstacleEvent'](this.currentLevel)
      let nextItems = this.$store.getters['canvasDict/getNextItemEvents'](this.currentLevel)
      let nextObstacleObject = null

      if (nextObstacle) {
        nextObstacleObject = this.$store.getters['canvasDict/getObstacleObject'](this.currentLevel, nextObstacle.id)
      }

      switch (object.type) {
        case 'continueIntro':
          this.currentIntroPart += 1
          break
        case 'skipIntro':
          this.$store.commit('canvasDict/setWatchedIntro')
          this.$store.commit('canvasDict/addGameState', 'home')
          this.$router.replace({ name: 'adventureHome' })
          break
        case 'selectLevel':
          if (this.currentLevel === 'home') {
            this.$store.commit('canvasDict/addGameState', 'home')
            this.$router.replace({ name: 'adventureHome' })
            this.newAnimations = [new AnimationObject('homeEnter', this.currentHomePoint)]
          } else {
            this.transitionFunction = (that) => {
              let steps = Math.min(that.$store.getters['canvasDict/getDynamicLevelData'](that.currentLevel).steps, 2)
              that.$store.commit('canvasDict/setCharacterPosition', {
                type: 'level',
                x: (steps + 0.5) * that.stepWidth,
                y: 145
              })
            }
            this.$store.commit('canvasDict/addGameState', 'level')
            this.$router.replace({ name: 'adventure' })
          }
          break
        case 'navigateToLevel':
          let startPoint = this.currentMapPoint
          let startLevel = this.currentLevel

          this.$store.commit('canvasDict/setLevel', object.value)
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
        case 'navigateToHomePoint':
          let startHomePoint = this.currentHomePoint
          let startBuilding = this.currentBuilding
          this.$store.commit('canvasDict/setBuilding', object.value)
          let path = this.$store.getters['canvasDict/getMapPath'](startBuilding + this.currentBuilding)
          if (path.length > 0) {
            let startVector = path.shift()
            let lastPoint = path[path.length - 1]
            lastPoint.x = this.currentHomePoint.x
            lastPoint.y = this.currentHomePoint.y
            this.animationQueue.push(new AnimationObject('navigateOnMap', path, startHomePoint, startVector))
          }
          break
        case 'backToMap':
          if (this.gameState === 'home') {
            this.animationQueue.push(new AnimationObject('homeLeave', this.currentHomePoint))
          }
          this.transitionFunction = (that) => {
            that.$store.commit('canvasDict/setCharacterPosition', {
              type: 'map',
              x: that.currentMapPoint.x,
              y: that.currentMapPoint.y
            })
          }
          this.$store.commit('canvasDict/addGameState', 'map')
          this.$router.replace({ name: 'adventureMap' })
          break
        case 'correctWord':
          let obstacleOnField = this.$store.getters['canvasDict/getObstacleOnField'](dynLevelData.steps)
          let obstacleOnFieldObject = null

          if (obstacleOnField) {
            obstacleOnFieldObject = this.$store.getters['canvasDict/getObstacleObject'](
              this.currentLevel, obstacleOnField.id
            )
          }

          if (dynLevelData.lootableObstacle) {
            this.takeItemsFromObstacle(obstacleOnFieldObject.lootableItems)
            this.$store.commit('canvasDict/setLootableObstacle', false)
          } else if (dynLevelData.collectableObstacle) {
            this.takeItemsFromObstacle(obstacleOnFieldObject.collectableItems)
            this.$store.commit('canvasDict/setCollectableObstacle', false)
            if (nextItems.length > 0 && dynLevelData.steps === nextItems[0].field) {
              this.$store.commit('canvasDict/setItemsOnFloor', true)
            }
            if (nextObstacle && dynLevelData.steps + 1 === nextObstacle.field) {
              this.$store.commit('canvasDict/setObstacleAhead', true)
              if (nextObstacleObject.collectableItems) {
                this.$store.commit('canvasDict/setCollectableObstacle', true)
              }
            }
            if (nextObstacleObject && nextObstacleObject.approaches && nextObstacle.field > dynLevelData.steps + 1 &&
                nextObstacle.field <= dynLevelData.steps + 3) {
              this.animationQueue.push(new AnimationObject('obstacleApproaches'))
            }
          } else if (dynLevelData.itemsOnFloor) {
            this.animationQueue.push(new AnimationObject('pickUpItems', true))
            for (let item of nextItems) {
              this.$store.commit('canvasDict/addCollectedItem', {
                id: item.id,
                spriteKey: item.spriteKey,
                animated: false,
                quantity: 1
              })
              this.$store.commit('vueDict/addStatAddit', { id: 'points', count: item.points })
              this.$store.commit('canvasDict/addFoundItem', { id: item.id, quantity: 1 })
            }
            this.$store.commit('canvasDict/removeItemsOnFloor', { type: 'item', field: dynLevelData.steps })
            this.$store.commit('canvasDict/setItemsOnFloor', false)
          } else if (dynLevelData.obstacleAhead) {
            this.animationQueue.push(new AnimationObject('attackObstacle'))
          } else {
            if (dynLevelData.steps < 2) {
              this.animationQueue.push(new AnimationObject(
                'moveFirstSteps', (dynLevelData.steps + 1.5) * this.stepWidth
              ))

              if (nextObstacleObject && nextObstacleObject.approaches && nextObstacle.field > dynLevelData.steps + 2 &&
                  nextObstacle.field <= 5) {
                this.animationQueue.push(new AnimationObject('obstacleApproaches'))
              }
            } else {
              this.animationQueue.push(new AnimationObject('moveForward'))
              if (nextObstacleObject && nextObstacleObject.approaches && nextObstacle.field > dynLevelData.steps + 2 &&
                  nextObstacle.field <= dynLevelData.steps + 4) {
                this.animationQueue.push(new AnimationObject('obstacleApproaches'))
              }
            }
            this.$store.commit('vueDict/addStatAddit', { id: 'steps', count: 1 })

            if (nextItems.length > 0 && dynLevelData.steps + 1 === nextItems[0].field) {
              this.$store.commit('canvasDict/setItemsOnFloor', true)
            }
            if (nextObstacle && dynLevelData.steps + 2 === nextObstacle.field) {
              this.$store.commit('canvasDict/setObstacleAhead', true)
              if (nextObstacleObject.collectableItems) {
                this.$store.commit('canvasDict/setCollectableObstacle', true)
              }
            }
            if (nextObstacle && nextObstacleObject.lootableItems) {
              this.$store.commit('canvasDict/setLootableObstacle', true)
            }
          }
          break
        case 'wrongWord':
          if (dynLevelData.collectableObstacle) {
            this.animationQueue.push(new AnimationObject('obstacleRunAway'))
            this.$store.commit('canvasDict/setCollectableObstacle', false)
            if (nextItems.length > 0 && dynLevelData.steps === nextItems[0].field) {
              this.$store.commit('canvasDict/setItemsOnFloor', true)
            }
            if (nextObstacle && dynLevelData.steps + 1 === nextObstacle.field) {
              this.$store.commit('canvasDict/setObstacleAhead', true)
              if (nextObstacleObject.collectableItems) {
                this.$store.commit('canvasDict/setCollectableObstacle', true)
              }
            }
            if (nextObstacleObject && nextObstacleObject.approaches && nextObstacle.field > dynLevelData.steps + 1 &&
                nextObstacle.field <= dynLevelData.steps + 3) {
              this.animationQueue.push(new AnimationObject('obstacleApproaches'))
            }
          } else if (dynLevelData.lootableObstacle) {
            this.animationQueue.push(new AnimationObject('pickUpItems', false))
            this.$store.commit('canvasDict/setLootableObstacle', false)
          } else if (dynLevelData.itemsOnFloor) {
            this.animationQueue.push(new AnimationObject('pickUpItems', false))
            this.$store.commit('canvasDict/setEventsRegistered', { type: 'item', field: dynLevelData.steps })
            this.$store.commit('canvasDict/setItemsOnFloor', false)
          } else if (dynLevelData.obstacleAhead && nextObstacle.power) {
            this.animationQueue.push(new AnimationObject('enemyAttack'))
          }
          break
        case 'nextWord':
          if (dynLevelData.lootableObstacle) {
            this.$router.replace({ name: 'adventureChoose' })
            this.$store.commit('canvasDict/setQuestionKey', 'adventureChooseQuestion2')
          } else if (dynLevelData.itemsOnFloor) {
            this.$router.replace({ name: 'adventureChoose' })
            this.$store.commit('canvasDict/setQuestionKey', 'adventureChooseQuestion1')
          } else if (dynLevelData.collectableObstacle) {
            this.$router.replace({ name: 'adventureChoose' })
            this.$store.commit('canvasDict/setQuestionKey', 'adventureChooseQuestion3')
          }
          break
        case 'chooseYes':
          if (dynLevelData.collectableObstacle) {
            if (dynLevelData.steps < 2) {
              this.animationQueue.push(new AnimationObject(
                'moveFirstSteps', (dynLevelData.steps + 1.5) * this.stepWidth
              ))
            } else {
              this.animationQueue.push(new AnimationObject('moveForward'))
            }
            this.$store.commit('canvasDict/setObstacleAhead', false)
          }
          this.$router.replace({ name: 'adventure' })
          this.$store.commit('canvasDict/setQuestionKey', '')
          break
        case 'chooseNo':
          switch (this.$store.state.canvasDict.questionKey) {
            case 'adventureChooseQuestion1':
              this.$store.commit('canvasDict/setEventsRegistered', { type: 'item', field: dynLevelData.steps })
              this.$store.commit('canvasDict/setItemsOnFloor', false)
              break
            case 'adventureChooseQuestion2':
              this.$store.commit('canvasDict/setLootableObstacle', false)
              break
            case 'adventureChooseQuestion3':
              this.$store.commit('canvasDict/setCollectableObstacle', false)
              break
            default:
          }
          this.$router.replace({ name: 'adventure' })
          this.$store.commit('canvasDict/setQuestionKey', '')
          break
        case 'abort':
          this.showMessageModal()
          break
        case 'finish':
          this.$router.replace({ name: 'adventureStatistics' })
          this.saveGame()
          break
        case 'navTo':
          this.$store.commit('vueDict/transferAdditionalStat')
          if (object.value === 'menu') {
            this.$store.commit('vueDict/setCategories', [])
            this.$store.commit('vueDict/setDifficulty', '')
            this.$store.commit('vueDict/setWordCount', 0)
            this.$store.commit('vueDict/setReversed', false)
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
      let vocabs = JSON.parse(JSON.stringify(this.$store.getters['vueDict/getFullVocabs']))
      let length = this.$store.state.vueDict.wordCount
      let wordObjects = []

      if (vocabs.words.length === 0) {
        this.noRouting = true
        this.$router.push({ name: 'category', params: { destination: 'adventure' } })
      } else if (vocabs.words.length === length) {
        while (vocabs.words.length > 0) {
          let random = Math.floor(Math.random() * vocabs.words.length)

          if (vocabs.words[random].difficulty <= this.$store.state.vueDict.difficulty) {
            wordObjects.push(vocabs.words.splice(random, 1)[0])
          } else {
            vocabs.words.splice(random, 1)
          }
        }
      } else {
        vocabs.words = vocabs.words.filter(word => word.difficulty <= this.$store.state.vueDict.difficulty)

        while (wordObjects.length < length) {
          let i = wordObjects.length
          let random = Math.floor(Math.random() * vocabs.words.length)

          if (wordObjects.length === 0) {
            wordObjects.push(JSON.parse(JSON.stringify(vocabs.words[random])))
          } else if (wordObjects[i - 1][vocabs.latinAlphabet] !== vocabs.words[random][vocabs.latinAlphabet]) {
            wordObjects.push(JSON.parse(JSON.stringify(vocabs.words[random])))
          } else if (vocabs.words.length === 1) {
            wordObjects.push(JSON.parse(JSON.stringify(vocabs.words[random])))
          }
        }
      }
      vocabs.words = wordObjects

      this.$store.commit('vueDict/setVocabs', vocabs)
    },
    addItemsToInventory () {
      for (let item of this.collectedItems) {
        let itemData = this.$store.getters['vueDict/getItemObject'](item.id)
        this.$store.commit('vueDict/addToInventory', {
          id: item.id,
          quantity: item.quantity,
          categories: itemData.categories,
          durability: itemData.durability || null
        })
        this.$store.commit('vueDict/unlockItem', item.id)
      }
    },
    takeItemsFromObstacle (items) {
      for (let item of items) {
        let itemData = this.$store.getters['vueDict/getItemObject'](item.id)
        for (let requiredItem of itemData.required) {
          let requiredItemData = this.$store.getters['vueDict/getItemObject'](requiredItem.id)
          let alreadyReady = this.collectedItems.find(readyItem =>
            readyItem.id === requiredItem.id && !readyItem.animated
          )
          if (alreadyReady) {
            alreadyReady.quantity -= requiredItem.quantity
          } else {
            this.$store.commit('canvasDict/addCollectedItem', {
              id: requiredItem.id,
              spriteKey: requiredItemData.spriteKeySmall,
              animated: false,
              quantity: -requiredItem.quantity
            })
          }
          this.$store.commit('canvasDict/addFoundItem', { id: requiredItem.id, quantity: -requiredItem.quantity })
        }
        this.$store.commit('canvasDict/addCollectedItem', {
          id: item.id,
          spriteKey: itemData.spriteKeySmall,
          animated: false,
          quantity: item.quantity
        })
        this.$store.commit('vueDict/addStatAddit', { id: 'points', count: itemData.points })
        this.$store.commit('canvasDict/addFoundItem', { id: item.id, quantity: item.quantity })
      }

      this.animationQueue.push(new AnimationObject('pickUpItems', true))
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
    introhomeTransitionUpdate () {
      this.transitionUpdate('home')
    },
    maplevelTransitionUpdate () {
      this.transitionUpdate('level')
      this.levelUpdate()
    },
    maphomeTransitionUpdate () {
      this.transitionUpdate('home')
    },
    homemapTransitionUpdate () {
      this.transitionUpdate('map')
    },
    levelmapTransitionUpdate () {
      this.transitionUpdate('map')
    },
    transitionUpdate (newGameState) {
      if (!this.transition.reversed) {
        this.transition.increase -= 0.1
        this.transition.progress -= this.transition.increase

        if (this.transition.progress <= 0) {
          this.transition.progress = 0
          this.transition.reversed = true
        }
      } else if (this.transition.delay < 20) {
        if (this.transition.delay === 0) {
          this.currentAnimation = null
          this.animationQueue = this.newAnimations
          if (this.transitionFunction) {
            this.transitionFunction(this)
            this.transitionFunction = null
          }
        }

        this.transition.delay += 1
      } else {
        this.transition.increase += 0.1
        this.transition.progress += this.transition.increase

        if (this.transition.progress > Math.hypot(this.canvasWidth / 2, this.canvasHeight / 2)) {
          this.$store.commit('canvasDict/addGameState', newGameState)
          this.transition = {
            reversed: false,
            increase: 10,
            progress: Math.hypot(this.canvasWidth / 2, this.canvasHeight / 2),
            delay: 0
          }
        }
      }
    },
    levelUpdate () {
      let dynLevelData = this.$store.getters['canvasDict/getDynamicLevelData'](this.currentLevel)

      if (!this.lastBackground) {
        let newBackground = this.getNewBackground(0, 0)
        this.$store.commit('canvasDict/addBackground', newBackground)

        if (newBackground.spriteKey.endsWith('background')) {
          this.$store.commit('canvasDict/addForeground', this.getForeground(newBackground))
        }
      }

      if ((dynLevelData.steps + 10) % 2000 === 0 && !dynLevelData.bossSpawned) {
        let boss = this.$store.getters['canvasDict/getBossObject'](this.currentLevel)
        let bossData = this.$store.getters['canvasDict/getSpriteData'](boss.spriteKey)
        let places = (dynLevelData.steps + 11) - this.lastBackground.firstField

        this.$store.commit('canvasDict/addEvent', {
          type: 'obstacle',
          registered: false,
          id: boss.id,
          spriteKey: boss.spriteKey,
          x: this.lastBackground.x + places * this.stepWidth - (boss.centerX - 50),
          y: boss.bottomY - bossData.spriteHeight,
          field: dynLevelData.steps + 10,
          durability: boss.durability,
          boss: true,
          power: boss.power,
          items: boss.items,
          unlocks: boss.unlocks
        })
        this.$store.commit('canvasDict/setBossSpawned', true)
      }

      if (this.lastBackground.x + this.lastBackground.width < this.canvasWidth + 100) {
        let newX = this.lastBackground.x + this.lastBackground.width
        let newBackground = this.getNewBackground(newX, 0)
        this.$store.commit('canvasDict/addBackground', newBackground)

        if (newBackground.spriteKey.endsWith('background')) {
          this.$store.commit('canvasDict/addForeground', this.getForeground(newBackground))
        }

        if (!dynLevelData.bossSpawned) {
          this.generateNewEvents()
        }
      }
      if (this.firstBackground.x + this.firstBackground.width < -100) {
        this.$store.commit('canvasDict/removeBackgrounds', this.currentLevel)
      }
      if (dynLevelData.events.length > 0 && dynLevelData.events[0].x < -200) {
        this.$store.commit('canvasDict/removeFirstEvent')
      }
    },
    getNewBackground (x, y) {
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
            width: this.$store.getters['canvasDict/getSpriteData'](bg.spriteKey).spriteWidth,
            firstField: this.lastBackground ? this.lastBackground.firstField + this.lastBackground.fieldCount : 0,
            fieldCount: bg.fieldCount
          }
        }
      }
    },
    getForeground (background) {
      let names = background.spriteKey.split('_')
      names.splice(names.length - 1, 1, 'foreground')
      return {
        id: background.id,
        spriteKey: names.join('_'),
        x: background.x,
        y: background.y,
        width: background.width
      }
    },
    generateNewEvents () {
      let bgItemData = this.$store.getters['canvasDict/getBackgroundItemData'](
        this.currentLevel, this.lastBackground.id
      )

      for (let field of bgItemData.foundOn.obstacles) {
        let fieldNo = this.lastBackground.firstField + field - 1
        for (let obstacle of bgItemData.canBeFound.obstacles) {
          if (Math.random() < obstacle.chance) {
            let obstacleObject = this.$store.getters['canvasDict/getObstacleObject'](this.currentLevel, obstacle.id)
            let obstacleData = this.$store.getters['canvasDict/getSpriteData'](obstacleObject.spriteKey)
            this.$store.commit('canvasDict/addEvent', {
              type: 'obstacle',
              registered: false,
              id: obstacle.id,
              spriteKey: obstacleObject.spriteKey,
              x: this.lastBackground.x + (field - 1) * this.stepWidth + (this.stepWidth - obstacleData.spriteWidth) / 2,
              y: obstacleObject.bottomY - obstacleData.spriteHeight,
              field: fieldNo,
              durability: obstacleObject.durability,
              power: obstacleObject.power || null,
              items: obstacleObject.items
            })
            break
          }
        }
      }

      for (let field of bgItemData.foundOn.items) {
        let fieldNo = this.lastBackground.firstField + field - 1
        if (!this.$store.getters['canvasDict/hasFieldObstacle'](this.currentLevel, fieldNo)) {
          for (let item of bgItemData.canBeFound.items) {
            if (Math.random() < item.chance) {
              let itemData = this.$store.getters['vueDict/getItemObject'](item.id)
              let itemsOnField = this.$store.getters['canvasDict/getItemNoOnField'](this.currentLevel, fieldNo)
              let itemPos = this.itemPositions[itemsOnField]
              let itemSpriteKey = itemData.spriteKeySmall

              if (Array.isArray(itemSpriteKey)) {
                itemSpriteKey = itemSpriteKey[Math.floor(Math.random() * itemSpriteKey.length)]
              }

              this.$store.commit('canvasDict/addEvent', {
                type: 'item',
                registered: false,
                id: item.id,
                spriteKey: itemSpriteKey,
                x: this.lastBackground.x + (field - 1) * this.stepWidth + itemPos.x,
                y: itemPos.y,
                field: fieldNo,
                points: itemData.points
              })

              if (itemsOnField + 1 === this.itemPositions.length) {
                break
              }
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

      this.$store.commit('canvasDict/setCharacterPosition', { type: 'map', x: cA.playerPos.x, y: cA.playerPos.y })

      if (this.gameState === 'map') {
        this.$store.commit('canvasDict/setMapOffset', Math.min(1200, Math.max(0, cA.playerPos.x - 300)))
      }

      if (Math.hypot(cA.vectors.toGoal.x, cA.vectors.toGoal.y) < 1) {
        if (cA.path.length === 0) {
          this.$store.commit('canvasDict/setCharacterPosition', {
            type: 'map',
            x: this.currentAnimation.currentPoint.x,
            y: this.currentAnimation.currentPoint.y
          })
          this.currentAnimation = null
        } else {
          cA.currentPoint = null
        }
      }
    },
    teleportHomeMapAnimation () {
      let { spriteHeight } = this.$store.getters['canvasDict/getSpriteData']('player_map_standing')

      if (!this.currentAnimation.counter.reverse) {
        if (this.currentAnimation.counter.height > spriteHeight) {
          if (this.oldMapOffset === null) {
            this.oldMapOffset = this.$store.state.canvasDict.mapOffset
            this.$store.commit('canvasDict/setCharacterPosition', {
              type: 'map',
              x: this.currentAnimation.goal.x,
              y: this.currentAnimation.goal.y
            })
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
          this.currentAnimation.counter.height += 0.8
        }
      } else {
        this.currentAnimation.counter.height -= 0.8
        if (this.currentAnimation.counter.height <= 0) {
          this.currentAnimation = null
        }
      }
    },
    homeEnterAnimation () {
      if (this.currentAnimation.first) {
        this.$store.commit('canvasDict/setCharacterPosition', {
          type: 'map',
          x: this.currentHomePoint.x,
          y: this.currentHomePoint.y + 100
        })
        this.currentAnimation.first = false
      }
      this.$store.commit('canvasDict/setCharacterPosition', { type: 'map', y: this.character.pos.map.y - 1 })

      if (this.character.pos.map.y <= this.currentHomePoint.y) {
        this.currentAnimation = null
        this.$store.commit('canvasDict/setCharacterPosition', {
          type: 'map',
          x: this.currentHomePoint.x,
          y: this.currentHomePoint.y
        })
      }
    },
    homeLeaveAnimation () {
      this.$store.commit('canvasDict/setCharacterPosition', { type: 'map', y: this.character.pos.map.y + 1 })
    },
    moveFirstStepsAnimation () {
      this.$store.commit('canvasDict/setCharacterPosition', {
        type: 'level',
        x: this.character.pos.level.x + 1
      })

      if (this.character.pos.level.x === this.currentAnimation.goalX) {
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
    obstacleRunAwayAnimation () {
      let dynLevelData = this.$store.getters['canvasDict/getDynamicLevelData'](this.currentLevel)
      let obstacleEvent = this.$store.getters['canvasDict/getObstacleOnField'](dynLevelData.steps)
      let obstacleData = this.$store.getters['canvasDict/getSpriteData'](obstacleEvent.spriteKey)

      this.$store.commit('canvasDict/setEventX', {
        event: {
          type: obstacleEvent.type,
          id: obstacleEvent.id,
          field: obstacleEvent.field
        },
        newX: obstacleEvent.x - 2
      })

      if (obstacleEvent.x - 2 + obstacleData.spriteWidth < -30) {
        this.$store.commit('canvasDict/setEventsRegistered', { type: 'obstacle', field: dynLevelData.steps })
        this.currentAnimation = null
      }
    },
    pickUpItemsAnimation () {
      this.currentAnimation.counter += 0.4

      if (this.currentAnimation.counter >= 40) {
        this.$store.commit('canvasDict/setCollectedItemsAnimated')
        this.currentAnimation.counter = 0
        this.currentAnimation = null
      }
    },
    attackObstacleAnimation () {
      let nextObstacle = this.$store.getters['canvasDict/getNextObstacleEvent'](this.currentLevel)
      this.currentAnimation.counter += 1

      if (this.currentAnimation.counter === 60) {
        let itemData = this.$store.getters['vueDict/getItemObject'](this.equippedItem)
        let damage = 1

        if (itemData.usefulAgainst.includes(nextObstacle.id)) {
          damage = itemData.power
        }

        if (this.equippedItem !== 'hand') {
          this.$store.commit('vueDict/reduceItemDurability', this.equippedItem)

          if (this.$store.getters['vueDict/getInventoryObject'](this.equippedItem).quantity === 0) {
            this.$store.commit('canvasDict/setEquippedItem', 'hand')
          }
        }

        this.$store.commit('canvasDict/reduceObstacleDurability', {
          field: nextObstacle.field,
          amount: damage
        })

        if (nextObstacle.durability <= 0) {
          let obstacleObject = this.$store.getters['canvasDict/getObstacleObject'](this.currentLevel, nextObstacle.id)

          this.$store.commit('canvasDict/setEventsRegistered', {
            type: 'obstacle',
            field: nextObstacle.field
          })

          if (obstacleObject.power) {
            this.$store.commit('canvasDict/addKilledEnemy', obstacleObject.id)
          }

          if (nextObstacle.boss) {
            for (let unlock of nextObstacle.unlocks) {
              this.$store.commit('canvasDict/unlockLevel', unlock)
            }
            this.$store.commit('canvasDict/setBossSpawned', false)
          }

          if (obstacleObject.destroyedBottomY) {
            let spriteData = this.$store.getters['canvasDict/getSpriteData'](obstacleObject.destroyedSpriteKey)

            this.$store.commit('canvasDict/setEventY', {
              event: {
                type: 'obstacle',
                id: nextObstacle.id,
                field: nextObstacle.field
              },
              newY: obstacleObject.destroyedBottomY - spriteData.spriteHeight
            })
          }

          for (let item of obstacleObject.items) {
            const itemObject = this.$store.getters['vueDict/getItemObject'](item.id)
            if (itemObject.categories.includes('collectable')) {
              const alreadyCollected = this.$store.getters['canvasDict/isAlreadyCollected'](item.id)

              if (!alreadyCollected) {
                this.$store.commit('canvasDict/addCollectable', item.id)
              } else {
                continue
              }
            }

            if (!item.chance || (item.chance && Math.random() < item.chance)) {
              this.$store.commit('canvasDict/addCollectedItem', {
                id: item.id,
                spriteKey: itemObject.spriteKeySmall,
                animated: false,
                quantity: item.quantity
              })
              this.$store.commit('vueDict/addStatAddit', { id: 'points', count: itemObject.points * item.quantity })
              this.$store.commit('canvasDict/addFoundItem', { id: item.id, quantity: item.quantity })
            }
          }

          if (obstacleObject.items.length > 0) {
            this.animationQueue.push(new AnimationObject('pickUpItems', true))
          }

          this.$store.commit('canvasDict/setObstacleAhead', false)
        }

        this.currentAnimation = null
      }
    },
    enemyAttackAnimation () {
      this.currentAnimation.counter += 1

      if (this.currentAnimation.counter >= 60) {
        let nextObstacle = this.$store.getters['canvasDict/getNextObstacleEvent'](this.currentLevel)

        if (this.character.armor !== 'noarmor') {
          let armorData = this.$store.getters['vueDict/getItemObject'](this.character.armor)

          this.$store.commit('canvasDict/changePlayerHealth', -(Math.max(nextObstacle.power - armorData.defense, 0)))
          this.$store.commit('vueDict/reduceItemDurability', this.character.armor)

          if (this.$store.getters['vueDict/getInventoryObject'](this.equippedItem).quantity === 0) {
            this.$store.commit('canvasDict/setEquippedItem', 'hand')
          }
        } else {
          this.$store.commit('canvasDict/changePlayerHealth', -nextObstacle.power)
        }
        if (this.$store.state.canvasDict.playerHealth <= 0) {
          this.saveGame(true)
          this.animationQueue.push(new AnimationObject('youDied'))
          this.$router.replace({ name: 'adventureStatistics' })
          this.dead = true
        }
        this.currentAnimation = null
      }
    },
    obstacleApproachesAnimation () {
      let nextObstacle = this.$store.getters['canvasDict/getNextObstacleEvent'](this.currentLevel)
      let obstacleData = this.$store.getters['canvasDict/getSpriteData'](nextObstacle.spriteKey)
      let dynLevelData = this.$store.getters['canvasDict/getDynamicLevelData'](this.currentLevel)
      this.$store.commit('canvasDict/setEventX', {
        event: {
          type: nextObstacle.type,
          id: nextObstacle.id,
          field: nextObstacle.field
        },
        newX: nextObstacle.x - 2
      })

      if (nextObstacle.x <= this.stepWidth * Math.min(dynLevelData.steps + 1.5, 3.5) -
          Math.floor(obstacleData.spriteWidth / 2)) {
        this.$store.commit('canvasDict/setEventX', {
          event: {
            type: nextObstacle.type,
            id: nextObstacle.id,
            field: nextObstacle.field
          },
          newX: this.stepWidth * Math.min(dynLevelData.steps + 1.5, 3.5) - Math.floor(obstacleData.spriteWidth / 2)
        })
        this.$store.commit('canvasDict/setEventField', {
          event: {
            type: nextObstacle.type,
            id: nextObstacle.id,
            field: nextObstacle.field
          },
          newField: dynLevelData.steps + 1
        })
        this.$store.commit('canvasDict/setObstacleAhead', true)

        this.currentAnimation = null
      }
    },
    youDiedAnimation () {
      this.currentAnimation.counter += 1

      if (this.counter === 60) {
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
    introhomeTransitionDraw (cD) {
      this.transitionDraw(
        that => { that.introDraw(cD) },
        that => { that.homeDraw(cD) }
      )
    },
    maplevelTransitionDraw (cD) {
      this.transitionDraw(
        that => { that.mapDraw(cD) },
        that => { that.levelDraw(cD) }
      )
    },
    maphomeTransitionDraw (cD) {
      this.transitionDraw(
        that => { that.mapDraw(cD) },
        that => { that.homeDraw(cD) }
      )
    },
    homemapTransitionDraw (cD) {
      this.transitionDraw(
        that => { that.homeDraw(cD) },
        that => { that.mapDraw(cD) }
      )
    },
    levelmapTransitionDraw (cD) {
      this.transitionDraw(
        that => { that.levelDraw(cD) },
        that => { that.mapDraw(cD) }
      )
    },
    transitionDraw (oldState, newState) {
      if (!this.transition.reversed) {
        Helper.drawCanvasRect(0, 0, this.canvasWidth, this.canvasHeight, 'darkness', this.ctx)
        this.ctx.save()
        Helper.clipCanvasCircle(this.canvasWidth / 2, this.canvasHeight / 2, this.transition.progress, this.ctx)
        this.ctx.clip()
        oldState(this)
        this.ctx.restore()
      } else {
        Helper.drawCanvasRect(0, 0, this.canvasWidth, this.canvasHeight, 'darkness', this.ctx)
        this.ctx.save()
        Helper.clipCanvasCircle(this.canvasWidth / 2, this.canvasHeight / 2, this.transition.progress, this.ctx)
        this.ctx.clip()
        newState(this)
        this.ctx.restore()
      }
    },
    introDraw (cD) {
      Helper.drawCanvasImage(0, 0, 'background_intro_' + this.currentIntroPart, cD)
    },
    mapDraw (cD) {
      let playerData = this.$store.getters['canvasDict/getSpriteData'](this.character.main.map)

      Helper.drawCanvasImage(0 - cD.mapOffset, 0, 'background_world', cD)
      if (this.currentAnimation && this.currentAnimation.type === 'teleportHomeMap') {
        Helper.drawCanvasImagePart(
          this.character.pos.map.x - Math.floor(playerData.spriteWidth / 2) - cD.mapOffset,
          this.character.pos.map.y - (playerData.spriteHeight - this.currentAnimation.counter.height),
          playerData.key, cD, 0, this.currentAnimation.counter.height
        )
      } else {
        Helper.drawCanvasImage(
          this.character.pos.map.x - Math.floor(playerData.spriteWidth / 2) - cD.mapOffset,
          this.character.pos.map.y - playerData.spriteHeight, playerData.key, cD
        )
      }
    },
    homeDraw (cD) {
      let houseUpgradeKey = this.$store.state.vueDict.currentUpgradeLevels.house
      let houseSpriteKey = this.$store.getters['vueDict/getUpgradeObject'](houseUpgradeKey).spriteKey

      Helper.drawCanvasImage(0, 0, 'background_home', cD)

      if (houseSpriteKey) {
        let houseData = this.$store.getters['canvasDict/getSpriteData'](houseSpriteKey)
        let currentHomePoint = this.$store.getters['canvasDict/currentHomePoint']

        Helper.drawCanvasImage(
          currentHomePoint.x - Math.floor(houseData.spriteWidth / 2),
          currentHomePoint.y - 20 - houseData.spriteHeight, houseData.key, cD
        )
      }

      this.homePlayerDraw(cD)
    },
    homePlayerDraw (cD) {
      let playerData = this.$store.getters['canvasDict/getSpriteData'](this.character.main.map)

      Helper.drawCanvasImage(
        this.character.pos.map.x - Math.floor(playerData.spriteWidth / 2) - cD.mapOffset,
        this.character.pos.map.y - playerData.spriteHeight, playerData.key, cD
      )
    },
    levelDraw (cD) {
      let dynLevelData = this.$store.getters['canvasDict/getDynamicLevelData'](this.currentLevel)

      for (let background of dynLevelData.background) {
        Helper.drawCanvasImage(background.x, background.y, background.spriteKey, cD)
      }

      for (let event of dynLevelData.events) {
        // TODO: wenn Event registered, dann ersetzen spriteKey mit destroyedSpriteKey
        if (!(event.type === 'obstacle' && event.registered)) {
          Helper.drawCanvasImage(event.x, event.y, event.spriteKey, cD)
        } else if (this.$store.getters['canvasDict/getSpriteData'](event.spriteKey + '_d', true)) {
          Helper.drawCanvasImage(event.x, event.y, event.spriteKey + '_d', cD)
        }
        if (!dynLevelData.itemsOnFloor && dynLevelData.obstacleAhead && !dynLevelData.lootableObstacle &&
             event.type === 'obstacle' && event.field === dynLevelData.steps + 1 && !event.registered) {
          this.healthBarDraw(event, cD)
        }
      }

      this.levelPlayerDraw(dynLevelData, cD)

      for (let foreground of dynLevelData.foreground) {
        Helper.drawCanvasImage(foreground.x, foreground.y, foreground.spriteKey, cD)
      }

      this.levelHudDraw(cD)
      this.currentWordDraw(cD)
      if (this.dead) {
        this.deathScreenDraw(cD)
      }
    },
    healthBarDraw (event, cD) {
      let eventData = this.$store.getters['canvasDict/getSpriteData'](event.spriteKey)
      let maxDurability = this.currentMapPoint.obstacles.find(obstacle => obstacle.id === event.id).durability
      let durabilityPercent = event.durability / maxDurability

      Helper.drawCanvasRect(
        event.x + eventData.spriteWidth * 0.2, event.y - 16, eventData.spriteWidth * 0.6, 8,
        'bar', this.ctx
      )

      if (durabilityPercent < 0.2) {
        Helper.drawCanvasRect(
          event.x + eventData.spriteWidth * 0.2, event.y - 16,
          eventData.spriteWidth * 0.6 * durabilityPercent, 8, 'barDanger', this.ctx
        )
      } else if (durabilityPercent < 0.6) {
        Helper.drawCanvasRect(
          event.x + eventData.spriteWidth * 0.2, event.y - 16,
          eventData.spriteWidth * 0.6 * durabilityPercent, 8, 'barWarning', this.ctx
        )
      } else {
        Helper.drawCanvasRect(
          event.x + eventData.spriteWidth * 0.2, event.y - 16,
          eventData.spriteWidth * 0.6 * durabilityPercent, 8, 'barSuccess', this.ctx
        )
      }
    },
    levelPlayerDraw (dynLevelData, cD) {
      let playerData = this.$store.getters['canvasDict/getSpriteData'](this.character.main.level)

      Helper.drawCanvasImage(
        this.character.pos.level.x - Math.floor(playerData.spriteWidth / 2),
        this.character.pos.level.y, playerData.key, cD
      )

      if (this.character.armor !== 'noarmor') {
        let itemData = this.$store.getters['vueDict/getItemObject'](this.character.armor)

        Helper.drawCanvasImage(
          this.character.pos.level.x - Math.floor(playerData.spriteWidth / 2),
          this.character.pos.level.y, itemData.spriteKey, cD
        )
      }

      if (this.equippedItem !== 'hand') {
        let itemData = this.$store.getters['vueDict/getItemObject'](this.equippedItem)

        Helper.drawCanvasImage(
          this.character.pos.level.x - Math.floor(playerData.spriteWidth / 2),
          this.character.pos.level.y - 30 - itemData.spriteHeight, itemData.spriteKey, cD
        )
      }

      if (this.currentAnimation && this.currentAnimation.type === 'pickUpItems') {
        this.pickUpItemsDraw(playerData, dynLevelData, cD)
      }
    },
    levelHudDraw (cD) {
      let bottomHUDData = this.$store.getters['canvasDict/getSpriteData']('UI_HUD_bottom')

      Helper.drawCanvasRect(10, this.canvasHeight - 21, 100, 5, 'barNothing', this.ctx)
      Helper.drawCanvasRect(10, this.canvasHeight - 12, 100, 5, 'barNothing', this.ctx)
      Helper.drawCanvasRect(189, this.canvasHeight - 13, 100, 5, 'barNothing', this.ctx)
      Helper.drawCanvasRect(
        10, this.canvasHeight - 21, this.$store.state.canvasDict.playerHealth, 5, 'barSuccess', this.ctx
      )
      if (this.character.armor !== 'noarmor') {
        let armorInvObject = this.$store.getters['vueDict/getInventoryObject'](this.character.armor)
        let armorObject = this.$store.getters['vueDict/getItemObject'](this.character.armor)

        Helper.drawCanvasRect(
          10, this.canvasHeight - 12, 100 * (armorInvObject.durability / armorObject.durability),
          5, 'barArmor', this.ctx
        )
      }
      Helper.drawCanvasRect(189, this.canvasHeight - 13, 56, 5, 'barEnemy', this.ctx)
      Helper.drawCanvasImage(0, this.canvasHeight - bottomHUDData.spriteHeight, bottomHUDData.key, cD)
    },
    deathScreenDraw (cD) {
      Helper.drawCanvasRect(0, 0, this.canvasWidth, this.canvasHeight, 'deathBackground', this.ctx)
      Helper.drawCanvasRect(0, 110, this.canvasWidth, 80, 'deathBand', this.ctx)
      Helper.drawCanvasText(this.canvasWidth / 2, 140, this.getText('adventureDeathScreen'), 'deathScreen', this.ctx)
      Helper.drawCanvasText(this.canvasWidth / 2, 170, '¯\\_(ツ)_/¯', 'deathScreen', this.ctx)
    },
    pickUpItemsDraw (playerData, dynLevelData, cD) {
      if (this.currentAnimation.success) {
        let items = this.collectedItems.filter(item => !item.animated)

        for (let i = 0; i < items.length; i++) {
          let itemData = this.$store.getters['canvasDict/getSpriteData'](items[i].spriteKey)
          let referenceX = this.stepWidth * Math.min(dynLevelData.steps + 0.5, 2.5) +
            Math.floor(playerData.spriteWidth / 2)
          let referenceY = 165 + i * 20 - this.currentAnimation.counter

          if (items[i].quantity > 0) {
            Helper.drawCanvasText(referenceX + 10, referenceY, '+', 'infoTextLeft', this.ctx)
            Helper.drawCanvasText(referenceX + 40, referenceY, items[i].quantity, 'infoTextRight', this.ctx)
          } else {
            Helper.drawCanvasText(referenceX + 10, referenceY, '-', 'infoTextLeftNegative', this.ctx)
            Helper.drawCanvasText(referenceX + 40, referenceY, items[i].quantity, 'infoTextRightNegative', this.ctx)
          }
          Helper.drawCanvasImage(
            referenceX + 45, referenceY - Math.floor(itemData.spriteHeight / 2), items[i].spriteKey, cD
          )
        }
      } else {
        let text = this.getText('adventureFailedPickup').split('\n')

        for (let i = 0; i < text.length; i++) {
          Helper.drawCanvasText(
            this.stepWidth * Math.min(dynLevelData.steps + 0.5, 2.5) + Math.floor(playerData.spriteWidth / 2) + 10,
            165 + i * 20 - this.currentAnimation.counter, text[i], 'errorText', this.ctx
          )
        }
      }
    },
    currentWordDraw (cD) {
      let word = this.currentWord[this.$store.state.vueDict.vocabs.mainAlphabet]
      if (word.length > 63) {
        word = word.substring(0, 60) + '...'
      }
      Helper.drawCanvasImage(0, 0, 'UI_word', cD)
      Helper.drawCanvasText(this.canvasWidth / 2, 19, word, 'standard', this.ctx)
    },
    getMovementFix (value, neg) {
      return neg ? -Math.sqrt(1 - Math.pow(value, 2)) : Math.sqrt(1 - Math.pow(value, 2))
    },
    saveGame (death = false) {
      let saveData = null

      for (let category of this.$store.state.vueDict.categoriesChosen) {
        this.$store.commit('vueDict/increaseCategoryPlayed', category)
      }
      this.addItemsToInventory()

      if (death) {
        saveData = JSON.parse(JSON.stringify(this.$store.getters['getSaveData']))
        saveData.gameState = 'map'
        saveData.playerHealth = 100
        for (let status of saveData.status) {
          status.count += status.additional
          status.additional = 0
        }
        saveData.dynamicLevelData[this.currentLevel] = {
          steps: 0,
          background: [],
          foreground: [],
          events: [],
          itemsOnFloor: false,
          obstacleAhead: false,
          lootableObstacle: false,
          bossSpawned: false
        }
        window.localStorage.setItem('globalDict', JSON.stringify(saveData))
      } else {
        saveData = this.$store.getters['getSaveData']
        for (let status of saveData.status) {
          status.count += status.additional
          status.additional = 0
        }
        window.localStorage.setItem('globalDict', JSON.stringify(saveData))
      }
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
          this.$store.commit('vueDict/resetVocabs')
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
      if (this.animationQueue) {
        if (this.animationQueue.length > 0 && this.currentAnimation === null) {
          this.currentAnimation = this.animationQueue.shift()
          this.animationStartFrame = this.$store.state.canvasDict.frameNo
          this.$store.commit('canvasDict/setAnimationActive', true)
        }
      }
    },
    '$route' (to, from) {
      if (this.$store.state.vueDict.transitionActive) {
        this.leaveTransition = 'animated slideOutDown faster'
        this.enterTransition = 'animated slideInUp faster' + (from.meta.delay.includes(to.name) ? ' adventure-delay' : '')
      } else {
        this.enterTransition = ''
        this.leaveTransition = ''
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

.animated {
  &.adventure-delay {
    -webkit-animation-delay: .8s;
    animation-delay: .8s;
  }
}
</style>
