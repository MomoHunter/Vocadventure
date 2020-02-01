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
    <div class="field is-full is-grouped is-grouped-multiline is-grouped-centered">
      <label class="label is-10 marginFilling" :class="getSizeClass('label')">
        {{ getText(words.foreignAlphabet) }}
      </label>
      <div class="control is-1 is-marginless"></div>
      <InputReadonly class="is-10 is-marginless" type="text" :value="getForeignWord" />
      <div class="control is-1 is-marginless centerIcon" @click="navTo('kanji')">
        <span class="icon has-text-success" :class="getSizeClass('icon')">
          <font-awesome-icon :icon="['fas', 'edit']" />
        </span>
      </div>
    </div>
    <div class="innerFlexContainer is-10" :class="currentWord === 0 ? 'dirBackward' : 'dirForward'">
      <ButtonBasic v-show="currentWord !== 0" class="is-half marginBottomSmall marginRightSmall" icon="arrow-left"
                   color="is-warning" text="trainingButton1" @click="previousWord()" />
      <ButtonBasic v-show="currentWord + 1 !== words.words.length" class="is-half marginBottomSmall marginLeftSmall"
                   icon="arrow-right" color="is-success" text="trainingButton2" @click="nextWord()" />
      <ButtonBasic v-show="currentWord + 1 === words.words.length" class="is-half marginBottomSmall marginLeftSmall"
                   icon="check" color="is-success" text="trainingButton3" @click="navTo('menu')" />
      <ButtonBasic icon="times" color="is-danger" text="trainingButton4"
                   @click="$router.push({ name: 'category', params: { destination: 'training' } })" />
    </div>
    <TheProgressBar class="is-10" color="is-success" :value="currentWord + 1" :maxValue="words.words.length"
                    :text="progressText" />
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
      currentWord: 0,
      storedWords: null
    }
  },
  beforeMount () {
    let stash = this.$store.state.vueDict.trainingStash
    if (stash) {
      this.storedWords = stash.storedWords
      this.currentWord = stash.currentWord
      this.$store.commit('vueDict/setTrainingStash', null)
    }
  },
  computed: {
    words () {
      return this.storedWords || this.$store.getters['vueDict/getShuffledVocabs']
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
    navTo (destination) {
      if (destination === 'menu') {
        this.$store.commit('vueDict/setCategories', [])
      } else {
        this.$store.commit('vueDict/setWriteKanji', {
          category: this.words.words[this.currentWord].category,
          index: this.words.words[this.currentWord].index
        })
        this.$store.commit('vueDict/setTrainingStash', {
          currentWord: this.currentWord,
          storedWords: this.words
        })
      }
      this.$router.push({ name: destination })
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

  &.spaceBetween {
    justify-content: space-between;
  }

  .is-full {
    width: 100%;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }

  .is-1 {
    width: calc(100% / 12);
  }

  .marginFilling {
    margin-left: calc(100% / 12);
    margin-right: calc(100% / 12);
  }

  .centerIcon {
    display: flex;
    align-items: center;
    justify-content: center;
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
