<template>
  <button class="button" :class="[getSizeClass('general'), color]" @click="$emit('click')">
    <span class="icon">
      <i class="fas" :class="'fa-' + icon"></i>
    </span>
    <span class="text">
      {{ getText(text) }}
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonBasic',
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
.button {
  justify-content: center;
  align-items: center;
}
</style>
