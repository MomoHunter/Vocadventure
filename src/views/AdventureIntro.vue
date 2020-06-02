<template>
  <div class="flexboxContainer is-10">
    <ButtonBasic class="marginBottomSmall" icon="arrow-right" text="adventureIntroButton1" color="is-warning"
                 @click="$emit('click', { type: 'skipIntro' })" />
    <ButtonBasic icon="times" text="adventureIntroButton2" color="is-danger"
                 @click="$emit('click', { type: 'abort' })" />
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'AdventureIntro',
  components: {
    ButtonBasic
  }
}
</script>

<style lang="scss" scoped>
.flexboxContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  padding-bottom: 71px;

  &.is-10 {
    width: calc(100% / 1.2);
  }
}
</style>
