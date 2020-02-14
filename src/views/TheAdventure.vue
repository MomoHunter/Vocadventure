<template>
  <div class="flexContainer justifyBetween" :class="statisticsVisible ? 'height-statistics' : 'height-ingame'">
    <div class="fullWidth" :class="{ marginBottomBig: keyboardVisible }">
      <HeroWithTags title="adventureTitle" :tagObjects="tags" />
      <canvas id="adventureCanvas" width="600" height="300"></canvas>
    </div>
    <div class="innerFlexContainerInput" :class="{ marginBottomBig: keyboardVisible }" v-show="!statisticsVisible">
      <span class="icon is-1" :class="latinIconColor">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', latinIcon]" :size="getSizeClass('fas')" />
      </span>
      <input class="input is-rounded is-10" type="text" :placeholder="getText(words.latinAlphabet)"
             :class="[getSizeClass('input'), { 'is-link': solutionVisible}]" v-model="latinInput"
             :readonly="resultsVisible" />
      <span class="icon is-1 has-text-warning">
        <font-awesome-icon v-show="resultsVisible && isLatinCorrect > 0" :icon="['fas', 'coins']"
                           :size="getSizeClass('fas')" />
      </span>
    </div>
    <div class="innerFlexContainerInput" :class="{ marginBottomBig: keyboardVisible }" v-show="!statisticsVisible">
      <span class="icon is-1" :class="foreignIconColor">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', foreignIcon]"
                           :size="getSizeClass('fas')" />
      </span>
      <div class="field is-10 has-addons">
        <div v-if="keyboardVisible" class="control">
          <ButtonIcon icon="backspace" color="is-danger" @click="removeLetter()" />
        </div>
        <div class="control fullWidth">
          <input class="input is-rounded" type="text" :placeholder="getText(words.foreignAlphabet)"
                :class="[getSizeClass('input'), { 'is-link': solutionVisible}]" v-model="foreignInput"
                @click="showKeyboard()" readonly />
        </div>
        <div v-if="keyboardVisible" class="control">
          <ButtonIcon icon="check" color="is-success" @click="hideKeyboard()" />
        </div>
      </div>
      <span class="icon is-1 has-text-warning">
        <font-awesome-icon v-show="resultsVisible && isForeignCorrect > 0" :icon="['fas', 'coins']"
                           :size="getSizeClass('fas')" />
      </span>
    </div>
    <div class="innerFlexContainerButton is-10" v-show="!statisticsVisible && !keyboardVisible">
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
    <transition enter-active-class="animated fadeInUp super-fast"
                leave-active-class="animated fadeOutDown super-fast is-absolute">
      <div v-show="keyboardVisible" class="flexGrow fullWidth keyboard">
        <TabsBasic :names="keyboardNames" :selected="currentKeyboardTab" @click="setTab($event)" radiusless />
        <div class="bottomKeyboard">
          <div class="keyContainer">
            <ButtonText class="is-radiusless keyboardButton" :text="sign" v-for="(sign, index) in keyboardSigns"
                          :key="index" @click="addLetter(sign)" />
          </div>
        </div>
      </div>
    </transition>
    <TheProgressBar v-show="!statisticsVisible && !keyboardVisible" class="is-10" color="is-success"
                    :text="progressText" :value="progressBarCount" :maxValue="words.words.length" />
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
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonText from '@/components/ButtonText.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'
import TabsBasic from '@/components/TabsBasic.vue'
import BarChartBasic from '@/components/BarChartBasic.vue'

import JapaneseSigns from '@/data/JapaneseSigns.json'

