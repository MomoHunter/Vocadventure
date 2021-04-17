<template>
  <div class="adventure-page">
    <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
      <div v-show="itemsVisible.off" class="inputs flex-grow flex-column">
        <InputTwoIcons class="border-bottom" :class="{ 'on-focus': inputBorderVisible }" :title="vocabs.latinAlphabet"
                       type="text" :color="inputColor" :colorLeft="latinIconColor" :colorRight="latinCoinColor"
                       :iconLeft="latinIcon" iconRight="coins" v-model="latinInput" :readonly="resultsVisible.on"
                       :leftIconVisible="resultsVisible.on" :rightIconVisible="resultsVisible.on && isLatinCorrect > 0" />
        <InputTwoIcons v-if="hasForeignAlphabet" class="border-bottom" :class="{ 'on-focus': inputBorderVisible }"
                       :title="vocabs.foreignAlphabet" type="text" :color="inputColor" :colorLeft="foreignIconColor"
                       :colorRight="foreignCoinColor" :iconLeft="foreignIcon" iconRight="coins" v-model="foreignInput"
                       :leftIconVisible="resultsVisible.on" :rightIconVisible="resultsVisible.on && isForeignCorrect > 0"
                       @click="showKeyboard()" readonly />
      </div>
    </transition>
    <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
      <div v-show="itemsVisible.on" class="items flex-grow overflow-auto">
        <TitleBasic class="margin-bottom-mini" text="adventureItemWeapons" color="weapons">
          <Sword :class="getSizeClass('general')" />
        </TitleBasic>
        <div class="flex-row gap-column-small overflow-auto margin-bottom-medium">
          <div class="flex-column" v-for="item in weapons" :key="item.id">
            <ItemBoxBasic class="small" mode="small" :item="item" :equipped="itemEquipped(item.id, 'weapons')" />
            <ButtonText class="small single-1 width-full" color="green" text="adventureItemButton1"
                        @click="itemBoxAction(item, 'weapons')" />
          </div>
        </div>
        <TitleBasic class="margin-bottom-mini" text="adventureItemArmor" color="armor">
          <ShieldOutline :class="getSizeClass('general')" />
        </TitleBasic>
        <div class="flex-row gap-column-small overflow-auto margin-bottom-medium">
          <div class="flex-column" v-for="item in armor" :key="item.id">
            <ItemBoxBasic class="small" mode="small" :item="item" :equipped="itemEquipped(item.id, 'armor')" />
            <ButtonText class="small single-1 width-full" color="green" text="adventureItemButton2"
                        @click="itemBoxAction(item, 'armor')" />
          </div>
        </div>
        <TitleBasic class="margin-bottom-mini" text="adventureItemConsumables" color="consumables">
          <BottleTonicOutline :class="getSizeClass('general')" />
        </TitleBasic>
        <div v-if="consumables.length > 0" class="flex-row gap-column-small overflow-auto">
          <div class="flex-column" v-for="item in consumables" :key="item.id">
            <ItemBoxBasic class="small" mode="small" :item="item" />
            <ButtonText class="small single-1 width-full" color="green" text="adventureItemButton3"
                        @click="itemBoxAction(item, 'consumables')" />
          </div>
        </div>
        <div v-else class="item-box-replacement" :class="getSizeClass('general')">
          {{ getText('adventureItemSelectionNoConsumables') }}
        </div>
      </div>
    </transition>
    <TheProgressBar class="width-full border-top" color="green" :value="progressBarCount"
                    :maxValue="vocabs.words.length" />
    <div class="button-container flex-row flex-wrap">
      <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                  leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
        <ButtonBasic v-show="resultsVisible.off || resultsVisible.on" class="width-half" icon="times" color="red"
                     text="adventureButton1" @click="$emit('click', { type: 'abort' })" />
      </transition>
      <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                  leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
        <ButtonBasic v-show="resultsVisible.off" class="width-half" icon="check" color="green" text="adventureButton2"
                     @click="checkInput()" />
      </transition>
      <transition :enter-active-class="enterActiveClass"
                  leave-active-class="animate__animated animate__fadeOut duration-c-350ms" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.on && currentWordIndex + 1 !== vocabs.words.length" class="width-half"
                     icon="arrow-right" color="green" text="adventureButton3" @click="nextWord()"
                     :disabled="$store.state.canvasDict.animationActive" />
      </transition>
      <transition :enter-active-class="enterActiveClass"
                  leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
        <ButtonBasic v-show="resultsVisible.on && currentWordIndex + 1 === vocabs.words.length" class="width-half"
                     icon="clipboard-check" color="green" text="adventureButton4"
                     @click="$emit('click', { type: 'finish' })" :disabled="$store.state.canvasDict.animationActive" />
      </transition>
      <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                  leave-active-class="animate__animated animate__fadeOut duration-c-350ms" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.off" class="width-half" icon="map" color="yellow" text="adventureButton5"
                     @click="$emit('click', { type: 'backToMap' })" />
      </transition>
      <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                  leave-active-class="animate__animated animate__fadeOut duration-c-350ms" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.off && itemsVisible.off" class="width-half" icon="briefcase" color="action"
                     text="adventureButton6" @click="showItems()" />
      </transition>
      <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                  leave-active-class="animate__animated animate__fadeOut duration-c-350ms" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.off && itemsVisible.on" class="width-half" icon="list" color="action"
                     text="adventureButton9" @click="hideItems()" />
      </transition>
      <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                  leave-active-class="animate__animated animate__fadeOut duration-c-350ms" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.on && solutionVisible.off" class="width-full" icon="eye" color="info"
                     text="adventureButton7" @click="showSolution()" />
      </transition>
      <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                  leave-active-class="animate__animated animate__fadeOut duration-c-350ms" @after-leave="endTrigger()">
        <ButtonBasic v-show="resultsVisible.on && solutionVisible.on" class="width-full" icon="eye-slash" color="info"
                     text="adventureButton8" @click="hideSolution()" />
      </transition>
    </div>
    <transition enter-active-class="animate__animated animate__fadeInUp duration-c-350ms"
                leave-active-class="animate__animated animate__fadeOutDown duration-c-350ms">
      <div v-show="keyboardVisible" class="keyboard flex-column">
        <HeroBasic title="adventureKeyboardTitle" :subtitle="[vocabs.foreignAlphabet]" />
        <TheBlockquote class="margin-top-small margin-bottom-medium" :text="vocabs.words[currentWordIndex][vocabs.mainAlphabet]" />
        <InputTwoIcons class="border-bottom on-focus margin-bottom-medium" :title="vocabs.foreignAlphabet" type="text"
                        color="action" v-model="foreignInput" readonly />
        <div class="flex-row border-top border-bottom">
          <ButtonText class="width-full" :class="{ 'single-2': isCurrentTab(name) }" v-for="name in keyboardNames"
                      color="action" :text="name" :key="name" @click="setTab(name)" />
        </div>
        <div class="keys flex-grow flex-row flex-wrap overflow-auto">
          <ButtonText class="recommended width-fifth" v-for="(sign, index) in keyboardSigns" :text="sign" color="action"
                      :key="index" @click="addLetter(sign)" />
        </div>
        <div class="button-container">
          <ButtonBasic class="width-half" icon="times" color="red" text="adventureKeyboardButton3"
                       @click="clearWord()" />
          <ButtonBasic class="width-half" icon="check" color="green" text="adventureKeyboardButton1"
                       @click="hideKeyboard()" />
          <ButtonBasic class="width-full" icon="backspace" color="yellow" text="adventureKeyboardButton2"
                       @click="removeLetter()" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import InputTwoIcons from '@/components/InputTwoIcons.vue'
