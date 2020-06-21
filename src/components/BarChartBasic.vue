<template>
  <div class="box barChartContainer noMarginBottom" :class="color" v-show="values.length > 0">
    <span class="content inlineBlock flexGrow marginBottomSmall" :class="getSizeClass('content')">
      {{ getText(title) }}
    </span>
    <span class="content inlineBlock marginBottomSmall" :class="getSizeClass('content')">
      {{ percentage }}%
    </span>
    <div class="barContainer" :class="getSizeClass('barContainer')">
      <div class="block" :class="backgroundColor(value)" v-for="(value, index) in values" :key="index"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarChartBasic',
  props: {
    title: String,
    color: String,
    values: Array
  },
  computed: {
    percentage () {
      return (this.values.reduce((result, value) => {
        switch (value) {
          case 2:
            return result + 1
          case 1:
            return result + 0.5
          default:
            return result
        }
      }, 0) / this.values.length * 100).toFixed(2)
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    backgroundColor (value) {
      switch (value) {
        case 2:
          return 'has-background-success'
        case 1:
          return 'has-background-warning'
        default:
          return 'has-background-danger'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.barChartContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-radius: 6px;
  padding: .5rem;

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
    width: 100%;
    border-radius: 290486px;
    overflow: hidden;

    &.is-small {
      height: .75rem;
    }

    &.is-normal {
      height: 1rem;
    }

    &.is-medium {
      height: 1.5rem;
    }

    &.is-large {
      height: 2rem;
    }

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
