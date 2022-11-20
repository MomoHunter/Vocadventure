<template>
  <div class="dropdown special" :class="[getSizeClass('general'), props.color]" @click="$emit('dropdown')">
    <div class="relative">
      <span class="icon">
        <i class="fas" :class="'fa-' + props.icon"></i>
      </span>
      <div class="trigger">
        {{ getText(props.label) }}
      </div>
      <span class="arrow" :class="animation">
        <i class="fas" :class="'fa-' + buttonIcon"></i>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  color: String,
  icon: String,
  label: String,
  dropdownVisible: Boolean
})
defineEmits(['dropdown'])

const buttonIcon = computed(() => {
  return props.dropdownVisible ? 'angle-up' : 'angle-down'
})

const animation = computed(() => {
  return props.dropdownVisible ? 'rotate-half-ccw duration-c-350ms' : 'rotate-half-cw duration-c-350ms'
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>
