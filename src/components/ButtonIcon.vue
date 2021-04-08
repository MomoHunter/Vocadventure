<template>
  <button class="button" :class="[getSizeClass('general'), color]" @click="$emit('click')">
    <span class="icon">
      <i class="fas" :class="'fa-' + icon"></i>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonIcon',
  props: {
    icon: String,
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
