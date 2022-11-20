<template>
  <div class="button upload" :class="[getSizeClass('general'), props.color]">
    <input class="input" type="file" accept=".json" multiple @change="$emit('change', $event.target.files)">
    <span class="icon">
      <i class="fas" :class="'fa-' + props.icon"></i>
    </span>
    <span class="text">
      {{ getText(props.text) }}
    </span>
  </div>
</template>

<script setup>
import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()

const props = defineProps({
  icon: String,
  text: String,
  color: String
})
defineEmits(['change'])

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
