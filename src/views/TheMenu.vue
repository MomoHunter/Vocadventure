<template>
  <div class="page">
    <TheHero title="menuTitle" :subtitle="subtitleText" />
    <div class="menu-button-container width-full relative" :class="getSizeClass('general')">
      <div class="width-full absolute">
        <transition :enter-active-class="trainingAnimation.enter"
                    :leave-active-class="trainingAnimation.leave">
          <ButtonBasic v-show="isVisible(1)" class="menu width-half" color="info" icon="book" text="menuButton1"
                       @click="navTo('menu', 'training')" :disabled="buttonsDisabled" />
        </transition>
        <transition :enter-active-class="adventureAnimation.enter"
                    :leave-active-class="adventureAnimation.leave">
          <ButtonBasic v-show="isVisible(1)" class="menu width-half" color="green" icon="gem" text="menuButton2"
                       @click="navTo('menu', 'adventure')" :disabled="buttonsDisabled" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(1)" class="menu width-full" color="settings" icon="cog" text="menuButton3"
                       @click="navTo('settings')" :disabled="buttonsDisabled" />
        </transition>
      </div>
      <div class="width-full absolute">
        <transition enter-active-class="invisible duration-c-700ms"
                    leave-active-class="disappear duration-c-700ms">
          <ButtonBasic v-show="isVisible(2)" class="menu width-half" color="info" icon="book"
                       text="menuTrainingButton1" @click="navTo('category', 'training')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(2) && isJapanese" class="menu width-half" color="info-2" icon="pen"
                       text="menuTrainingButton2" @click="navTo('category', 'writeKanji')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(2) && isJapanese" class="menu width-half" color="red" icon="arrow-left"
                       text="menuTrainingButton3" @click="navTo('menu')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(2)" class="menu width-half" color="green-light" icon="search"
                       text="menuTrainingButton4" @click="navTo('dictionary')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(2) && !isJapanese" class="menu width-full" color="red" icon="arrow-left"
                       text="menuTrainingButton3" @click="navTo('menu')" />
        </transition>
      </div>
      <div class="width-full absolute">
        <transition enter-active-class="invisible duration-c-700ms"
                    leave-active-class="animate__animated animate__slideOutRight duration-c-700ms">
          <ButtonBasic v-show="isVisible(3)" class="menu width-half" color="green" icon="gem"
                       text="menuAdventureButton1" @click="navTo('category', 'adventure')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(3)" class="menu width-half" color="yellow" icon="award"
                       text="menuAdventureButton2" @click="navTo('achievements')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(3)" class="menu width-full" color="red" icon="arrow-left"
                       text="menuAdventureButton3" @click="navTo('menu')" />
        </transition>
      </div>
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms"
                @after-leave="resetNotification()">
      <NotificationBasic v-show="notificationVisible" title="menuNotificationTitle" :text="updateText"
                         :color="updateColor" :icon="updateIcon" :spin="updateIcon === 'cog'"
                         @click="hideNotification()" />
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppDynStore } from '@/stores/appdyn'
import { useAppConstStore } from '@/stores/appconst'

const route = useRoute()
const router = useRouter()
const savestate = useSavestateStore()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()

onMounted(() => {
  if (updateText.value[0] !== '') {
    showNotification()
  }
})

const subtitleText = computed(() => {
  return ['menuSubtitle', savestate.app.targetLanguage]
})
const buttonsDisabled = computed(() => {
  return appDyn.newUpdate && savestate.app.missedUpdates
})
const isJapanese = computed(() => {
  return savestate.app.targetLanguage === 'japanese'
})

const trainingAnimation = reactive({
  enter: '',
  leave: ''
})
const adventureAnimation = reactive({
  enter: '',
  leave: ''
})
watch(
  () => route.query.sub || '',
  (to, from) => {
    trainingAnimation.enter = from === 'adventure' ?
      'animate__animated animate__fadeIn duration-c-350ms delay-c-350ms' :
      'invisible duration-c-700ms'
    trainingAnimation.leave = to === 'adventure' ?
      'fade-out-custom duration-c-700ms':
      'disappear duration-c-700ms'
    adventureAnimation.enter = from === 'training' ?
      'animate__animated animate__fadeIn duration-c-350ms delay-c-350ms' :
      'invisible duration-c-700ms'
    adventureAnimation.leave = to === 'training' ?
      'animate__animated animate__fadeOut duration-c-350ms' :
      'animate__animated animate__slideOutLeft duration-c-700ms'
  }
)

function navTo (name, additional = '') {
  switch (name) {
    case 'menu':
      if (additional === '') {
        router.push({ name: name })
      } else {
        router.push({ name: name, query: { sub: additional } })
      }
      break
    case 'category':
      router.push({ name: name, params: { destination: additional } })
      break
    default:
      router.push({ name: name })
  }
}

const notificationVisible = ref(false)
const blockNotificationReset = ref(false)

const updateText = computed(() => {
  if (appDyn.updateFinished) {
    return ['menuNotificationUpdateFinished']
  } else if (appDyn.newUpdate) {
    return ['menuNotificationNewUpdate']
  } else if (appDyn.updatesWillInstall) {
    return ['menuNotificationUpdatesWillInstall']
  } else if (appDyn.updateAvailable) {
    return ['menuNotificationUpdateAvailable']
  } else if (appDyn.updateSuccess) {
    return ['menuNotificationUpdateSuccess']
  }
  return ['']
})
watch(
  () => updateText.value,
  (to, from) => {
    if (to[0] !== '') {
      if (from[0] !== '' && !notificationVisible.value) {
        blockNotificationReset.value = true
      }
      showNotification()
    }
  }
)

const updateColor = computed(() => {
  if (appDyn.updateAvailable || appDyn.updatesWillInstall) {
    return 'yellow'
  }
  return 'green'
})

const updateIcon = computed(() => {
  if (appDyn.updateFinished || appDyn.updateSuccess) {
    return 'check-square'
  } else if (appDyn.updateAvailable || appDyn.updatesWillInstall) {
    return 'info'
  }
  return 'cog'
})

function showNotification () {
  notificationVisible.value = true
}

function hideNotification () {
  notificationVisible.value = false
}

function resetNotification () {
  if (!blockNotificationReset.value) {
    appDyn.resetSWNotifications()
  } else {
    blockNotificationReset.value = false
  }
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function isVisible (page) {
  switch (page) {
    case 1: // main
      return !route.query.sub
    case 2: // training
      return route.query.sub === 'training'
    case 3: // adventure
      return route.query.sub === 'adventure'
    default:
      return false
  }
}
</script>

<style lang="scss" scoped>
.page {
  justify-content: space-evenly;
}
</style>
