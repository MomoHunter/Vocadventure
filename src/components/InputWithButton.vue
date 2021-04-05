<template>
  <div class="flex-row">
    <InputBasic class="flex-grow" :color="colorInput" :type="type" :icon="iconInput" @input="$emit('input', $event)"
                :value="value" :maxlength="maxlength" />
    <ButtonIcon :icon="iconButton" :color="colorButton" @click="$emit('click')" />
  </div>
</template>

<script>
import InputBasic from '@/components/InputBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'InputWithButton',
  props: {
    colorInput: String,
    colorButton: String,
    type: String,
    iconInput: String,
    iconButton: String,
    maxlength: Number,
    value: String
  },
  components: {
    InputBasic,
    ButtonIcon
  }
}
</script>
