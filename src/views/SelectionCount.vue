<template>
  <div class="page">
    <HeroBasic title="selectionCountTitle" :subtitle="['selectionCountSubtitle']" />
    <div class="buttons flex-grow flex-column overflow-auto">
      <div class="flex-row">
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
      <div class="flex-row flex-wrap">
        <ButtonText class="width-third" :class="{ 'single-2': wordCountSelected(option) }"
                    v-for="option in availableOptions" color="action" :text="option" :key="option"
                    @click="setWordCount(option)" />
        <ButtonText v-show="!inputVisible" class="width-full" :class="{ 'single-2': customCountSet }" color="action"
                    :text="customCountText" @click="showInput()" />
        <InputWithButton v-if="inputVisible" class="width-full" v-model="customCount" type="number" colorInput="action"
                         colorButton="green" iconInput="pen" iconButton="check" :maxlength="4" @click="hideInput()" />
        <ButtonText class="width-full" :class="{ 'single-2': wordCountSelected(countAllWords) }" color="action"
                    text="selectionCountAll" @click="setWordCount(countAllWords)" />
      </div>
      <ButtonBasic class="width-full" :class="{ 'single-2': $store.state.vueDict.reversed }" icon="sync-alt"
                   color="action" text="selectionCountReverse" @click="toggleWordsReversed()" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="selectionButton2"
                   @click="navTo('category', 'adventure')" />
      <ButtonBasic class="width-half" icon="check" color="green" text="selectionButton1" @click="navTo('adventure')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="selectionCountNotificationTitle"
                       :text="['selectionCountNotificationText']" color="red" icon="exclamation"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonMDI from '@/components/ButtonMDI.vue'
import ButtonText from '@/components/ButtonText.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import SpeedometerSlow from 'vue-material-design-icons/SpeedometerSlow.vue'
import SpeedometerMedium from 'vue-material-design-icons/SpeedometerMedium.vue'
import Speedometer from 'vue-material-design-icons/Speedometer.vue'

export default {
  name: 'SelectionCount',
  components: {
    HeroBasic,
    ButtonBasic,
    ButtonMDI,
    ButtonText,
    InputWithButton,
    NotificationBasic,
    SpeedometerSlow,
    SpeedometerMedium,
    Speedometer
  },
  data () {
    return {
      inputVisible: false,
      customCount: '',
      availableOptions: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200],
      notificationVisible: false
    }
  },
  created () {
    if (this.$store.state.vueDict.categoriesChosen.length === 0) {
      this.navTo('category', 'adventure')
    }
  },
  mounted () {
    let wordCount = this.$store.state.vueDict.wordCount
    if (!this.availableOptions.includes(wordCount) && wordCount !== 0 && wordCount !== this.countAllWords) {
      this.customCount = wordCount.toString()
    }
  },
  computed: {
    customCountSet () {
      return this.customCount !== ''
    },
    customCountText () {
      return this.customCount === '' ? 'selectionCountCustom' : this.customCount
    },
    countAllWords () {
      return this.$store.getters['vueDict/getFullVocabs'].words.length
    }
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    difficultySelected (difficulty) {
      return this.$store.state.vueDict.difficulty === difficulty
    },
    setDifficulty (difficulty) {
      this.$store.commit('vueDict/setDifficulty', difficulty)
      this.showNotification = false
    },
    wordCountSelected (count) {
      if (this.customCountSet) {
        return false
      }
      return this.$store.state.vueDict.wordCount === count
    },
    setWordCount (count) {
      this.$store.commit('vueDict/setWordCount', count)
      this.customCount = ''
      this.hideNotification()
    },
    showInput () {
      this.inputVisible = true
    },
    hideInput () {
      this.inputVisible = false
      if (this.customCountSet) {
        if (parseInt(this.customCount) > 9001) {
          this.customCount = '9001'
        }
        this.$store.commit('vueDict/setWordCount', parseInt(this.customCount))
      } else {
        if (!this.availableOptions.includes(this.$store.state.vueDict.wordCount)) {
          this.$store.commit('vueDict/setWordCount', 10)
        }
      }
    },
    toggleWordsReversed () {
      this.$store.commit('vueDict/setReversed', !this.$store.state.vueDict.reversed)
    },
    navTo (name, params = '') {
      switch (name) {
        case 'category':
          this.$router.push({ name: name, params: { destination: params } })
          break
        case 'adventure':
          if (this.$store.getters['vueDict/getVocabsWithDifficulty'].words.length === 0) {
            this.showNotification()
          } else {
            this.$router.push({ name: name })
          }
          break
        default:
      }
    },
    showNotification () {
      this.notificationVisible = true
    },
    hideNotification () {
      this.notificationVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.buttons {
  justify-content: space-between;
}
</style>
