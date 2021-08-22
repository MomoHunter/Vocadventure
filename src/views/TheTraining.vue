<template>
  <div class="page">
    <HeroBasic title="trainingTitle" />
    <div class="height-full flex-column overflow-auto">
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
    <TheProgressBar class="width-full border-top" color="green" :value="currentWord + 1" :maxValue="words.words.length" />
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

export default {
  name: 'TheTraining',
  components: {
    HeroBasic,
    TextWithIcon,
    ButtonBasic,
    TagBasic,
    TheProgressBar,
    NotificationBasic,
    TheBlockquote
  },
  data () {
    return {
      currentWord: 0,
      storedWords: null,
      synth: window.speechSynthesis,
      ttsWorking: true,
      ttsPlaying: false,
      ttsWordType: 'latin',
      notificationVisible: false
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
      let vocabs = this.$store.getters['vueDict/getShuffledVocabs']

      if (vocabs.words.length === 0) {
        vocabs.words.push({
          category: '',
          german: '',
          english: ''
        })
      }
      return vocabs
    },
    hasForeignWords () {
      return this.words.foreignAlphabet !== ''
    },
    isFirstWord () {
      return this.currentWord === 0
    },
    isLastWord () {
      return this.currentWord + 1 === this.words.words.length
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
    }
  },
  methods: {
    previousWord () {
      if (this.currentWord > 0) {
        this.currentWord--
      }
    },
    nextWord () {
      if (this.currentWord + 1 < this.words.words.length) {
        this.currentWord++
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
