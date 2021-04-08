<template>
  <div class="notification flex-row absolute at-bottom" :class="[getSizeClass('general'), color]">
    <div class="bar margin-right-small"></div>
    <div class="icon flex-column margin-right-medium">
      <i class="fas" :class="['fa-' + icon, { 'fa-spin': spin }]"></i>
    </div>
    <div class="flex-column flex-grow">
      <div class="title">
        {{ getText(title) }}
      </div>
      <div class="text" v-html="getText(...text)"></div>
    </div>
    <button class="button close" :class="getSizeClass('general')" @click="$emit('click')">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'NotificationBasic',
  props: {
    title: String,
    text: Array,
    color: String,
    icon: String,
    spin: Boolean
  },
  methods: {
    getText (id, ...params) {
      return this.$store.getters.getText(id, ...params)
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
</style>
