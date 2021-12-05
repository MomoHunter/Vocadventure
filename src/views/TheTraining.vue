<template>
  <div class="page">
    <HeroBasic title="trainingTitle" />
    <div class="action-container">
      <DropdownButton icon="list" color="action" label="trainingDropdown" :dropdownVisible="dropdownVisible"
                      @dropdown="toggleDropdown()" />
    </div>
    <DropdownMenu v-show="dropdownVisible" class="flex-grow" color="action" :selected="currentlySelected"
                  :vocabs="vocabs" mode="activate" @click="hideWord($event)" />
    <div v-show="!dropdownVisible" class="height-full flex-column overflow-auto">
      <div class="flex-column margin-top-mini margin-bottom-mini margin-left-mini">
        <TagBasic class="margin-bottom-mini" title="trainingTag1Title" :text="categoryName" color="info-2" />
        <TagBasic title="trainingTag2Title" :text="difficulty" color="info-2" />
      </div>
      <TheBlockquote :text="words.words[currentWord][$store.state.lang]" />
      <div class="flex-grow flex-column space-evenly">
        <TextWithIcon :title="words.latinAlphabet" :text="latinWord" :leftIcon="ttsIconLatin" :leftIconColor="ttsIconColor"
                      @click-left="speak('latin')" />
        <TextWithIcon v-if="hasForeignWords" :title="words.foreignAlphabet" :text="foreignWord" :leftIcon="ttsIconForeign"
                      :leftIconColor="ttsIconColor" :rightIcon="isJapanese ? 'edit' : ''" rightIconColor="green"
                      @click-left="speak('foreign')" @click-right="navTo('writeKanji')" />
      </div>
    </div>
    <TheProgressBar v-show="!dropdownVisible" class="width-full border-top" color="green" :value="progressValue"
                    :maxValue="progressMaxValue" />
    <div class="button-container flex-row flex-wrap">
      <ButtonBasic v-show="!isFirstWord" class="width-half" icon="arrow-left" color="yellow" text="trainingButton1"
                   @click="previousWord()" />
      <ButtonBasic v-show="!isLastWord" class="width-half" icon="arrow-right" color="green" text="trainingButton2"
                   @click="nextWord()" />
      <ButtonBasic v-show="isLastWord" class="width-half" icon="check" color="green" text="trainingButton3"
                   @click="navTo('menu')" />
      <ButtonBasic class="width-full" icon="times" color="red" text="trainingButton4" @click="navTo('category')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="trainingNotificationTitle"
                       :text="['trainingNotificationText']" color="red" icon="exclamation" @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import TextWithIcon from '@/components/TextWithIcon.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TagBasic from '@/components/TagBasic.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'
import TheBlockquote from '@/components/TheBlockquote.vue'
import DropdownButton from '@/components/DropdownButton.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'

