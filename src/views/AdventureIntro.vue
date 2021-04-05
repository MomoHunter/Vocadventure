<template>
  <div class="adventure-page">
    <div class="story flex-grow overflow-auto">
      <TheBlockquote v-show="displayedIntroText !== ''" :text="displayedIntroText" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="times" text="adventureIntroButton2" color="red"
                  @click="$emit('click', { type: 'abort' })" />
      <ButtonBasic class="width-half" icon="check" text="adventureIntroButton1" color="green"
                  @click="continueAction()" />
      <ButtonBasic class="width-full" icon="arrow-right" text="adventureIntroButton3" color="yellow"
                  @click="$emit('click', { type: 'skipIntro' })" />
    </div>
  </div>
</template>

<script>
import TheBlockquote from '@/components/TheBlockquote.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'AdventureIntro',
  components: {
    TheBlockquote,
    ButtonBasic
  },
  data () {
    return {
      currentIntroPart: 1,
      displayedIntroText: '',
      currentTextIndex: 0,
      writesText: true
    }
  },
  computed: {
    introText () {
      return this.getText('adventureIntroPart' + this.currentIntroPart).split('')
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
      if (this.displayedIntroText === this.getText('adventureIntroPart' + this.currentIntroPart)) {
        if (this.currentIntroPart < 8) {
          this.currentIntroPart += 1
          this.$emit('click', { type: 'continueIntro' })
        } else {
          this.$emit('click', { type: 'skipIntro' })
        }
        this.displayedIntroText = ''
        this.currentTextIndex = 0
        this.writesText = true
      } else {
        this.displayedIntroText = this.getText('adventureIntroPart' + this.currentIntroPart)
        this.writesText = false
      }
    }
  },
  watch: {
    newCharacterTrigger () {
      if (this.writesText) {
        this.displayedIntroText += this.introText[this.currentTextIndex]
        if (this.currentTextIndex < this.introText.length - 1) {
          this.currentTextIndex += 1
        } else {
          this.writesText = false
        }
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
