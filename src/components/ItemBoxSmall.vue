<template>
  <div class="box outerBox noMarginBottom" :class="color">
    <div class="box innerBox">
      <div class="fullHeight fullWidth backgroundPicture"
           :style="{ backgroundImage: 'url(' + baseUrl + itemData.spritePath + ')' }"></div>
    </div>
    <div class="content has-text-right" :class="getSizeClass('content')">
      {{ quantityText }}
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
    quantityText () {
      if (this.hasInventoryCount) {
        let inventoryData = this.$store.getters['vueDict/getInventoryObject'](this.item.id)
        return `x${inventoryData.quantity.toLocaleString()} / x${this.item.quantity.toLocaleString()}`
      }
      return `x${this.item.quantity.toLocaleString()}`
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
  min-width: 65px;
  height: 100%;
  position: relative;

  .innerBox {
    padding: .5rem;
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
