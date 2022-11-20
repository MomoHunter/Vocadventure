<template>
  <div class="slider flex-column" :class="getSizeClass('general')">
    <div class="title">
      {{ getText(props.title) }}
    </div>
    <div class="flex-row">
      <div class="icon flex-row">
        <i class="fas" :class="'fa-' + props.icon"></i>
      </div>
      <input class="input-slider flex-grow" type="range" :min="props.min" :max="props.max" :step="props.step"
             :value="props.modelValue" @input="$emit('update:modelValue', parseFloat($event.target.value))">
      <div class="value text-center">
        {{ transformedValue }}
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
  min: Number,
  max: Number,
  step: Number,
  modelValue: Number,
  icon: String
})
defineEmits(['update:modelValue'])

const transformedValue = computed(() => {
  if (parseInt(props.step) === props.step) {
    return props.modelValue
  } else {
    return props.modelValue.toFixed(2)
  }
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>
