<template>
  <section class="hero flex-column" :class="getSizeClass('general')">
    <span class="title text-center">
      {{ getText(props.title) }}
    </span>
    <span class="subtitle text-center" v-if="props.subtitle">
      {{ getText(...props.subtitle) }}
    </span>
  </section>
</template>

<script setup>
import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  title: String,
  subtitle: Array
})

function getText (id, ...params) {
  return appConst.getText(id, ...params)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>

<style lang="scss" scoped>
.hero {
  align-items: center;
  justify-content: center;
}
</style>