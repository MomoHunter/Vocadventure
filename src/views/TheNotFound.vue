<template>
  <div class="flexContainer justifyEvenly">
    <TheHero title="notFoundTitle" subtitle="notFoundSubtitle"></TheHero>
    <div class="is-10">
      <ButtonBasic color="is-success" icon="home" text="notFoundButton" @click="$router.push({ name: 'menu' })" />
    </div>
  </div>
</template>

<script>
import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheNotFound',
  components: {
    TheHero,
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
