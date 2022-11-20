<template>
  <div class="page">
    <TheHero title="settingsTitle" />
    <div class="flex-grow overflow-auto">
      <DropdownBasic class="single margin-bottom-medium margin-top-medium" title="settingsLanguage" icon="globe"
                     :options="languages" :selected="savestate.app.lang" @change="changeValue('newLanguage', $event)" />
      <DropdownBasic class="single margin-bottom-medium" title="settingsTargetLanguage" icon="user-graduate"
                     :options="targetLanguages" :selected="savestate.app.targetLanguage"
                     @change="changeValue('newTargetLanguage', $event)" />
      <DropdownBasic class="single margin-bottom-medium" title="settingsTheme" icon="palette" :options="themes"
                     :selected="savestate.app.theme" @change="changeValue('newTheme', $event)" />
      <DropdownBasic class="single margin-bottom-medium" title="settingsSize" icon="expand-arrows-alt" :options="sizes"
                     :selected="savestate.app.size" @change="changeValue('newSize', $event)" />
      <TheSlider class="margin-bottom-medium border-bottom-2" title="settingsViewport" :min="0.5" :max="1.2" :step="0.05"
                 v-model="state.newViewport" icon="glasses" />
      <TheSlider class="margin-bottom-medium border-bottom-2" title="settingsVolume" :min="0" :max="100" :step="1"
                 v-model="state.newVolume" icon="volume-up" />
      <TheCheckbox class="border-bottom-2 margin-bottom-medium" title="settingsUpdateTitle" icon="download"
                   text="settingsUpdate" :active="state.newAllowUpdates"
                   @click="changeValue('newAllowUpdates', !state.newAllowUpdates)" />
      <ButtonBasic class="single-2 width-full margin-bottom-large" color="info" icon="tasks"
                   text="settingsButtonWordpacks" @click="navTo('packages')" />
      <ButtonBasic class="single-2 width-full margin-bottom-large" color="info-2" icon="rectangle-list"
                   text="settingsButtonCredits" @click="navTo('credits')" />
      <ButtonBasic class="single-2 width-full margin-bottom-medium" color="red" icon="trash" text="settingsButtonDelete"
                   @click="showModal()" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" color="red" icon="arrow-left" text="settingsButton2"
                   @click="navTo('menu')" />
      <ButtonBasic class="width-half" color="green" icon="check" text="settingsButton1"
                   @click="submitChanges()" />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import TheSlider from '@/components/TheSlider.vue'
import TheCheckbox from '@/components/TheCheckbox.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppConstStore } from '@/stores/appconst'
import { useIndexedDBStore } from '@/stores/indexeddb'
import { useAppDynStore } from '@/stores/appdyn'

const router = useRouter()
const savestate = useSavestateStore()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()
const indexedDBStore = useIndexedDBStore()

const state = reactive({
  newLanguage: savestate.app.lang,
  newTargetLanguage: savestate.app.targetLanguage,
  newTheme: savestate.app.theme,
  newSize: savestate.app.size,
  newViewport: savestate.app.viewport,
  newVolume: savestate.app.volume,
  newAllowUpdates: savestate.app.allowUpdates
})

const languages = computed(() => {
  return Object.keys(appConst.texts)
})
const targetLanguages = computed(() => {
  return Object.keys(appConst.targetLanguages)
})
const themes = computed(() => {
  return Object.keys(appConst.themes)
})
const sizes = computed(() => {
  return Object.keys(appConst.sizeClasses.general)
})

function changeValue (type, value) {
  state[type] = value
}

function submitChanges () {
  savestate.app.lang = state.newLanguage
  savestate.app.targetLanguage = state.newTargetLanguage
  savestate.changeTheme(state.newTheme)
  savestate.app.size = state.newSize
  savestate.changeViewport(state.newViewport)
  savestate.app.volume = state.newVolume
  savestate.changeAllowUpdates(state.newAllowUpdates)
  indexedDBStore.saveEntry({
    name: 'updatedb',
    store: 'allow',
    entry: {
      index: 1,
      value: state.newAllowUpdates
    }
  })
  savestate.saveData()
  navTo('menu')
}

function showModal () {
  appDyn.activeModal = { name: 'areYouSure' }
}

function navTo (name) {
  switch (name) {
    case 'packages':
      appDyn.packagesDestination = 'settings'
      break
    default:
  }
  router.push({ name: name })
}
</script>
