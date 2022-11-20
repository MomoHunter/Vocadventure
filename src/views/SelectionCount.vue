<template>
  <div class="page">
    <TheHero title="selectionCountTitle" :subtitle="['selectionCountSubtitle']" />
    <div class="buttons flex-grow flex-column overflow-auto">
      <div class="flex-row">
        <ButtonMDI class="width-third" :class="{ 'single-2': isDifficultySelected(1) }" color="green"
                      text="difficulty1" @click="setDifficulty(1)">
          <MDIIconSpeedometerSlow :class="getSizeClass('general')" />
        </ButtonMDI>
        <ButtonMDI class="width-third" :class="{ 'single-2': isDifficultySelected(2) }" color="yellow"
                   text="difficulty2" @click="setDifficulty(2)">
          <MDIIconSpeedometerMedium :class="getSizeClass('general')" />
        </ButtonMDI>
        <ButtonMDI class="width-third" :class="{ 'single-2': isDifficultySelected(3) }" color="red"
                   text="difficulty3" @click="setDifficulty(3)">
          <MDIIconSpeedometer :class="getSizeClass('general')" />
        </ButtonMDI>
      </div>
      <div class="flex-row flex-wrap">
        <ButtonText class="width-third" :class="{ 'single-2': isWordCountSelected(wordCount) }"
                    v-for="wordCount in availableWordCounts" color="action" :text="wordCount" :key="wordCount"
                    @click="setWordCount(wordCount)" />
        <ButtonText v-show="!inputVisible" class="width-full" :class="{ 'single-2': isCustomCountSet }" color="action"
                    :text="customCountText" @click="showInput()" />
        <InputWithButton v-if="inputVisible" class="width-full" v-model="customCount" type="number" color-input="action"
                         color-button="green" icon-input="pen" icon-button="check" :maxlength="4" @click="hideInput()" />
        <ButtonText class="width-full" :class="{ 'single-2': isWordCountSelected(allWordsCount) }" color="action"
                    text="selectionCountAll" @click="setWordCount(allWordsCount)" />
      </div>
      <ButtonBasic class="width-full" :class="{ 'single-2': appDyn.reversedType }" icon="sync-alt"
                   color="action" text="selectionCountReverse" @click="toggleWordsReversed()" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="selectionButton2"
                   @click="navTo('category', 'adventure')" />
      <ButtonBasic class="width-half" icon="check" color="green" text="selectionButton1" @click="navTo('adventure')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="selectionCountNotificationTitle"
                       :text="['selectionCountNotificationText']" color="red" icon="exclamation"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import ButtonMDI from '@/components/ButtonMDI.vue'
import MDIIconSpeedometerSlow from '@/components/MDIIconSpeedometerSlow.vue'
import MDIIconSpeedometerMedium from '@/components/MDIIconSpeedometerMedium.vue'
import MDIIconSpeedometer from '@/components/MDIIconSpeedometer.vue'
import ButtonText from '@/components/ButtonText.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import { useAppDynStore } from '@/stores/appdyn'
import { useAppConstStore } from '@/stores/appconst'

const router = useRouter()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()

onBeforeMount(() => {
  if (appDyn.categoriesChosen.length === 0) {
    navTo('category', 'adventure')
  }
})

onMounted(() => {
  let wordCount = appDyn.wordCount
  if (!availableWordCounts.includes(wordCount) && wordCount !== 0 && wordCount !== allWordsCount.value) {
    customCount.value = wordCount.toString()
  }
})

function isDifficultySelected (difficulty) {
  return appDyn.wordDifficulty === difficulty
}

function setDifficulty (difficulty) {
  appDyn.wordDifficulty = difficulty
  hideNotification()
}

const availableWordCounts = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200]
const customCount = ref('')
const inputVisible = ref(false)

const isCustomCountSet = computed(() => {
  return customCount.value !== ''
})

const customCountText = computed(() => {
  return isCustomCountSet.value ? customCount.value : 'selectionCountCustom'
})

const allWordsCount = computed(() => {
  return appConst.getFullVocabs().words.length
})

function isWordCountSelected (wordCount) {
  if (isCustomCountSet.value) {
    return false
  }
  return appDyn.wordCount === wordCount
}

function setWordCount (wordCount) {
  appDyn.wordCount = wordCount
  customCount.value = ''
  hideNotification()
}

function showInput () {
  inputVisible.value = true
}

function hideInput () {
  inputVisible.value = false
  if (isCustomCountSet.value) {
    if (parseInt(customCount.value) > 9001) { // it's over 9000
      customCount.value = '9001'
    }
    appDyn.wordCount = parseInt(customCount.value)
  } else {
    if (!availableWordCounts.includes(appDyn.wordCount)) {
      appDyn.wordCount = 10
    }
  }
}

function toggleWordsReversed () {
  appDyn.reversedType = !appDyn.reversedType
}

const notificationVisible = ref(false)

function showNotification () {
  notificationVisible.value = true
}

function hideNotification () {
  notificationVisible.value = false
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function navTo (name, params = '') {
  switch (name) {
    case 'category':
      router.push({ name: name, params: { destination: params } })
      break
    case 'adventure':
      if (appConst.getFullVocabs().words.length === 0) {
        showNotification()
      } else {
        router.push({ name: name })
      }
      break
    default:
  }
}
</script>

<style lang="scss" scoped>
.buttons {
  justify-content: space-between;
}
</style>
