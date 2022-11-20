<template>
  <div class="blockquote" :class="getSizeClass('general')">
    <div class="bar"></div>
    <div v-if="!props.hasHtml" class="text">
      {{ getText(props.text) }}
    </div>
    <div v-else class="text" v-html="getText(props.text)">
    </div>
  </div>
</template>

<script setup>
import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()

const props = defineProps({
  text: String,
  hasHtml: Boolean
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>
