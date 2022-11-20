<template>
  <div class="page">
    <TheHero title="trainingTitle" />
    <div class="action-container">
      <DropdownButton icon="list" color="action" :label="dropdownLabel" :dropdown-visible="dropdownVisible"
                      @dropdown="toggleDropdown()" />
    </div>
    <div class="height-full flex-column relative" :class="{ 'overflow-auto': !dropdownVisible }">
      <DropdownMenu v-show="dropdownVisible" class="flex-grow absolute width-full height-full" color="action"
                    :selected-word="currentlySelected" :vocabs="vocabs" mode="activate"
                    @new-word="toggleWord($event)" />
      <div class="flex-column margin-top-mini margin-bottom-mini margin-left-mini">
        <TheTag class="margin-bottom-mini" title="trainingTag1Title" :text="categoryName" color="info-2" />
        <TheTag title="trainingTag2Title" :text="wordDifficulty" color="info-2" />
      </div>
      <TheBlockquote :text="wordOriginal" />
      <div class="flex-grow flex-column space-evenly">
        <TextWithIcon :title="words.latinAlphabet" :text="wordLatin" :left-icon="ttsIconLatin"
                      :left-icon-color="ttsIconColor" @click-left="speak('latin')" />
        <TextWithIcon v-if="hasForeignWords" :title="words.foreignAlphabet" :text="wordForeign"
                      :left-icon="ttsIconForeign" :left-icon-color="ttsIconColor"
                      :right-icon="isJapanese ? 'edit' : ''" right-icon-color="green" @click-left="speak('foreign')"
                      @click-right="navTo('writeKanji')" />
      </div>
    </div>
    <transition :enter-active-class="'grow duration-c-350ms ' + getSizeClass('general')"
                :leave-active-class="'shrink duration-c-350ms ' + getSizeClass('general')"
                @after-enter="setDropdownAnimating(false)" @after-leave="setProgressVisible(false)"
                @before-enter="setProgressVisible(true)">
      <div v-show="!dropdownVisible" class="button-container overflow-hidden flex-shrink">
          <TheProgressBar class="width-full"
                          color="green" :value="progressValue"
                          :max-value="progressMaxValue" />
      </div>
    </transition>
    <div class="button-container flex-row flex-wrap">
      <ButtonBasic v-show="!isFirstWordSelected" class="width-half" icon="arrow-left" color="yellow"
                   text="trainingButton1" @click="previousWord()" />
      <ButtonBasic v-show="!isLastWordSelected" class="width-half" icon="arrow-right" color="green"
                   text="trainingButton2" @click="nextWord()" />
      <ButtonBasic v-show="isLastWordSelected" class="width-half" icon="check" color="green" text="trainingButton3"
                   @click="navTo('menu')" />
      <ButtonBasic class="width-full" icon="times" color="red" text="trainingButton4" @click="navTo('category')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="trainingNotificationTitle"
                         :text="['trainingNotificationText']" color="red" icon="exclamation"
                         @click="hideNotification()" />
    </transition>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import DropdownButton from '@/components/DropdownButton.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import TheTag from '@/components/TheTag.vue'
import TheBlockquote from '@/components/TheBlockquote.vue'
import TextWithIcon from '@/components/TextWithIcon.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppDynStore } from '@/stores/appdyn'
import { useAppConstStore } from '@/stores/appconst'

const router = useRouter()

const savestate = useSavestateStore()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()

onBeforeMount(() => {
  if (appDyn.trainingStash) {
    currentWord.value = appDyn.trainingStash.currentWord
  } else if (appDyn.categoriesChosen.length === 0) {
    navTo('category')
  }
  currentlySelected.categoryKey = words.value.words[currentWord.value].categoryKey
  currentlySelected.index = words.value.words[currentWord.value].index
  if (!isFirstWordSelected.value) {
    nextWord()
  }
})

