<template>
  <div class="package-list-entry flex-row"
       :class="[getSizeClass('general'), { 'special': props.mode !== 'standard', 'inactive': !active }, color]">
    <ButtonIcon v-show="active" class="single-1" icon="check" color="green" @click="$emit('toggle', false)" />
    <ButtonIcon v-show="!active" class="single-1" icon="times" color="red" @click="$emit('toggle', true)" />
    <div class="details flex-grow" @click="$emit('toggle', !active)">
      <svg class="flag">
        <image class="flag-image" :href="'assets/img/flags/' + getFlagName(props.wordpack.targetLanguage) + '.svg'"
               preserveAspectRatio="none" />
      </svg>
      <div class="foreground flex-column">
        <div class="title">
          [{{ props.wordpack.tag }}] {{ props.wordpack.name }}
        </div>
        <div class="stats">
          {{ getText('packagesEntryStats1') }}: {{ getCategoryCount(props.wordpack) }} |
          {{ getText('packagesEntryStats2') }}: {{ getWordCount(props.wordpack) }}
        </div>
      </div>
    </div>
    <ButtonIcon v-show="props.mode === 'standard'" class="single-1" icon="edit" color="green" @click="$emit('click')" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()

const props = defineProps({
  wordpack: Object,
  mode: String,
  isActiveList: Array
})
defineEmits(['click', 'toggle'])

const active = computed(() => {
  return props.isActiveList.includes(appConst.getWordpackKey(props.wordpack))
})

const color = computed(() => {
  switch (props.mode) {
    case 'download':
      return 'action'
    case 'delete':
      return 'red'
    default:
      return ''
  }
})

function getCategoryCount (wordpack) {
  return wordpack.categories.length.toLocaleString()
}

function getWordCount (wordpack) {
  return wordpack.categories.reduce((count, category) => {
    return count + category.words.length
  }, 0).toLocaleString()
}

function getFlagName (targetLanguage) {
  return appConst.targetLanguages[targetLanguage].flag
}

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>

<style lang="scss" scoped>
.package-list-entry {
  .details {
    justify-content: center;
  }
}
</style>
