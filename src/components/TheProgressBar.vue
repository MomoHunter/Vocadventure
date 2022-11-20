<template>
  <div class="progress relative" :class="[getSizeClass('general'), props.color]">
    <div class="background width-full"></div>
    <div class="foreground absolute" :style="{ width: percentage + '%' }"></div>
    <div class="text absolute height-full width-full text-center">
      {{ progressText }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  color: String,
  value: Number,
  maxValue: Number,
  text: {
    type: String,
    default: ''
  }
})

const percentage = computed(() => {
  return Math.min(props.value, props.maxValue) / props.maxValue * 100
})

const progressText = computed(() => {
  if (props.text === '') {
    return `${props.value.toLocaleString()} / ${props.maxValue.toLocaleString()}`
  }
  return props.text
})

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>

<style lang="scss" scoped>

</style>
