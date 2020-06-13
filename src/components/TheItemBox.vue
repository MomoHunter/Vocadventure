<template>
  <div class="box itemBox noMarginBottom" @click="$emit('click', item.id)">
    <span class="activeIcon has-text-success" v-show="equipped">
      <font-awesome-icon :icon="['fas', 'check-square']" :size="getSizeClass('fas')" />
    </span>
    <p class="content has-text-centered marginBottomSmall"
       :class="getSizeClass('content')">{{ getText(item.id) }}</p>
    <div class="flexGrow fullWidth backgroundPicture"
         :style="{ backgroundImage: 'url(' + baseUrl + item.spritePath + ')' }"></div>
    <div class="fullWidth infoBar" v-if="hasInfoBar">
      <div class="content noMarginBottom" :class="getSizeClass('content')">
        {{ item.quantity }}
      </div>
      <progress v-show="item.durability" class="progress flexGrow customProgress"
                :class="[getSizeClass('progress'), getProgressColor(item)]" :value="item.durability"
                :max="item.maxDurability">
      </progress>
      <div v-show="item.healing && !item.durability" class="flexGrow"></div>
      <div v-show="item.healing" class="content noMarginBottom has-text-success" :class="getSizeClass('content')">
        +{{ item.healing }}HP
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheItemBox',
  props: {
    item: Object,
    equipped: Boolean,
    hasInfoBar: Boolean
  },
  computed: {
    baseUrl () {
      return process.env.BASE_URL
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    getProgressColor (item) {
      if (item.durability < item.maxDurability / 3) {
        return 'is-danger'
      } else if (item.durability < item.maxDurability / 1.5) {
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

.noMarginBottom {
  margin-bottom: 0px;
}

.itemBox {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

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
