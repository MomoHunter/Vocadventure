<template>
  <svg class="material-design-icon" :class="getSizeClass('general')" :width="props.size"
       :height="props.size" viewBox="0 0 24 24">
    <path fill="currentColor" d="M11 4V6H4V10H6V8H18V10H20V6H13V4M8 10V12H13.59L11.59 14H4V16H11V18H10V20H13V16H20V14H14.21L16 12.21V10Z" />
  </svg>
</template>

<script setup>
import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  size: {
    type: Number,
    default: 24
  }
})

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>