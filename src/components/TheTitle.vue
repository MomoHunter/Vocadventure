<template>
  <div class="section-title flex-row"
       :class="[getSizeClass('general'), props.color, { 'no-icons': !hasFAIcon && !hasMDIcon }]">
    <div v-if="hasFAIcon" class="icon">
      <i class="fas" :class="'fa-' + props.icon"></i>
    </div>
    <div v-if="hasMDIcon" class="icon">
      <slot></slot>
    </div>
    <div class="text">
      {{ getText(props.text) }}
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

import { useAppConstStore } from '@/stores/appconst'

const props = defineProps({
  text: String,
  color: String,
  icon: {
    type: String,
    default: ''
  }
})

const appConst = useAppConstStore()
const slots = useSlots()

const hasFAIcon = computed(() => {
  return props.icon !== ''
})
const hasMDIcon = computed(() => {
  return slots.hasOwnProperty('default')
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>
