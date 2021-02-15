<template>
  <div class="box outerBox noMarginBottom" :class="[color, getSizeClass('itemBox')]">
    <div class="box innerBox">
      <div class="fullHeight fullWidth backgroundPicture"
           :style="{ backgroundImage: 'url(' + baseUrl + itemData.spritePath + ')' }"></div>
    </div>
    <div class="content has-text-right" :class="getSizeClass('content')">
      <span :class="inventoryCountClass" v-if="hasInventoryCount">{{ quantityText.own }}</span>
      <span v-if="hasInventoryCount"> / </span>
      <span>{{ quantityText.needed }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemBoxSmall',
  props: {
    item: Object,
    hasInventoryCount: Boolean
  },
  computed: {
    baseUrl () {
      return process.env.BASE_URL
    },
    itemData () {
      return this.$store.getters['vueDict/getItemObject'](this.item.id)
    },
    color () {
      if (this.itemData.categories.includes('weapon')) {
        return 'is-primary'
      } else if (this.itemData.categories.includes('consumable')) {
        return 'is-success'
      } else if (this.itemData.categories.includes('armor')) {
        return 'is-warning'
      } else {
        return 'is-basic'
      }
    },
    inventoryCount () {
      if (!this.hasInventoryCount) {
        return 0
      }
      let inventoryObject = this.$store.getters['vueDict/getInventoryObject'](this.item.id)
      let collectedItem = this.$store.state.canvasDict.collectedItems.find(item => item.id === this.item.id)
      return (collectedItem ? collectedItem.quantity : 0) + (inventoryObject ? inventoryObject.quantity : 0)
    },
    quantityText () {
      if (!this.hasInventoryCount) {
        return {
          needed: `x${this.item.quantity.toLocaleString()}`
        }
      }
      return {
        own: `x${this.inventoryCount.toLocaleString()}`,
        needed: `x${this.item.quantity.toLocaleString()}`
      }
    },
    inventoryCountClass () {
      if (!this.hasInventoryCount) {
        return ''
      } else if (this.item.quantity > this.inventoryCount) {
        return 'has-text-danger'
      }
      return 'has-text-success'
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.outerBox {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: .25rem;
  width: 4em;
  height: 6em;
  position: relative;

  &.is-small {
  width: 3em;
  height: 4.5em;
  }

  &.is-medium {
  width: 5em;
  height: 7.5em;
  }

  &.is-large {
  width: 6em;
  height: 9em;
  }

  .innerBox {
    padding: .35rem;
    flex-grow: 1;
    margin-bottom: .25rem;

    .backgroundPicture {
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
}
</style>
