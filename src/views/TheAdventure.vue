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
      counter: {
        animation: 0,
        increase: 0
      },
      transitions: [
        'intromap',
        'maplevel',
        'levelmap'
      ],
      animationQueue: [],
      currentAnimation: null,
      animationStartFrame: 0
    }
  },
  beforeRouteEnter (to, from, next) {
    next(component => {
      if (!component.$store.state.canvasDict.watchedIntro) {
        component.$store.commit('canvasDict/setGameState', 'intro')
        component.$router.replace({ name: 'adventureIntro' })
      } else if (component.$store.state.canvasDict.gameState === 'map') {
        component.$router.replace({ name: 'adventureMap' })
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
      if (this.$store.state.canvasDict.gameState !== 'level') {
        return []
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
    gameState () {
      return this.$store.state.canvasDict.gameState
    },
    lastBackground () {
      return this.$store.getters['canvasDict/getLastBackground'](this.$store.state.canvasDict.currentLevel)
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
      switch (object.type) {
        case 'skipIntro':
          this.$store.commit('canvasDict/setWatchedIntro')
          this.$store.commit('canvasDict/setGameState', 'map')
          this.$router.replace({ name: 'adventureMap' })
          break
        case 'selectLevel':
          if (this.$store.state.canvasDict.currentLevel !== 'home') {
            this.$store.commit('canvasDict/setGameState', 'level')
            this.$router.replace({ name: 'adventure' })
          }
          break
        case 'navigateToLevel':
          let startPoint = this.currentMapPoint

          this.$store.commit('canvasDict/setMapPoint', object.value)
          if (object.home) {
            this.animationQueue.push(new AnimationObject('teleportHomeMap', startPoint, this.currentMapPoint))
          } else {
            this.animationQueue.push(new AnimationObject('navigateOnMap', startPoint, this.currentMapPoint))
          }
          break
        case 'backToMap':
          this.$store.commit('canvasDict/setGameState', 'map')
          this.$router.replace({ name: 'adventureMap' })
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

        this.clearCanvas()
        this.canvasDraw()

        this.$store.commit('canvasDict/setStartTS', timestamp)
      }
    },
    clearCanvas () {
      this.$store.state.canvasDict.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
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
      this.transitionUpdate('map')
    },
    maplevelTransitionUpdate () {
      this.transitionUpdate('level')
      this.levelUpdate()
    },
    levelmapTransitionUpdate () {
      this.transitionUpdate('map')
    },
    transitionUpdate (destination) {
      this.counter.increase += 0.1
      this.counter.animation += this.counter.increase

      if (Math.sqrt(Math.pow(this.canvasWidth / 2, 2) + Math.pow(this.canvasHeight / 2, 2)) < this.counter.animation) {
        this.$store.commit('canvasDict/setGameState', destination)
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
        this.$store.commit('canvasDict/setGameState', 'map')
        this.$router.replace({ name: 'adventureMap' })
      }
    },
    levelUpdate () {
      let level = this.$store.state.canvasDict.currentLevel

      if (!this.lastBackground) {
        let newBackground = this.getNewBackground(level, 0, 0)
        this.$store.commit('canvasDict/addBackground', newBackground)

        if (newBackground.spriteKey.endsWith('background')) {
          this.$store.commit('canvasDict/addForeground', this.getForeground(newBackground))
        }
      }

      if (this.lastBackground.x + this.lastBackground.width < this.canvasWidth + 100) {
        let newX = this.lastBackground.x + this.lastBackground.width
        let newBackground = this.getNewBackground(level, newX, 0)
        this.$store.commit('canvasDict/addBackground', newBackground)

        if (newBackground.spriteKey.endsWith('background')) {
          this.$store.commit('canvasDict/addForeground', this.getForeground(newBackground))
        }
      }
    },
    getNewBackground (level, x, y) {
      const cD = this.$store.state.canvasDict
      let point = this.$store.state.canvasDict.levels[level]
      let max = point.backgroundChances.reduce((acc, bg) => { return acc + bg.chance }, 0)
      let random = Math.random() * max

      for (let bg of point.backgroundChances) {
        random -= bg.chance
        if (random <= 0) {
          return {
            id: bg.id,
            spriteKey: bg.spriteKey,
            x: x,
            y: y,
            width: Helper.getSpriteData(bg.spriteKey, cD).spriteWidth
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
    navigateOnMapAnimation () {
      this.currentAnimation.current.x += (this.currentAnimation.goal.x - this.currentAnimation.start.x) / 60
      this.currentAnimation.current.y += (this.currentAnimation.goal.y - this.currentAnimation.start.y) / 60

      if (Math.abs(this.currentAnimation.current.x - this.currentAnimation.start.x) >=
          Math.abs(this.currentAnimation.goal.x - this.currentAnimation.start.x) &&
          Math.abs(this.currentAnimation.current.y - this.currentAnimation.start.y) >=
          Math.abs(this.currentAnimation.goal.y - this.currentAnimation.start.y)) {
        this.currentAnimation = null
      }
    },
    teleportHomeMapAnimation () {
      let { spriteHeight } = Helper.getSpriteData('player_map_standing', this.$store.state.canvasDict)

      if (!this.currentAnimation.counter.reverse) {
        this.currentAnimation.counter.number += 0.8
        if (this.currentAnimation.counter.number > spriteHeight) {
          this.currentAnimation.counter.reverse = true
        }
      } else {
        this.currentAnimation.counter.number -= 0.8
        if (this.currentAnimation.counter.number <= 0) {
          this.currentAnimation = null
        }
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

      Helper.drawCanvasImage(0, 0, 'background_world', cD)
      if (this.currentAnimation && this.currentAnimation.type === 'navigateOnMap') {
        Helper.drawCanvasImage(
          this.currentAnimation.current.x - Math.floor(playerData.spriteWidth / 2),
          this.currentAnimation.current.y - playerData.spriteHeight, 'player_map_standing', cD
        )
      } else if (this.currentAnimation && this.currentAnimation.type === 'teleportHomeMap') {
        if (!this.currentAnimation.counter.reverse) {
          Helper.drawCanvasImagePart(
            this.currentAnimation.start.x - Math.floor(playerData.spriteWidth / 2),
            this.currentAnimation.start.y - playerData.spriteHeight + this.currentAnimation.counter.number,
            'player_map_standing', cD, 0, this.currentAnimation.counter.number
          )
        } else {
          Helper.drawCanvasImagePart(
            this.currentAnimation.goal.x - Math.floor(playerData.spriteWidth / 2),
            this.currentAnimation.goal.y - playerData.spriteHeight + this.currentAnimation.counter.number,
            'player_map_standing', cD, 0, this.currentAnimation.counter.number
          )
        }
      } else {
        Helper.drawCanvasImage(
          this.currentMapPoint.x - Math.floor(playerData.spriteWidth / 2),
          this.currentMapPoint.y - playerData.spriteHeight, 'player_map_standing', cD
        )
      }
    },
    levelDraw (cD) {
      let level = this.$store.state.canvasDict.currentLevel
      let backgrounds = this.$store.getters['canvasDict/getBackgrounds'](level)
      let events = this.$store.getters['canvasDict/getEvents'](level)

      for (let background of backgrounds.background) {
        Helper.drawCanvasImage(background.x, background.y, background.spriteKey, cD)
      }

      for (let event of events) {
        Helper.drawCanvasImage(event.x, event.y, event.spriteKey, cD)
      }

      Helper.drawCanvasImage(17, 145, 'player_level_standing', cD)

      for (let foreground of backgrounds.foreground) {
        Helper.drawCanvasImage(foreground.x, foreground.y, foreground.spriteKey, cD)
      }

      this.drawCurrentWord()
    },
    drawCurrentWord () {
      let word = this.currentWord[this.$store.state.lang]
      if (word.length > 68) {
        word = word.substring(0, 65) + '...'
      }
      Helper.drawCanvasRect(0, 0, this.canvasWidth, 30, 'standardBlur', this.ctx)
      Helper.drawCanvasText(
        this.canvasWidth / 2, 15, word, 'standard', this.ctx
      )
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
    gameState (newState, oldState) {
      if (this.transitions.includes(oldState + newState)) {
        this.$store.commit('canvasDict/setGameState', oldState + newState)
      }
    },
    currentAnimation (newState) {
      if (newState === null && this.animationQueue.length > 0) {
        this.currentAnimation = this.animationQueue.shift()
        this.animationStartFrame = this.$store.state.canvasDict.frameNo
      } else if (newState === null && this.animationQueue.length === 0) {
        this.animationStartFrame = 0
      }
    },
    animationQueue () {
      if (this.animationQueue.length > 0 && this.currentAnimation === null) {
        this.currentAnimation = this.animationQueue.shift()
        this.animationStartFrame = this.$store.state.canvasDict.frameNo
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
