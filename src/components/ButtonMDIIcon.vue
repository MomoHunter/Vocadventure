<template>
  <button class="button" :class="[getSizeClass('general'), color]" @click="$emit('click')">
    <span class="icon">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonMDIIcon',
  props: {
    color: String
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  justify-content: center;
  align-items: center;
}
</style>
