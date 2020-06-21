<template>
  <div class="box itemBox noMarginBottom" :class="color" @click="$emit('click', item.id)">
    <span class="activeIcon has-text-success" v-show="equipped">
      <font-awesome-icon :icon="['fas', 'check-square']" :size="getSizeClass('fas')" />
    </span>
    <p class="content has-text-centered marginBottomSmall"
       :class="getSizeClass('content')">{{ getText(item.id) }}</p>
    <div class="box pictureBox flexGrow marginBottomSmall">
      <div class="fullHeight fullWidth backgroundPicture"
           :style="{ backgroundImage: 'url(' + baseUrl + itemData.spritePath + ')' }"></div>
    </div>
    <div class="fullWidth infoBar" v-if="hasInfoBar">
      <div class="content noMarginBottom" :class="getSizeClass('content')">
        x{{ item.quantity.toLocaleString() }}
      </div>
      <progress v-show="itemData.durability" class="progress flexGrow customProgress"
                :class="[getSizeClass('progress'), getProgressColor()]" :value="item.durability"
                :max="itemData.durability">
      </progress>
      <div v-show="itemData.healing && !itemData.durability" class="flexGrow"></div>
      <div v-show="itemData.healing" class="content noMarginBottom" :class="getSizeClass('content')">
        +{{ itemData.healing }}HP
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemBoxBasic',
  props: {
    item: Object,
    equipped: Boolean,
    hasInfoBar: Boolean
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
    },
    getProgressColor () {
      if (this.item.durability < this.itemData.durability / 3) {
        return 'is-danger'
      } else if (this.item.durability < this.itemData.durability / 1.5) {
        return 'is-warning'
      } else {
        return 'is-success'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flexGrow {
  flex-grow: 1;
}

.itemBox {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  padding: 1rem;

  .pictureBox {
    padding: .5rem;
  }

  .activeIcon {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 2px;
    height: 2px;
    line-height: 0px;
  }
}

.backgroundPicture {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.infoBar {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;

  .customProgress {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: .5rem;
    height: 12px;
  }
}
</style>
