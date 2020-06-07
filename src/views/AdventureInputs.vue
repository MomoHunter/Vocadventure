<template>
  <div class="flexboxContainer">
    <transition leave-active-class="animated slideOutLeft a-little-bit-faster"
                enter-active-class="animated slideInLeft a-little-bit-faster" @after-leave="endTrigger()">
      <div class="innerFlexContainerInput flexGrow marginBottomBig" v-show="itemsVisible.off">
        <span class="icon is-1" :class="latinIconColor">
          <transition leave-active-class="animated fadeOut a-little-bit-faster" enter-active-class="animated fadeIn">
            <font-awesome-icon v-show="resultsVisible.on" :icon="['fas', latinIcon]" :size="getSizeClass('fas')" />
          </transition>
        </span>
        <input class="input is-rounded is-10" type="text" :placeholder="getText(vocabs.latinAlphabet)"
               :class="[getSizeClass('input'), { 'is-info': inputBorderInfo}]"
               v-model="latinInput" :readonly="resultsVisible.on" />
        <span class="icon is-1" :class="latinCoinColor">
          <transition leave-active-class="animated fadeOut a-little-bit-faster" enter-active-class="animated fadeIn">
            <font-awesome-icon v-show="resultsVisible.on && isLatinCorrect > 0" :icon="['fas', 'coins']"
                               :size="getSizeClass('fas')" />
          </transition>
        </span>
      </div>
    </transition>
    <transition leave-active-class="animated slideOutRight a-little-bit-faster"
                enter-active-class="animated slideInRight a-little-bit-faster">
      <div class="innerFlexContainerInput flexGrow marginBottomBig" v-show="hasForeignAlphabet && itemsVisible.off">
        <span class="icon is-1" :class="foreignIconColor">
          <transition leave-active-class="animated fadeOut a-little-bit-faster" enter-active-class="animated fadeIn">
            <font-awesome-icon v-show="resultsVisible.on" :icon="['fas', foreignIcon]" :size="getSizeClass('fas')" />
          </transition>
        </span>
        <div class="field is-10 has-addons noMarginBottom">
          <div v-if="keyboardVisible" class="control">
            <ButtonIcon icon="backspace" color="is-danger" @click="removeLetter()" />
          </div>
          <div class="control fullWidth">
            <input class="input is-rounded" type="text" :placeholder="getText(vocabs.foreignAlphabet)"
                   :class="[getSizeClass('input'), { 'is-info': inputBorderInfo}]"
                   v-model="foreignInput" @click="showKeyboard()" readonly />
          </div>
          <div v-if="keyboardVisible" class="control">
            <ButtonIcon icon="check" color="is-success" @click="hideKeyboard()" />
          </div>
        </div>
        <span class="icon is-1" :class="foreignCoinColor">
          <transition leave-active-class="animated fadeOut a-little-bit-faster" enter-active-class="animated fadeIn">
            <font-awesome-icon v-show="resultsVisible.on && isForeignCorrect > 0" :icon="['fas', 'coins']"
                               :size="getSizeClass('fas')" />
          </transition>
        </span>
      </div>
    </transition>
    <transition leave-active-class="animated zoomOut a-little-bit-faster"
                enter-active-class="animated zoomIn a-little-bit-faster" @after-leave="endTrigger()">
      <div class="is-max-10 flexGrow overflowAuto displayFlex" v-show="itemsVisible.on">
        <div class="itemBar">
          <div class="box customBox marginBottomBig" v-for="item in items" :key="item.id"
                @click="setItemEquipped(item.id)">
            <span class="activeIcon has-text-success" v-show="itemEquipped(item.id)">
              <font-awesome-icon :icon="['fas', 'check-square']" :size="getSizeClass('fas')" />
            </span>
            <p class="content has-text-centered marginBottomSmall" :class="getSizeClass('content')">{{ getText(item.id) }}</p>
            <div class="flexGrow fullWidth backgroundPicture"
                  :style="{ backgroundImage: 'url(' + baseUrl + item.spritePath + ')' }"></div>
            <div class="fullWidth infoBar">
              <div class="content noMarginBottom" :class="getSizeClass('content')">
                {{ item.quantity }}
              </div>
              <progress v-show="item.durability" class="progress flexGrow customProgress"
                        :class="[getSizeClass('progress'), getProgressColor(item)]" :value="item.durability"
                        :max="item.maxDurability">
              </progress>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="innerFlexContainerButton is-10 marginBottomBig" v-show="!keyboardVisible">
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.off && itemsVisible.off" class="is-half marginBottomSmall marginRightSmall"
                    icon="map" color="is-warning" text="adventureButton5"
                    @click="$emit('click', { type: 'backToMap' })" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="itemsVisible.on" class="marginBottomSmall" icon="list" color="is-primary"
                    text="adventureButton9" @click="hideItems()" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="resultsVisible.off && itemsVisible.off" class="is-half marginBottomSmall marginLeftSmall"
                    icon="check" color="is-success" text="adventureButton2" @click="checkInput()" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="itemsVisible.off && (resultsVisible.off || resultsVisible.on)" class="is-half marginRightSmall" icon="times" color="is-danger"
                    text="adventureButton1" @click="$emit('click', { type: 'abort' })" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.on && currentWordIndex + 1 !== vocabs.words.length"
                    class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right" color="is-success"
                    text="adventureButton3" @click="nextWord()" :disabled="$store.state.canvasDict.animationActive" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="resultsVisible.on && currentWordIndex + 1 === vocabs.words.length"
                    class="is-half marginBottomSmall marginLeftSmall" icon="clipboard-check" color="is-success"
                    text="adventureButton4" @click="$emit('click', { type: 'finish' })"
                    :disabled="$store.state.canvasDict.animationActive" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="resultsVisible.off && itemsVisible.off" class="is-half marginLeftSmall" icon="briefcase"
                    color="is-primary" text="adventureButton6" @click="showItems()" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="itemsVisible.on" icon="times" color="is-danger" text="adventureButton1"
                    @click="$emit('click', { type: 'abort' })" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.on && solutionVisible.off" icon="eye" color="is-info" text="adventureButton7"
                    @click="showSolution()" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.on && solutionVisible.on" icon="eye-slash" color="is-info" text="adventureButton8"
                    @click="hideSolution()" />
      </transition>
    </div>
    <TheProgressBar v-show="!keyboardVisible" class="is-10" color="is-success" :text="progressText"
                    :value="progressBarCount" :maxValue="vocabs.words.length" />
    <transition enter-active-class="animated fadeInUp super-fast"
                leave-active-class="animated fadeOutDown super-fast is-absolute">
      <div v-show="keyboardVisible" class="flexGrow2 fullWidth keyboard">
        <TabsBasic :names="keyboardNames" :selected="currentKeyboardTab" @click="setTab($event)" radiusless />
        <div class="bottomKeyboard">
          <div class="keyContainer">
            <ButtonText class="is-radiusless keyboardButton" :text="sign" v-for="(sign, index) in keyboardSigns"
                        :key="index" @click="addLetter(sign)" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonText from '@/components/ButtonText.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'
