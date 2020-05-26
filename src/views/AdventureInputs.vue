<template>
  <div class="flexboxContainer">
    <div class="innerFlexContainerInput" :class="{ marginBottomBig: keyboardVisible }">
      <span class="icon is-1" :class="latinIconColor">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', latinIcon]" :size="getSizeClass('fas')" />
      </span>
      <input class="input is-rounded is-10" type="text" :placeholder="getText(vocabs.latinAlphabet)"
             :class="[getSizeClass('input'), { 'is-info': solutionVisible}]" v-model="latinInput"
             :readonly="resultsVisible" />
      <span class="icon is-1" :class="latinCoinColor">
        <font-awesome-icon v-show="resultsVisible && isLatinCorrect > 0" :icon="['fas', 'coins']"
                           :size="getSizeClass('fas')" />
      </span>
    </div>
    <div class="innerFlexContainerInput" :class="{ marginBottomBig: keyboardVisible }" v-show="hasForeignAlphabet">
      <span class="icon is-1" :class="foreignIconColor">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', foreignIcon]" :size="getSizeClass('fas')" />
      </span>
      <div class="field is-10 has-addons noMarginBottom">
        <div v-if="keyboardVisible" class="control">
          <ButtonIcon icon="backspace" color="is-danger" @click="removeLetter()" />
        </div>
        <div class="control fullWidth">
          <input class="input is-rounded" type="text" :placeholder="getText(vocabs.foreignAlphabet)"
                :class="[getSizeClass('input'), { 'is-info': solutionVisible}]" v-model="foreignInput"
                @click="showKeyboard()" readonly />
        </div>
        <div v-if="keyboardVisible" class="control">
          <ButtonIcon icon="check" color="is-success" @click="hideKeyboard()" />
        </div>
      </div>
      <span class="icon is-1" :class="foreignCoinColor">
        <font-awesome-icon v-show="resultsVisible && isForeignCorrect > 0" :icon="['fas', 'coins']"
                           :size="getSizeClass('fas')" />
      </span>
    </div>
    <div class="innerFlexContainerButton is-10" v-show="!keyboardVisible">
      <ButtonBasic class="is-half marginBottomSmall marginRightSmall" icon="times" color="is-danger"
                   text="adventureButton1" @click="$emit('click', { type: 'abort' })" />
      <ButtonBasic v-show="!resultsVisible" class="is-half marginBottomSmall marginLeftSmall" icon="check"
                   color="is-success" text="adventureButton2" @click="checkInput()" />
      <ButtonBasic v-show="resultsVisible && currentWordIndex + 1 !== vocabs.words.length"
                   class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right" color="is-success"
                   text="adventureButton3" @click="nextWord()" :disabled="$store.state.canvasDict.animationActive" />
      <ButtonBasic v-show="resultsVisible && currentWordIndex + 1 === vocabs.words.length"
                   class="is-half marginBottomSmall marginLeftSmall" icon="clipboard-check" color="is-success"
                   text="adventureButton4" @click="$emit('click', { type: 'finish' })"
                   :disabled="$store.state.canvasDict.animationActive" />
      <ButtonBasic v-show="!resultsVisible" class="is-half marginRightSmall" icon="map" color="is-warning"
                   text="adventureButton5" @click="$emit('click', { type: 'backToMap' })" />
      <ButtonBasic v-show="!resultsVisible" class="is-half marginLeftSmall" icon="briefcase" color="is-primary"
                   text="adventureButton6" @click="showItems()" />
      <ButtonBasic v-show="resultsVisible && !solutionVisible" icon="eye" color="is-info" text="adventureButton7"
                   @click="showSolution()" />
      <ButtonBasic v-show="resultsVisible && solutionVisible" icon="eye-slash" color="is-info" text="adventureButton8"
                   @click="hideSolution()" />
    </div>
    <TheProgressBar v-show="!keyboardVisible" class="is-10" color="is-success" :text="progressText"
                    :value="progressBarCount" :maxValue="vocabs.words.length" />
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
      solutionVisible: false,
      resultsVisible: false,
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
      if (this.hasForeignAlphabet) {
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
      if (this.resultsVisible) {
        return this.$store.state.vueDict.currentWordIndex + 1
      }
      return this.$store.state.vueDict.currentWordIndex
    },
    progressText () {
      return this.progressBarCount + ' / ' + this.vocabs.words.length
    },
    keyboardNames () {
      console.log('wants to know your names')
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
      this.resultsVisible = true
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
      this.resultsVisible = false
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
      this.solutionVisible = true
      this.latinInput = this.vocabs.words[this.currentWordIndex][this.vocabs.latinAlphabet]
      if (this.hasForeignAlphabet) {
        this.foreignInput = this.vocabs.words[this.currentWordIndex][this.vocabs.foreignAlphabet]
      }
    },
    hideSolution () {
      this.solutionVisible = false
      this.latinInput = this.userLatinInput
      if (this.hasForeignAlphabet) {
        this.foreignInput = this.userForeignInput
      }
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

  .is-10 {
    width: calc(100% / 1.2);
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
