<template>
  <div class="notification items flex-row absolute at-bottom" :class="[getSizeClass('general'), color]">
    <div class="bar margin-right-small"></div>
    <div class="icon flex-column margin-right-medium">
      <font-awesome-icon :icon="['fas', icon]" :spin="spin" />
    </div>
    <div class="list flex-column flex-grow">
      <div class="title margin-bottom-small">
        {{ getText(title) }}
      </div>
      <div class="item-list flex-row overflow-auto">
        <ItemBoxBasic class="small" v-for="item in items" mode="small" :item="item" :key="item.id" />
      </div>
    </div>
    <button class="button close" :class="getSizeClass('general')" @click="$emit('click')">
      <font-awesome-icon :icon="['fas', 'times']" />
    </button>
  </div>
</template>

<script>
import ItemBoxBasic from '@/components/ItemBoxBasic.vue'

export default {
  name: 'NotificationItems',
  props: {
    title: String,
    color: String,
    icon: String,
    items: Array,
    spin: Boolean
  },
  components: {
    ItemBoxBasic
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
.notification {
  align-items: stretch;

  .icon {
    justify-content: center;
    align-items: center;
  }
}

.at-bottom {
  bottom: 0px;
}

.item-list {
  .item-box:not(:last-child) {
    margin-right: .5rem;
  }
}
</style>
