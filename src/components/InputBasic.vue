<template>
  <div class="input-text flex-column" :class="[getSizeClass('general'), props.color]">
    <div v-if="hasTitle" class="title">
      {{ getText(props.title) }}
    </div>
    <div class="flex-row">
      <span class="icon">
        <i class="fas" :class="'fa-' + props.icon"></i>
      </span>
      <input v-focus class="input width-full" :type="props.type" @input="$emit('update:modelValue', $event.target.value)"
             :value="props.modelValue" :maxlength="props.maxlength" :readonly="props.readonly"
             :nofocus="props.noFocus" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  type: String,
  icon: String,
  readonly: Boolean,
  noFocus: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: 9999
  },
  color: String,
  modelValue: String
})
defineEmits(['update:modelValue'])

const hasTitle = computed(() => {
  return props.title !== ''
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>

<style lang="scss" scoped>
.input-text {
  justify-content: center;
}
</style>
