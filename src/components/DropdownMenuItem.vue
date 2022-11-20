<template>
  <div class="dropdown-menu-item">
    <div class="category">
      {{ appConst.getCategoryName(props.catKey) }}
    </div>
    <div class="word"
        :class="{ 'selected': isSelected(props.catKey, index), 'disabled': savestate.isWordDeactivated(props.catKey, index) }"
        v-for="(word, index) in props.words" :key="index">
      <div class="index">
        {{ index + 1 }}
      </div>
      <div class="details flex-column flex-grow">
        <div class="name">
          {{ word[savestate.app.lang] }}
        </div>
        <div v-if="props.foreignAlphabet !== ''" class="translation">
          {{ word[props.foreignAlphabet] }}
        </div>
        <div v-else class="translation">
          {{ word[props.latinAlphabet] }}
        </div>
      </div>
      <ButtonIcon class="single-1" :icon="getIcon(props.catKey, index)" :color="getColor(props.catKey, index)"
                  @click="$emit('new-word', { categoryKey: props.catKey, index: index })" />
    </div>
  </div>
</template>

<script setup>
import ButtonIcon from '@/components/ButtonIcon.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppConstStore } from '@/stores/appconst'

const savestate = useSavestateStore()
const appConst = useAppConstStore()
const props = defineProps({
  words: Array,
  catKey: String,
  latinAlphabet: String,
  foreignAlphabet: String,
  selectedWord: Object,
  mode: String
})
defineEmits(['new-word'])

function isSelected (categoryKey, index) {
  return categoryKey === props.selectedWord.categoryKey && index === props.selectedWord.index
}

function getIcon (categoryKey, index) {
  if (props.mode === 'select') {
    return 'arrow-right'
  } else {
    if (savestate.isWordDeactivated(categoryKey, index)) {
      return 'times'
    } else {
      return 'check'
    }
  }
}

function getColor (categoryKey, index) {
  if (props.mode === 'select') {
    return 'green'
  } else {
    if (savestate.isWordDeactivated(categoryKey, index)) {
      return 'red'
    } else {
      return 'green'
    }
  }
}
</script>
