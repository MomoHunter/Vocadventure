<template>
  <div class="page">
    <HeroBasic title="writeKanjiTitle" :subtitle="[currentWord[$store.state.lang]]" />
    <div class="action-container">
      <DropdownButton icon="list" color="action" label="writeKanjiDropdown" :dropdownVisible="dropdownVisible"
                      @dropdown="toggleDropdown()" />
    </div>
    <DropdownMenu v-show="dropdownVisible" class="flex-grow" color="action" :selected="currentlySelected"
                  :vocabs="words" @click="newCurrentWord($event)" />
    <div v-show="!dropdownVisible" class="flex-grow flex-column">
      <div class="flex-column margin-top-mini margin-bottom-mini margin-left-mini">
        <TagBasic class="margin-bottom-mini" title="writeKanjiCategoryTag" :text="categoryName" color="info-2" />
        <TagBasic title="writeKanjiDifficultyTag" :text="difficulty" color="info-2" />
      </div>
      <div ref="letter" class="special-font flex-grow flex-row flex-center" :class="getSizeClass('general')" @mousedown="setDrawOn($event, 'mouse')"
           @mouseup="setDrawOff()" @touchstart="setDrawOn($event, 'touch')" @touchend="setDrawOff()" v-maxFontSize>
        <canvas ref="checkKana" class="canvas" v-square></canvas>
        <div class="background" v-square>
          <div v-show="drawActive" class="score">{{ drawScore }}%</div>
          <div class="top left has-alpha"></div>
          <div class="top right has-alpha"></div>
          <div class="bottom left has-alpha"></div>
          <div class="bottom right has-alpha"></div>
        </div>
        <div v-show="!drawActive" class="letter">
          {{ currentLetter }}
        </div>
        <canvas ref="drawKana" class="canvas in-front" @mousemove="drawLine($event, 'mouse')"
                @touchmove="drawLine($event, 'touch')" v-square></canvas>
      </div>
    </div>
    <div v-show="!drawActive" class="button-container flex-row overflow-auto flex-shrink">
      <ButtonText :class="{ 'single-2': currentLetterIndex === index }"
                  v-for="(letter, index) in currentWord[words.foreignAlphabet]" color="info" :text="letter"
                  :key="index" @click="setCurrentLetter(index)" />
    </div>
    <div v-show="drawActive" class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="writeKanjiButton3" @click="deactivateDraw()" />
      <ButtonBasic class="width-half" icon="trash" color="action" text="writeKanjiButton4" @click="clearCanvas()" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="writeKanjiButton1" @click="navTo()" />
      <ButtonBasic class="width-half" icon="pen" color="action" text="writeKanjiButton2" @click="activateDraw()"
                   :disabled="drawActive" />
    </div>
  </div>
</template>

<script>
import * as Helper from '@/canvas/helper.js'

import HeroBasic from '@/components/HeroBasic.vue'
import DropdownButton from '@/components/DropdownButton.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import ButtonText from '@/components/ButtonText.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TagBasic from '@/components/TagBasic.vue'

