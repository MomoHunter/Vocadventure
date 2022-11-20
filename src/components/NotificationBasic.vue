<template>
  <div class="notification flex-row absolute at-bottom" :class="[getSizeClass('general'), props.color]">
    <div class="bar margin-right-small"></div>
    <div class="icon flex-column margin-right-medium">
      <i class="fas" :class="['fa-' + props.icon, { 'fa-spin': props.spin }]"></i>
    </div>
    <div class="flex-column flex-grow">
      <div class="title">
        {{ getText(props.title) }}
      </div>
      <div class="text" v-html="getText(...props.text)"></div>
    </div>
    <button class="button close" :class="getSizeClass('general')" @click="$emit('click')">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script setup>
import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
    title: String,
    text: Array,
    color: String,
    icon: String,
    spin: Boolean
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
.notification {
  align-items: stretch;

  .icon {
    justify-content: center;
    align-items: center;
  }
}

.at-bottom {
  bottom: 0px;
}
</style>
