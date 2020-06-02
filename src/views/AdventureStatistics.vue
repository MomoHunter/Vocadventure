<template>
  <div class="flexboxContainer">
    <BarChartBasic class="is-10" :title="$store.state.vueDict.vocabs.latinAlphabet"
                   :values="$store.state.vueDict.correctLatinWords" />
    <BarChartBasic class="is-10" :title="$store.state.vueDict.vocabs.foreignAlphabet"
                   :values="$store.state.vueDict.correctForeignWords" />
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" icon="arrow-left" color="is-warning" text="adventureStatisticsButton1"
                   @click="$emit('click', { type: 'navTo', value: 'category' })" />
      <ButtonBasic icon="check" color="is-success" text="adventureStatisticsButton2"
                   @click="$emit('click', { type: 'navTo', value: 'menu' })" />
    </div>
  </div>
</template>

<script>
import BarChartBasic from '@/components/BarChartBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'AdventureStatistics',
  components: {
    BarChartBasic,
    ButtonBasic
  }
}
</script>

<style lang="scss" scoped>
.flexboxContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 71px;

  .is-10 {
    width: calc(100% / 1.2);
  }
}
</style>
