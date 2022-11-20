<template>
  <div class="page">
    <TheHero title="packagesEditCategoriesTitle" :subtitle="wordpackName" />
    <div v-show="!newCategoryVisible" ref="categoriesElement" class="flex-grow overflow-auto">
      <PackageCategoryEntry v-for="category in categories" :category="category"
                            :expanded="expandedCategories.includes(category.index)" :key="category.index"
                            @expand="toggleExpanded(category.index)" @edit="editEntry($event, category.index)"
                            @delete="removeEntry($event, category.index)"
                            @new="navTo('packagesEditWord', category.index)" />
    </div>
    <div v-show="newCategoryVisible" class="flex-grow overflow-auto padding-top-medium">
      <InputBasic class="border-bottom margin-bottom-medium" v-for="lang in supportedLanguages"
                  v-model="newCategoryData[lang]" :title="lang" type="text" icon="font" no-focus :key="lang" />
    </div>
    <div v-show="newCategoryVisible" class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="packagesEditCategoriesNewButton2"
                   @click="hideNewCategory()" />
      <ButtonBasic class="width-half" icon="check" color="green" text="packagesEditCategoriesNewButton1"
                   @click="saveNewCategory()" />
    </div>
    <div v-show="!newCategoryVisible" class="button-container">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="packagesEditCategoriesButton2"
                   @click="navTo('packagesEdit')" />
      <ButtonBasic class="width-half" icon="plus" color="green" text="packagesEditCategoriesButton1"
                   @click="showNewCategory()" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="packagesEditCategoriesNotificationTitle"
                         :text="['packagesEditCategoriesNotificationText']" color="red" icon="exclamation"
                         @click="hideNotification()" />
    </transition>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import InputBasic from '@/components/InputBasic.vue'
import PackageCategoryEntry from '@/components/PackageCategoryEntry.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import { useAppDynStore } from '@/stores/appdyn'
import { useSavestateStore } from '@/stores/savestate'

const router = useRouter()
const savestate = useSavestateStore()
const appDyn = useAppDynStore()

onBeforeMount(() => {
  if (!appDyn.packages.wordpack) {
    navTo('packages')
    return
  } else {
    categories.value = JSON.parse(JSON.stringify(appDyn.packages.wordpack.categories))
  }

  if (appDyn.packages.categoryIndex >= 0) {
    expandedCategories.value.push(appDyn.packages.categoryIndex)
  }
})

onMounted(() => {
  categoriesElement.value.scrollTop = appDyn.packages.categoriesScroll
  appDyn.packages.categoriesScroll = 0
})

onBeforeRouteLeave((to, from) => {
  if (appDyn.activeModal !== null) {
    appDyn.activeModal = null
  }

  if (to.name === 'packagesEdit') {
    appDyn.packages.wordpack.categories = categories.value
    appDyn.packages.categoryIndex = -1
  }
})

const wordpackName = computed(() => {
  const wordpack = appDyn.packages.wordpack
  if (wordpack) {
    return [`[${wordpack.tag}] ${wordpack.name}`]
  }
  return ['']
})

const categoriesElement = ref(null)
const categories = ref([])
const newCategoryData = ref({})
const newCategoryVisible = ref(false)

const supportedLanguages = computed(() => {
  if (appDyn.packages.wordpack) {
    return appDyn.packages.wordpack.supportedLanguages
  }
  return []
})

function showNewCategory (categoryIndex = -1) {
  newCategoryData.value = {}
  if (categoryIndex < 0) {
    newCategoryData.value.index = categories.value.reduce((newIndex, category) => {
      return category.index >= newIndex ? category.index + 1 : newIndex
    }, 1)
    for (let lang of supportedLanguages.value) {
      newCategoryData.value[lang] = ''
    }
    newCategoryData.value.words = []
  } else {
    const category = categories.value.find(category => category.index === categoryIndex)
    newCategoryData.value.index = categoryIndex
    for (let lang of supportedLanguages.value) {
      newCategoryData.value[lang] = category[lang]
    }
    newCategoryData.value.words = []
  }
  newCategoryVisible.value = true
}

function hideNewCategory () {
  newCategoryData.value = {}
  newCategoryVisible.value = false
}

