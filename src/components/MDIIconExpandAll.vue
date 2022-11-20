<template>
  <svg class="material-design-icon" :class="getSizeClass('general')" :width="props.size"
       :height="props.size" viewBox="0 0 24 24">
    <path fill="currentColor" d="M18,8H8V18H6V8A2,2 0 0,1 8,6H18V8M14,2H4A2,2 0 0,0 2,4V14H4V4H14V2M22,12V20A2,2 0 0,1 20,22H12A2,2 0 0,1 10,20V12A2,2 0 0,1 12,10H20A2,2 0 0,1 22,12M20,15H17V12H15V15H12V17H15V20H17V17H20V15Z" />
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