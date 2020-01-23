<template>
  <div class="flexContainer justifyBetween">
    <div>
      <HeroWithTags title="adventureTitle" :tagObjects="tags" />
      <canvas id="adventureCanvas" width="600" height="300"></canvas>
    </div>
    <div class="innerFlexContainerInput">
      <span v-show="resultsVisible" class="icon is-1" :class="[getSizeClass('icon'), romajiIconColor]">
        <font-awesome-icon :icon="['fas', romajiIcon]" />
      </span>
      <input class="input is-rounded is-10" type="text" :class="getSizeClass('input')" :placeholder="getText('romaji')"
             v-model="romajiInput" />
      <span v-show="resultsVisible" class="icon is-1 has-text-warning" :class="getSizeClass('icon')">
        <font-awesome-icon :icon="['fas', 'coins']" />
      </span>
    </div>
    <div class="innerFlexContainerInput">
      <span v-show="resultsVisible" class="icon is-1" :class="[getSizeClass('icon'), kanaIconColor]">
        <font-awesome-icon :icon="['fas', kanaIcon]" />
      </span>
      <input class="input is-rounded is-10" type="text" :class="getSizeClass('input')" :placeholder="getText('kana')"
             v-model="kanaInput" />
      <span v-show="resultsVisible" class="icon is-1 has-text-warning" :class="getSizeClass('icon')">
        <font-awesome-icon :icon="['fas', 'coins']" />
      </span>
    </div>
    <div class="innerFlexContainerButton is-10" :class="currentWord === 0 ? 'dirBackward' : 'dirForward'">
      <ButtonBasic class="is-half marginBottomSmall marginRightSmall" icon="times" color="is-danger"
                   text="adventureButton1" @click="showAbortModal()" />
      <ButtonBasic v-show="!resultsVisible" class="is-half marginBottomSmall marginLeftSmall" icon="check"
                   color="is-success" text="adventureButton2" @click="checkInput()" />
      <ButtonBasic v-show="resultsVisible" class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right"
                   color="is-success" text="adventureButton3" @click="nextWord()" />
      <ButtonBasic v-show="!resultsVisible" icon="briefcase" color="is-primary" text="adventureButton4"
                   @click="showItems()" />
      <ButtonBasic v-show="resultsVisible && !solutionVisible" icon="eye" color="is-link" text="adventureButton5"
                   @click="showSolution()" />
      <ButtonBasic v-show="resultsVisible && solutionVisible" icon="eye-slash" color="is-link" text="adventureButton6"
                   @click="hideSolution()" />
    </div>
    <TheProgressBar class="is-10" color="is-success" :text="progressText" :value="currentWord"
                    :maxValue="words.words.length" />
  </div>
</template>

<script>
import HeroWithTags from '@/components/HeroWithTags.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'

export default {
  name: 'TheAdventure',
  components: {
    HeroWithTags,
    ButtonBasic,
    TheProgressBar
  },
  data () {
    return {
      currentWord: 0,
      romajiInput: '',
      kanaInput: '',
      resultsVisible: false,
      solutionVisible: false
    }
  },
  computed: {
    tags () {
      return [
        {
          nameId: 'adventureCategoryTag',
          valueId: this.words.words[this.currentWord].category,
          color: 'is-primary'
        },
        {
          nameId: 'adventureCountTag',
          valueId: this.$store.state.wordCount,
          color: 'is-primary'
        },
        {
          nameId: 'adventureDifficultyTag',
          valueId: 'difficulty' + this.$store.state.difficulty,
          color: this.difficultyColor
        }
      ]
    },
    difficultyColor () {
      switch (this.$store.state.difficulty) {
        case '1':
          return 'is-success'
        case '2':
          return 'is-warning'
        default:
          return 'is-danger'
      }
    },
    words () {
      return this.$store.getters.getShuffledVocabs
    },
    isRomajiCorrect () {
      return this.romajiInput.toLowerCase() === this.words.words[this.currentWord].romaji.toLowerCase()
    },
    romajiIcon () {
      return this.isRomajiCorrect ? 'check' : 'times'
    },
    romajiIconColor () {
      return this.isRomajiCorrect ? 'has-text-success' : 'has-text-danger'
    },
    isKanaCorrect () {
      return this.kanaInput.toLowerCase() === this.words.words[this.currentWord].kana.toLowerCase()
    },
    kanaIcon () {
      return this.isKanaCorrect ? 'check' : 'times'
    },
    kanaIconColor () {
      return this.isKanaCorrect ? 'has-text-success' : 'has-text-danger'
    },
    progressText () {
      return (this.currentWord + 1) + ' / ' + this.words.words.length
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    showItems () {

    },
    showAbortModal () {

    },
    checkInput () {
      this.resultsVisible = true
    },
    nextWord () {
      this.resultsVisible = false
    },
    showSolution () {
      this.solutionVisible = true
    },
    hideSolution () {
      this.solutionVisible = false
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
  height: 100%;

  &.justifyBetween {
    justify-content: space-between;
  }

  .is-1 {
    width: calc(100% / 12);
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}

.innerFlexContainerInput {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.innerFlexContainerButton {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  .is-half {
    width: calc(50% - .25rem);
  }
}
</style>
