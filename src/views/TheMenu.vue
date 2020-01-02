<template>
  <div class="flexContainer justifyEvenly">
    <TheHero title="menuTitle" subtitle="menuSubtitle"/>
    <div class="is-10" v-show="!query">
      <ButtonBasic class="marginBottomSmall" color="is-info" icon="book" text="menuButton1"
                   @click="$router.push({ name: 'menu', query: { sub: 'training' } })" />
      <ButtonBasic class="marginBottomSmall" color="is-link" icon="gem" text="menuButton2"
                   @click="$router.push({ name: 'menu', query: { sub: 'adventure' } })" />
      <ButtonBasic class="marginBottomSmall" color="is-dark" icon="cog" text="menuButton3"
                   @click="$router.push({ name: 'settings' })" />
    </div>
    <div class="is-10" v-show="query === 'training'">
      <ButtonBasic class="marginBottomSmall" color="is-info" icon="book" text="menuTrainingButton1"
                   @click="$router.push({ name: 'selection', params: { destination: 'training' } })" />
      <ButtonBasic class="marginBottomSmall" color="is-success" icon="pen" text="menuTrainingButton2"
                   @click="$router.push('/')" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" text="menuTrainingButton3"
                   @click="$router.push('/')" />
    </div>
    <div class="is-10" v-show="query === 'adventure'">
      <ButtonBasic class="marginBottomSmall" color="is-link" icon="gem" text="menuAdventureButton1"
                   @click="$router.push({ name: 'selection', params: { destination: 'adventure' } })" />
      <ButtonBasic class="marginBottomSmall" color="is-warning" icon="shopping-cart" text="menuAdventureButton2"
                   @click="$router.push('/')" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" text="menuAdventureButton3"
                   @click="$router.push('/')" />
    </div>
  </div>
</template>

<script>
import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheMenu',
  components: {
    TheHero,
    ButtonBasic
  },
  computed: {
    query () {
      return this.$route.query.sub
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
  flex-wrap: wrap;
  align-items: center;
  height: 100%;

  div {
    margin-top: 1rem;
  }

  &.justifyEvenly {
    justify-content: space-evenly;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}
</style>
