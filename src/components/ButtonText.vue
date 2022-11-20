<template>
  <button class="button" :class="[getSizeClass('general'), props.color]" @click="$emit('click')">
    <div v-show="highlighted" class="highlight"></div>
    <span class="text">
      {{ getText(props.text) }}
    </span>
  </button>
</template>

<script setup>
import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()

const props = defineProps({
  text: [String, Number],
  color: String,
  highlighted: {
    type: Boolean,
    default: false
  }
})
defineEmits(['click'])

function getText (id) {
  return appConst.getText(id)
}

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
