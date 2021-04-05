<template>
  <div class="text-with-icon flex-column" :class="getSizeClass('general')">
    <div class="title">
      {{ getText(title) }}
    </div>
    <div class="relative">
      <div v-if="hasLeftIcon" class="icon left" :class="leftIconColor" @click="$emit('click-left')">
        <font-awesome-icon :icon="['fas', leftIcon]" />
      </div>
      <div class="text flex-grow">
        {{ text }}
      </div>
      <div v-if="hasRightIcon" class="icon right" :class="rightIconColor" @click="$emit('click-right')">
        <font-awesome-icon :icon="['fas', rightIcon]" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextWithIcon',
  props: {
    title: String,
    leftIcon: {
      type: String,
      default: ''
    },
    rightIcon: {
      type: String,
      default: ''
    },
    text: String,
    leftIconColor: String,
    rightIconColor: String
  },
  computed: {
    hasLeftIcon () {
      return this.leftIcon !== ''
    },
    hasRightIcon () {
      return this.rightIcon !== ''
    }
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

</style>
