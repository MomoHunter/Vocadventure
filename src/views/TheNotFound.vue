<template>
  <div class="flexContainer justifyEvenly">
    <HeroBasic class="marginBottomSmall" title="notFoundTitle" subtitle="notFoundSubtitle" />
    <div class="is-10">
      <ButtonBasic color="is-success" icon="home" text="notFoundButton" @click="$router.push({ name: 'menu' })" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheNotFound',
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
  height: 100%;

  &.justifyEvenly {
    justify-content: center;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}
</style>
