<template>
  <div class="flexboxContainer">
    <div class="itemContainer" v-if="items.length > 0">
      <ItemBoxSmall :item="item" v-for="item in items" :key="item.id" />
    </div>
    <div class="noItemsContainer" v-else>
      {{ getText('adventureStatisticsNoItems') }}
    </div>
    <BarChartBasic class="is-10" :title="$store.state.vueDict.vocabs.latinAlphabet" color="has-background-grey-lighter"
                   :values="$store.state.vueDict.correctLatinWords" />
    <BarChartBasic class="is-10" :title="$store.state.vueDict.vocabs.foreignAlphabet" color="has-background-grey-lighter"
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
import ItemBoxSmall from '@/components/ItemBoxSmall.vue'
import BarChartBasic from '@/components/BarChartBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'AdventureStatistics',
  components: {
    ItemBoxSmall,
    BarChartBasic,
    ButtonBasic
  },
  computed: {
    items () {
      return this.$store.state.canvasDict.collectedItems
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

  .itemContainer {
    display: flex;
    height: 25%;
    max-width: calc(100% / 1.2);
    overflow: auto;

    > :not(:last-child) {
      margin-right: .5rem;
    }
  }
}
</style>
