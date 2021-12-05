<template>
  <div class="adventure-page">
    <div class="story flex-grow overflow-auto">
      <TheBlockquote v-show="displayedStoryText !== ''" :text="displayedStoryText" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="times" text="adventureStoryButton2" color="red"
                  @click="$emit('click', { type: 'abort' })" />
      <ButtonBasic class="width-half" icon="check" text="adventureStoryButton1" color="green"
                  @click="continueAction()" />
      <ButtonBasic class="width-full" icon="arrow-right" text="adventureStoryButton3" color="yellow"
                  @click="$emit('click', { type: 'skipStoryPart' })" />
    </div>
  </div>
</template>

<script>
import TheBlockquote from '@/components/TheBlockquote.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'AdventureStory',
  components: {
    TheBlockquote,
    ButtonBasic
  },
  data () {
    return {
      displayedStoryText: '',
      currentTextIndex: 0
    }
  },
  computed: {
    fragments () {
      return this.$store.state.canvasDict.fragments
    },
    storyFragment () {
      return this.$store.state.canvasDict.storyFragment
    },
    storyPart () {
      return this.$store.state.canvasDict.storyPart
    },
    storyTextId () {
      return `adventureStoryF${this.storyFragment}P${this.storyPart}`
    },
    storyText () {
      return this.getText(this.storyTextId)
    },
    storyTextCharacter () {
      return this.storyText.split('')
    },
    newCharacterTrigger () {
      return Math.floor(this.$store.state.canvasDict.frameNo / 3)
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    continueAction () {
      if (this.displayedStoryText === this.storyText || this.storyText === this.storyTextId) {
        if (this.fragments[this.storyFragment].updateCalls.length > this.storyPart) {
          this.$store.commit('canvasDict/setStoryPart', this.storyPart + 1)
          this.$emit('click', { type: 'continueStory' })
        }
        // this.displayedStoryText = ''
        // this.currentTextIndex = 0
        // this.$store.commit('canvasDict/setStoryWritesText', true)
      } else {
        this.displayedStoryText = this.storyText
        this.$store.commit('canvasDict/setStoryWritesText', false)
      }
    }
  },
  watch: {
    newCharacterTrigger () {
      if (this.$store.state.canvasDict.storyWritesText && this.storyText !== this.storyTextId) {
        this.displayedStoryText += this.storyTextCharacter[this.currentTextIndex]
        if (this.currentTextIndex < this.storyText.length - 1) {
          this.currentTextIndex += 1
        } else {
          this.$store.commit('canvasDict/setStoryWritesText', false)
        }
      }
    },
    storyPart () {
      this.displayedStoryText = ''
      this.currentTextIndex = 0
      if (this.storyText === this.storyTextId) {
        this.$store.commit('canvasDict/setStoryWritesText', false)
      } else {
        this.$store.commit('canvasDict/setStoryWritesText', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.story {
  height: 1rem;
}
</style>
