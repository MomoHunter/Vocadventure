<template>
  <div class="flexContainer justifyEvenly">
    <TheHero title="menuTitle" subtitle="menuSubtitle"/>
    <div>
      Hier steht shit
    </div>
  </div>
</template>

<script>
import TheHero from '@/components/TheHero.vue'

export default {
  name: 'TheMenu',
  components: {
    TheHero
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;

  &.justifyEvenly {
    justify-content: space-evenly;
  }
}
</style>
