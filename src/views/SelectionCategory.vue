<template>
  <div class="page">
    <TheHero :title="destination" :subtitle="['selectionCategorySubtitle']" />
    <div v-show="!searchVisible && !sortVisible" class="action-container flex-row">
      <ButtonBasic class="width-full" color="action" :icon="sortIcon" text="categoryButton1" @click="showSort()" />
      <ButtonMDIIcon color="action" @click="removeAllCategories()">
        <MDIIconAnimationOutline :class="getSizeClass('general')" />
      </ButtonMDIIcon>
      <ButtonMDIIcon color="action" @click="addAllCategories()">
        <MDIIconExpandAll :class="getSizeClass('general')" />
      </ButtonMDIIcon>
      <ButtonBasic class="width-full" color="action" icon="search" text="categoryButton4" @click="showSearch()" />
    </div>
    <div v-show="sortVisible" class="action-container flex-row flex-center">
      <DropdownBasic class="width-full" :icon="sortIcon" color="action" :options="sorters" :selected="sorters[0]"
                     @change="sort($event)" />
      <ButtonIcon icon="times" color="red" @click="hideSort()" />
    </div>
    <div v-if="searchVisible" class="action-container">
      <InputWithButton class="width-full" type="text" icon-input="search" icon-button="times" color-input="action"
                       color-button="red" @click="hideSearch()" v-model="searchString" />
    </div>
    <div class="flex-column overflow-auto max-height flex-shrink" :class="{ 'border-bottom': !nothingSelected }">
      <div v-for="category in appDyn.categoriesChosen" class="flex-row" :key="category">
        <ButtonText class="single-1 flex-grow" color="selected" :text="appConst.getCategoryName(category)" />
        <ButtonIcon class="single-1" icon="times" color="red" @click="removeCategory(category)" />
      </div>
    </div>
    <div class="flex-grow flex-row overflow-auto">
      <div class="flex-column flex-grow">
        <ButtonText v-for="category in categoriesAvailable" class="single-1" color="info"
                    :text="category.name" @click="addCategory(category.key)" :key="category.key" />
      </div>
      <div v-if="hasInfo" class="flex-column">
        <ButtonText v-for="category in categoriesAvailable" class="single-1" color="info-2"
                    :text="getCategoryInfo(category.key)" @click="addCategory(category.key)" :key="category.key" />
      </div>
    </div>
    <div class="button-container flex-row flex-wrap">
      <ButtonBasic class="width-half" color="red" icon="arrow-left" text="categoryButton6" @click="navTo('menu')" />
      <ButtonBasic class="width-half" color="green" icon="check" text="categoryButton5" @click="navTo('next')" />
      <ButtonBasic class="width-full" color="info" icon="tasks" text="categoryButton7" @click="navTo('packages')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="selectionCategoryNotificationTitle"
                         :text="['selectionCategoryNotificationText']" color="red" icon="exclamation"
                         @click="hideNotification()" />
    </transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonMDIIcon from '@/components/ButtonMDIIcon.vue'
import MDIIconAnimationOutline from '@/components/MDIIconAnimationOutline.vue'
import MDIIconExpandAll from '@/components/MDIIconExpandAll.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import ButtonText from '@/components/ButtonText.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useSavestateStore } from '@/stores/savestate'
import { useAppConstStore } from '@/stores/appconst'
import { useAppDynStore } from '@/stores/appdyn'

const route = useRoute()
const router = useRouter()
const savestate = useSavestateStore()
const appConst = useAppConstStore()
const appDyn = useAppDynStore()

onBeforeRouteLeave((to, from) => {
  if (to.name === 'menu' || to.name === 'packages') {
    cleanUp.value = true
  }
})

const cleanUp = ref(false)

onBeforeUnmount(() => {
  if (cleanUp.value) {
    appDyn.categoriesChosen = []
    appDyn.wordDifficulty = 1
    appDyn.wordCount = 10
    appDyn.reversedType = false
  }
})

const searchVisible = ref(false)
const searchString = ref('')

function showSearch () {
  searchVisible.value = true
}

function hideSearch () {
  searchVisible.value = false
}

