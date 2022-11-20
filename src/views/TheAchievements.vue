<template>
  <div class="page">
    <TheHero title="achievementsTitle"
             :subtitle="['achievementsSubtitle', finishedAchievements, achievementCount]" />
    <div v-show="!sortVisible && !filterVisible && !searchVisible" class="action-container">
      <ButtonBasic class="width-third" text="achievementsButton1" icon="sort" color="action" @click="showSort()" />
      <ButtonBasic class="width-third" text="achievementsButton2" icon="filter" color="action" @click="showFilter()" />
      <ButtonBasic class="width-third" text="achievementsButton3" icon="search" color="action" @click="showSearch()" />
    </div>
    <div v-show="sortVisible" class="action-container flex-row flex-center">
      <DropdownBasic class="width-full" :icon="sortIcon" color="action" :options="sorters" :selected="sorters[0]"
                     @change="sort($event)" />
      <ButtonIcon icon="times" color="red" @click="hideSort()" />
    </div>
    <div v-show="filterVisible" class="action-container flex-row">
      <ButtonIcon icon="refresh" color="action" @click="clearFilter()" />
      <div class="flex-row flex-grow overflow-auto">
        <ButtonIcon v-for="category in appConst.achievements" :class="{ 'single-2': isCategoryFiltered(category.id) }"
                    :icon="category.icon" :color="category.color" :key="category.id" @click="toggleCategoryFilter(category.id)" />
      </div>
      <ButtonIcon icon="times" color="red" @click="hideFilter()" />
    </div>
    <div v-if="searchVisible" class="action-container">
      <InputWithButton class="width-full" type="text" icon-input="search" icon-button="times" color-input="action"
                       color-button="red" @click="hideSearch()" v-model="searchString" />
    </div>
    <div class="flex-grow overflow-auto">
      <div class="flex-row flex-wrap gap-column-medium gap-row-medium margin-medium">
        <div v-for="(achievement, index) in achievements" class="achievement-box"
            :class="getSizeClass('general')" :key="index">
          <div class="category" :class="achievement.categoryColor">
            <span class="icon">
              <i class="fas" :class="'fa-' + achievement.categoryIcon"></i>
            </span>
            {{ getText(achievement.categoryId) }}
          </div>
          <div class="image-box margin-top-small margin-bottom-small" :class="{ 'locked': true }"
               :style="{ backgroundImage: `url(${'assets/img/achievements/' + achievement.id.toLowerCase() + '.png'})` }"></div>
          <div class="title text-center overflow-auto">
            {{ getText(`achievements${capitalize(achievement.id)}Title`) }}
          </div>
          <div class="description overflow-auto text-center">
            {{ getText(`achievements${capitalize(achievement.id)}Desc`) }}
          </div>
          <TheProgressBar class="small" color="green" :value="100" :max-value="achievement.maxValue" />
          <div class="xp">
            {{ achievement.xp.toLocaleString() }} {{ getText('points') }}
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <ButtonBasic class="width-full" text="achievementsButton4" icon="arrow-left" color="red" @click="navTo()" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppConstStore } from '@/stores/appconst'

const router = useRouter()
const savestate = useSavestateStore()
const appConst = useAppConstStore()

const achievements = computed(() => {
  let regex = new RegExp('.*' + searchString.value.toLowerCase().split('').join('.{0,3}') + '.*')
  return appConst.achievements.flatMap((category) => {
    if (!isCategoryFiltered(category.id)) {
      return []
    }

    let newAchievementObj = []

    for (let entry of category.entries) {
      if (regex.test(getText(`achievements${capitalize(entry.id)}Title`).toLowerCase())) {
        newAchievementObj.push(
          JSON.parse(JSON.stringify({
            categoryId: category.id,
            categoryColor: category.color,
            categoryIcon: category.icon,
            ...entry
          }))
        )
      }
    }
    return newAchievementObj
  }).sort(sortFunction.value)
})

const finishedAchievements = computed(() => {
  return 0
})

const achievementCount = computed(() => {
  return appConst.achievements.reduce((acc, category) => {
    return acc + category.entries.length
  }, 0)
})

const sortVisible = ref(false)
const sortIcon = ref('sort')
const sortFunction = ref((a, b) => 0)
const sorters = [
  'sortStandard',
  'sortAlphAsc',
  'sortAlphDesc',
]
const sortType = ref(sorters[0])

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
        if (getText(`achievements${capitalize(a.id)}Title`).toLowerCase() > getText(`achievements${capitalize(b.id)}Title`).toLowerCase()) {
          return 1
        } else if (getText(`achievements${capitalize(a.id)}Title`).toLowerCase() < getText(`achievements${capitalize(b.id)}Title`).toLowerCase()) {
          return -1
        } else {
          return 0
        }
      }
      break
    case 'sortAlphDesc':
      sortFunction.value = (a, b) => {
        if (getText(`achievements${capitalize(a.id)}Title`).toLowerCase() < getText(`achievements${capitalize(b.id)}Title`).toLowerCase()) {
          return 1
        } else if (getText(`achievements${capitalize(a.id)}Title`).toLowerCase() > getText(`achievements${capitalize(b.id)}Title`).toLowerCase()) {
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

const filterVisible = ref(false)
const filteredCategories = ref([])

function showFilter () {
  filterVisible.value = true
}

function hideFilter () {
  filterVisible.value = false
}

function toggleCategoryFilter (categoryId) {
  if (filteredCategories.value.includes(categoryId)) {
    filteredCategories.value = filteredCategories.value.filter((id) => id !== categoryId)
  } else {
    filteredCategories.value.push(categoryId)
  }
}

function clearFilter () {
  filteredCategories.value = []
}

function isCategoryFiltered (categoryId) {
  if (filteredCategories.value.length === 0) {
    return true
  }
  return filteredCategories.value.includes(categoryId)
}

const searchVisible = ref(false)
const searchString = ref('')

function showSearch () {
  searchVisible.value = true
}

function hideSearch () {
  searchVisible.value = false
}

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function capitalize (word) {
  return word[0].toUpperCase() + word.substr(1)
}

function navTo () {
  router.push({ name: 'menu', query: { sub: 'adventure' } })
}
</script>

<style lang="scss" scoped>
</style>