export default {
  name: 'TheWriteKanji',
  components: {
    HeroBasic,
    DropdownButton,
    DropdownMenu,
    ButtonText,
    ButtonBasic,
    TagBasic
  },
  data () {
    return {
      dropdownVisible: false,
      currentlySelected: { category: '', index: 1 },
      currentCategory: '',
      currentWord: {},
      currentLetterIndex: 0,
      canvas: null,
      context: null,
      checkCanvas: null,
      checkContext: null,
      drawActive: false,
      isDrawing: false,
      currentIdentifier: null,
      lastPoint: null,
      startResult: 0,
      drawScore: '0.00'
    }
  },
  beforeMount () {
    let storeLink = this.$store.state.vueDict.writeKanji
    if (storeLink) {
      this.setCurrentWord(storeLink.category, storeLink.index)
    } else {
      if (this.$store.state.vueDict.categoriesChosen.length === 0) {
        this.$router.push({ name: 'category', params: { destination: 'writeKanji' } })
      } else {
        this.setCurrentWord(this.$store.state.vueDict.categoriesChosen[0], 0)
      }
    }
  },
  mounted () {
    this.canvas = this.$refs.drawKana
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight
    this.context = this.canvas.getContext('2d')
    this.checkCanvas = this.$refs.checkKana
    this.checkCanvas.width = this.checkCanvas.clientWidth
    this.checkCanvas.height = this.checkCanvas.clientHeight
    this.checkContext = this.checkCanvas.getContext('2d')
  },
  computed: {
    words () {
      return this.$store.getters['vueDict/getVocabsWithCategories'](false)
    },
    currentLetter () {
      if (this.currentWord[this.words.foreignAlphabet]) {
        return this.currentWord[this.words.foreignAlphabet][this.currentLetterIndex]
      }
      return 'あ'
    },
    categoryName () {
      let foundCategory = this.$store.getters['vueDict/getCategories'].find(category => {
        return category.id === this.currentCategory
      }, this)

      if (foundCategory) {
        return foundCategory.categoryName
      }
      return ''
    },
    difficulty () {
      return 'difficulty' + this.currentWord['difficulty']
    }
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    newCurrentWord (wordDetails) {
      this.setCurrentWord(wordDetails.category, wordDetails.index)
      this.hideDropdown()
    },
    setCurrentWord (category, index) {
      this.currentlySelected = { category: category, index: index }
      this.currentCategory = category
      this.currentLetterIndex = 0
      this.currentWord = this.words.words[category][index]
      this.deactivateDraw()
    },
    setCurrentLetter (index) {
      this.currentLetterIndex = index
    },
    activateDraw () {
      let theme = this.$store.state.theme
      Helper.drawCanvasTextResizable(
        this.checkCanvas.width / 2, this.checkCanvas.height / 2.08, this.currentLetter, 'writeKanji' + theme,
        this.$refs.letter.style.fontSize, this.checkContext
      )

      this.startResult = 0
      let imageTwo = this.checkContext.getImageData(0, 0, this.checkCanvas.width, this.checkCanvas.height)
      for (let i = 0; i < imageTwo.data.length; i += 4) {
        if (imageTwo.data[i + 3] === 255) {
          this.startResult += 1
        }
      }
      this.drawActive = true
    },
    deactivateDraw () {
      if (this.context && this.checkContext) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.checkContext.clearRect(0, 0, this.checkCanvas.width, this.checkCanvas.height)
      }
      this.drawScore = '0.00'
      this.drawActive = false
    },
    setDrawOn (event, type) {
      if (this.drawActive) {
        this.isDrawing = true
        let clientRect = this.canvas.getBoundingClientRect()
        switch (type) {
          case 'touch':
            for (let touch of event.changedTouches) {
              if (this.currentIdentifier === null) {
                this.currentIdentifier = touch.identifier
              }
              if (this.currentIdentifier === touch.identifier) {
                this.lastPoint = {
                  x: touch.pageX - clientRect.left,
                  y: touch.pageY - clientRect.top
                }
              }
            }
            break
          case 'mouse':
            this.lastPoint = {
              x: event.pageX - clientRect.left,
              y: event.pageY - clientRect.top
            }
            break
          default:
            this.lastPoint = {
              x: 0,
              y: 0
            }
        }
      }
    },
    setDrawOff () {
      this.isDrawing = false
      this.lastPoint = null
      this.currentIdentifier = null
      let imageDraw = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
      let imageCheck = this.checkContext.getImageData(0, 0, this.checkCanvas.width, this.checkCanvas.height)
      let result = 0
      for (let i = 0; i < imageDraw.data.length; i += 4) {
        if (imageDraw.data[i + 3] !== 0 && imageCheck.data[i + 3] !== 0) {
          result += 1
        } else if (imageDraw.data[i + 3] !== 0 && imageCheck.data[i + 3] === 0) {
          result -= 0.29
        }
      }
      this.drawScore = Math.max(Math.min((result / (this.startResult * 0.7)) * 100, 100), 0).toFixed(2)
    },
    clearCanvas () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.checkContext.clearRect(0, 0, this.checkCanvas.width, this.checkCanvas.height)
      this.drawScore = '0.00'
      this.activateDraw()
    },
    drawLine (event, type) {
      let pos = { x: 0, y: 0 }

      if (this.isDrawing) {
        let clientRect = this.canvas.getBoundingClientRect()
        switch (type) {
          case 'touch':
            for (let touch of event.changedTouches) {
              if (this.currentIdentifier === touch.identifier) {
                pos = {
                  x: touch.pageX - clientRect.left,
                  y: touch.pageY - clientRect.top
                }
              }
            }
            break
          case 'mouse':
            pos = {
              x: event.pageX - clientRect.left,
              y: event.pageY - clientRect.top
            }
            break
          default:
            pos = { x: 0, y: 0 }
        }
        Helper.drawCanvasLine(
          this.lastPoint.x, this.lastPoint.y, this.$store.state.theme + 'Font' + this.$store.state.size,
          this.context, 1, pos.x, pos.y
        )

        this.lastPoint = pos
      }
    },
    toggleDropdown () {
      this.dropdownVisible = !this.dropdownVisible
    },
    showDropdown () {
      this.dropdownVisible = true
    },
    hideDropdown () {
      this.dropdownVisible = false
    },
    navTo () {
      if (this.$store.state.vueDict.writeKanji) {
        this.$store.commit('vueDict/setWriteKanji', null)
        this.$router.push({ name: 'training' })
      } else {
        this.$router.push({ name: 'category', params: { destination: 'writeKanji' } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.special-font {
  font-family: "KanjiStrokeOrders";
  line-height: 0;
}
</style>
