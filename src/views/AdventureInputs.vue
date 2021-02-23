<template>
  <div class="flexboxContainer">
    <div class="innerFlexContainerInput flexGrow marginBottomBig">
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
    <div class="innerFlexContainerInput flexGrow marginBottomBig" v-show="hasForeignAlphabet">
      <span class="icon is-1" :class="foreignIconColor">
        <transition leave-active-class="animated fadeOut a-little-bit-faster" enter-active-class="animated fadeIn">
          <font-awesome-icon v-show="resultsVisible.on" :icon="['fas', foreignIcon]" :size="getSizeClass('fas')" />
        </transition>
      </span>
      <input class="input is-rounded is-10" type="text" :placeholder="getText(vocabs.foreignAlphabet)"
             :class="[getSizeClass('input'), { 'is-info': inputBorderInfo}]"
             v-model="foreignInput" @click="showKeyboard()" readonly />
      <span class="icon is-1" :class="foreignCoinColor">
        <transition leave-active-class="animated fadeOut a-little-bit-faster" enter-active-class="animated fadeIn">
          <font-awesome-icon v-show="resultsVisible.on && isForeignCorrect > 0" :icon="['fas', 'coins']"
                             :size="getSizeClass('fas')" />
        </transition>
      </span>
    </div>
    <div class="innerFlexContainerButton is-10 marginBottomBig">
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.off" class="is-half marginBottomSmall marginRightSmall"
                     icon="map" color="is-warning" text="adventureButton5"
                     @click="$emit('click', { type: 'backToMap' })" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="resultsVisible.off" class="is-half marginBottomSmall marginLeftSmall"
                     icon="check" color="is-success" text="adventureButton2" @click="checkInput()" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="resultsVisible.off || resultsVisible.on"
                     class="is-half marginRightSmall" icon="times" color="is-danger" text="adventureButton1"
                     @click="$emit('click', { type: 'abort' })" />
      </transition>
      <transition :enter-active-class="enterActiveClass"
                  leave-active-class="animated fadeOut a-little-bit-faster" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.on && currentWordIndex + 1 !== vocabs.words.length"
                     class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right" color="is-success"
                     text="adventureButton3" @click="nextWord()" :disabled="$store.state.canvasDict.animationActive" />
      </transition>
      <transition :enter-active-class="enterActiveClass"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="resultsVisible.on && currentWordIndex + 1 === vocabs.words.length"
                     class="is-half marginBottomSmall marginLeftSmall" icon="clipboard-check" color="is-success"
                     text="adventureButton4" @click="$emit('click', { type: 'finish' })"
                     :disabled="$store.state.canvasDict.animationActive" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster">
        <ButtonBasic v-show="resultsVisible.off" class="is-half marginLeftSmall" icon="briefcase"
                     color="is-primary" text="adventureButton6" @click="showItems()" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.on && solutionVisible.off" icon="eye" color="is-info" text="adventureButton7"
                     @click="showSolution()" />
      </transition>
      <transition enter-active-class="animated fadeIn a-little-bit-faster"
                  leave-active-class="animated fadeOut a-little-bit-faster" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.on && solutionVisible.on" icon="eye-slash" color="is-info"
                     text="adventureButton8" @click="hideSolution()" />
      </transition>
    </div>
    <TheProgressBar class="is-10" color="is-success" :text="progressText"
                    :value="progressBarCount" :maxValue="vocabs.words.length" />
    <transition enter-active-class="animated fadeInUp a-little-bit-faster"
                leave-active-class="animated fadeOutDown a-little-bit-faster">
      <div v-show="keyboardVisible" class="specialKeyboard has-background-background">
        <h1 class="title marginTopBig" :class="getSizeClass('title')">
          {{ getText('adventureKeyboardTitle') }}
        </h1>
        <div class="control is-10 marginBottomBig">
          <div class="content" :class="getSizeClass('content')">
            <blockquote>
              {{ vocabs.words[currentWordIndex][vocabs.mainAlphabet] }}
            </blockquote>
          </div>
        </div>
        <input class="input is-rounded is-10 marginBottomBig" type="text" :placeholder="getText(vocabs.foreignAlphabet)"
               :class="[getSizeClass('input'), { 'is-info': inputBorderInfo}]"
               v-model="foreignInput" readonly />
        <div class="flexGrow fullWidth keyboard marginBottomBig">
          <TabsBasic :names="keyboardNames" :selected="currentKeyboardTab" @click="setTab($event)" radiusless />
          <div class="bottomKeyboard">
            <div class="keyContainer">
              <ButtonText class="is-radiusless keyboardButton" :text="sign" v-for="(sign, index) in keyboardSigns"
                          :key="index" @click="addLetter(sign)" />
            </div>
          </div>
        </div>
        <div class="innerFlexContainerButton is-10 marginBottomBig">
          <ButtonBasic class="is-full marginBottomSmall" icon="check"
                       color="is-success" text="adventureKeyboardButton1" @click="hideKeyboard()" />
          <ButtonBasic class="is-half marginRightSmall" icon="backspace"
                       color="is-warning" text="adventureKeyboardButton2" @click="removeLetter()" />
          <ButtonBasic class="is-half marginLeftSmall" icon="times"
                       color="is-danger" text="adventureKeyboardButton3" @click="clearWord()" />
        </div>
      </div>
    </transition>
    <transition enter-active-class="animated fadeInUp a-little-bit-faster"
                leave-active-class="animated fadeOutDown a-little-bit-faster">
      <div v-show="itemsVisible" class="itemSelectionContainer has-background-background">
        <h1 class="title marginTopBig" :class="getSizeClass('title')">
          {{ getText('adventureItemSelectionTitle') }}
        </h1>
        <div class="is-10 marginBottomBig flexGrow overflowAuto">
          <div class="customTitle marginBottomSmall has-text-white-ter has-background-weapon">
            <Sword class="marginRightSmall" :class="getSizeClass('mdi')" />
            <div class="content" :class="getSizeClass('content')">
              {{ getText('adventureItemWeapons') }}
            </div>
          </div>
          <div class="itemBar overflowAuto marginBottomBig">
            <ItemBoxBasic v-for="item in weapons" :key="item.id" :item="item"
                          :equipped="itemEquipped(item.id, 'weapons')" hasInfoBar isSizeable
                          @click="itemBoxAction(item, 'weapons')" />
          </div>
          <div class="customTitle marginBottomSmall has-text-white-ter has-background-armor">
            <ShieldOutline class="marginRightSmall" :class="getSizeClass('mdi')" />
            <div class="content" :class="getSizeClass('content')">
              {{ getText('adventureItemArmor') }}
            </div>
          </div>
          <div class="itemBar overflowAuto marginBottomBig">
            <ItemBoxBasic v-for="item in armor" :key="item.id" :item="item"
                          :equipped="itemEquipped(item.id, 'armor')" hasInfoBar isSizeable
                          @click="itemBoxAction(item, 'armor')" />
          </div>
          <div class="customTitle marginBottomSmall has-text-white-ter has-background-consumable">
            <BottleTonicOutline class="marginRightSmall" :class="getSizeClass('mdi')" />
            <div class="content" :class="getSizeClass('content')">
              {{ getText('adventureItemConsumables') }}
            </div>
          </div>
          <div class="itemBar overflowAuto marginBottomBig">
            <ItemBoxBasic v-for="item in consumables" :key="item.id" :item="item"
                          :equipped="itemEquipped(item.id, 'consumables')" hasInfoBar isSizeable
                          @click="itemBoxAction(item, 'consumables')" />
            <div class="consumablesPlaceholder" :class="getSizeClass('itemBoxBasic')" v-if="consumables.length === 0">
              {{ getText('adventureItemSelectionNoConsumables') }}
            </div>
          </div>
        </div>
        <div class="is-10">
          <ButtonBasic icon="times" color="is-danger" text="adventureItemSelectionButton1" @click="hideItems()" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonText from '@/components/ButtonText.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'
