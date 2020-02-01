<template>
  <div class="flexContainer spaceBetween">
    <HeroWithTags class="marginBottomSmall" title="writeKanjiTitle" :subtitle="currentWord[$store.state.lang]"
                  :tagObjects="tags" />
    <div class="is-10 marginBottomSmall">
      <DropdownSpecial buttonText="writeKanjiDropdown" buttonColor="is-link" :vocabs="words"
                       @click="setCurrentWord($event.category, $event.index)" />
    </div>
    <div class="box is-10 flexGrow centerText specialFont" v-maxFontSize>
      <span>{{ currentWord[words.foreignAlphabet][currentLetter] }}</span>
    </div>
    <div class="field is-max-10 has-addons overflowAuto">
      <div class="control" v-for="(letter, index) in currentWord[words.foreignAlphabet]" :key="index">
        <ButtonText :text="letter" color="is-link" :selected="currentLetter === index" @click="setCurrentLetter(index)" />
      </div>
    </div>
    <div class="is-10">
      <ButtonBasic color="is-danger" icon="arrow-left" text="writeKanjiButton1"
                   @click="navBack()" />
    </div>
  </div>
</template>

<script>
import HeroWithTags from '@/components/HeroWithTags.vue'
import DropdownSpecial from '@/components/DropdownSpecial.vue'
import ButtonText from '@/components/ButtonText.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheWriteKanji',
  components: {
    HeroWithTags,
    DropdownSpecial,
    ButtonText,
    ButtonBasic
  },
  data () {
    return {
      currentCategory: '',
      currentWord: {},
      currentLetter: 0
    }
  },
  beforeMount () {
    let storeLink = this.$store.state.vueDict.writeKanji
    if (storeLink) {
      this.setCurrentWord(storeLink.category, storeLink.index)
    } else {
      this.setCurrentWord(this.$store.state.vueDict.categoriesChosen[0], 0)
    }
  },
  computed: {
    tags () {
      return [
        {
          nameId: 'writeKanjiCategoryTag',
          valueId: this.currentCategory,
          color: 'is-primary'
        },
        {
          nameId: 'writeKanjiDifficultyTag',
          valueId: 'difficulty' + this.currentWord['difficulty'],
          color: this.getDifficultyColor(this.currentWord['difficulty'])
        }
      ]
    },
    words () {
      return this.$store.getters['vueDict/getVocabsWithCategories']
    }
  },
  methods: {
    setCurrentWord (category, index) {
      this.currentCategory = category
      this.currentLetter = 0
      this.currentWord = this.words.words[category][index]
    },
    setCurrentLetter (index) {
      this.currentLetter = index
    },
    getDifficultyColor (difficulty) {
      switch (difficulty) {
        case '1':
          return 'is-success'
        case '2':
          return 'is-warning'
        default:
          return 'is-danger'
      }
    },
    navBack () {
      if (this.$store.state.vueDict.writeKanji) {
        this.$store.commit('vueDict/setWriteKanji', null)
        this.$router.push({ name: 'training' })
      } else {
        this.$router.push({ name: 'category', params: { destination: 'kanji' } })
      }
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
  align-items: center;
  height: calc(100% - 71px);

  &.spaceBetween {
    justify-content: space-between;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }

  .is-max-10 {
    max-width: calc(100% / 1.2);
  }

  .flexGrow {
    flex-grow: 1;
  }

  .overflowAuto {
    overflow: auto;
  }

  .centerText {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .specialFont {
    font-family: "KanjiStrokeOrders";
    line-height: 0;
  }
}
</style>