import TabsBasic from '@/components/TabsBasic.vue'

export default {
  name: 'AdventureInputs',
  components: {
    ButtonBasic,
    ButtonIcon,
    ButtonText,
    TheProgressBar,
    TabsBasic
  },
  data () {
    return {
      keyboardVisible: false,
      solutionVisible: {
        off: true,
        on: false
      },
      resultsVisible: {
        off: true,
        on: false
      },
      itemsVisible: {
        off: true,
        on: false
      },
      inputBorderInfo: false,
      animationQueue: [],
      latinInput: '',
      foreignInput: '',
      userLatinInput: '',
      userForeignInput: '',
      currentKeyboardTab: ''
    }
  },
  mounted () {
    this.currentKeyboardTab = this.keyboardNames[0] || ''
  },
  computed: {
    vocabs () {
      return this.$store.state.vueDict.vocabs
    },
    currentWordIndex () {
      return this.$store.state.vueDict.currentWordIndex
    },
    hasForeignAlphabet () {
      return this.vocabs.foreignAlphabet !== ''
    },
    isLatinCorrect () {
      if (this.userLatinInput.toLowerCase() ===
          this.vocabs.words[this.currentWordIndex][this.vocabs.latinAlphabet].toLowerCase()) {
        return 2
      } else if (this.streamline(this.userLatinInput) ===
                 this.streamline(this.vocabs.words[this.currentWordIndex][this.vocabs.latinAlphabet])) {
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
    latinCoinColor () {
      switch (this.isLatinCorrect) {
        case 2:
          return 'has-text-warning'
        default:
          return 'has-text-grey-lighter'
      }
    },
    isForeignCorrect () {
      if (!this.hasForeignAlphabet) {
        return 0
      } else if (this.userForeignInput.toLowerCase() ===
          this.vocabs.words[this.currentWordIndex][this.vocabs.foreignAlphabet].toLowerCase()) {
        return 2
      } else if (this.streamline(this.userForeignInput) ===
                 this.streamline(this.vocabs.words[this.currentWordIndex][this.vocabs.foreignAlphabet])) {
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
    foreignCoinColor () {
      switch (this.isForeignCorrect) {
        case 2:
          return 'has-text-warning'
        default:
          return 'has-text-grey-lighter'
      }
    },
    progressBarCount () {
      if (this.resultsVisible.on) {
        return this.$store.state.vueDict.currentWordIndex + 1
      }
      return this.$store.state.vueDict.currentWordIndex
    },
    progressText () {
      return this.progressBarCount + ' / ' + this.vocabs.words.length
    },
    keyboardNames () {
      let names = Object.keys(this.vocabs.signs)
      if (this.vocabs.signs.other) {
        for (let extra of this.vocabs.signs.other) {
          names.splice(extra.position, 0, extra.id)
        }
        names = names.filter(name => name !== 'other')
      }
      return names
    },
    keyboardSigns () {
      if (this.vocabs.signs.other) {
        for (let extra of this.vocabs.signs.other) {
          if (extra.id === this.currentKeyboardTab && !this.vocabs.signs[extra.id]) {
            this.$store.commit('vueDict/setKeyboardSigns', { name: extra.id, signs: this[extra.function] })
            break
          }
        }
      }
      return this.vocabs.signs[this.currentKeyboardTab]
    },
    getKanji () {
      let kanji = []
      let kanjiSet = new Set(this.$store.getters['vueDict/getFullVocabs'].words.flatMap(word =>
        word[this.vocabs.foreignAlphabet].split('')
      ))

      this.keyboardNames.filter(name => name !== 'kanji').forEach(name => {
        this.vocabs.signs[name].forEach(sign => {
          kanjiSet.delete(sign)
        })
      })

      kanjiSet.forEach(sign => {
        kanji.splice(Math.floor(Math.random() * (kanji.length + 1)), 0, sign)
      })

      return kanji
    },
    items () {
      let items = this.$store.state.vueDict.inventory.filter(item => item.power && item.quantity > 0)
      items.unshift(this.$store.getters['vueDict/getItemObject']('hand'))

      return items
    },
    baseUrl () {
      return process.env.BASE_URL
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
      return word.toLowerCase().replace(/(\(.+\)|（.+）)|[-, .!?/！。・、？]/g, '')
    },
    checkInput () {
      this.resultsVisible.off = false
      this.animationQueue.push(['resultsVisible', 'on'])
      this.keyboardVisible = false
      this.userLatinInput = this.latinInput
      this.$store.commit('vueDict/addCorrectLatin', this.isLatinCorrect)
      if (this.hasForeignAlphabet) {
        this.userForeignInput = this.foreignInput
        this.$store.commit('vueDict/addCorrectForeign', this.isForeignCorrect)
      }

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
      if (this.isLatinCorrect > 0 || this.isForeignCorrect > 0) {
        this.$emit('click', { type: 'correctWord' })
      } else {
        this.$emit('click', { type: 'wrongWord' })
      }
    },
    nextWord () {
      this.hideSolution()
      this.resultsVisible.on = false
      this.animationQueue.push(['resultsVisible', 'off'])
      this.currentKeyboardTab = this.keyboardNames[0] || ''
      this.userLatinInput = ''
      this.latinInput = ''
      if (this.hasForeignAlphabet) {
        this.userForeignInput = ''
        this.foreignInput = ''
      }
      this.$store.commit('vueDict/incCurrentWord')
      this.$emit('click', { type: 'nextWord' })
    },
    showSolution () {
      this.solutionVisible.off = false
      this.animationQueue.push(['solutionVisible', 'on'])
    },
    hideSolution () {
      this.solutionVisible.on = false
      this.animationQueue.push(['solutionVisible', 'off'])
    },
    showItems () {
      this.itemsVisible.off = false
      this.animationQueue.push(['itemsVisible', 'on'])
    },
    hideItems () {
      this.itemsVisible.on = false
      this.animationQueue.push(['itemsVisible', 'off'])
    },
    showKeyboard () {
      if (this.resultsVisible.off) {
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
      if (letter === '␣') {
        this.foreignInput += ' '
      } else {
        this.foreignInput += letter
      }
    },
    removeLetter () {
      this.foreignInput = this.foreignInput.slice(0, -1)
    },
    itemEquipped (itemId) {
      return itemId === this.$store.state.canvasDict.currentEquippedItem
    },
    setItemEquipped (itemId) {
      this.$store.commit('canvasDict/setEquippedItem', itemId)
    },
    getProgressColor (item) {
      if (item.durability < item.maxDurability / 3) {
        return 'is-danger'
      } else if (item.durability < item.maxDurability / 1.5) {
        return 'is-warning'
      } else {
        return 'is-success'
      }
    },
    endTrigger () {
      while (this.animationQueue.length > 0) {
        let variable = this.animationQueue.shift()
        this[variable[0]][variable[1]] = true

        if (variable[0] === 'solutionVisible' && variable[1] === 'on') {
          this.inputBorderInfo = true
          this.latinInput = this.vocabs.words[this.currentWordIndex][this.vocabs.latinAlphabet]
          if (this.hasForeignAlphabet) {
            this.foreignInput = this.vocabs.words[this.currentWordIndex][this.vocabs.foreignAlphabet]
          }
        } else if (variable[0] === 'solutionVisible' && variable[1] === 'off') {
          this.inputBorderInfo = false
          this.latinInput = this.userLatinInput
          if (this.hasForeignAlphabet) {
            this.foreignInput = this.userForeignInput
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flexboxContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;

  .noMarginBottom {
    margin-bottom: 0;
  }

  .flexGrow {
    flex-grow: 1;
  }

  .flexGrow2 {
    flex-grow: 8;
  }

  .overflowAuto {
    overflow: auto;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }

  .is-max-10 {
    max-width: calc(100% / 1.2);
  }

  .is-absolute {
    position: absolute;
    bottom: 0;
  }

  .innerFlexContainerInput {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    .is-1 {
      width: calc(100% / 12);
    }

    .is-10 {
      width: calc(100% / 1.2);
    }
  }

  .innerFlexContainerButton {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    .is-half {
      width: calc(50% - .25rem);
    }
  }

  .displayFlex {
    display: flex;
  }

  .itemBar {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    height: 100%;

    .customBox {
      display: flex;
      flex-direction: column;
      height: 75%;
      width: 175px;
      position: relative;

      .activeIcon {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 2px;
        height: 2px;
        line-height: 0px;
      }

      &:not(:first-child) {
        margin-left: .25rem;
      }

      &:not(:last-child) {
        margin-right: .25rem;
      }
    }

    .backgroundPicture {
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .infoBar {
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: nowrap;

      .noMarginBottom {
        margin-bottom: 0px;
      }

      .customProgress {
        margin-top: auto;
        margin-bottom: auto;
        margin-right: .5rem;
        height: 12px;
      }
    }
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
        text-transform: none;
      }
    }
  }
}
</style>
