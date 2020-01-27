<template>
  <div class="flexContainer justifyBetween" :class="statisticsVisible ? 'height-statistics' : 'height-ingame'">
    <div>
      <HeroWithTags title="adventureTitle" :tagObjects="tags" />
      <canvas id="adventureCanvas" width="600" height="300"></canvas>
    </div>
    <div class="innerFlexContainerInput" v-show="!statisticsVisible">
      <span class="icon is-1" :class="[getSizeClass('icon'), latinIconColor]">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', latinIcon]" />
      </span>
      <input class="input is-rounded is-10" type="text" :placeholder="getText(words.latinAlphabet)"
             :class="[getSizeClass('input'), { 'is-link': solutionVisible}]" v-model="latinInput"
             :readonly="resultsVisible" />
      <span class="icon is-1 has-text-warning" :class="getSizeClass('icon')">
        <font-awesome-icon v-show="resultsVisible && isLatinCorrect" :icon="['fas', 'coins']" />
      </span>
    </div>
    <div class="innerFlexContainerInput" v-show="!statisticsVisible">
      <span class="icon is-1" :class="[getSizeClass('icon'), foreignIconColor]">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', foreignIcon]" />
      </span>
      <input class="input is-rounded is-10" type="text" :placeholder="getText(words.foreignAlphabet)"
             :class="[getSizeClass('input'), { 'is-link': solutionVisible}]" v-model="foreignInput" readonly />
      <span class="icon is-1 has-text-warning" :class="getSizeClass('icon')">
        <font-awesome-icon v-show="resultsVisible && isForeignCorrect" :icon="['fas', 'coins']" />
      </span>
    </div>
    <div class="innerFlexContainerButton is-10" v-show="!statisticsVisible">
      <ButtonBasic class="is-half marginBottomSmall marginRightSmall" icon="times" color="is-danger"
                   text="adventureButton1" @click="showMessageModal()" />
      <ButtonBasic v-show="!resultsVisible" class="is-half marginBottomSmall marginLeftSmall" icon="check"
                   color="is-success" text="adventureButton2" @click="checkInput()" />
      <ButtonBasic v-show="resultsVisible && currentWord + 1 !== $store.state.vueDict.wordCount"
                   class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right" color="is-success"
                   text="adventureButton3" @click="nextWord()" />
      <ButtonBasic v-show="resultsVisible && currentWord + 1 === $store.state.vueDict.wordCount"
                   class="is-half marginBottomSmall marginLeftSmall" icon="clipboard-check" color="is-success"
                   text="adventureButton4" @click="showStatistics()" />
      <ButtonBasic v-show="!resultsVisible" icon="briefcase" color="is-primary" text="adventureButton5"
                   @click="showItems()" />
      <ButtonBasic v-show="resultsVisible && !solutionVisible" icon="eye" color="is-link" text="adventureButton6"
                   @click="showSolution()" />
      <ButtonBasic v-show="resultsVisible && solutionVisible" icon="eye-slash" color="is-link" text="adventureButton7"
                   @click="hideSolution()" />
    </div>
    <TheProgressBar v-show="!statisticsVisible" class="is-10" color="is-success" :text="progressText"
                    :value="progressBarCount" :maxValue="words.words.length" />
    <BarChartBasic v-show="statisticsVisible" class="is-10" :title="words.latinAlphabet" :values="correctLatinWords" />
    <BarChartBasic v-show="statisticsVisible" class="is-10" :title="words.foreignAlphabet"
                   :values="correctForeignWords" />
    <div v-show="statisticsVisible" class="is-10">
      <ButtonBasic class="marginBottomSmall" icon="arrow-left" color="is-warning" text="adventureButton8"
                   @click="navTo('category')" />
      <ButtonBasic icon="check" color="is-success" text="adventureButton9" @click="navTo('menu')" />
    </div>
  </div>
</template>

<script>
import * as Helper from '@/canvas/helper.js'
import HeroWithTags from '@/components/HeroWithTags.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'
import BarChartBasic from '@/components/BarChartBasic.vue'

