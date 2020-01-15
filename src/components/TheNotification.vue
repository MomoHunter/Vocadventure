<template>
  <div class="notification atBottom" :class="color">
    <button class="delete" @click="$emit('click')"></button>
    {{ getText(text) }}
  </div>
</template>

<script>
export default {
  name: 'TheNotification',
  props: ['text', 'color'],
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.atBottom {
  position: absolute;
  bottom: 0px;
}
</style>