const sortVisible = ref(false)
const sortIcon = ref('sort')
const sortFunction = ref((a, b) => 0)
const sorters = [
  'sortStandard',
  'sortAlphAsc',
  'sortAlphDesc',
  'sortCountAsc',
  'sortCountDesc',
  'sortDiffAsc',
  'sortDiffDesc',
  'sortPlayedAsc',
  'sortPlayedDesc',
  'sortLastPlayedAsc',
  'sortLastPlayedDesc',
  'sortProficiencyAsc',
  'sortProficiencyDesc'
]
const sortType = ref(sorters[0])
const hasInfo = computed(() => {
  return !['sortStandard', 'sortAlphAsc', 'sortAlphDesc'].includes(sortType.value)
})

function showSort () {
  sortVisible.value = true
}

function hideSort () {
  sortVisible.value = false
}

function sort (type) {
  if (type.endsWith('Asc')) {
    sortIcon.value = 'sort-up'
  } else if (type.endsWith('Desc')) {
    sortIcon.value = 'sort-down'
  } else {
    sortIcon.value = 'sort'
  }

  switch (type) {
    case 'sortStandard':
      sortFunction.value = (a, b) => 0
      break
    case 'sortAlphAsc':
      sortFunction.value = (a, b) => {
        if (a.name > b.name) {
          return 1
        } else if (a.name < b.name) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortAlphDesc':
      sortFunction.value = (a, b) => {
        if (a.name < b.name) {
          return 1
        } else if (a.name > b.name) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortCountAsc':
      sortFunction.value = (a, b) => {
        if (appConst.getCategory(a.key).words.length > appConst.getCategory(b.key).words.length) {
          return 1
        } else if (appConst.getCategory(a.key).words.length < appConst.getCategory(b.key).words.length) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortCountDesc':
      sortFunction.value = (a, b) => {
        if (appConst.getCategory(a.key).words.length < appConst.getCategory(b.key).words.length) {
          return 1
        } else if (appConst.getCategory(a.key).words.length > appConst.getCategory(b.key).words.length) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortDiffAsc':
      sortFunction.value = (a, b) => {
        if (appConst.getCategoryDifficulty(a.key) > appConst.getCategoryDifficulty(b.key)) {
          return 1
        } else if (appConst.getCategoryDifficulty(a.key) < appConst.getCategoryDifficulty(b.key)) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortDiffDesc':
      sortFunction.value = (a, b) => {
        if (appConst.getCategoryDifficulty(a.key) < appConst.getCategoryDifficulty(b.key)) {
          return 1
        } else if (appConst.getCategoryDifficulty(a.key) > appConst.getCategoryDifficulty(b.key)) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortPlayedAsc':
      sortFunction.value = (a, b) => {
        if (savestate.getCategoryStats(a.key).count > savestate.getCategoryStats(b.key).count) {
          return 1
        } else if (savestate.getCategoryStats(a.key).count < savestate.getCategoryStats(b.key).count) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortPlayedDesc':
      sortFunction.value = (a, b) => {
        if (savestate.getCategoryStats(a.key).count < savestate.getCategoryStats(b.key).count) {
          return 1
        } else if (savestate.getCategoryStats(a.key).count > savestate.getCategoryStats(b.key).count) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortLastPlayedAsc':
      sortFunction.value = (a, b) => {
        if (savestate.getCategoryStats(a.key).lastPlayed > savestate.getCategoryStats(b.key).lastPlayed) {
          return 1
        } else if (savestate.getCategoryStats(a.key).lastPlayed < savestate.getCategoryStats(b.key).lastPlayed) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortLastPlayedDesc':
      sortFunction.value = (a, b) => {
        if (savestate.getCategoryStats(a.key).lastPlayed < savestate.getCategoryStats(b.key).lastPlayed) {
          return 1
        } else if (savestate.getCategoryStats(a.key).lastPlayed > savestate.getCategoryStats(b.key).lastPlayed) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortProficiencyAsc':
      sortFunction.value = (a, b) => {
        let proficiencyA = savestate.getCategoryStats(a.key).proficiency
        let proficiencyB = savestate.getCategoryStats(b.key).proficiency
        proficiencyA = proficiencyA.reduce((acc, prof) => acc + prof, 0) / Math.max(proficiencyA.length, 1)
        proficiencyB = proficiencyB.reduce((acc, prof) => acc + prof, 0) / Math.max(proficiencyB.length, 1)
        if (proficiencyA > proficiencyB) {
          return 1
        } else if (proficiencyA < proficiencyB) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortProficiencyDesc':
      sortFunction.value = (a, b) => {
        let proficiencyA = savestate.getCategoryStats(a.key).proficiency
        let proficiencyB = savestate.getCategoryStats(b.key).proficiency
        proficiencyA = proficiencyA.reduce((acc, prof) => acc + prof, 0) / Math.max(proficiencyA.length, 1)
        proficiencyB = proficiencyB.reduce((acc, prof) => acc + prof, 0) / Math.max(proficiencyB.length, 1)
        if (proficiencyA < proficiencyB) {
          return 1
        } else if (proficiencyA > proficiencyB) {
          return -1
        } else {
          return 0
        }
      }
      break
    default:
  }

  sortType.value = type
}

const nothingSelected = computed(() => {
  return appDyn.categoriesChosen.length === 0
})
const categoriesAvailable = computed(() => {
  let regex = new RegExp('.*' + searchString.value.toLowerCase().split('').join('.{0,3}') + '.*')
  return appConst.getAvailableCategories.filter((category) => {
    return !appDyn.categoriesChosen.includes(category.key) &&
      regex.test(category.name.toLowerCase())
  }).sort(sortFunction.value)
})

function removeAllCategories () {
  appDyn.categoriesChosen = []
}

function addAllCategories () {
  let regex = new RegExp('.*' + searchString.value.toLowerCase().split('').join('.{0,3}') + '.*')
  appDyn.categoriesChosen = appConst.getAvailableCategories.filter((category) => {
    return regex.test(category.name.toLowerCase())
  }).map(category => category.key)
  hideNotification()
}

function addCategory (key) {
  appDyn.categoriesChosen.push(key)
  hideNotification()
}

function removeCategory (key) {
  appDyn.categoriesChosen = appDyn.categoriesChosen.filter(category => category !== key)
}

function getCategoryInfo (key) {
  if (sortType.value.startsWith('sortCount')) {
    return appConst.getCategory(key).words.length.toLocaleString()
  } else if (sortType.value.startsWith('sortDiff')) {
    return appConst.getCategoryDifficulty(key).toFixed(2).toLocaleString()
  } else if (sortType.value.startsWith('sortPlayed')) {
    return savestate.getCategoryStats(key).count.toLocaleString()
  } else if (sortType.value.startsWith('sortProficiency')) {
    let proficiency = savestate.getCategoryStats(key).proficiency
    if (proficiency.length === 0) {
      return getText('selectionCategoryProficiencyNone')
    }
    let percent = proficiency.reduce((acc, prof) => acc + prof, 0) / Math.max(proficiency.length, 1) * 100
    return percent.toFixed(1).toLocaleString() + '%'
  } else if (sortType.value.startsWith('sortLastPlayed')) {
    const lastPlayed = savestate.getCategoryStats(key).lastPlayed
    if (lastPlayed === 0) {
      return getText('selectionCategoryLastPlayedNever')
    }
    
    const nowDate = new Date()
    const lastPlayedDate = new Date(lastPlayed)
    const now = parseInt(
      `${nowDate.getFullYear()}` +
      (nowDate.getMonth() >= 10 ? `${nowDate.getMonth()}` : `0${nowDate.getMonth()}`) +
      (nowDate.getDate() >= 10 ? `${nowDate.getDate()}` : `0${nowDate.getDate()}`) +
      (nowDate.getHours() >= 10 ? `${nowDate.getHours()}` : `0${nowDate.getHours()}`) +
      (nowDate.getMinutes() >= 10 ? `${nowDate.getMinutes()}` : `0${nowDate.getMinutes()}`) +
      (nowDate.getSeconds() >= 10 ? `${nowDate.getSeconds()}` : `0${nowDate.getSeconds()}`)
    )
    const lp = parseInt(
      `${lastPlayedDate.getFullYear()}` +
      (lastPlayedDate.getMonth() >= 10 ? `${lastPlayedDate.getMonth()}` : `0${lastPlayedDate.getMonth()}`) +
      (lastPlayedDate.getDate() >= 10 ? `${lastPlayedDate.getDate()}` : `0${lastPlayedDate.getDate()}`) +
      (lastPlayedDate.getHours() >= 10 ? `${lastPlayedDate.getHours()}` : `0${lastPlayedDate.getHours()}`) +
      (lastPlayedDate.getMinutes() >= 10 ? `${lastPlayedDate.getMinutes()}` : `0${lastPlayedDate.getMinutes()}`) +
      (lastPlayedDate.getSeconds() >= 10 ? `${lastPlayedDate.getSeconds()}` : `0${lastPlayedDate.getSeconds()}`)
    )

    if (now - lp >= 10_000_000_000) { // last played a year ago
      let amount =  Math.floor((now - lp) / 10_000_000_000).toLocaleString()
      if (amount === 1) {
        return getText('selectionCategoryLastPlayedYear', amount)
      }
      return getText('selectionCategoryLastPlayedYears', amount)
    } else if (now - lp >= 100_000_000) { // last played a month ago
      let amount = Math.floor((now - lp) / 100_000_000)
      if (nowDate.getFullYear() !== lastPlayedDate.getFullYear()) {
        amount -= 88
      }
      if (amount === 1) {
        return getText('selectionCategoryLastPlayedMonth', amount)
      }
      return getText('selectionCategoryLastPlayedMonths', amount)
    } else if (now - lp >= 1_000_000) { // last played a day ago
      let amount = Math.floor((now - lp) / 1_000_000)
      if (nowDate.getMonth() !== lastPlayedDate.getMonth() || nowDate.getFullYear() > lastPlayedDate.getFullYear()) {
        if ([0, 2, 4, 6, 7, 9, 11].includes(lastPlayedDate.getMonth())) { // month has 31 days
          amount -= 69 // nice
        } else if ([3, 5, 8, 10].includes(lastPlayedDate.getMonth())) { // month has 30 days
          amount -= 70
        } else if (lastPlayedDate.getMonth() === 1) { // is february
          if (new Date(lastPlayedDate.getFullYear(), 1, 29).getDate() === 29) { // is leap year
            amount -= 71
          } else {
            amount -= 72
          }
        }
      }
      if (amount === 1) {
        return getText('selectionCategoryLastPlayedDay', amount)
      }
      return getText('selectionCategoryLastPlayedDays', amount)
    } else if (now - lp >= 10_000) { // last played an hour ago
      let amount = Math.floor((now - lp) / 10_000)
      if (nowDate.getDate() !== lastPlayedDate.getDate() || nowDate.getMonth() > lastPlayedDate.getMonth()) {
        amount -= 76
      }
      if (amount === 1) {
        return getText('selectionCategoryLastPlayedHour', amount)
      }
      return getText('selectionCategoryLastPlayedHours', amount)
    } else if (now - lp >= 100) { // last played a minute ago
      let amount = Math.floor((now - lp) / 100)
      if (nowDate.getHours() !== lastPlayedDate.getHours() || nowDate.getDate() > lastPlayedDate.getDate()) {
        amount -= 40
      }
      if (amount === 1) {
        return getText('selectionCategoryLastPlayedMinute', amount)
      }
      return getText('selectionCategoryLastPlayedMinutes', amount)
    } else { // last played less than a minute ago
      return getText('selectionCategoryLastPlayedLessThanMinute')
    }
  }
  return ''
}

function getText (id, ...params) {
  return appConst.getText(id, ...params)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

const destination = computed(() => {
  return route.params.destination
})

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
      let dest = destination.value
      if (destination.value === 'writeKanji') {
        dest = 'training'
      }

      router.push({ name: name, query: { sub: dest } })
      break
    case 'packages':
      appDyn.packagesDestination = destination.value
      router.push({ name: name })
      break
    case 'next':
      if (nothingSelected.value) {
        showNotification()
        break
      }

      if (destination.value === 'adventure') {
        router.push({ name: 'selection' })
      } else {
        router.push({ name: destination.value })
      }
      break
    default:
  }
}
</script>

<style lang="scss" scoped>
.max-height {
  max-height: 22%;
}
</style>
