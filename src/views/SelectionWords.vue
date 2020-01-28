<template>
  <div class="flexContainer spaceBetween">
    <HeroBasic title="selectionWordsTitle" subtitle="selectionWordsSubtitle" />
    <div class="is-10">
      <ButtonBasic color="is-danger" icon="arrow-left" text="selectionWordsButton1"
                   @click="$router.push({ name: 'category', params: { destination: 'kanji' } })" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'SelectionWords',
  components: {
    HeroBasic,
    ButtonBasic
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
  height: calc(100% - 71px);

  &.spaceBetween {
    justify-content: space-between;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}
</style>