import TabsBasic from '@/components/TabsBasic.vue'
import ItemBoxBasic from '@/components/ItemBoxBasic.vue'

import BottleTonicOutline from 'vue-material-design-icons/BottleTonicOutline.vue'
import Sword from 'vue-material-design-icons/Sword.vue'
import ShieldOutline from 'vue-material-design-icons/ShieldOutline.vue'

export default {
  name: 'AdventureInputs',
  components: {
    ButtonBasic,
    ButtonText,
    TheProgressBar,
    TabsBasic,
    ItemBoxBasic,
    BottleTonicOutline,
    Sword,
    ShieldOutline
  },
  data () {
    return {
      keyboardVisible: false,
      itemsVisible: false,
      solutionVisible: {
        off: true,
        on: false
      },
      resultsVisible: {
        off: true,
        on: false
      },
      inputBorderInfo: false,
      animationQueue: [],
      consumableUsed: false,
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
          return 'has-text-silver'
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
          return 'has-text-silver'
      }
    },
    progressBarCount () {
      if (this.resultsVisible.on) {
        return this.currentWordIndex + 1
      }
      return this.currentWordIndex
    },
    progressText () {
      return this.progressBarCount + ' / ' + this.vocabs.words.length
    },
    keyboardNames () {
      let names = Object.keys(this.vocabs.signs)
      if (this.vocabs.signs.other) {
        for (let extra of this.vocabs.signs.other) {
          names = names.filter(name => name !== extra.id)
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
    weapons () {
      let items = this.$store.state.vueDict.inventory.filter(item =>
        item.categories.includes('weapon') && item.quantity > 0
      )
      items.unshift(this.$store.getters['vueDict/getItemObject']('hand'))
      return items
    },
    armor () {
      let items = this.$store.state.vueDict.inventory.filter(item =>
        item.categories.includes('armor') && item.quantity > 0
      )
      items.unshift(this.$store.getters['vueDict/getItemObject']('noarmor'))
      return items
    },
    consumables () {
      return this.$store.state.vueDict.inventory.filter(item =>
        item.categories.includes('consumable') && item.quantity > 0
      )
    },
    baseUrl () {
      return process.env.BASE_URL
    },
    enterActiveClass () {
      return 'animated a-little-bit-faster ' + (this.$store.state.canvasDict.animationActive ? 'fadeInC2' : 'fadeIn')
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
      return word.toLowerCase().replace(/(\(.+\)|（.+）)|[-, ;.!?/！。・、？0-9０-９]/g, '')
    },
    checkInput () {
      this.resultsVisible.off = false
      this.animationQueue.push(['resultsVisible', 'on'])
      this.keyboardVisible = false
      this.userLatinInput = this.latinInput
      this.$store.commit('vueDict/addCorrectLatin', {
        inputValue: this.userLatinInput,
        result: this.isLatinCorrect
      })
      if (this.hasForeignAlphabet) {
        this.userForeignInput = this.foreignInput
        this.$store.commit('vueDict/addCorrectForeign', {
          inputValue: this.userForeignInput,
          result: this.isForeignCorrect
        })
      }

      if (this.isLatinCorrect > 0) {
        this.$store.commit('vueDict/addStatAddit', { id: 'points', count: this.isLatinCorrect })
        this.$store.commit('vueDict/addStatAddit', { id: 'coins', count: this.isLatinCorrect })
      }
      if (this.isForeignCorrect > 0) {
        this.$store.commit('vueDict/addStatAddit', {
          id: 'points',
          count: this.isForeignCorrect * this.vocabs.words[this.currentWordIndex].difficulty
        })
        this.$store.commit('vueDict/addStatAddit', {
          id: 'coins',
          count: this.isForeignCorrect * this.vocabs.words[this.currentWordIndex].difficulty
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
      this.consumableUsed = false
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
    showKeyboard () {
      if (this.resultsVisible.off) {
        this.keyboardVisible = true
      }
    },
    hideKeyboard () {
      this.keyboardVisible = false
    },
    showItems () {
      this.itemsVisible = true
    },
    hideItems () {
      this.itemsVisible = false
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
    clearWord () {
      this.foreignInput = ''
    },
    itemBoxAction (item, type) {
      switch (type) {
        case 'weapons':
          this.$store.commit('canvasDict/setEquippedItem', item.id)
          break
        case 'armor':
          this.$store.commit('canvasDict/setEquippedArmor', item.id)
          break
        case 'consumables':
          if (!this.consumableUsed) {
            let itemData = this.$store.getters['vueDict/getItemObject'](item.id)

            if (itemData.healing) {
              if (this.$store.state.canvasDict.playerHealth < 100) {
                this.$store.commit('canvasDict/changePlayerHealth', itemData.healing)
                this.$store.commit('vueDict/addToInventory', { id: item.id, quantity: -1 })
              }
            }

            this.consumableUsed = true
          }
          break
        default:
      }
    },
    itemEquipped (itemId, type) {
      switch (type) {
        case 'weapons':
          return itemId === this.$store.state.canvasDict.character.hand
        case 'armor':
          return itemId === this.$store.state.canvasDict.character.armor
        default:
          return false
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

  .flexGrow {
    flex-grow: 1;
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

    .is-full {
      width: 100%;
    }
  }

  .specialKeyboard {
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    height: calc(100% + .5rem);
    padding-bottom: 71px;
    top: 0px;
    z-index: 4;

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
          width: calc(100% / 1.2);
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          justify-items: stretch;

          .keyboardButton {
            text-transform: none;
          }
        }
      }
    }
  }

  .itemSelectionContainer {
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    height: calc(100% + .5rem);
    padding-bottom: 71px;
    top: 0px;
    z-index: 4;

    .customTitle {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      padding: .25rem;
      border-radius: 290486px;
    }

    .itemBar {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
    }

    .consumablesPlaceholder {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;

      &.is-small {
        height: 7em;
      }

      &.is-normal {
        height: 9em;
      }

      &.is-medium {
        height: 11em;
      }

      &.is-large {
        height: 13em;
      }
    }
  }
}
</style>
