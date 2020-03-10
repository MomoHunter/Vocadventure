<template>
  <div class="notification atBottom" :class="color">
    <button class="delete" @click="$emit('click')"></button>
    <div class="content" :class="getSizeClass('content')" v-html="getText(text)"></div>
  </div>
</template>

<script>
export default {
  name: 'TheNotification',
  props: {
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
.atBottom {
  position: absolute;
  bottom: 0px;
}
</style>
