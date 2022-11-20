<template>
  <div class="text-with-icon flex-column" :class="getSizeClass('general')">
    <div class="title">
      {{ getText(props.title) }}
    </div>
    <div class="relative">
      <div v-if="hasLeftIcon" class="icon left" :class="[props.leftIconColor, { 'clickable': isLeftClickable }]"
           @click="$emit('click-left')">
        <i class="fas" :class="'fa-' + props.leftIcon"></i>
      </div>
      <div class="text flex-grow">
        {{ getText(props.text) }}
      </div>
      <div v-if="hasRightIcon" class="icon right" :class="[props.rightIconColor, { 'clickable': isRightClickable }]"
           @click="$emit('click-right')">
        <i class="fas" :class="'fa-' + props.rightIcon"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  title: String,
  leftIcon: {
    type: String,
    default: ''
  },
  rightIcon: {
    type: String,
    default: ''
  },
  text: String,
  leftIconColor: String,
  rightIconColor: String
})
defineEmits(['click-left', 'click-right'])

const hasLeftIcon = computed(() => {
  return props.leftIcon !== ''
})
const isLeftClickable = computed(() => {
  return ['volume-mute', 'volume-off'].includes(props.leftIcon)
})

const hasRightIcon = computed(() => {
  return props.rightIcon !== ''
})
const isRightClickable = computed(() => {
  return ['edit'].includes(props.rightIcon)
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>
