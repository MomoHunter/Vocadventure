<template>
  <nav class="status flex-row">
    <div class="status-item flex-column" :class="getSizeClass('general')" v-for="state in status" :key="state.id">
      <div class="name">
        {{ getText(state.id) }}
      </div>
      <div class="value">
        <span>
          {{ formatValue(state.count) }}
        </span>
        <span v-show="inAdventure" class="text-green">
          +{{ formatValue(state.additional) }}
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TheStatus',
  props: {
    status: Array
  },
  computed: {
    inAdventure () {
      if (this.$route.name) {
        return this.$route.name.startsWith('adventure')
      }
      return false
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    formatValue (value) {
      if (value < 1_000_000) {
        return value.toLocaleString()
      } else if (value < 1_000_000_000) {
        return (value / 1_000_000).toFixed(3) + 'M'
      } else if (value < 1_000_000_000_000) {
        return (value / 1_000_000_000).toFixed(3) + 'B'
      } else {
        return (value / 1_000_000_000_000).toFixed(3) + 'T'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.status {
  justify-content: space-around;
  padding: 5px 0;

  > .status-item {
    align-items: center;

    .name {
      text-transform: uppercase;
    }
  }

}
</style>