export default {
  name: 'TheTraining',
  components: {
    HeroBasic,
    TextWithIcon,
    ButtonBasic,
    TagBasic,
    TheProgressBar,
    NotificationBasic,
    TheBlockquote,
    DropdownButton,
    DropdownMenu
  },
  data () {
    return {
      currentWord: 0,
      currentlySelected: { category: '', index: 1 },
      storedWords: null,
      synth: window.speechSynthesis,
      ttsWorking: true,
      ttsPlaying: false,
      ttsWordType: 'latin',
      notificationVisible: false,
      dropdownVisible: false
    }
  },
  beforeMount () {
    let stash = this.$store.state.vueDict.trainingStash
    if (stash) {
      this.storedWords = stash.storedWords
      this.currentWord = stash.currentWord
      this.$store.commit('vueDict/setTrainingStash', null)
    } else if (this.$store.state.vueDict.categoriesChosen.length === 0) {
      this.$router.push({ name: 'category', params: { destination: 'training' } })
    }
    this.currentlySelected.category = this.words.words[this.currentWord].category
    this.currentlySelected.index = this.words.words[this.currentWord].index
    if (!this.isFirstWord) {
      this.nextWord()
    }
  },
  mounted () {
    if (!this.synth) {
      this.ttsWorking = false
    } else {
      if (this.synth.getVoices().length === 0) {
        this.ttsWorking = false
      } else if (this.synth.getVoices().filter(voice => this.words.lang.includes(voice.lang)).length === 0) {
        this.ttsWorking = false
      }
      this.synth.onvoiceschanged = () => {
        if (this.synth.getVoices().filter(voice => this.words.lang.includes(voice.lang)).length !== 0) {
          this.ttsWorking = true
        }
      }
    }
  },
  computed: {
    words () {
      if (this.storedWords) {
        return this.storedWords
      }
      let vocabs = this.$store.getters['vueDict/getVocabsWithCategories'](true)

      if (Object.keys(vocabs.words).length === 0) {
        vocabs.words = [{
          category: '',
          german: '',
          english: ''
        }]
      } else {
        let newWords = []

        for (let category in vocabs.words) {
          for (let word of vocabs.words[category]) {
            word.category = category
            newWords.splice(Math.floor(Math.random() * newWords.length), 0, word)
          }
        }
        vocabs.words = newWords
      }

      return vocabs
    },
    vocabs () {
      return this.$store.getters['vueDict/getVocabsWithCategories'](false)
    },
    hasForeignWords () {
      return this.words.foreignAlphabet !== ''
    },
    isFirstWord () {
      return this.currentWord === this.words.words.findIndex(
        word => !this.$store.getters['vueDict/isWordDeactivated'](word.category, word.index)
      )
    },
    isLastWord () {
      let foundIndex = 0
      this.words.words.forEach((word, index) => {
        if (!this.$store.getters['vueDict/isWordDeactivated'](word.category, word.index)) {
          foundIndex = index
        }
      })
      return this.currentWord === foundIndex
    },
    isJapanese () {
      return this.$store.state.targetLanguage === 'japanese'
    },
    categoryName () {
      let foundCategory = this.$store.getters['vueDict/getCategories'].find(category => {
        return category.id === this.words.words[this.currentWord].category
      }, this)

      if (foundCategory) {
        return foundCategory.categoryName
      }
      return ''
    },
    difficulty () {
      return 'difficulty' + this.words.words[this.currentWord].difficulty
    },
    latinWord () {
      return this.words.words[this.currentWord][this.words.latinAlphabet]
    },
    foreignWord () {
      return this.words.words[this.currentWord][this.words.foreignAlphabet]
    },
    ttsIconLatin () {
      if (this.ttsWorking) {
        return this.ttsPlaying && this.ttsWordType === 'latin' ? 'volume-up' : 'volume-off'
      }
      return 'volume-mute'
    },
    ttsIconForeign () {
      if (this.ttsWorking) {
        return this.ttsPlaying && this.ttsWordType === 'foreign' ? 'volume-up' : 'volume-off'
      }
      return 'volume-mute'
    },
    ttsIconColor () {
      return this.ttsWorking ? 'green' : 'red'
    },
    progressValue () {
      return this.currentWord + 1 - this.words.words.slice(0, this.currentWord + 1).reduce((acc, word) => {
        if (this.$store.getters['vueDict/isWordDeactivated'](word.category, word.index)) {
          acc += 1
        }
        return acc
      }, 0)
    },
    progressMaxValue () {
      return this.words.words.reduce((maxValue, word) => {
        if (!this.$store.getters['vueDict/isWordDeactivated'](word.category, word.index)) {
          maxValue += 1
        }
        return maxValue
      }, 0)
    }
  },
  methods: {
    previousWord () {
      if (this.currentWord > 0) {
        for (let i = this.currentWord - 1; i >= 0; i--) {
          let word = this.words.words[i]
          if (!this.$store.getters['vueDict/isWordDeactivated'](word.category, word.index)) {
            this.currentWord = i
            break
          }
        }
        this.currentlySelected.category = this.words.words[this.currentWord].category
        this.currentlySelected.index = this.words.words[this.currentWord].index
        this.ttsPlaying = false
      }
    },
    nextWord () {
      if (this.currentWord + 1 < this.words.words.length) {
        for (let i = this.currentWord + 1; i < this.words.words.length; i++) {
          let word = this.words.words[i]
          if (!this.$store.getters['vueDict/isWordDeactivated'](word.category, word.index)) {
            this.currentWord = i
            break
          }
        }
        this.currentlySelected.category = this.words.words[this.currentWord].category
        this.currentlySelected.index = this.words.words[this.currentWord].index
        this.ttsPlaying = false
      }
    },
    toggleDropdown () {
      this.dropdownVisible = !this.dropdownVisible
    },
    hideWord (wordDetails) {
      if (this.$store.getters['vueDict/isWordDeactivated'](wordDetails.category, wordDetails.index)) {
        this.$store.commit('vueDict/removeDeactivatedWord', wordDetails)
        window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
      } else {
        let currentWordObject = this.words.words[this.currentWord]
        if (currentWordObject.category === wordDetails.category && currentWordObject.index === wordDetails.index) {
          if (this.isFirstWord) {
            this.nextWord()
          } else {
            this.previousWord()
          }
        }
        this.$store.commit('vueDict/addDeactivatedWord', wordDetails)
        window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
      }
    },
    speak (wordType) {
      if (this.ttsWorking) {
        if (!this.ttsPlaying) {
          let speech
          this.ttsWordType = wordType
          if (wordType === 'foreign') {
            speech = new SpeechSynthesisUtterance(this.foreignWord)
          } else {
            speech = new SpeechSynthesisUtterance(this.latinWord)
          }
          let voice = this.synth.getVoices().filter(voice => this.words.lang.includes(voice.lang))[0]
          if (!voice) {
            this.ttsWorking = false
          }
          speech.lang = this.words.lang
          speech.volume = this.$store.state.volume / 100
          speech.rate = 1
          speech.pitch = 1
          speech.voice = voice
          speech.onstart = () => {
            this.ttsPlaying = true
          }
          speech.onend = () => {
            this.ttsPlaying = false
          }
          this.synth.speak(speech)
        }
      } else {
        this.notificationVisible = true
      }
    },
    showNotification () {
      this.notificationVisible = true
    },
    hideNotification () {
      this.notificationVisible = false
    },
    navTo (name) {
      switch (name) {
        case 'menu':
          this.$store.commit('vueDict/setCategories', [])
          this.$router.push({ name: name })
          break
        case 'category':
          this.$router.push({ name: name, params: { destination: 'training' } })
          break
        default:
          if (this.isJapanese) {
            this.$store.commit('vueDict/setWriteKanji', {
              category: this.words.words[this.currentWord].category,
              index: this.words.words[this.currentWord].index
            })
            this.$store.commit('vueDict/setTrainingStash', {
              currentWord: this.currentWord,
              storedWords: this.words
            })
            this.$router.push({ name: name })
          }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.space-evenly {
  justify-content: space-evenly;
}

.button-container {
  justify-content: flex-end;
}
</style>
