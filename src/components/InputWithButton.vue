<template>
  <div class="flex-row">
    <InputBasic class="flex-grow" :color="props.colorInput" :type="props.type" :icon="props.iconInput"
                @update:modelValue="$emit('update:modelValue', $event)" :model-value="props.modelValue"
                :maxlength="props.maxlength" />
    <ButtonIcon :icon="props.iconButton" :color="props.colorButton" @click="$emit('click')" />
  </div>
</template>

<script setup>
import InputBasic from '@/components/InputBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

const props = defineProps({
  colorInput: String,
  colorButton: String,
  type: String,
  iconInput: String,
  iconButton: String,
  maxlength: Number,
  modelValue: String
})
defineEmits(['update:modelValue', 'click'])
</script>
