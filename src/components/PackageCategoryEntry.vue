<template>
  <div class="package-category-entry flex-column" :class="getSizeClass('general')">
    <div class="flex-row">
      <ButtonIcon class="single-1" :icon="expandIcon" color="action" @click="$emit('expand')" />
      <div class="title flex-grow info">
        {{ props.category[savestate.app.lang] }}
      </div>
      <ButtonIcon class="single-1" icon="pen" color="green" @click="$emit('edit', { type: 'category' })" />
      <ButtonIcon class="single-1" icon="trash" color="red" @click="$emit('delete', { type: 'category' })" />
    </div>
    <ButtonBasic v-show="props.expanded" class="single-1 new-word" icon="plus" color="green" text="packagesEditCategoriesButton3"
                 @click="$emit('new')" />
    <div v-show="props.expanded" class="flex-row" v-for="(word, index) in props.category.words" :key="index">
      <div class="details flex-grow flex-row">
        <div class="index">
          {{ index + 1 }}
        </div>
        <div class="word">
          {{ word[savestate.app.lang] }}
        </div>
      </div>
      <ButtonIcon class="single-1" icon="pen" color="green" @click="$emit('edit', { type: 'word', index: index })" />
      <ButtonIcon class="single-1" icon="trash" color="red" @click="$emit('delete', { type: 'word', index: index })" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

import { useAppConstStore } from '@/stores/appconst'
import { useSavestateStore } from '@/stores/savestate'

const savestate = useSavestateStore()
const appConst = useAppConstStore()
const props = defineProps({
  category: Object,
  expanded: Boolean
})
defineEmits(['click', 'new', 'edit', 'delete', 'expand'])

const expandIcon = computed(() => {
  return props.expanded ? 'angle-up' : 'angle-down'
})

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>
