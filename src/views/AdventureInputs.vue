<template>
  <div class="flexboxContainer">
    <!-- <div class="innerFlexContainerInput" :class="{ marginBottomBig: keyboardVisible }" v-show="!statisticsVisible">
      <span class="icon is-1" :class="latinIconColor">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', latinIcon]" :size="getSizeClass('fas')" />
      </span>
      <input class="input is-rounded is-10" type="text" :placeholder="getText(words.latinAlphabet)"
             :class="[getSizeClass('input'), { 'is-info': solutionVisible}]" v-model="latinInput"
             :readonly="resultsVisible" />
      <span class="icon is-1" :class="latinCoinColor">
        <font-awesome-icon v-show="resultsVisible && isLatinCorrect > 0" :icon="['fas', 'coins']"
                           :size="getSizeClass('fas')" />
      </span>
    </div>
    <div class="innerFlexContainerInput" :class="{ marginBottomBig: keyboardVisible }" v-show="!statisticsVisible">
      <span class="icon is-1" :class="foreignIconColor">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', foreignIcon]"
                           :size="getSizeClass('fas')" />
      </span>
      <div class="field is-10 has-addons noMarginBottom">
        <div v-if="keyboardVisible" class="control">
          <ButtonIcon icon="backspace" color="is-danger" @click="removeLetter()" />
        </div>
        <div class="control fullWidth">
          <input class="input is-rounded" type="text" :placeholder="getText(words.foreignAlphabet)"
                :class="[getSizeClass('input'), { 'is-info': solutionVisible}]" v-model="foreignInput"
                @click="showKeyboard()" readonly />
        </div>
        <div v-if="keyboardVisible" class="control">
          <ButtonIcon icon="check" color="is-success" @click="hideKeyboard()" />
        </div>
      </div>
      <span class="icon is-1" :class="foreignCoinColor">
        <font-awesome-icon v-show="resultsVisible && isForeignCorrect > 0" :icon="['fas', 'coins']"
                           :size="getSizeClass('fas')" />
      </span>
    </div>
    <div class="innerFlexContainerButton is-10" v-show="!statisticsVisible && !keyboardVisible">
      <ButtonBasic class="is-half marginBottomSmall marginRightSmall" icon="times" color="is-danger"
                   text="adventureButton1" @click="showMessageModal()" />
      <ButtonBasic v-show="!resultsVisible" class="is-half marginBottomSmall marginLeftSmall" icon="check"
                   color="is-success" text="adventureButton2" @click="checkInput()" />
      <ButtonBasic v-show="resultsVisible && currentWord + 1 !== words.words.length"
                   class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right" color="is-success"
                   text="adventureButton3" @click="nextWord()" />
      <ButtonBasic v-show="resultsVisible && currentWord + 1 === words.words.length"
                   class="is-half marginBottomSmall marginLeftSmall" icon="clipboard-check" color="is-success"
                   text="adventureButton4" @click="showStatistics()" />
      <ButtonBasic v-show="!resultsVisible" icon="briefcase" color="is-primary" text="adventureButton5"
                   @click="showItems()" />
      <ButtonBasic v-show="resultsVisible && !solutionVisible" icon="eye" color="is-info" text="adventureButton6"
                   @click="showSolution()" />
      <ButtonBasic v-show="resultsVisible && solutionVisible" icon="eye-slash" color="is-info" text="adventureButton7"
                   @click="hideSolution()" />
      <ButtonBasic v-show="introPlaying" icon="times" color="is-danger" text="adventureButton1"
                   @click="showMessageModal()" />
    </div>
    <TheProgressBar v-show="!statisticsVisible && !keyboardVisible" class="is-10" color="is-success"
                    :text="progressText" :value="progressBarCount" :maxValue="words.words.length" />
    <transition enter-active-class="animated fadeInUp super-fast"
                leave-active-class="animated fadeOutDown super-fast is-absolute">
      <div v-show="keyboardVisible" class="flexGrow fullWidth keyboard">
        <TabsBasic :names="keyboardNames" :selected="currentKeyboardTab" @click="setTab($event)" radiusless />
        <div class="bottomKeyboard">
          <div class="keyContainer">
            <ButtonText class="is-radiusless keyboardButton" :text="sign" v-for="(sign, index) in keyboardSigns"
                          :key="index" @click="addLetter(sign)" />
          </div>
        </div>
      </div>
    </transition> -->
    sth
  </div>
</template>

<script>
// import ButtonBasic from '@/components/ButtonBasic.vue'
// import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'AdventureInputs'
  // components: {
  //   ButtonBasic,
  //   ButtonIcon
  // }
}
</script>

<style lang="scss" scoped>
.flexboxContainer {
  display: flex;
  flex-direction: column;

  .innerFlexContainerInput {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    .is-1 {
      width: calc(100% / 12);
    }

    .is-10 {
      width: calc(100% / 1.2);
    }
  }
}
</style>
