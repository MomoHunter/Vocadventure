<template>
  <div>
    <progress class="progress" :class="[getSizeClass('progress'), color]" :value="value" :max="maxValue">
    </progress>
    <p class="content has-text-centered" :class="getSizeClass('content')">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'TheProgressBar',
  props: {
    color: String,
    value: Number,
    maxValue: Number,
    text: String
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
