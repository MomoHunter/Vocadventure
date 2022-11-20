<template>
  <div class="page">
    <TheHero title="packagesEditTitle" />
    <div class="flex-grow overflow-auto">
      <InputBasic class="border-bottom margin-top-medium margin-bottom-medium" v-model="wordpack.tag"
                  title="packagesEditTag" type="text" icon="tag" :maxlength="3" no-focus />
      <InputBasic class="border-bottom margin-bottom-medium" v-model="wordpack.name" title="packagesEditName"
                  type="text" icon="font" no-focus />
      <DropdownBasic class="border-bottom margin-bottom-medium" title="packagesEditTargetLanguage"
                     :options="targetLanguageOptions" icon="user-graduate" :selected="wordpack.targetLanguage"
                     @change="setTargetLanguage($event)" />
      <TheCheckbox class="border-bottom margin-bottom-medium" v-for="key in Object.keys(appConst.texts)"
                     title="packagesEditSupportedLanguages" icon="globe" :text="key"
                     :active="wordpack.supportedLanguages.includes(key)" :key="key" @click="toggleSupportedLang(key)" />
    </div>
    <div class="button-container flex-row flex-wrap">
      <ButtonBasic class="width-half" icon="times" color="red" text="packagesEditButton2"
                   @click="checkForChanges(true)" />
      <ButtonBasic class="width-half" icon="check" color="green" text="packagesEditButton3"
                   @click="navTo('packages', true)" />
      <ButtonBasic class="width-full" icon="list" color="info" text="packagesEditButton1"
                   @click="navTo('packagesEditCategories')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="packagesEditNotificationTitle"
                         :text="['packagesEditNotificationText']" color="red" icon="exclamation"
                         @click="hideNotification()" />
    </transition>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch, computed } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import InputBasic from '@/components/InputBasic.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import TheCheckbox from '@/components/TheCheckbox.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import { useAppDynStore } from '@/stores/appdyn'
import { useAppConstStore } from '@/stores/appconst'
import { useIndexedDBStore } from '@/stores/indexeddb'

const router = useRouter()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()
const indexedDBStore = useIndexedDBStore()

onBeforeRouteLeave((to, from) => {
  if (to.name === 'packages') {
    if (appDyn.packages.wordpackKey === '') {
      return
    }

    checkForChanges()
    if (appDyn.activeModal === null && appDyn.packages.changed) {
      showModal()
      return false
    } else {
      appDyn.activeModal = null
      appDyn.packages.wordpackKey = ''
      appDyn.packages.wordpack = null
      appDyn.packages.changed = false
    }
  }
  return
})

onBeforeMount(() => {
  if (appDyn.packages.wordpackKey === '') {
    navTo('packages')
    return
  }

  let foundWordpack = null
  if (appDyn.packages.wordpack) {
    foundWordpack = JSON.parse(JSON.stringify(appDyn.packages.wordpack))
  } else if (currentWordpack.value) {
    foundWordpack = currentWordpack.value
  }

  if (foundWordpack) {
    if (!foundWordpack.isCustom) {
      wordpack.index = getNewIndex()
    } else {
      wordpack.index = foundWordpack.index
    }
    wordpack.tag = foundWordpack.tag
    wordpack.name = foundWordpack.name
    wordpack.targetLanguage = foundWordpack.targetLanguage
    wordpack.supportedLanguages = Array.from(foundWordpack.supportedLanguages)
    wordpack.categories = foundWordpack.categories
  } else {
    wordpack.index = parseInt(appDyn.packages.wordpackKey.split('_')[1])
  }
})

function getNewIndex () {
  return appConst.vocabulary.reduce((maxIndex, wordpack) => {
    if (wordpack.isCustom) {
      return wordpack.index >= maxIndex ? wordpack.index + 1 : maxIndex
    }
    return maxIndex
  }, 1)
}

function showModal () {
  appDyn.activeModal = {
    name: 'message',
    title: 'packagesEditModalTitle',
    text: ['packagesEditModalText'],
    buttons: [
      {
        icon: 'times',
        text: 'packagesEditModalButton1',
        color: 'red'
      },
      {
        icon: 'check',
        text: 'packagesEditModalButton2',
        color: 'green'
      }
    ]
  }
}

watch(
  () => appDyn.modalAnswer,
  (newAnswer) => {
    switch (newAnswer) {
      case 'button1':
        appDyn.activeModal = null
        break
      case 'button2':
        navTo('packages')
        break
      default:
    }
  }
)

const wordpack = reactive({
  index: 1,
  tag: '',
  name: '',
  targetLanguage: 'japanese',
  supportedLanguages: [],
  isCustom: true,
  categories: []
})
const currentWordpack = computed(() => {
  return appConst.getWordpack(appDyn.packages.wordpackKey)
})

const targetLanguageOptions = computed(() => {
  return Object.keys(appConst.targetLanguages)
})

function setTargetLanguage (newTargetLanguage) {
  wordpack.targetLanguage = newTargetLanguage
}

function toggleSupportedLang (newLang) {
  if (wordpack.supportedLanguages.includes(newLang)) {
    wordpack.supportedLanguages = wordpack.supportedLanguages.filter(language => language !== newLang)
  } else {
    wordpack.supportedLanguages.push(newLang)
  }
  hideNotification()
}

function checkForChanges (navigation = false) {
  let changed = false

  if (currentWordpack.value) {
    if (wordpack.tag !== currentWordpack.value.tag || wordpack.name !== currentWordpack.value.name ||
        wordpack.targetLanguage !== currentWordpack.value.targetLanguage ||
        wordpack.supportedLanguages.length !== currentWordpack.value.supportedLanguages.length) {
      changed = true
    }
    for (let lang of currentWordpack.value.supportedLanguages) {
      if (!wordpack.supportedLanguages.includes(lang)) {
        changed = true
        break
      }
    }
  }

  if (changed) {
    appDyn.packages.changed = true
  }

  if (navigation) {
    navTo('packages')
  }
}

const notificationVisible = ref(false)

function showNotification () {
  notificationVisible.value = true
}

function hideNotification () {
  notificationVisible.value = false
}

function navTo (destination, saving = false) {
  switch (destination) {
    case 'packagesEditCategories':
      appDyn.packages.wordpack = wordpack
      router.push({ name: destination })
      break
    case 'packages':
      if (saving) {
        if (wordpack.tag === '' || wordpack.name === '' || wordpack.supportedLanguages.length === 0) {
          showNotification()
        } else {
          if (!appDyn.packages.wordpackKey.startsWith('s')) {
            appConst.deleteWordpack(appDyn.packages.wordpackKey, false)
          }
          indexedDBStore.saveEntry({ name: 'wordpackdb', store: 'wordpacks', entry: wordpack })
          appDyn.packages.wordpackKey = ''
          appDyn.packages.wordpack = null
          router.push({ name: destination })
        }
      } else {
        router.push({ name: destination })
      }
      break
    default:
  }
}
</script>