onMounted(() => {
  if (!synth) {
    ttsWorking.value = false
  } else {
    if (synth.getVoices().length === 0) {
      ttsWorking.value = false
    } else if (synth.getVoices().filter(voice => words.value.lang.includes(voice.lang)).length === 0) {
      ttsWorking.value = false
    } else {
      ttsWorking.value = true
    }
    synth.onvoiceschanged = () => {
      if (synth.getVoices().filter(voice => words.value.lang.includes(voice.lang)).length !== 0) {
        ttsWorking.value = true
      }
    }
  }
})

const currentWord = ref(0)

const isFirstWordSelected = computed(() => {
  return currentWord.value === words.value.words.findIndex(
    (word) => !savestate.isWordDeactivated(word.categoryKey, word.index)
  )
})

const isLastWordSelected = computed(() => {
  let foundIndex = 0
  words.value.words.forEach((word, index) => {
    if (!savestate.isWordDeactivated(word.categoryKey, word.index)) {
      foundIndex = index
    }
  })
  return currentWord.value === foundIndex
})

const words = computed(() => {
  if (appDyn.trainingStash) {
    return appDyn.trainingStash.storedWords
  }

  let newVocabs = appConst.getFullVocabs(false)
  if (newVocabs.words.length === 0) {
    let placeholder = {
      categoryKey: ''
    }
    for (let lang of Object.keys(appConst.texts)) {
      placeholder[lang] = ''
    }
    newVocabs.words.push(placeholder)
  } else {
    let shuffledWords = []
    while (newVocabs.words.length > 0) {
      shuffledWords.push(newVocabs.words.splice(Math.floor(Math.random() * newVocabs.words.length), 1)[0])
    }
    newVocabs.words = shuffledWords
  }

  return newVocabs
})

const vocabs = computed(() => {
  let newVocabs = appConst.getFullVocabs(false)
  let newWordsObj = {}
  for (let word of newVocabs.words) {
    if (!newWordsObj.hasOwnProperty(word.categoryKey)) {
      newWordsObj[word.categoryKey] = []
    }
    newWordsObj[word.categoryKey].push(word)
  }
  newVocabs.words = newWordsObj
  return newVocabs
})

const dropdownVisible = ref(false)
const dropdownAnimating = ref(false)
const currentlySelected = reactive({ categoryKey: '', index: 1 })
const dropdownLabel = computed(() => {
  if (savestate.app.deactivatedWords.length === 0) {
    return getText('trainingDropdown')
  }
  return getText('trainingDropdownNumber', savestate.app.deactivatedWords.length)
})

function toggleDropdown () {
  dropdownVisible.value = !dropdownVisible.value
  if (dropdownVisible.value) {
    dropdownAnimating.value = true
  }
}

function setDropdownAnimating (newValue) {
  dropdownAnimating.value = newValue
}

const progressVisible = ref(true)

function setProgressVisible (isVisible) {
  progressVisible.value = isVisible
}

function toggleWord (word) {
  if (savestate.isWordDeactivated(word.categoryKey, word.index)) {
    savestate.app.deactivatedWords = savestate.app.deactivatedWords.filter((deactWord) =>
      deactWord.categoryKey !== word.categoryKey || deactWord.index !== word.index
    )
    savestate.saveData()
  } else {
    let currentWordObject = words.value.words[currentWord.value]
    if (currentWordObject.categoryKey === word.categoryKey && currentWordObject.index === word.index) {
      if (isFirstWordSelected.value) {
        nextWord()
      } else {
        previousWord()
      }
    }
    savestate.app.deactivatedWords.push(word)
    savestate.saveData()
  }
}

const progressValue = computed(() => {
  return currentWord.value + 1 - words.value.words.slice(0, currentWord.value + 1).reduce((acc, word) => {
    if (savestate.isWordDeactivated(word.categoryKey, word.index)) {
      acc += 1
    }
    return acc
  }, 0)
})

const progressMaxValue = computed(() => {
  return words.value.words.reduce((maxValue, word) => {
    if (!savestate.isWordDeactivated(word.categoryKey, word.index)) {
      maxValue += 1
    }
    return maxValue
  }, 0)
})

const synth = window.speechSynthesis
const ttsWorking = ref(false)
const ttsPlaying = ref(false)
const ttsWordType = ref('')

