<template>
  <div class="flexContainer spaceBetween">
    <HeroBasic title="trainingTitle" />
    <div class="field is-10 is-grouped is-grouped-multiline">
      <div class="control fullWidth">
        <TagBasic textOne="trainingCategoryTag" :textTwo="words.words[currentWord].category" colorTwo="is-primary" />
      </div>
      <div class="control fullWidth">
        <div class="box">
          <div class="content has-text-centered" :class="getSizeClass('content')">
            {{ words.words[currentWord][$store.state.lang] }}
          </div>
        </div>
      </div>
    </div>
    <div class="field is-10">
      <label class="label" :class="getSizeClass('label')">
        {{ getText(words.latinAlphabet) }}
      </label>
      <InputReadonly type="text" :value="getLatinWord" />
    </div>
    <div class="field is-10">
      <label class="label" :class="getSizeClass('label')">
        {{ getText(words.foreignAlphabet) }}
      </label>
      <InputReadonly type="text" :value="getForeignWord" />
    </div>
    <div class="innerFlexContainer is-10" :class="currentWord === 0 ? 'dirBackward' : 'dirForward'">
      <ButtonBasic v-show="currentWord !== 0" class="is-half marginBottomSmall marginRightSmall" icon="arrow-left"
                   color="is-warning" text="trainingButton1" @click="previousWord()" />
      <ButtonBasic v-show="currentWord + 1 !== words.words.length" class="is-half marginBottomSmall marginLeftSmall"
                   icon="arrow-right" color="is-success" text="trainingButton2" @click="nextWord()" />
      <ButtonBasic v-show="currentWord + 1 === words.words.length" class="is-half marginBottomSmall marginLeftSmall"
                   icon="check" color="is-success" text="trainingButton3" @click="navToMenu()" />
      <ButtonBasic icon="times" color="is-danger" text="trainingButton4"
                   @click="$router.push({ name: 'category', params: { destination: 'training' } })" />
    </div>
    <TheProgressBar class="is-10 marginBottomSmall" color="is-success" :value="currentWord + 1"
                    :maxValue="words.words.length" :text="progressText" />
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import TagBasic from '@/components/TagBasic.vue'
import InputReadonly from '@/components/InputReadonly.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'

export default {
  name: 'TheTraining',
  components: {
    HeroBasic,
    TagBasic,
    InputReadonly,
    ButtonBasic,
    TheProgressBar
  },
  data () {
    return {
      currentWord: 0
    }
  },
  computed: {
    words () {
      return this.$store.getters.getShuffledVocabs
    },
    tags () {
      return [
        {
          nameId: 'trainingCategoryTag',
          valueId: this.words.words[this.currentWord].category
        }
      ]
    },
    getLatinWord () {
      return this.words.words[this.currentWord][this.words.latinAlphabet]
    },
    getForeignWord () {
      return this.words.words[this.currentWord][this.words.foreignAlphabet]
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
    previousWord () {
      if (this.currentWord > 0) {
        this.currentWord--
      }
    },
    nextWord () {
      if (this.currentWord + 1 < this.words.words.length) {
        this.currentWord++
      }
    },
    navToMenu () {
      this.$store.commit('setCategories', [])
      this.$router.push({ name: 'menu' })
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

  &.spaceBetween {
    justify-content: space-between;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}

.innerFlexContainer {
  display: flex;
  flex-wrap: wrap;

  &.dirForward {
    flex-direction: row;
  }

  &.dirBackward {
    flex-direction: row-reverse;
  }

  .is-half {
    width: calc(50% - .25rem);
  }
}
</style>
