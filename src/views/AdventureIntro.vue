<template>
  <div class="flexboxContainer is-10">
    <div class="content flexGrow" :class="getSizeClass('content')">
      <blockquote class="overflowAuto">
        {{ displayedIntroText }}
      </blockquote>
    </div>
    <div class="innerFlexContainerButton">
      <ButtonBasic class="marginBottomSmall" icon="check" text="adventureIntroButton1" color="is-success"
                  @click="continueAction()" />
      <ButtonBasic class="is-half marginRightSmall" icon="times" text="adventureIntroButton2" color="is-danger"
                  @click="$emit('click', { type: 'abort' })" />
      <ButtonBasic class="is-half marginLeftSmall" icon="arrow-right" text="adventureIntroButton3" color="is-warning"
                  @click="$emit('click', { type: 'skipIntro' })" />
    </div>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'AdventureIntro',
  components: {
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
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
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
.flexboxContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 71px;

  &.is-10 {
    width: calc(100% / 1.2);
  }

  .is-half {
    width: calc(50% - .25rem);
  }

  .flexGrow {
    flex-grow: 1;
  }

  .overflowAuto {
    overflow: auto;
    max-height: 180px;
  }

  .innerFlexContainerButton {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
