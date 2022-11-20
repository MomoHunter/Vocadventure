<template>
  <transition enter-active-class="grow all duration-c-350ms" leave-active-class="shrink all duration-c-350ms"
              @after-enter="setCompletelyOpen(true)" @before-leave="setCompletelyOpen(false)"
              @after-leave="selectTab(selectedTab)">
    <div class="dropdown-menu flex-column" :class="[getSizeClass('general'), props.color]">
      <div v-if="props.tabs.length > 0" class="dropdown-menu-tabs border-bottom">
        <div class="tab-slider duration-c-350ms fill-mode-forwards" :class="[buttonWidth, tabAnimation, tabPos]"></div>
        <ButtonText v-for="(name, index) in props.tabs" :class="buttonWidth" :text="name" :color="props.color"
                    :key="index" @click="selectTab(index)" />
      </div>
      <div ref="container" class="overflow-auto overflow-x-hidden relative flex-grow"
           :class="{ 'overflow-y-auto': completelyOpen, 'overflow-y-hidden': !completelyOpen }">
        <div class="dropdown-menu-items absolute width-full" :class="animation.leave">
          <DropdownMenuItem v-for="(words, key) in vocabValues[0].words" :words="words" :cat-key="key"
                            :latin-alphabet="vocabValues[0].latinAlphabet"
                            :foreign-alphabet="vocabValues[0].foreignAlphabet" :selected-word="props.selectedWord"
                            :mode="props.mode" :key="key" @new-word="$emit('new-word', $event)" />
        </div>
        <div v-if="vocabValues.length > 1" :ref="mountEL" class="dropdown-menu-items absolute width-full"
             :class="animation.enter">
          <DropdownMenuItem v-for="(words, key) in vocabValues[1].words" :words="words" :cat-key="key"
                            :latin-alphabet="vocabValues[1].latinAlphabet"
                            :foreign-alphabet="vocabValues[1].foreignAlphabet" :selected-word="props.selectedWord"
                            :mode="props.mode" :key="key" @new-word="$emit('new-word', $event)" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'

import ButtonText from '@/components/ButtonText.vue'
import DropdownMenuItem from '@/components/DropdownMenuItem.vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()
const props = defineProps({
  color: String,
  tabs: {
    type: Array,
    default: []
  },
  selectedWord: Object,
  selectedTab: {
    type: Number,
    default: 0
  },
  vocabs: Object,
  mode: {
    type: String,
    default: 'select'
  }
})
const emit = defineEmits(['new-tab', 'new-word'])

onBeforeMount(() => {
  vocabValues.value.push(props.vocabs)
})

const buttonWidth = computed(() => {
  switch (props.tabs.length) {
    case 1:
      return 'width-full'
    case 2:
      return 'width-half'
    case 3:
      return 'width-third'
    case 4:
      return 'width-fourth'
    default:
      return 'width-fifth'
  }
})

const previousTab = ref(0)
const tabAnimation = computed(() => {
  let dist = props.selectedTab - previousTab.value
  if (dist > 0) {
    return `slide-c-right-o-${dist}`
  } else if (dist < 0) {
    return `slide-c-left-o-${Math.abs(dist)}`
  }
  return ''
})
const tabPos = computed(() => {
  if (previousTab.value > 0) {
    return `pos-${props.tabs.length}-${previousTab.value}`
  }
  return ''
})

function selectTab (index) {
  previousTab.value = props.selectedTab
  emit('new-tab', index)
  if (container.value.scrollTop > 0) {
    container.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const animation = computed(() => {
  let dist = props.selectedTab - previousTab.value
  const enterClasses = 'animate__animated ' +
    (dist < 0 ? 'animate__slideInLeft' : 'animate__slideInRight') +
    ' duration-c-350ms'
  if (dist === 0) {
    return {
      enter: enterClasses,
      leave: ''
    }
  }
  return {
    enter: enterClasses,
    leave: `animate__animated ${dist < 0 ? 'animate__slideOutRight' : 'animate__slideOutLeft'} duration-c-350ms`
  }
})

const container = ref(null)
const vocabValues = ref([])
watch(
  () => props.vocabs,
  (newVocabs) => {
    vocabValues.value.push(newVocabs)
  }
)

function mountEL (el) {
  if (el) {
    el.addEventListener('animationend', () => {
      vocabValues.value.shift()
      previousTab.value = props.selectedTab
    })
  }
}

const completelyOpen = ref(false)

function setCompletelyOpen (isOpen) {
  completelyOpen.value = isOpen
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}
</script>

<style lang="scss" scoped>
.dropdown-menu {
  min-height: 0px;
}
</style>