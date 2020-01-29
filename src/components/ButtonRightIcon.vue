<template>
  <button class="button spaceBetween is-outlined is-fullwidth" :class="[getSizeClass('button'), color]"
     @click="$emit('click')">
    <span>{{ getText(text) }}</span>
    <span class="icon">
      <font-awesome-icon :icon="['fas', icon]" />
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonRightIcon',
  props: {
    icon: String,
    text: String,
    color: String
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
.spaceBetween {
  justify-content: space-between;
}
</style>