export default {
  name: 'TheAdventure',
  components: {
    HeroWithTags,
    ButtonBasic,
    ButtonIcon,
    ButtonText,
    TheProgressBar,
    TabsBasic,
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
      currentKeyboardTab: '',
      resultsVisible: false,
      solutionVisible: false,
      keyboardVisible: false,
      statisticsVisible: false
    }
  },
  mounted () {
    this.$store.commit('canvasDict/initCanvas')
    this.currentKeyboardTab = this.keyboardNames[0] || ''
    this.loopActivated = true
    this.canvasLoop()
  },
  beforeDestroy () {
    this.loopActivated = false
    this.$store.commit('vueDict/resetAdditional')
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
    isLatinCorrect () {
      if (this.userLatinInput.toLowerCase() ===
          this.words.words[this.currentWord][this.words.latinAlphabet].toLowerCase()) {
        return 2
      } else if (this.streamline(this.userLatinInput) ===
                 this.streamline(this.words.words[this.currentWord][this.words.latinAlphabet])) {
        return 1
      } else {
        return 0
      }
    },
    latinIcon () {
      switch (this.isLatinCorrect) {
        case 0:
          return 'times'
        default:
          return 'check'
      }
    },
    latinIconColor () {
      switch (this.isLatinCorrect) {
        case 2:
          return 'has-text-success'
        case 1:
          return 'has-text-warning'
        default:
          return 'has-text-danger'
      }
    },
    isForeignCorrect () {
      if (this.userForeignInput.toLowerCase() ===
          this.words.words[this.currentWord][this.words.foreignAlphabet].toLowerCase()) {
        return 2
      } else if (this.streamline(this.userForeignInput) ===
                 this.streamline(this.words.words[this.currentWord][this.words.foreignAlphabet])) {
        return 1
      } else {
        return 0
      }
    },
    foreignIcon () {
      switch (this.isForeignCorrect) {
        case 0:
          return 'times'
        default:
          return 'check'
      }
    },
    foreignIconColor () {
      switch (this.isForeignCorrect) {
        case 2:
          return 'has-text-success'
        case 1:
          return 'has-text-warning'
        default:
          return 'has-text-danger'
      }
    },
    keyboardNames () {
      return Object.keys(JapaneseSigns)
    },
    keyboardSigns () {
      let signs = JapaneseSigns
      signs.kanji = this.getKanji

      return signs[this.currentKeyboardTab]
    },
    getKanji () {
      let kanji = []
      let kanjiSet = new Set(this.$store.getters['vueDict/getVocabs'].words.flatMap(word =>
        word[this.words.foreignAlphabet].split('')
      ))

      this.keyboardNames.filter(name => name !== 'kanji').forEach(name => {
        JapaneseSigns[name].forEach(sign => {
          kanjiSet.delete(sign)
        })
      })

      kanjiSet.forEach(sign => {
        kanji.splice(Math.floor(Math.random() * (kanji.length + 1)), 0, sign)
      })

      return kanji
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
    streamline (word) {
      return word.toLowerCase().replace(/(\(.+\)|（.+）)|[-, .!?/！。・]/g, '')
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
      this.keyboardVisible = false
      this.userLatinInput = this.latinInput
      this.userForeignInput = this.foreignInput
      this.correctLatinWords.push(this.isLatinCorrect)
      this.correctForeignWords.push(this.isForeignCorrect)

      if (this.isLatinCorrect > 0) {
        this.$store.commit('vueDict/addStatAddit', { id: 'points', count: this.isLatinCorrect })
        this.$store.commit('vueDict/addStatAddit', { id: 'coins', count: this.isLatinCorrect })
      }
      if (this.isForeignCorrect > 0) {
        this.$store.commit('vueDict/addStatAddit', {
          id: 'points',
          count: this.isForeignCorrect * this.$store.state.vueDict.difficulty
        })
        this.$store.commit('vueDict/addStatAddit', {
          id: 'coins',
          count: this.isForeignCorrect * this.$store.state.vueDict.difficulty
        })
      }

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
    showKeyboard () {
      if (!this.resultsVisible) {
        this.keyboardVisible = true
      }
    },
    hideKeyboard () {
      this.keyboardVisible = false
    },
    setTab (id) {
      this.currentKeyboardTab = id
    },
    addLetter (letter) {
      this.foreignInput += letter
    },
    removeLetter () {
      this.foreignInput = this.foreignInput.slice(0, -1)
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
      for (let category of this.$store.state.vueDict.categoriesChosen) {
        this.$store.commit('vueDict/increaseCategoryPlayed', category)
      }
      this.$store.commit('vueDict/transferAdditionalStat')
      window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
      if (name === 'menu') {
        this.$store.commit('vueDict/setCategories', [])
        this.$store.commit('vueDict/setDifficulty', '')
        this.$store.commit('vueDict/setWordCount', 0)
        this.$router.push({ name: 'menu' })
      } else {
        this.$router.push({ name: 'category', params: { destination: 'adventure' } })
      }
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

  .flexGrow {
    flex-grow: 1;
  }

  .is-absolute {
    position: absolute;
    bottom: 0;
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

.keyboard {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  .bottomKeyboard {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    height: 0;
    overflow: auto;
    flex-grow: 1;

    .keyContainer {
      width: 95%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .keyboardButton {
        flex: 1 0 2.5em;
      }
    }
  }
}
</style>
