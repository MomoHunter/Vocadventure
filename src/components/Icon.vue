<template>
  <div class="single-icon" :class="[getSizeClass('general'), props.color, { 'is-gradient': props.isGradient }]">
    <span v-if="hasFAIcon" :class="{ 'is-link': hasLink }" @click="openLink()">
      <i :class="[props.type, 'fa-' + props.icon]"></i>
    </span>
    <span v-if="hasMDIcon" :class="{ 'is-link': hasLink }" @click="openLink()">
      <slot></slot>
    </span>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

import { useAppConstStore } from '@/stores/appconst'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  color: String,
  isGradient: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'fas'
  },
  link: {
    type: String,
    default: ''
  }
})
const slots = useSlots()
const appConst = useAppConstStore()

const hasFAIcon = computed(() => {
  return props.icon !== ''
})
const hasMDIcon = computed(() => {
  return slots.hasOwnProperty('default')
})
const hasLink = computed(() => {
  return props.link !== ''
})

function openLink () {
  if (hasLink.value) {
    window.open(props.link, '_blank')
  }
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>
