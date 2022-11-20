<template>
  <nav class="status flex-row">
    <div class="status-item flex-column width-third" :class="getSizeClass('general')" v-for="state in props.status"
         :key="state.id">
      <div class="name">
        {{ getText(state.id) }}
      </div>
      <div class="value">
        <span>
          {{ formatValue(state.count) }}
        </span>
        <span v-show="inAdventure" class="text-green">
          +{{ formatValue(state.additional) }}
        </span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useAppConstStore } from '@/stores/appconst'

const route = useRoute()
const appConst = useAppConstStore()
const props = defineProps({
  status: Array
})

const inAdventure = computed(() => {
  return route.name && route.name.startsWith('adventure')
})

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function formatValue (value) {
  if (value < 1_000_000) {
    return value.toLocaleString()
  } else if (value < 1_000_000_000) {
    return (value / 1_000_000).toFixed(3) + 'M'
  } else if (value < 1_000_000_000_000) {
    return (value / 1_000_000_000).toFixed(3) + 'B'
  } else {
    return (value / 1_000_000_000_000).toFixed(3) + 'T'
  }
}
</script>

<style lang="scss" scoped>
.status {
  padding: 5px 0;

  > .status-item {
    align-items: center;

    .name {
      text-transform: uppercase;
    }
  }
}
</style>
