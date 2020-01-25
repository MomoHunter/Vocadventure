<template>
  <div class="flexContainer justifyBetween">
    <div>
      <HeroWithTags title="adventureTitle" :tagObjects="tags" />
      <canvas id="adventureCanvas" width="600" height="300"></canvas>
    </div>
    <div class="innerFlexContainerInput">
      <span class="icon is-1" :class="[getSizeClass('icon'), latinIconColor]">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', latinIcon]" />
      </span>
      <input class="input is-rounded is-10" type="text" :placeholder="getText(words.latinAlphabet)"
             :class="[getSizeClass('input'), { 'is-link': solutionVisible}]" v-model="latinInput"
             :readonly="resultsVisible" />
      <span class="icon is-1 has-text-warning" :class="getSizeClass('icon')">
        <font-awesome-icon v-show="resultsVisible && isLatinCorrect" :icon="['fas', 'coins']" />
      </span>
    </div>
    <div class="innerFlexContainerInput">
      <span class="icon is-1" :class="[getSizeClass('icon'), foreignIconColor]">
        <font-awesome-icon v-show="resultsVisible" :icon="['fas', foreignIcon]" />
      </span>
      <input class="input is-rounded is-10" type="text" :placeholder="getText(words.foreignAlphabet)"
             :class="[getSizeClass('input'), { 'is-link': solutionVisible}]" v-model="foreignInput" readonly />
      <span class="icon is-1 has-text-warning" :class="getSizeClass('icon')">
        <font-awesome-icon v-show="resultsVisible && isForeignCorrect" :icon="['fas', 'coins']" />
      </span>
    </div>
    <div class="innerFlexContainerButton is-10">
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
    <TheProgressBar class="is-10" color="is-success" :text="progressText" :value="currentWord + 1"
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
      latinInput: '',
      foreignInput: '',
      userLatinInput: '',
      userForeignInput: '',
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
          valueId: this.$store.state.vueDict.wordCount,
          color: 'is-primary'
        },
        {
          nameId: 'adventureDifficultyTag',
          valueId: 'difficulty' + this.$store.state.vueDict.difficulty,
          color: this.difficultyColor
        }
      ]
    },
    difficultyColor () {
      switch (this.$store.state.vueDict.difficulty) {
        case '1':
          return 'is-success'
        case '2':
          return 'is-warning'
        default:
          return 'is-danger'
      }
    },
    words () {
      let vocabs = this.$store.getters['vueDict/getShuffledVocabs']
      let length = this.$store.state.vueDict.wordCount

      if (vocabs.words.length === length) {
        return vocabs
      } else {
        let wordObjects = [
          JSON.parse(JSON.stringify(vocabs.words[Math.random() * vocabs.words.length]))
        ]

        while (wordObjects.length < length) {
          let i = wordObjects.length
          let random = Math.random() * vocabs.words.length

          if (wordObjects[i - 1][vocabs.latinAlphabet] !== vocabs.words[random][vocabs.latinAlphabet]) {
            wordObjects.push(JSON.parse(JSON.stringify(vocabs.words[random])))
          }
        }

        vocabs.words = wordObjects

        return vocabs
      }
    },
    isLatinCorrect () {
      return this.userLatinInput.toLowerCase() === this.words.words[this.currentWord][this.words.latinAlphabet].toLowerCase()
    },
    latinIcon () {
      return this.isLatinCorrect ? 'check' : 'times'
    },
    latinIconColor () {
      return this.isLatinCorrect ? 'has-text-success' : 'has-text-danger'
    },
    isForeignCorrect () {
      return this.userForeignInput.toLowerCase() === this.words.words[this.currentWord][this.words.foreignAlphabet].toLowerCase()
    },
    foreignIcon () {
      return this.isForeignCorrect ? 'check' : 'times'
    },
    foreignIconColor () {
      return this.isForeignCorrect ? 'has-text-success' : 'has-text-danger'
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
      this.userLatinInput = this.latinInput
      this.userForeignInput = this.foreignInput
    },
    nextWord () {
      this.resultsVisible = false
      this.userLatinInput = ''
      this.userForeignInput = ''
    },
    showSolution () {
      this.solutionVisible = true
      this.latinInput = this.words.words[this.currentWord][this.words.latinAlphabet]
      this.foreignInput = this.words.words[this.currentWord][this.words.foreignAlphabet]
    },
    hideSolution () {
      this.solutionVisible = false
      this.latinInput = this.userLatinInput
      this.foreignInput = this.userForeignInput
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
  height: calc(100% - .5rem);

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
