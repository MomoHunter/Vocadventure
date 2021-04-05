<template>
  <div class="progress relative" :class="[getSizeClass('general'), color]">
    <div class="background width-full"></div>
    <div class="foreground absolute" :style="{ width: percentage + '%' }"></div>
    <div class="text absolute height-full width-full text-center">
      {{ progressText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheProgressBar',
  props: {
    color: String,
    value: Number,
    maxValue: Number,
    text: {
      type: String,
      default: ''
    }
  },
  computed: {
    percentage () {
      return this.value / this.maxValue * 100
    },
    progressText () {
      if (this.text === '') {
        return this.value.toString() + ' / ' + this.maxValue.toString()
      }
      return this.text
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

</style>
