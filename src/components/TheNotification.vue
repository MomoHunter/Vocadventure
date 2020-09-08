<template>
  <div class="notification atBottom" :class="color">
    <button class="delete" @click="$emit('click')"></button>
    <div class="flexContent">
      <span class="icon" v-if="hasIcon">
        <font-awesome-icon :icon="['fas', icon]" :spin="spin" :size="getSizeClass('fas')" />
      </span>
      <div class="content" :class="getSizeClass('content')" v-html="getText(text)">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheNotification',
  props: {
    text: String,
    color: String,
    hasIcon: Boolean,
    icon: String,
    spin: Boolean
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

.flexContent {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
}
</style>
