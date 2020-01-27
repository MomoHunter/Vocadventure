<template>
  <div class="flexContainer spaceBetween">
    <HeroBasic title="selectionCountTitle" />
    <div class="field has-addons is-10">
      <div class="control is-third">
        <ButtonMDI :selected="difficultySelected('1')" color="is-success" text="difficulty1"
                   @click="setDifficulty('1')">
          <SpeedometerSlow :class="getSizeClass('mdi')" />
        </ButtonMDI>
      </div>
      <div class="control is-third">
        <ButtonMDI :selected="difficultySelected('2')" color="is-warning" text="difficulty2"
                   @click="setDifficulty('2')">
          <SpeedometerMedium :class="getSizeClass('mdi')" />
        </ButtonMDI>
      </div>
      <div class="control is-third">
        <ButtonMDI :selected="difficultySelected('3')" color="is-danger" text="difficulty3"
                   @click="setDifficulty('3')">
          <Speedometer :class="getSizeClass('mdi')" />
        </ButtonMDI>
      </div>
    </div>
    <div class="field is-grouped is-grouped-multiline is-10">
      <div class="control is-third" :class="optionClasses(option)" v-for="option of availableOptions" :key="option">
        <ButtonTextNoTranslation class="is-fullwidth" color="is-primary" :text="option" @click="setWordCount(option)"
                                 :selected="wordCountSelected(option)" />
      </div>
      <div class="control is-two-third left-row">
        <ButtonText v-show="!isInputVisible && !customCountSet" class="is-fullwidth" color="is-primary"
                    text="selectionCountCustom" @click="showInput()" />
        <ButtonTextNoTranslation v-show="!isInputVisible && customCountSet" class="is-fullwidth" color="is-primary"
                                 :text="customCount" @click="showInput()"
                                 :selected="wordCountSelected(parseInt(customCount))" />
        <InputWithButton v-show="isInputVisible" colorInput="is-primary" colorButton="is-success" type="number"
                         iconButton="check" @click="hideInput()" v-model="customCount" />
      </div>
      <div class="control is-third right-row">
        <ButtonText class="is-fullwidth" color="is-primary" text="selectionCountAll"
                    @click="setWordCount(countAllWords)" :selected="wordCountSelected(countAllWords)" />
      </div>
    </div>
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" color="is-success" icon="check" text="selectionButton1"
                   @click="navTo()" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" text="selectionButton2"
                   @click="$router.push({ name: 'category', params: { destination: 'adventure' } })" />
    </div>
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
      <TheNotification v-show="showNotification" color="is-danger" text="selectionCountNotification"
                       @click="closeNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonMDI from '@/components/ButtonMDI.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonText from '@/components/ButtonText.vue'
import ButtonTextNoTranslation from '@/components/ButtonTextNoTranslation.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import TheNotification from '@/components/TheNotification.vue'

import SpeedometerSlow from 'vue-material-design-icons/SpeedometerSlow.vue'
import SpeedometerMedium from 'vue-material-design-icons/SpeedometerMedium.vue'
import Speedometer from 'vue-material-design-icons/Speedometer.vue'

export default {
  name: 'SelectionCount',
  components: {
    HeroBasic,
    ButtonMDI,
    ButtonBasic,
    ButtonText,
    ButtonTextNoTranslation,
    InputWithButton,
    TheNotification,
    SpeedometerSlow,
    SpeedometerMedium,
    Speedometer
  },
  data () {
    return {
      isInputVisible: false,
      customCount: '',
      availableOptions: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200],
      showNotification: false
    }
  },
  computed: {
    customCountSet () {
      return this.customCount !== ''
    },
    countAllWords () {
      return this.$store.getters['vueDict/getVocabs'].words.length
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
    optionClasses (option) {
      let index = this.availableOptions.indexOf(option) % 3

      switch (index) {
        case 0:
          return 'left-row'
        case 1:
          return 'center-row'
        case 2:
          return 'right-row'
        default:
          return 'full-row'
      }
    },
    wordCountSelected (count) {
      return this.$store.state.vueDict.wordCount === count
    },
    setWordCount (count) {
      this.$store.commit('vueDict/setWordCount', count)
      this.customCount = ''
      this.showNotification = false
    },
    showInput () {
      this.isInputVisible = true
    },
    hideInput () {
      this.isInputVisible = false
      if (this.customCountSet) {
        if (this.customCount > 9001) {
          this.customCount = 9001
        }
        this.$store.commit('vueDict/setWordCount', parseInt(this.customCount))
      }
    },
    navTo () {
      if (this.$store.state.vueDict.difficulty === '' || this.$store.state.vueDict.wordCount === 0) {
        this.showNotification = true
      } else {
        this.$router.push({ name: 'adventure' })
      }
    },
    closeNotification () {
      this.showNotification = false
    }
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  height: calc(100% - 71px);

  &.spaceBetween {
    justify-content: space-between;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }

  .is-third {
    width: calc(100% / 3);
  }

  .is-two-third {
    width: calc(100% / 1.5);
  }

  .left-row {
    margin: 0px !important;
    padding-right: .25rem;
    padding-bottom: .5rem;
  }

  .center-row {
    margin: 0px !important;
    padding-left: .25rem;
    padding-right: .25rem;
    padding-bottom: .5rem;
  }

  .right-row {
    margin: 0px !important;
    padding-left: .25rem;
    padding-bottom: .5rem;
  }

  .full-row {
    margin: 0px !important;
    padding-bottom: .5rem;
  }
}
</style>
