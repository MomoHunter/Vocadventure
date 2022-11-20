<template>
  <div class="page">
    <TheHero title="packagesTitle" :subtitle="subtitle" />
    <div class="action-container">
      <ButtonBasic class="width-half" icon="download" color="action" text="packagesButton1"
                   @click="switchMode('download')" />
      <ButtonUpload class="width-half" icon="upload" color="action" text="packagesButton2"
                    @change="processFiles($event)" />
    </div>
    <div class="flex-grow overflow-auto">
      <PackageListEntry v-for="(wordpack, index) in appConst.vocabulary" :wordpack="wordpack" :mode="mode"
                        :is-active-list="activeList" @toggle="handleEntryToggle(wordpack, $event)"
                        @click="navTo('edit', appConst.getWordpackKey(wordpack))" :key="index" />
    </div>
    <div v-show="mode !== 'standard'" class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="packagesButton5" @click="switchMode('standard')" />
      <ButtonBasic class="width-half" icon="check" color="green" text="packagesButton6"
                   @click="showModal()" :disabled="selectedWordpacks.length === 0" />
    </div>
    <div class="button-container flex-row flex-wrap">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="packagesButton3" @click="navTo('back')" />
      <ButtonBasic class="width-half" icon="plus" color="green" text="packagesButton4"
                   @click="navTo('edit', getNewWordpackKey())" />
      <ButtonBasic class="width-full" icon="trash" color="red" text="packagesButton7" @click="switchMode('delete')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="packagesNotificationTitle"
                         :text="['packagesNotificationText', supportedLanguages]" color="red" icon="exclamation"
                         @click="hideNotification()" />
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonUpload from '@/components/ButtonUpload.vue'
import PackageListEntry from '@/components/PackageListEntry.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppDynStore } from '@/stores/appdyn'
import { useAppConstStore } from '@/stores/appconst'
import { useIndexedDBStore } from '@/stores/indexeddb'

const router = useRouter()
const savestate = useSavestateStore()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()
const indexedDBStore = useIndexedDBStore()

const mode = ref('standard')

function switchMode (newMode) {
  if (mode.value !== newMode) {
    mode.value = newMode
    selectedWordpacks.value = []
  }
}

function getNewWordpackKey () {
  return 'c_' + appConst.vocabulary.reduce((maxIndex, wordpack) => {
    if (wordpack.isCustom) {
      return wordpack.index >= maxIndex ? wordpack.index + 1 : maxIndex
    }
    return maxIndex
  }, 1).toString()
}

const selectedWordpacks = ref([])
const activeList = computed(() => {
  switch (mode.value) {
    case 'download':
    case 'delete':
      return selectedWordpacks.value
    default:
      return savestate.app.activeWordpacks
  }
})

function processFiles (files) {
  let newFirstIndex = appConst.vocabulary.reduce((maxIndex, wordpack) => {
    if (wordpack.isCustom) {
      return wordpack.index >= maxIndex ? wordpack.index + 1 : maxIndex
    }
    return maxIndex
  }, 1)

  for (let i = 0; i < files.length; i++) {
    getFile(files[i], newFirstIndex + i)
  }
}

function getFile (file, index) {
  const fileReader = new FileReader()
  fileReader.addEventListener('load', event => {
    let loadedWordpack = JSON.parse(event.target.result)
    loadedWordpack.isCustom = true
    loadedWordpack.index = index

    indexedDBStore.saveEntry({ name: 'wordpackdb', store: 'wordpacks', entry: loadedWordpack })
    handleEntryToggle(loadedWordpack, true)
  })
  fileReader.readAsText(file)
}

function downloadWordpack (wordpack) {
  let element = document.createElement('a')
  let file = new Blob([JSON.stringify(wordpack)], { type: 'application/json' })
  element.href = URL.createObjectURL(file)
  element.download = wordpack.name.toLowerCase().trim().replace(/ /g, '_') + '-wordpack.json'
  element.click()
}

function handleEntryToggle (wordpack, bool) {
  switch (mode.value) {
    case 'download':
      if (bool) {
        if (selectedWordpacks.value.length === 1) {
          selectedWordpacks.value = []
        }
        selectedWordpacks.value.push(appConst.getWordpackKey(wordpack))
      } else {
        selectedWordpacks.value = selectedWordpacks.value.filter(key => key !== appConst.getWordpackKey(wordpack))
      }
      break
    case 'delete':
      if (bool) {
        selectedWordpacks.value.push(appConst.getWordpackKey(wordpack))
      } else {
        selectedWordpacks.value = selectedWordpacks.value.filter(key => key !== appConst.getWordpackKey(wordpack))
      }
      break
    default:
      if (bool) {
        if (!savestate.app.activeWordpacks.includes(appConst.getWordpackKey(wordpack))) {
          savestate.app.activeWordpacks.push(appConst.getWordpackKey(wordpack))
        }
      } else {
        savestate.app.activeWordpacks = savestate.app.activeWordpacks.filter(
          (key) => key !== appConst.getWordpackKey(wordpack)
        )
      }
  }
}

const subtitle = computed(() => {
  switch (mode.value) {
    case 'download':
      return ['packagesSubtitleDownload']
    case 'delete':
      return ['packagesSubtitleDelete']
    default:
      return ['']
  }
})

function showModal () {
  switch (mode.value) {
    case 'download':
      for (let key of selectedWordpacks.value) {
        downloadWordpack(appConst.getWordpack(key))
      }
      switchMode('standard')
      break
    case 'delete':
      appDyn.activeModal = {
        name: 'message',
        title: 'packagesModalTitle',
        text: [
          'packagesModalText',
          selectedWordpacks.value.map((key) => {
            let wordpack = appConst.getWordpack(key, false)
            if (wordpack) {
              return `<li>[${wordpack.tag}] ${wordpack.name}</li>`
            }
            return ''
          }).join('')
        ],
        buttons: [
          {
            icon: 'times',
            text: 'packagesModalButton1',
            color: 'red'
          },
          {
            icon: 'check',
            text: 'packagesModalButton2',
            color: 'green'
          }
        ]
      }
      break
    default:
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
        for (let key of selectedWordpacks.value) {
          indexedDBStore.deleteEntry({ name: 'wordpackdb', store: 'wordpacks', entry: appConst.getWordpack(key) })
        }
        savestate.saveData()
        appDyn.activeModal = null
        switchMode('standard')
        break
      default:
    }
  }
)

const supportedLanguages = ref('')
const notificationVisible = ref(false)

function showNotification () {
  notificationVisible.value = true
}

function hideNotification () {
  notificationVisible.value = false
}

function getText (id) {
  return appConst.getText(id)
}

function navTo (destination = '', wordpackKey = '') {
  if (destination === 'edit') {
    let wordpack = appConst.getWordpack(wordpackKey)
    if (!wordpack || wordpack.supportedLanguages.includes(savestate.app.lang)) {
      appDyn.packages.wordpackKey = wordpackKey
      router.push({ name: 'packagesEdit' })
    } else {
      supportedLanguages.value = wordpack.supportedLanguages.map((lang) => {
        return `<li>${getText(lang)}</li>`
      }).join('')
      showNotification()
    }
  } else { // back
    savestate.saveData()
    switch (appDyn.packagesDestination) {
      case 'adventure':
      case 'training':
      case 'writeKanji':
        router.push({ name: 'category', params: { destination: appDyn.packagesDestination } })
        appDyn.packagesDestination = ''
        break
      default:
        if (appDyn.packagesDestination !== '') {
          router.push({ name: appDyn.packagesDestination })
        } else {
          router.push({ name: 'menu' })
        }
    }
  }
}
</script>
