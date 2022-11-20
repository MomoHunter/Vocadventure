<template>
  <div class="checkbox flex-column" :class="getSizeClass('general')">
    <div class="title">
      {{ getText(props.title) }}
    </div>
    <div class="relative">
      <span class="icon">
        <i class="fas" :class="'fa-' + props.icon"></i>
      </span>
      <div class="text">
        {{ getText(props.text) }}
      </div>
      <span class="check" @click="$emit('click')">
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <div v-show="!props.active" class="body off red-dark"></div>
        </transition>
        <div class="body on green-dark"></div>
        <div ref="headEl" class="head" :class="animation">
          <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                      leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
            <i v-show="props.active" class="fas fa-check"></i>
          </transition>
          <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                      leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
            <i v-show="!props.active" class="fas fa-times"></i>
          </transition>
        </div>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
    title: String,
    icon: String,
    text: String,
    active: Boolean
})
defineEmits(['click'])

const headEl = ref(null)

const animation = computed(() => {
  return props.active ? 'on-animation duration-c-350ms' : 'off-animation duration-c-350ms'
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>

<style lang="scss" scoped>
.head {
  animation-fill-mode: forwards;
}
</style>
