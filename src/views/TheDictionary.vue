<template>
  <div class="page">
    <TheHero title="dictionaryTitle" />
    <div class="action-container">
      <DropdownBasic class="width-full margin-top-medium margin-bottom-medium" title="dictionaryDropdown" icon="tasks"
                     color="action" :options="types" @change="changeType($event)" />
      <InputBasic class="margin-bottom-small" v-model="searchString" title="dictionaryInput" type="text"
                  icon="search" color="action" no-focus />
    </div>
    <div class="dictionary-list flex-grow overflow-auto" :class="getSizeClass('general')">
      <div v-if="searchString === ''" class="height-full flex-column flex-center">
        {{ getText('dictionaryNoSearchTerm') }}
      </div>
      <div v-else-if="words.length === 0" class="height-full flex-column flex-center">
        {{ getText('dictionaryNoWords') }}
      </div>
      <div class="word" v-for="(wordObj, index) in words" :key="index">
        <div class="index">
          {{ index + 1 }}
        </div>
        <div class="details flex-column flex-grow">
          <div class="label">
            {{ wordObj.word[returnType] }}
          </div>
          <div class="info">
            {{ wordObj.word[types[currentTypeIndex]] }}
          </div>
          <div class="category selected">
            {{ wordObj.category }}
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="dictionaryButton1"
                   @click="navTo('menu')" />
      <ButtonBasic class="width-half" icon="list" color="info" text="dictionaryButton2"
                   @click="navTo('packages')" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import InputBasic from '@/components/InputBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppConstStore } from '@/stores/appconst'
import { useAppDynStore } from '@/stores/appdyn'

const router = useRouter()
const savestate = useSavestateStore()
const appConst = useAppConstStore()
const appDyn = useAppDynStore()

const types = computed(() => {
  const targetLang = appConst.targetLanguages[savestate.app.targetLanguage]
  let languages = new Set()
  languages.add(savestate.app.lang)
  Object.keys(appConst.texts).forEach((lang) => {
    languages.add(lang)
  })
  languages.add(targetLang.latinAlphabet)
  if (targetLang.foreignAlphabet !== '') {
    languages.add(targetLang.foreignAlphabet)
  }
  return Array.from(languages)
})

const currentTypeIndex = ref(0)

function changeType (newType) {
  currentTypeIndex.value = types.value.indexOf(newType)
}

const searchString = ref('')

const words = computed(() => {
  if (searchString.value === '') {
    return []
  }
  return appConst.getSearchedWords(types.value[currentTypeIndex.value], searchString.value)
})

const returnType = computed(() => {
  const targetLang = appConst.targetLanguages[savestate.app.targetLanguage]
  if (targetLang.latinAlphabet === types.value[currentTypeIndex.value] ||
      targetLang.foreignAlphabet === types.value[currentTypeIndex.value]) {
    return savestate.app.lang
  } else {
    if (targetLang.foreignAlphabet === '') {
      return targetLang.latinAlphabet
    } else {
      return targetLang.foreignAlphabet
    }
  }
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function navTo (destination) {
  if (destination === 'menu') {
    router.push({ name: destination, query: { sub: 'training' } })
  } else {
    appDyn.packagesDestination = 'dictionary'
    // this.$store.commit('vueDict/setDestination', this.$route.name)
    router.push({ name: destination })
  }
}
</script>
