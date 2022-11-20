<template>
  <button class="button" :class="[getSizeClass('general'), props.color]" @click="$emit('click')">
    <span class="icon">
      <i class="fas" :class="'fa-' + props.icon"></i>
    </span>
  </button>
</template>

<script setup>
import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
    icon: String,
    color: String
})
defineEmits(['click'])

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>

<style lang="scss" scoped>
.button {
  justify-content: center;
  align-items: center;
}
</style>
