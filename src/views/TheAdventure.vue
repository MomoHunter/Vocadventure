<template>
  <div class="flexContainer">
    <HeroWithTags title="adventureTitle" :tagObjects="tags" />
    <canvas id="adventureCanvas" width="600" height="300"></canvas>
    <div class="innerFlexContainer">
      <span class="icon is-1" :class="[getSizeClass('icon'), romajiIconColor]">
        <font-awesome-icon :icon="['fas', romajiIcon]" />
      </span>
      <input class="input is-rounded is-10" type="text" :class="getSizeClass('input')" :placeholder="getText('romaji')"
             v-model="romajiInput" />
      <span class="icon is-1 has-text-warning" :class="getSizeClass('icon')">
        <font-awesome-icon :icon="['fas', 'coins']" />
      </span>
    </div>
    <div class="innerFlexContainer">
      <span class="icon is-1" :class="[getSizeClass('icon'), kanaIconColor]">
        <font-awesome-icon :icon="['fas', kanaIcon]" />
      </span>
      <input class="input is-rounded is-10" type="text" :class="getSizeClass('input')" :placeholder="getText('kana')"
             v-model="kanaInput" />
      <span class="icon is-1 has-text-warning" :class="getSizeClass('icon')">
        <font-awesome-icon :icon="['fas', 'coins']" />
      </span>
    </div>
    <TheProgressBar class="is-10" color="is-success" :text="progressText" :value="currentWord"
                    :maxValue="words.words.length" />
  </div>
</template>

<script>
import HeroWithTags from '@/components/HeroWithTags.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'

export default {
  name: 'TheAdventure',
  components: {
    HeroWithTags,
    TheProgressBar
  },
  data () {
    return {
      currentWord: 0,
      romajiInput: '',
      kanaInput: ''
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

  .is-1 {
    width: calc(100% / 12);
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}

.innerFlexContainer {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
