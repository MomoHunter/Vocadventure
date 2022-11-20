<template>
  <div class="tag" :class="[getSizeClass('general'), props.color]">
    <div class="title">
      {{ getText(props.title) }}
    </div>
    <div class="text">
      {{ getText(props.text) }}
    </div>
  </div>
</template>

<script setup>
import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  title: String,
  text: [String, Number],
  color: String
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>
