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
import HeroWithTags from '@/components/HeroWithTags.vue'

// import JapaneseSigns from '@/data/JapaneseSigns.json'

export default {
  name: 'TheAdventure',
  components: {
    HeroWithTags
  },
  data () {
    return {
      currentWord: 0,
      introPlaying: false,
      introTransitionPlaying: false,
      loopActivated: false,
      animationProgressCounter: 0
    }
  },
  beforeRouteEnter (to, from, next) {
    next(component => {
      if (!component.$store.state.canvasDict.watchedIntro) {
        component.introPlaying = true
        component.$router.replace({ name: 'adventureIntro' })
      } else if (!component.$store.state.canvasDict.inLevel) {
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
        this.$store.commit('vueDict/closeModal')
        next()
      } else {
        this.showMessageModal()
        next(false)
      }
    } else {
      next()
    }
  },
  mounted () {
    this.$store.commit('canvasDict/initCanvas')
    this.loopActivated = true
    this.canvasLoop(0)
  },
  beforeDestroy () {
    this.loopActivated = false
    this.$store.commit('vueDict/resetAdditional')
  },
  computed: {
    tags () {
      if (!this.$store.state.canvasDict.inLevel) {
        return []
      }
      return [
        {
          nameId: 'adventureCategoryTag',
          valueId: this.words.words[this.currentWord].category,
          color: 'is-info'
        },
        {
          nameId: 'adventureCountTag',
          valueId: this.words.words.length,
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
    words () {
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

      return vocabs
    },
    answer () {
      return this.$store.state.vueDict.currentModalAnswer
    },
    introTexts () {
      let intro = this.getText('adventureIntro')
      let texts = ['']

      for (let part of intro.split(' ')) {
        let measuredText = texts[texts.length - 1] + ' ' + part
        measuredText.trim()
        if (Helper.getTextWidth(measuredText, 'intro', this.$store.state.canvasDict.context).width > 400) {
          texts.push(part)
        } else {
          texts[texts.length - 1] += ' ' + part
        }
      }

      return texts
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
    currentPoint () {
      return this.$store.getters['canvasDict/currentPoint']
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
        case 'skip':
          this.$store.commit('canvasDict/setWatchedIntro')
          // window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
          this.introPlaying = false
          this.introTransitionPlaying = true
          this.animationProgressCounter = 0
          this.$router.replace({ name: 'adventureMap' })
          break
        case 'select':
          console.log('sth sth select')
          break
        case 'navigate':
          this.$store.commit('canvasDict/setMapPoint', object.value)
          break
        case 'abort':
          this.showMessageModal()
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
      if (this.introPlaying) {
        this.animationProgressCounter += 0.5

        if (this.canvasHeight - 50 + (30 * (this.introTexts.length - 1)) - this.animationProgressCounter < -20) {
          this.introPlaying = false
          this.$store.commit('canvasDict/setWatchedIntro')
          this.animationProgressCounter = 0
          this.introTransitionPlaying = true
          this.$router.replace({ name: 'adventureMap' })
        }
      } else if (this.introTransitionPlaying) {
        this.animationProgressCounter += 3

        if (this.animationProgressCounter > this.canvasWidth / 2 * 1.4) {
          this.introTransitionPlaying = false
          this.animationProgressCounter = 0
        }
      }
    },
    canvasDraw () {
      const cD = this.$store.state.canvasDict // read-only

      if (this.introPlaying) {
        Helper.drawCanvasImage(0, 0, 'background_intro_background', cD)

        for (let i = 0; i < this.introTexts.length; i++) {
          Helper.drawCanvasText(
            this.canvasWidth / 2, 250 + (30 * i) - this.animationProgressCounter,
            this.introTexts[i], 'intro', this.ctx
          )
        }

        Helper.drawCanvasImage(0, 0, 'background_intro_foreground', cD)
      } else if (this.introTransitionPlaying) {
        Helper.drawCanvasImage(0, 0, 'background_intro', cD)
        this.ctx.save()
        Helper.clipCanvasCircle(this.canvasWidth / 2, this.canvasHeight / 2, this.animationProgressCounter, this.ctx)
        this.ctx.clip()
        this.drawMap()
        this.ctx.restore()
      } else {
        this.drawMap()
      }
    },
    drawMap () {
      const cD = this.$store.state.canvasDict // read-only
      let playerData = Helper.getSpriteData('player_standing', cD)

      Helper.drawCanvasImage(0, 0, 'background_world', cD)
      Helper.drawCanvasImage(
        this.currentPoint.x - Math.floor(playerData.spriteWidth / 2), this.currentPoint.y - playerData.spriteHeight,
        'player_standing', cD
      )
    },
    drawCurrentWord () {
      Helper.drawCanvasRect(0, 0, this.canvasWidth, 30, 'standardBlur', this.ctx)
      Helper.drawCanvasText(
        this.canvasWidth / 2, 15, this.words.words[this.currentWord][this.$store.state.lang], 'standard', this.ctx
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
          this.$store.commit('vueDict/closeModal')
          break
        default:
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
