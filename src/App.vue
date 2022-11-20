<template>
  <div class="height-full flex-column">
    <TheStatus :status="savestate.app.status" @click="toggleCalendar()" />
    <div class="flex-grow width-full relative">
      <router-view v-slot="{ Component }">
        <transition :enter-active-class="enterTransition" :leave-active-class="leaveTransition"
                    @after-enter="toggleTransitionActive(true)" @before-enter="toggleTransitionActive(false)">
          <component :is="Component" />
        </transition>
      </router-view>
      <TheCalendar :visible="calendarVisible" @click="toggleCalendar()" />
    </div>
    <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
      <ModalAreYouSure v-show="modalName === 'areYouSure'" />
    </transition>
    <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                leave-active-class="animate__animated animate__fadeOut duration-c-350ms"
                @after-leave="setModalAnswer('')">
      <ModalMessage v-if="modalName === 'message'" :options="appDyn.activeModal"
                    @click="setModalAnswer($event)" />
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount, onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import TheStatus from '@/components/TheStatus.vue'
import TheCalendar from '@/components/TheCalendar.vue'
import ModalAreYouSure from '@/components/ModalAreYouSure.vue'
import ModalMessage from '@/components/ModalMessage.vue'

import { useSavestateStore } from './stores/savestate'
import { useIndexedDBStore } from './stores/indexeddb'
import { useAppDynStore } from './stores/appdyn'
import { useAppConstStore } from './stores/appconst'
import { useGameDynStore } from './stores/gamedyn'
import { useGameConstStore } from './stores/gameconst'

import { initStores } from '@/canvas/storeref.js'
import KanaVGs from '@/assets/kanji.svg'

const route = useRoute()
const savestate = useSavestateStore()
const indexedDBStore = useIndexedDBStore()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()
const gameDyn = useGameDynStore()
const gameConst = useGameConstStore()

onBeforeMount(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.onmessage = (event) => {
      if (event.data) {
        switch (event.data.type) {
          case 'newUpdate':
            appDyn.newUpdate = true
            savestate.saveData()
            break
          case 'updateFinished':
            if (savestate.app.missedUpdates && savestate.app.allowUpdates) {
              savestate.app.missedUpdates = false
              savestate.app.updateSuccessful = true
              savestate.saveData()
              location.reload()
            } else {
              savestate.app.updateSuccessful = true
              savestate.saveData()
              appDyn.updateFinished = true
            }
            break
          default:
        }
      }
    }
  }
  Snap.load(KanaVGs, (fragment) => {
    appConst.kanaSvg = fragment
    let spinner = document.getElementById('spinner')

    if (spinner && spinner.parentNode) {
      spinner.parentNode.removeChild(spinner)
    }
  })
})

onMounted(() => {
  if (window.screen.width * window.devicePixelRatio < 1150) {
    savestate.changeViewport(0.75)
  }

  savestate.loadData()
  indexedDBStore.getEntries({ name: 'wordpackdb', store: 'wordpacks' })
  gameConst.initSpritesheet()
  initStores(savestate, appDyn, appConst, gameDyn, gameConst)

  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration && !registration.waiting && savestate.app.allowUpdates && savestate.app.missedUpdates) {
        if (savestate.app.allowUpdates) {
          appDyn.newUpdate = true
        } else {
          appDyn.updateAvailable = true
          savestate.app.missedUpdates = true
        }
        setTimeout(() => {
          navigator.serviceWorker.controller.postMessage({
            type: 'update'
          })
        }, 3000)
      }
    })
  }
})

const enterTransition = ref('')
const leaveTransition = ref('')

watch(
  () => [route.name, route.meta.forward],
  (to, from) => {
    if (from[0] && to[0]) {
      let enterAnim = 'animate__slideInLeft'
      let leaveAnim = 'animate__slideOutRight'
      if (from[1].includes(to[0])) {
        enterAnim = 'animate__slideInRight'
        leaveAnim = 'animate__slideOutLeft'
      }
      enterTransition.value = `animate__animated ${enterAnim} duration-c-500ms delay-c-100ms`
      leaveTransition.value = `animate__animated ${leaveAnim} duration-c-500ms`
    }
  }
)

function toggleTransitionActive (isActive) {
  appDyn.transitionActive = isActive
}

const calendarVisible = ref(false)

function showCalendar () {
  calendarVisible.value = true
}

function hideCalendar () {
  calendarVisible.value = false
}

function toggleCalendar () {
  calendarVisible.value = !calendarVisible.value
}

const modalName = computed(() => {
  if (appDyn.activeModal !== null) {
    return appDyn.activeModal.name
  }
  return ''
})

function setModalAnswer (answer) {
  appDyn.modalAnswer = answer
}
</script>

<style lang="scss" src="@/assets/custom.scss"></style>
<style lang="css" src="@/assets/fontawesome/css/all.min.css"></style>