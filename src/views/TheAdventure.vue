<template>
  <div class="flexContainer">
    <HeroWithTags title="adventureTitle" :tagObjects="tags" />
  </div>
</template>

<script>
import HeroWithTags from '@/components/HeroWithTags.vue'

export default {
  name: 'TheAdventure',
  components: {
    HeroWithTags
  },
  data () {
    return {
      currentWord: 0
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
          nameId: 'adventureDifficultyTag',
          valueId: 'difficulty' + this.$store.state.difficulty,
          color: this.difficultyColor
        },
        {
          nameId: 'adventureCountTag',
          valueId: this.$store.state.wordCount,
          color: 'is-primary'
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
}
</style>
