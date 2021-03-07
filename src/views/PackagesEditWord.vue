<template>
  <div class="flexboxContainer">
    <HeroBasic class="marginBottomSmall" title="packagesEditWordTitle" />
    <div class="is-10 overflowAuto flexGrow">
      <input class="input marginBottomSmall" :class="getSizeClass('input')" type="text"
             v-model="newWordData.latinAlphabet" :placeholder="getText(targetLanguageData.latinAlphabet)"
             @click="hideNotification()" />
      <input v-show="targetLanguageData.foreignAlphabet !== ''" class="input marginBottomSmall"
             :class="getSizeClass('input')" type="text" v-model="newWordData.foreignAlphabet"
             :placeholder="getText(targetLanguageData.foreignAlphabet)" @click="hideNotification()" />
      <div class="field has-addons">
        <div class="control is-third">
          <ButtonMDI :selected="difficultySelected(1)" color="is-success" text="difficulty1"
                    @click="setDifficulty(1)">
            <SpeedometerSlow :class="getSizeClass('mdi')" />
          </ButtonMDI>
        </div>
        <div class="control is-third">
          <ButtonMDI :selected="difficultySelected(2)" color="is-warning" text="difficulty2"
                    @click="setDifficulty(2)">
            <SpeedometerMedium :class="getSizeClass('mdi')" />
          </ButtonMDI>
        </div>
        <div class="control is-third">
          <ButtonMDI :selected="difficultySelected(3)" color="is-danger" text="difficulty3"
                    @click="setDifficulty(3)">
            <Speedometer :class="getSizeClass('mdi')" />
          </ButtonMDI>
        </div>
      </div>
      <input class="input marginBottomSmall" type="text" v-for="lang in supportedLanguages" :key="lang"
             :placeholder="getText(lang)" v-model="newWordData.languageTranslations[lang]" @click="hideNotification()" />
    </div>
    <div class="is-10 buttonContainer">
      <ButtonBasic class="marginBottomSmall" icon="check" color="is-success" text="packagesEditWordButton1" @click="saveWord()" />
      <ButtonBasic icon="times" color="is-danger" text="packagesEditWordButton2" @click="navTo()" />
    </div>
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
      <TheNotification v-show="notificationVisible" class="fullWidth" color="is-danger" text="packagesEditWordNotification"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonMDI from '@/components/ButtonMDI.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TheNotification from '@/components/TheNotification.vue'

import SpeedometerSlow from 'vue-material-design-icons/SpeedometerSlow.vue'
import SpeedometerMedium from 'vue-material-design-icons/SpeedometerMedium.vue'
import Speedometer from 'vue-material-design-icons/Speedometer.vue'

export default {
  name: 'PackagesEditWord',
  components: {
    HeroBasic,
    ButtonMDI,
    ButtonBasic,
    TheNotification,
    SpeedometerSlow,
    SpeedometerMedium,
    Speedometer
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
    wordIndex () {
      return this.$store.state.vueDict.selectedWordPackWordIndex
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
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
      if (this.$store.state.vueDict.selectedWordPackWordIndex >= 0) {
        this.$store.commit('vueDict/updateWordInSelectedPack', wordObject)
        this.$store.commit('vueDict/setSelectedWordPackWordIndex', -1)
      } else {
        this.$store.commit('vueDict/addWordToSelectedPack', wordObject)
      }
      this.navTo()
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

<style lang="scss" scoped>
.flexboxContainer {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  height: calc(100% - 71px);

  .is-10 {
    width: calc(100% / 1.2);
  }

  .is-third {
    width: calc(100% / 3);
  }

  .flexGrow {
    flex-grow: 1;
  }

  .overflowAuto {
    overflow: auto;
  }
}
</style>
