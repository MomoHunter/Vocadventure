<template>
  <article class="message atTop" :class="color">
    <div class="message-header" :class="color">
      <p>{{ getText(title) }}</p>
      <button class="delete" @click="$emit('click')"></button>
    </div>
    <div class="message-body">
      <div class="boxContainer">
        <ItemBoxBasic class="customBox fullHeight" :item="item" v-for="item in items" :key="item.id" hasInfoBar />
      </div>
    </div>
  </article>
</template>

<script>
import ItemBoxBasic from '@/components/ItemBoxBasic.vue'

export default {
  name: 'NotificationItems',
  components: {
    ItemBoxBasic
  },
  props: {
    title: String,
    color: String,
    items: Array
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
.atTop {
  position: absolute;
  top: 0px;
}

.boxContainer {
  overflow-y: hidden;
  overflow-x: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 200px;

  .customBox {
    min-width: 150px;
    position: relative;

    &:first-child {
      margin-left: auto;
    }

    &:not(:last-child) {
      margin-right: .5rem;
    }

    &:last-child {
      margin-right: auto;
    }
  }
}
</style>