import HeroBasic from '@/components/HeroBasic.vue'
import TitleBasic from '@/components/TitleBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonText from '@/components/ButtonText.vue'
import ItemBoxBasic from '@/components/ItemBoxBasic.vue'
import TheBlockquote from '@/components/TheBlockquote.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'

import BottleTonicOutline from 'vue-material-design-icons/BottleTonicOutline.vue'
import Sword from 'vue-material-design-icons/Sword.vue'
import ShieldOutline from 'vue-material-design-icons/ShieldOutline.vue'

export default {
  name: 'AdventureInputs',
  components: {
    InputTwoIcons,
    HeroBasic,
    TitleBasic,
    ButtonBasic,
    ButtonText,
    ItemBoxBasic,
    TheBlockquote,
    TheProgressBar,
    BottleTonicOutline,
    Sword,
    ShieldOutline
  },
  data () {
    return {
      keyboardVisible: false,
      itemsVisible: {
        off: true,
        on: false
      },
      solutionVisible: {
        off: true,
        on: false
      },
      resultsVisible: {
        off: true,
        on: false
      },
      inputBorderVisible: false,
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
          return 'green'
        case 1:
          return 'yellow'
        default:
          return 'red'
      }
    },
    latinCoinColor () {
      switch (this.isLatinCorrect) {
        case 2:
          return 'gold'
        default:
          return 'silver'
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
          return 'green'
        case 1:
          return 'yellow'
        default:
          return 'red'
      }
    },
    foreignCoinColor () {
      switch (this.isForeignCorrect) {
        case 2:
          return 'gold'
        default:
          return 'silver'
      }
    },
    inputColor () {
      if (this.inputBorderVisible) {
        return 'info'
      }
      return 'action'
    },
    progressBarCount () {
      if (this.resultsVisible.on) {
        return this.currentWordIndex + 1
      }
      return this.currentWordIndex
    },
    keyboardNames () {
      if (this.vocabs.signs) {
        let names = Object.keys(this.vocabs.signs)
        if (this.vocabs.signs.other) {
          for (let extra of this.vocabs.signs.other) {
            names = names.filter(name => name !== extra.id)
            names.splice(extra.position, 0, extra.id)
          }
          names = names.filter(name => name !== 'other')
        }
        return names
      } else {
        return []
      }
    },
    keyboardSigns () {
      if (this.vocabs.signs) {
        if (this.vocabs.signs.other) {
          for (let extra of this.vocabs.signs.other) {
            if (extra.id === this.currentKeyboardTab && !this.vocabs.signs[extra.id]) {
              this.$store.commit('vueDict/setKeyboardSigns', { name: extra.id, signs: this[extra.function] })
              break
            }
          }
        }
        return this.vocabs.signs[this.currentKeyboardTab]
      } else {
        return []
      }
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
    enterActiveClass () {
      return 'animate__animated duration-c-350ms ' +
        (this.$store.state.canvasDict.animationActive ? 'fade-in-to-disabled' : 'animate__fadeIn')
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

      this.$store.commit('vueDict/addStatAddit', { id: 'vocabs', count: 1 })
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
      this.itemsVisible.off = false
      this.animationQueue.push(['itemsVisible', 'on'])
    },
    hideItems () {
      this.itemsVisible.on = false
      this.animationQueue.push(['itemsVisible', 'off'])
    },
    isCurrentTab (id) {
      return id === this.currentKeyboardTab
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
          this.inputBorderVisible = true
          this.latinInput = this.vocabs.words[this.currentWordIndex][this.vocabs.latinAlphabet]
          if (this.hasForeignAlphabet) {
            this.foreignInput = this.vocabs.words[this.currentWordIndex][this.vocabs.foreignAlphabet]
          }
        } else if (variable[0] === 'solutionVisible' && variable[1] === 'off') {
          this.inputBorderVisible = false
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
.inputs {
  justify-content: space-evenly;
}

.items {
  height: 1rem;
}

.keys {
  align-content: flex-start;
}
</style>
