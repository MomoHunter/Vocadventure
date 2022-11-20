<template>
  <div class="page">
    <TheHero :title="title" :subtitle="categoryName" />
    <div class="flex-grow overflow-auto padding-top-medium">
      <div class="flex-row margin-bottom-medium">
        <ButtonMDI class="width-third" :class="{ 'single-2': difficultySelected(1) }" color="green" text="difficulty1"
                   @click="setDifficulty(1)">
          <MDIIconSpeedometerSlow />
        </ButtonMDI>
        <ButtonMDI class="width-third" :class="{ 'single-2': difficultySelected(2) }" color="yellow" text="difficulty2"
                   @click="setDifficulty(2)">
          <MDIIconSpeedometerMedium />
        </ButtonMDI>
        <ButtonMDI class="width-third" :class="{ 'single-2': difficultySelected(3) }" color="red" text="difficulty3"
                   @click="setDifficulty(3)">
          <MDIIconSpeedometer />
        </ButtonMDI>
      </div>
      <InputBasic class="border-bottom margin-bottom-medium" v-for="lang in supportedLanguages" :title="lang"
                  type="text" icon="font" v-model="newWordData.languageTranslations[lang]" no-focus :key="lang"
                  @click="hideNotification()" />
      <InputBasic class="border-bottom margin-bottom-medium" :title="targetLanguageData.latinAlphabet"
                  type="text" icon="globe" v-model="newWordData.latinAlphabet" no-focus @click="hideNotification()" />
      <InputBasic v-show="targetLanguageData.foreignAlphabet !== ''" class="border-bottom margin-bottom-medium"
                  :title="targetLanguageData.foreignAlphabet" type="text" icon="globe"
                  v-model="newWordData.foreignAlphabet" no-focus @click="hideNotification()" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="packagesEditWordButton2"
                   @click="navTo('packagesEditCategories')" />
      <ButtonBasic class="width-half" icon="check" color="green" text="packagesEditWordButton1" @click="saveWord()" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="packagesEditWordNotificationTitle"
                       :text="['packagesEditWordNotificationText']" color="red" icon="exclamation"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import InputBasic from '@/components/InputBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonMDI from '@/components/ButtonMDI.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import MDIIconSpeedometerSlow from '@/components/MDIIconSpeedometerSlow.vue'
import MDIIconSpeedometerMedium from '@/components/MDIIconSpeedometerMedium.vue'
import MDIIconSpeedometer from '@/components/MDIIconSpeedometer.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppDynStore } from '@/stores/appdyn'
import { useAppConstStore } from '@/stores/appconst'

const router = useRouter()
const savestate = useSavestateStore()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()

onBeforeRouteLeave((to, from) => {
  appDyn.packages.wordIndex = -1
})

onBeforeMount(() => {
  if (!appDyn.packages.wordpack) {
    navTo('packages')
    return
  }
  if (appDyn.packages.wordIndex >= 0) {
    const wordData = appDyn.packages.wordpack.categories.find(
      category => category.index === appDyn.packages.categoryIndex
    ).words[appDyn.packages.wordIndex]
    newWordData.difficulty = wordData.difficulty
    for (let lang of supportedLanguages.value) {
      newWordData.languageTranslations[lang] = wordData[lang]
    }
    newWordData.latinAlphabet = wordData[targetLanguageData.value.latinAlphabet]
    if (targetLanguageData.value.foreignAlphabet !== '') {
      newWordData.foreignAlphabet = wordData[targetLanguageData.value.foreignAlphabet]
    }
  } else {
    for (let lang of supportedLanguages.value) {
      newWordData.languageTranslations[lang] = ''
    }
  }
})

const title = computed(() => {
  if (appDyn.packages.wordIndex >= 0) {
    return 'packagesEditWordTitleEdit'
  }
  return 'packagesEditWordTitleNew'
})

const categoryName = computed(() => {
  const wordpack = appDyn.packages.wordpack
  if (wordpack) {
    let foundCategory = wordpack.categories.find(category =>
      category.index === appDyn.packages.categoryIndex
    )

    if (foundCategory) {
      return [foundCategory[savestate.app.lang]]
    }
  }
  return ['']
})

function difficultySelected (difficulty) {
  return newWordData.difficulty === difficulty
}

function setDifficulty (difficulty) {
  hideNotification()
  newWordData.difficulty = difficulty
}

const targetLanguageData = computed(() => {
  if (appDyn.packages.wordpack) {
    return appConst.targetLanguages[appDyn.packages.wordpack.targetLanguage]
  }
  return appConst.targetLanguages.japanese
})

const supportedLanguages = computed(() => {
  if (appDyn.packages.wordpack) {
    return appDyn.packages.wordpack.supportedLanguages
  }
  return []
})

const newWordData = reactive({
  latinAlphabet: '',
  foreignAlphabet: '',
  difficulty: 1,
  languageTranslations: {}
})

function saveWord () {
  let emptyField = false
  if (newWordData.latinAlphabet === '') {
    emptyField = true
  } else if (newWordData.foreignAlphabet === '' && targetLanguageData.value.foreignAlphabet !== '') {
    emptyField = true
  }
  for (let lang of supportedLanguages.value) {
    if (newWordData.languageTranslations[lang] === '') {
      emptyField = true
    }
  }
  if (emptyField) {
    showNotification()
    return
  }

  let wordObject = {
    difficulty: newWordData.difficulty
  }
  for (let lang of supportedLanguages.value) {
    wordObject[lang] = newWordData.languageTranslations[lang]
  }
  wordObject[targetLanguageData.value.latinAlphabet] = newWordData.latinAlphabet
  if (targetLanguageData.value.foreignAlphabet !== '') {
    wordObject[targetLanguageData.value.foreignAlphabet] = newWordData.foreignAlphabet
  }
  let category = appDyn.packages.wordpack.categories.find(category => category.index === appDyn.packages.categoryIndex)
  if (appDyn.packages.wordIndex >= 0) {
    category.words[appDyn.packages.wordIndex] = wordObject
  } else {
    category.words.push(wordObject)
  }
  navTo('packagesEditCategories')
  appDyn.packages.changed = true
}

const notificationVisible = ref(false)

function showNotification () {
  notificationVisible.value = true
}

function hideNotification () {
  notificationVisible.value = false
}

function navTo (destination) {
  router.push({ name: destination })
}
</script>