export default {
  name: 'TheAdventure',
  components: {
    HeroWithTags,
    ButtonBasic,
    TheProgressBar,
    BarChartBasic
  },
  data () {
    return {
      loopActivated: false,
      currentWord: 0,
      progressBarCount: 0,
      latinInput: '',
      foreignInput: '',
      userLatinInput: '',
      userForeignInput: '',
      correctLatinWords: [],
      correctForeignWords: [],
      resultsVisible: false,
      solutionVisible: false,
      statisticsVisible: false
    }
  },
  mounted () {
    this.$store.commit('canvasDict/initCanvas')
    this.loopActivated = true
    this.canvasLoop()
  },
  beforeDestroy () {
    this.loopActivated = false
  },
  computed: {
    tags () {
      return [
        {
          nameId: 'adventureCategoryTag',
          valueId: this.words.words[this.currentWord].category,
          color: 'is-primary'
        },
        {
          nameId: 'adventureCountTag',
          valueId: this.$store.state.vueDict.wordCount,
          color: 'is-primary'
        },
        {
          nameId: 'adventureDifficultyTag',
          valueId: 'difficulty' + this.$store.state.vueDict.difficulty,
          color: this.difficultyColor
        }
      ]
    },
    difficultyColor () {
      switch (this.$store.state.vueDict.difficulty) {
        case '1':
          return 'is-success'
        case '2':
          return 'is-warning'
        default:
          return 'is-danger'
      }
    },
    words () {
      let vocabs = JSON.parse(JSON.stringify(this.$store.getters['vueDict/getVocabs']))
      let length = this.$store.state.vueDict.wordCount

      if (vocabs.words.length === length) {
        return vocabs
      } else {
        let wordObjects = []

        while (wordObjects.length < length) {
          let i = wordObjects.length
          let random = Math.floor(Math.random() * vocabs.words.length)

          if (parseInt(vocabs.words[random].difficulty) <= parseInt(this.$store.state.vueDict.difficulty)) {
            if (wordObjects.length === 0) {
              wordObjects.push(JSON.parse(JSON.stringify(vocabs.words[random])))
            } else if (wordObjects[i - 1][vocabs.latinAlphabet] !== vocabs.words[random][vocabs.latinAlphabet]) {
              wordObjects.push(JSON.parse(JSON.stringify(vocabs.words[random])))
            }
          }
        }

        vocabs.words = wordObjects

        return vocabs
      }
    },
    isLatinCorrect () {
      return this.userLatinInput.toLowerCase() === this.words.words[this.currentWord][this.words.latinAlphabet].toLowerCase()
    },
    latinIcon () {
      return this.isLatinCorrect ? 'check' : 'times'
    },
    latinIconColor () {
      return this.isLatinCorrect ? 'has-text-success' : 'has-text-danger'
    },
    isForeignCorrect () {
      return this.userForeignInput.toLowerCase() === this.words.words[this.currentWord][this.words.foreignAlphabet].toLowerCase()
    },
    foreignIcon () {
      return this.isForeignCorrect ? 'check' : 'times'
    },
    foreignIconColor () {
      return this.isForeignCorrect ? 'has-text-success' : 'has-text-danger'
    },
    progressText () {
      return this.progressBarCount + ' / ' + this.words.words.length
    },
    answer () {
      return this.$store.state.vueDict.currentModalAnswer
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    showItems () {

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
    },
    checkInput () {
      this.resultsVisible = true
      this.userLatinInput = this.latinInput
      this.userForeignInput = this.foreignInput
      this.correctLatinWords.push(this.isLatinCorrect)
      this.correctForeignWords.push(this.isForeignCorrect)
      this.progressBarCount++
    },
    nextWord () {
      this.hideSolution()
      this.resultsVisible = false
      this.userLatinInput = ''
      this.userForeignInput = ''
      this.latinInput = ''
      this.foreignInput = ''
      this.currentWord++
    },
    showSolution () {
      this.solutionVisible = true
      this.latinInput = this.words.words[this.currentWord][this.words.latinAlphabet]
      this.foreignInput = this.words.words[this.currentWord][this.words.foreignAlphabet]
    },
    hideSolution () {
      this.solutionVisible = false
      this.latinInput = this.userLatinInput
      this.foreignInput = this.userForeignInput
    },
    showStatistics () {
      this.statisticsVisible = true
    },
    canvasLoop (timestamp) {
      if (this.loopActivated) {
        let raf = requestAnimationFrame(timestamp => this.canvasLoop(timestamp))
        this.$store.commit('canvasDict/setRaf', raf)

        this.$store.commit('canvasDict/addLag', timestamp - this.$store.state.canvasDict.startTS)

        while (this.$store.state.canvasDict.lag > this.$store.state.canvasDict.refreshrate) {
          this.$store.commit('canvasDict/invreaseFrameNo')

          // this.canvasUpdate()

          if (this.lag > this.refreshrate * 5) {
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
      this.$store.state.canvasDict.context.clearRect(
        0, 0, this.$store.getters['canvasDict/canvasWidth'], this.$store.getters['canvasDict/canvasHeight']
      )
    },
    canvasDraw () {
      let ctx = this.$store.state.canvasDict.context
      let canvasWidth = this.$store.getters['canvasDict/canvasWidth']
      // let canvasHeight = this.$store.getters['canvasDict/canvasHeight']

      Helper.drawCanvasRect(0, 0, canvasWidth, 30, 'standardBlur', ctx)
      Helper.drawCanvasText(
        canvasWidth / 2, 15, this.words.words[this.currentWord][this.$store.state.lang], 'standard', ctx
      )
    },
    navTo (name) {
      this.$router.push({ name: name })
    }
  },
  watch: {
    answer () {
      switch (this.answer) {
        case 'buttonLeft':
          this.$store.commit('vueDict/closeModal')
          break
        case 'buttonRight':
          this.$router.push({ name: 'selection' })
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
  flex-wrap: wrap;
  align-items: center;

  &.height-ingame {
    height: calc(100% - .5rem);
  }

  &.height-statistics {
    height: calc(100% - 71px);
  }

  &.justifyBetween {
    justify-content: space-between;
  }

  .is-1 {
    width: calc(100% / 12);
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}

.innerFlexContainerInput {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.innerFlexContainerButton {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  .is-half {
    width: calc(50% - .25rem);
  }
}
</style>
