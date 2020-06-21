<template>
  <div class="box outerBox noMarginBottom" :class="color">
    <div class="box innerBox">
      <div class="fullHeight fullWidth backgroundPicture"
           :style="{ backgroundImage: 'url(' + baseUrl + itemData.spritePath + ')' }"></div>
    </div>
    <div class="content has-text-right" :class="getSizeClass('content')">
      x{{ item.quantity.toLocaleString() }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemBoxSmall',
  props: {
    item: Object
  },
  computed: {
    baseUrl () {
      return process.env.BASE_URL
    },
    itemData () {
      return this.$store.getters['vueDict/getItemObject'](this.item.id)
    },
    color () {
      switch (this.itemData.category) {
        case 'weapon':
          return 'is-primary'
        case 'consumable':
          return 'is-success'
        case 'armor':
          return 'is-warning'
        default:
          return 'is-basic'
      }
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
