<template>
  <div class="dropdown" :class="[getSizeClass('general'), props.color]">
    <div v-if="hasTitle" class="title">
      {{ getText(props.title) }}
    </div>
    <div class="relative">
      <span class="icon">
        <i class="fas" :class="'fa-' + props.icon"></i>
      </span>
      <select class="select" @change="$emit('change', $event.target.value)">
        <option class="option" v-for="option in props.options" :selected="isSelected(option)" :value="option"
                :key="option">
          {{ getText(option) }}
        </option>
      </select>
      <span class="arrow">
        <i class="fas" :class="'fa-' + angleIcon"></i>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  options: Array,
  selected: {
    type: String,
    default: ''
  },
  icon: String,
  color: String
})
defineEmits(['change'])

const hasTitle = computed(() => {
  return props.title !== ''
})

const isOpen = ref(false)

const angleIcon = computed(() => {
  return isOpen.value ? 'angle-up' : 'angle-down' // is shit on smartphone, won't implement
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function isSelected (option) {
  return option === props.selected
}
</script>