function speak (wordType) {
  if (ttsWorking.value) {
    if (!ttsPlaying.value) {
      let speech
      ttsWordType.value = wordType
      if (wordType === 'foreign') {
        speech = new SpeechSynthesisUtterance(wordForeign.value)
      } else {
        speech = new SpeechSynthesisUtterance(wordLatin.value)
      }
      let voice = synth.getVoices().filter(voice => words.value.lang.includes(voice.lang))[0]
      if (!voice) {
        ttsWorking.value = false
      }
      speech.lang = words.value.lang
      speech.volume = savestate.app.volume / 100
      speech.rate = 1
      speech.pitch = 1
      speech.voice = voice
      speech.onstart = () => {
        ttsPlaying.value = true
      }
      speech.onend = () => {
        ttsPlaying.value = false
      }
      synth.speak(speech)
    }
  } else {
    showNotification()
  }
}

function previousWord () {
  if (currentWord.value > 0) {
    for (let i = currentWord.value - 1; i >= 0; i--) {
      let word = words.value.words[i]
      if (!savestate.isWordDeactivated(word.categoryKey, word.index)) {
        currentWord.value = i
        break
      }
    }
    currentlySelected.categoryKey = words.value.words[currentWord.value].categoryKey
    currentlySelected.index = words.value.words[currentWord.value].index
    ttsPlaying.value = false
  }
}

function nextWord () {
  if (currentWord.value + 1 < words.value.words.length) {
    for (let i = currentWord.value + 1; i < words.value.words.length; i++) {
      let word = words.value.words[i]
      if (!savestate.isWordDeactivated(word.categoryKey, word.index)) {
        currentWord.value = i
        break
      }
    }
    currentlySelected.categoryKey = words.value.words[currentWord.value].categoryKey
    currentlySelected.index = words.value.words[currentWord.value].index
    ttsPlaying.value = false
  }
}

const categoryName = computed(() => {
  return appConst.getCategoryName(words.value.words[currentWord.value].categoryKey)
})

const isJapanese = computed(() => {
  return savestate.app.targetLanguage === 'japanese'
})

const hasForeignWords = computed(() => {
  return words.value.foreignAlphabet !== ''
})

const wordDifficulty = computed(() => {
  return 'difficulty' + words.value.words[currentWord.value].difficulty
})

const wordOriginal = computed(() => {
  return words.value.words[currentWord.value][savestate.app.lang]
})

const wordLatin = computed(() => {
  return words.value.words[currentWord.value][words.value.latinAlphabet]
})
const ttsIconLatin = computed(() => {
  if (ttsWorking.value) {
    return ttsPlaying.value && ttsWordType.value === 'latin' ? 'volume-up' : 'volume-off'
  }
  return 'volume-mute'
})
const wordForeign = computed(() => {
  return words.value.words[currentWord.value][words.value.foreignAlphabet]
})
const ttsIconForeign = computed(() => {
  if (ttsWorking.value) {
    return ttsPlaying.value && ttsWordType.value === 'foreign' ? 'volume-up' : 'volume-off'
  }
  return 'volume-mute'
})
const ttsIconColor = computed(() => {
  return ttsWorking.value ? 'green' : 'red'
})

function getText (id, ...params) {
  return appConst.getText(id, ...params)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

const notificationVisible = ref(false)

function showNotification () {
  notificationVisible.value = true
}

function hideNotification () {
  notificationVisible.value = false
}

function navTo (name) {
  switch (name) {
    case 'menu':
      appDyn.categoriesChosen = []
      currentWord.value = 0
      appDyn.trainingStash = null
      appDyn.writeKanji.data = null
      router.push({ name: name })
      break
    case 'category':
      appDyn.trainingStash = null
      appDyn.writeKanji.data = null
      router.push({ name: name, params: { destination: 'training' } })
      break
    default:
      if (isJapanese.value) {
        appDyn.writeKanji.data = {
          categoryKey: currentlySelected.categoryKey,
          index: currentlySelected.index
        }
        appDyn.trainingStash = {
          currentWord: currentWord.value,
          storedWords: words.value
        }
        router.push({ name: name })
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
