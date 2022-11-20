<template>
  <div class="modal width-full height-full flex-column" :class="getSizeClass('general')">
    <div class="content">
      <div class="title">
        {{ getText(props.options.title) }}
      </div>
      <div class="text overflow-auto" v-html="getText(...props.options.text)"></div>
      <div class="buttons flex-row">
        <ButtonBasic class="width-full" v-for="(button, index) in props.options.buttons" :icon="button.icon"
                     :text="button.text" :color="button.color" :key="index"
                     @click="$emit('click', 'button' + (index + 1))" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonBasic from '@/components/ButtonBasic.vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  options: Object
})
defineEmits(['click'])

function getText (id, ...params) {
  return appConst.getText(id, ...params)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>

<style lang="scss" scoped>
.modal {
  justify-content: center;
  max-width: 700px;
}
</style>
