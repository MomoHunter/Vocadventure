<template>
  <div class="page">
    <HeroBasic title="writeKanjiTitle" :subtitle="[currentWord[$store.state.lang]]" />
    <div class="action-container">
      <DropdownButton icon="list" color="action" label="writeKanjiDropdown" :dropdownVisible="dropdownVisible"
                      @dropdown="toggleDropdown()" />
    </div>
    <DropdownMenu v-show="dropdownVisible" class="flex-grow" color="action" :selected="currentlySelected"
                  :vocabs="words" @click="newCurrentWord($event)" />
    <div v-show="!dropdownVisible" class="flex-grow flex-column">
      <div class="flex-column margin-top-mini margin-bottom-mini margin-left-mini">
        <TagBasic class="margin-bottom-mini" title="writeKanjiCategoryTag" :text="categoryName" color="info-2" />
        <TagBasic title="writeKanjiDifficultyTag" :text="difficulty" color="info-2" />
      </div>
      <div class="special-font flex-grow flex-row flex-center" v-maxFontSize>
        <div class="background" v-square>
          <div class="top left"></div>
          <div class="top right"></div>
          <div class="bottom left"></div>
          <div class="bottom right"></div>
        </div>
        <div class="letter">
          {{ currentLetter }}
        </div>
      </div>
    </div>
    <div class="button-container flex-row overflow-auto flex-shrink">
      <ButtonText :class="{ 'single-2': currentLetterIndex === index }"
                  v-for="(letter, index) in currentWord[words.foreignAlphabet]" color="info" :text="letter"
                  :key="index" @click="setCurrentLetter(index)" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-full" icon="arrow-left" color="red" text="writeKanjiButton1" @click="navTo()" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import DropdownButton from '@/components/DropdownButton.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import ButtonText from '@/components/ButtonText.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TagBasic from '@/components/TagBasic.vue'

export default {
  name: 'TheWriteKanji',
  components: {
    HeroBasic,
    DropdownButton,
    DropdownMenu,
    ButtonText,
    ButtonBasic,
    TagBasic
  },
  data () {
    return {
      dropdownVisible: false,
      currentlySelected: { category: '', index: 1 },
      currentCategory: '',
      currentWord: {},
      currentLetterIndex: 0
    }
  },
  beforeMount () {
    let storeLink = this.$store.state.vueDict.writeKanji
    if (storeLink) {
      this.setCurrentWord(storeLink.category, storeLink.index)
    } else {
      if (this.$store.state.vueDict.categoriesChosen.length === 0) {
        this.$router.push({ name: 'category', params: { destination: 'writeKanji' } })
      } else {
        this.setCurrentWord(this.$store.state.vueDict.categoriesChosen[0], 0)
      }
    }
  },
  computed: {
    words () {
      return this.$store.getters['vueDict/getVocabsWithCategories']
    },
    currentLetter () {
      if (this.currentWord[this.words.foreignAlphabet]) {
        return this.currentWord[this.words.foreignAlphabet][this.currentLetterIndex]
      }
      return 'あ'
    },
    categoryName () {
      let foundCategory = this.$store.getters['vueDict/getCategories'].find(category => {
        return category.id === this.currentCategory
      }, this)

      if (foundCategory) {
        return foundCategory.categoryName
      }
      return ''
    },
    difficulty () {
      return 'difficulty' + this.currentWord['difficulty']
    }
  },
  methods: {
    newCurrentWord (wordDetails) {
      this.setCurrentWord(wordDetails.category, wordDetails.index)
      this.hideDropdown()
    },
    setCurrentWord (category, index) {
      this.currentlySelected = { category: category, index: index }
      this.currentCategory = category
      this.currentLetterIndex = 0
      this.currentWord = this.words.words[category][index]
    },
    setCurrentLetter (index) {
      this.currentLetterIndex = index
    },
    getDifficultyColor (difficulty) {
      switch (difficulty) {
        case 1:
          return 'is-success'
        case 2:
          return 'is-warning'
        default:
          return 'is-danger'
      }
    },
    toggleDropdown () {
      this.dropdownVisible = !this.dropdownVisible
    },
    showDropdown () {
      this.dropdownVisible = true
    },
    hideDropdown () {
      this.dropdownVisible = false
    },
    navTo () {
      if (this.$store.state.vueDict.writeKanji) {
        this.$store.commit('vueDict/setWriteKanji', null)
        this.$router.push({ name: 'training' })
      } else {
        this.$router.push({ name: 'category', params: { destination: 'writeKanji' } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.special-font {
  font-family: "KanjiStrokeOrders";
  line-height: 0;
}
</style>
