<template>
  <div class="flexboxContainer">
    <div class="innerFlexContainerInput flexGrow marginBottomBig" v-show="!itemsVisible">
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
    <div class="innerFlexContainerInput flexGrow marginBottomBig" v-show="hasForeignAlphabet && !itemsVisible">
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
    <div class="is-max-10 flexGrow overflowAuto displayFlex" v-show="itemsVisible">
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
    <div class="innerFlexContainerButton is-10 marginBottomBig" v-show="!keyboardVisible">
      <ButtonBasic v-show="!resultsVisible && !itemsVisible" class="is-half marginBottomSmall marginRightSmall"
                   icon="map" color="is-warning" text="adventureButton5"
                   @click="$emit('click', { type: 'backToMap' })" />
      <ButtonBasic v-show="itemsVisible" class="marginBottomSmall" icon="list" color="is-primary"
                   text="adventureButton9" @click="hideItems()" />
      <ButtonBasic v-show="!resultsVisible && !itemsVisible" class="is-half marginBottomSmall marginLeftSmall"
                   icon="check" color="is-success" text="adventureButton2" @click="checkInput()" />
      <ButtonBasic v-show="!itemsVisible" class="is-half marginRightSmall" icon="times" color="is-danger"
                   text="adventureButton1" @click="$emit('click', { type: 'abort' })" />
      <ButtonBasic v-show="resultsVisible && currentWordIndex + 1 !== vocabs.words.length"
                   class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right" color="is-success"
                   text="adventureButton3" @click="nextWord()" :disabled="$store.state.canvasDict.animationActive" />
      <ButtonBasic v-show="resultsVisible && currentWordIndex + 1 === vocabs.words.length"
                   class="is-half marginBottomSmall marginLeftSmall" icon="clipboard-check" color="is-success"
                   text="adventureButton4" @click="$emit('click', { type: 'finish' })"
                   :disabled="$store.state.canvasDict.animationActive" />
      <ButtonBasic v-show="!resultsVisible && !itemsVisible" class="is-half marginLeftSmall" icon="briefcase"
                   color="is-primary" text="adventureButton6" @click="showItems()" />
      <ButtonBasic v-show="itemsVisible" icon="times" color="is-danger" text="adventureButton1"
                   @click="$emit('click', { type: 'abort' })" />
      <ButtonBasic v-show="resultsVisible && !solutionVisible" icon="eye" color="is-info" text="adventureButton7"
                   @click="showSolution()" />
      <ButtonBasic v-show="resultsVisible && solutionVisible" icon="eye-slash" color="is-info" text="adventureButton8"
                   @click="hideSolution()" />
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
      solutionVisible: false,
      resultsVisible: false,
      itemsVisible: false,
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
      if (this.resultsVisible) {
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
    showItems () {
      this.itemsVisible = true
    },
    hideItems () {
      this.itemsVisible = false
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