function saveNewCategory () {
  let filled = true
  for (let lang of supportedLanguages.value) {
    if (newCategoryData.value[lang] === '') {
      filled = false
    }
  }

  if (!filled) {
    showNotification()
  } else {
    let category = categories.value.find(category => category.index === newCategoryData.value.index)
    if (category) {
      for (let lang of supportedLanguages.value) {
        category[lang] = newCategoryData.value[lang]
      }
    } else {
      categories.value.push(newCategoryData.value)
    }
    hideNewCategory()
    appDyn.packages.changed = true
  }
}

const notificationVisible = ref(false)

function showNotification () {
  notificationVisible.value = true
}

function hideNotification () {
  notificationVisible.value = false
}

const expandedCategories = ref([])

function toggleExpanded (categoryIndex) {
  if (expandedCategories.value.includes(categoryIndex)) {
    expandedCategories.value = expandedCategories.value.filter(index => index !== categoryIndex)
  } else {
    expandedCategories.value.push(categoryIndex)
  }
}

function editEntry (data, categoryIndex) {
  switch (data.type) {
    case 'category':
      showNewCategory(categoryIndex)
      break
    case 'word':
      editWord(categoryIndex, data.index)
      break
    default:
  }
}

function editWord (categoryIndex, index) {
  appDyn.packages.wordIndex = index
  navTo('packagesEditWord', categoryIndex)
}

function removeEntry (data, categoryIndex) {
  switch (data.type) {
    case 'category':
      confirmRemoveCategory(categoryIndex)
      break
    case 'word':
      confirmRemoveWord(categoryIndex, data.index)
      break
    default:
  }
}

const selectedCategoryIndex = ref(-1)

function confirmRemoveCategory (categoryIndex) {
  let categoryName = ''
  const category = categories.value.find(category => category.index === categoryIndex)
  if (category) {
    categoryName = category[savestate.app.lang]
  }

  selectedCategoryIndex.value = categoryIndex
  selectedWordIndex.value = -1
  appDyn.activeModal = {
    name: 'message',
    title: 'packagesEditCategoriesModalTitle',
    text: [
      'packagesEditCategoriesModalCategoryText',
      categoryName
    ],
    buttons: [
      {
        icon: 'times',
        text: 'packagesEditCategoriesModalButton1',
        color: 'red'
      },
      {
        icon: 'check',
        text: 'packagesEditCategoriesModalButton2',
        color: 'green'
      }
    ]
  }
}

const selectedWordIndex = ref(-1)

function confirmRemoveWord (categoryIndex, index) {
  let wordName = ''
  const category = categories.value.find(category => category.index === categoryIndex)
  if (category && category.words.length > index) {
    wordName = category.words[index][savestate.app.lang]
  }

  selectedCategoryIndex.value = categoryIndex
  selectedWordIndex.value = index
  appDyn.activeModal = {
    name: 'message',
    title: 'packagesEditCategoriesModalTitle',
    text: [
      'packagesEditCategoriesModalWordText',
      wordName
    ],
    buttons: [
      {
        icon: 'times',
        text: 'packagesEditCategoriesModalButton1',
        color: 'red'
      },
      {
        icon: 'check',
        text: 'packagesEditCategoriesModalButton2',
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
        if (selectedWordIndex.value < 0) {
          deleteCategory(selectedCategoryIndex.value)
        } else {
          deleteWord(selectedCategoryIndex.value, selectedWordIndex.value)
        }
        appDyn.activeModal = null
        break
      default:
    }
  }
)

function deleteCategory (categoryIndex) {
  categories.value = categories.value.filter(category => category.index !== categoryIndex)
  expandedCategories.value = expandedCategories.value.filter(index => index !== categoryIndex)
  appDyn.packages.changed = true
}

function deleteWord (categoryIndex, index) {
  let category = categories.value.find(category => category.index === categoryIndex)
  category.words.splice(index, 1)
  appDyn.packages.changed = true
}

function navTo (destination, categoryIndex = -1) {
  switch (destination) {
    case 'packagesEditWord':
      appDyn.packages.wordpack.categories = categories.value
      appDyn.packages.categoryIndex = categoryIndex
      appDyn.packages.categoriesScroll = categoriesElement.value.scrollTop
      break
    default:
  }
  router.push({ name: destination })
}
</script>
