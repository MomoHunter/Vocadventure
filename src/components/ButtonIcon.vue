<template>
  <button class="button" :class="[getSizeClass('general'), color]" @click="$emit('click')">
    <span class="icon">
      <font-awesome-icon :icon="['fas', icon]" :transform="{ rotate: rotation }" />
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonIcon',
  props: {
    icon: String,
    color: String,
    rotation: {
      type: Number,
      default: 0
    }
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
