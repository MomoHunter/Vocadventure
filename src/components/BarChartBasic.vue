<template>
  <div class="barChartContainer">
    <span class="content inlineBlock flexGrow">
      {{ getText(title) }}
    </span>
    <span class="content inlineBlock">
      {{ percentage }}%
    </span>
    <div class="barContainer">
      <div class="block" :class="value ? 'has-background-success' : 'has-background-danger'"
           v-for="(value, index) in values" :key="index"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarChartBasic',
  props: {
    title: String,
    values: Array
  },
  computed: {
    percentage () {
      return (this.values.reduce((result, value) => {
        return value ? result + 1 : result
      }, 0) / this.values.length * 100).toFixed(2)
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
.barChartContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .inlineBlock {
    display: inline-block;
  }

  .flexGrow {
    flex-grow: 1;
  }

  .barContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 1.5rem;
    width: 100%;

    .block {
      flex-grow: 1;
      height: 100%;

      &:not(:last-child) {
        margin-right: -1px;
      }
    }
  }
}
</style>
