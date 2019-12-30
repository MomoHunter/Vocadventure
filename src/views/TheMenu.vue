<template>
  <div class="flexContainer justifyEvenly">
    <TheHero title="menuTitle" subtitle="menuSubtitle"/>
    <div class="is-10" v-show="!query">
      <ButtonBasic class="marginBottomSmall" color="is-info" icon="book" :text="getText('menuButton1')"
                   @click="$router.push({ name: 'menu', query: { sub: 'training' } })" />
      <ButtonBasic class="marginBottomSmall" color="is-link" icon="gem" :text="getText('menuButton2')"
                   @click="$router.push({ name: 'menu', query: { sub: 'adventure' } })" />
      <ButtonBasic class="marginBottomSmall" color="is-dark" icon="cog" :text="getText('menuButton3')"
                   @click="$router.push({ name: 'settings' })" />
    </div>
    <div class="is-10" v-show="query === 'training'">
      <ButtonBasic class="marginBottomSmall" color="is-info" icon="book" :text="getText('menuTrainingButton1')"
                   @click="$router.push({ name: 'selection', params: { destination: 'training' } })" />
      <ButtonBasic class="marginBottomSmall" color="is-success" icon="pen" :text="getText('menuTrainingButton2')"
                   @click="$router.push('/')" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" :text="getText('menuTrainingButton3')"
                   @click="$router.push('/')" />
    </div>
    <div class="is-10" v-show="query === 'adventure'">
      <ButtonBasic class="marginBottomSmall" color="is-link" icon="gem" :text="getText('menuAdventureButton1')"
                   @click="$router.push({ name: 'selection', params: { destination: 'adventure' } })" />
      <ButtonBasic class="marginBottomSmall" color="is-warning" icon="shopping-cart" :text="getText('menuAdventureButton2')"
                   @click="$router.push('/')" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" :text="getText('menuAdventureButton3')"
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
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  height: 100%;

  &.justifyEvenly {
    justify-content: space-evenly;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}

.marginBottomSmall {
  margin-bottom: 0.5rem;
}
</style>
