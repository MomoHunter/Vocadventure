<template>
  <div class="flexboxContainer">
    <BarChartBasic v-show="statisticsVisible" class="is-10" :title="words.latinAlphabet" :values="correctLatinWords" />
    <BarChartBasic v-show="statisticsVisible" class="is-10" :title="words.foreignAlphabet"
                   :values="correctForeignWords" />
    <div v-show="statisticsVisible" class="is-10">
      <ButtonBasic class="marginBottomSmall" icon="arrow-left" color="is-warning" text="adventureButton8"
                   @click="navTo('category')" />
      <ButtonBasic icon="check" color="is-success" text="adventureButton9" @click="navTo('menu')" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdventureStatistics'
}
</script>

<style lang="scss" scoped>
.flexboxContainer {
  display: flex;
  flex-direction: column;
}
</style>
