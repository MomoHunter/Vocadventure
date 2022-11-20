<template>
  <svg class="material-design-icon" :class="getSizeClass('general')" :width="props.size"
       :height="props.size" viewBox="0 0 24 24">
    <path fill="currentColor" d="M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z" />
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