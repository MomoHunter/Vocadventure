<template>
  <div class="flexContainer spaceBetween">
    <HeroWithTags class="marginBottomSmall" title="writeKanjiTitle" :tagObjects="tags" />
    <div class="is-10 marginBottomSmall">
      <DropdownSpecial buttonText="writeKanjiDropdown" buttonColor="is-link" :vocabs="words" />
    </div>
    <div class="is-10 box flexGrow">
    </div>
    <div class="is-10">
      <ButtonBasic color="is-danger" icon="arrow-left" text="writeKanjiButton1"
                   @click="$router.push({ name: 'category', params: { destination: 'kanji' } })" />
    </div>
  </div>
</template>

<script>
import HeroWithTags from '@/components/HeroWithTags.vue'
import DropdownSpecial from '@/components/DropdownSpecial.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheWriteKanji',
  components: {
    HeroWithTags,
    DropdownSpecial,
    ButtonBasic
  },
  computed: {
    tags () {
      return [
        {
          nameId: 'writeKanjiCategoryTag',
          valueId: '',
          color: 'is-primary'
        },
        {
          nameId: 'writeKanjiDifficultyTag',
          valueId: '',
          color: 'is-danger'
        }
      ]
    },
    words () {
      return this.$store.getters['vueDict/getVocabsWithCategories']
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

  .flexGrow {
    flex-grow: 1;
  }
}
</style>
