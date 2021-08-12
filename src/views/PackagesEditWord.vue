<template>
  <div class="page">
    <HeroBasic :title="title" :subtitle="categoryName" />
    <div class="flex-grow overflow-auto padding-top-medium">
      <div class="flex-row margin-bottom-medium">
        <ButtonMDI class="width-third" :class="{ 'single-2': difficultySelected(1) }" color="green" text="difficulty1"
                   @click="setDifficulty(1)">
          <SpeedometerSlow :class="getSizeClass('general')" />
        </ButtonMDI>
        <ButtonMDI class="width-third" :class="{ 'single-2': difficultySelected(2) }" color="yellow" text="difficulty2"
                   @click="setDifficulty(2)">
          <SpeedometerMedium :class="getSizeClass('general')" />
        </ButtonMDI>
        <ButtonMDI class="width-third" :class="{ 'single-2': difficultySelected(3) }" color="red" text="difficulty3"
                   @click="setDifficulty(3)">
          <Speedometer :class="getSizeClass('general')" />
        </ButtonMDI>
      </div>
      <InputBasic class="border-bottom margin-bottom-medium" v-for="lang in supportedLanguages" :title="lang"
                  type="text" icon="font" v-model="newWordData.languageTranslations[lang]" noFocus :key="lang"
                  @click="hideNotification()" />
      <InputBasic class="border-bottom margin-bottom-medium" :title="targetLanguageData.latinAlphabet"
                  type="text" icon="globe" v-model="newWordData.latinAlphabet" noFocus @click="hideNotification()" />
      <InputBasic v-show="targetLanguageData.foreignAlphabet !== ''" class="border-bottom margin-bottom-medium"
                  :title="targetLanguageData.foreignAlphabet" type="text" icon="globe"
                  v-model="newWordData.foreignAlphabet" noFocus @click="hideNotification()" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="packagesEditWordButton2" @click="navTo()" />
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

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonMDI from '@/components/ButtonMDI.vue'
import InputBasic from '@/components/InputBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import SpeedometerSlow from 'vue-material-design-icons/SpeedometerSlow.vue'
import SpeedometerMedium from 'vue-material-design-icons/SpeedometerMedium.vue'
import Speedometer from 'vue-material-design-icons/Speedometer.vue'

export default {
  name: 'PackagesEditWord',
  components: {
    HeroBasic,
    ButtonMDI,
    InputBasic,
    ButtonBasic,
    NotificationBasic,
    SpeedometerSlow,
    SpeedometerMedium,
    Speedometer
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('vueDict/setSelectedWordPackWordIndex', -1)
    next()
  },
  data () {
    return {
      newWordData: {
        latinAlphabet: '',
        foreignAlphabet: '',
        difficulty: 1,
        languageTranslations: {}
      },
      notificationVisible: false
    }
  },
  beforeCreate () {
    if (!this.$store.state.vueDict.selectedWordPack) {
      this.$router.push({ name: 'packages' })
    }
  },
  created () {
    if (this.wordIndex >= 0) {
      let wordData = this.$store.state.vueDict.selectedWordPack.categories.find(cat => cat.index === this.categoryIndex)
        .words[this.wordIndex]
      this.newWordData.difficulty = wordData.difficulty
      for (let lang of this.supportedLanguages) {
        this.newWordData.languageTranslations[lang] = wordData[lang]
      }
      this.newWordData.latinAlphabet = wordData[this.targetLanguageData.latinAlphabet]
      if (this.targetLanguageData.foreignAlphabet !== '') {
        this.newWordData.foreignAlphabet = wordData[this.targetLanguageData.foreignAlphabet]
      }
    } else {
      for (let lang of this.supportedLanguages) {
        this.newWordData.languageTranslations[lang] = ''
      }
    }
  },
  computed: {
    title () {
      if (this.wordIndex >= 0) {
        return 'packagesEditWordTitleEdit'
      }
      return 'packagesEditWordTitleNew'
    },
    targetLanguageData () {
      if (this.$store.state.vueDict.selectedWordPack) {
        return this.$store.state.vueDict.targetLanguages[this.$store.state.vueDict.selectedWordPack.targetLanguage]
      }
      return this.$store.state.vueDict.targetLanguages.japanese
    },
    supportedLanguages () {
      if (this.$store.state.vueDict.selectedWordPack) {
        return this.$store.state.vueDict.selectedWordPack.supportedLanguages
      }
      return []
    },
    categoryIndex () {
      return this.$store.state.vueDict.selectedWordPackCategoryIndex
    },
    categoryName () {
      let wordPack = this.$store.state.vueDict.selectedWordPack
      if (wordPack) {
        let foundCategory = wordPack.categories.find(category =>
          category.index === this.categoryIndex
        )

        if (foundCategory) {
          return [foundCategory[this.$store.state.lang]]
        }
      }
      return ['']
    },
    wordIndex () {
      return this.$store.state.vueDict.selectedWordPackWordIndex
    }
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    difficultySelected (difficulty) {
      return this.newWordData.difficulty === difficulty
    },
    setDifficulty (difficulty) {
      this.hideNotification()
      this.newWordData.difficulty = difficulty
    },
    saveWord () {
      let emptyField = false
      if (this.newWordData.latinAlphabet === '') {
        emptyField = true
      } else if (this.newWordData.foreignAlphabet === '' && this.targetLanguageData.foreignAlphabet !== '') {
        emptyField = true
      }
      for (let lang of this.supportedLanguages) {
        if (this.newWordData.languageTranslations[lang] === '') {
          emptyField = true
        }
      }
      if (emptyField) {
        this.showNotification()
        return
      }

      let wordObject = {
        difficulty: this.newWordData.difficulty
      }
      for (let lang of this.supportedLanguages) {
        wordObject[lang] = this.newWordData.languageTranslations[lang]
      }
      wordObject[this.targetLanguageData.latinAlphabet] = this.newWordData.latinAlphabet
      if (this.targetLanguageData.foreignAlphabet !== '') {
        wordObject[this.targetLanguageData.foreignAlphabet] = this.newWordData.foreignAlphabet
      }
      if (this.wordIndex >= 0) {
        this.$store.commit('vueDict/updateWordInSelectedPack', wordObject)
      } else {
        this.$store.commit('vueDict/addWordToSelectedPack', wordObject)
      }
      this.navTo()
      this.$store.commit('vueDict/setSelectedWordPackChanged', true)
    },
    showNotification () {
      this.notificationVisible = true
    },
    hideNotification () {
      this.notificationVisible = false
    },
    navTo () {
      this.$router.push({ name: 'packagesEditCategories' })
    }
  }
}
</script>
