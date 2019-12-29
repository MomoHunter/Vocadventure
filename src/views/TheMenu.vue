<template>
  <div class="flexContainer justifyEvenly">
    <TheHero :gD="gD" title="menuTitle" subtitle="menuSubtitle"/>
  </div>
</template>

<script>
import TheHero from '@/components/TheHero.vue'

export default {
  name: 'TheMenu',
  props: ['gD'],
  components: {
    TheHero
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  display: flex;
  flex-direction: column;

  .justifyEvenly {
    justify-content: space-evenly;
  }
}
</style>
