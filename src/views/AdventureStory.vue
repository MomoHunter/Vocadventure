<template>
  <div class="adventure-page">
    <div class="story flex-grow overflow-auto">
      <TheBlockquote v-show="displayedStoryText !== ''" :text="displayedStoryText" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="times" text="adventureStoryButton2" color="red"
                  @click="abort()" />
      <ButtonBasic class="width-half" icon="check" text="adventureStoryButton1" color="green"
                  @click="continueStory()" />
      <ButtonBasic class="width-full" icon="arrow-right" text="adventureStoryButton3" color="yellow"
                  @click="skipStoryPart()" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

import TheBlockquote from '@/components/TheBlockquote.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppConstStore } from '@/stores/appconst'
import { useGameDynStore } from '@/stores/gamedyn'
import { useGameConstStore } from '@/stores/gameconst'

const savestate = useSavestateStore()
const appConst = useAppConstStore()
const gameDyn = useGameDynStore()
const gameConst = useGameConstStore()

const displayedStoryText = ref('')
const currentTextIndex = ref(0)
const newCharacterTrigger = computed(() => {
  return Math.floor(gameDyn.frameNo / 3)
})
const storyTextId = computed(() => {
  return `adventureStoryF${savestate.game.storyFragment}P${savestate.game.storyPart}`
})
const storyText = computed(() => {
  return getText(storyTextId.value)
})
watch(storyText, () => {
  displayedStoryText.value = ''
  currentTextIndex.value = 0
  if (storyText.value === storyTextId.value) {
    gameDyn.storyWritesText = false
  } else {
    gameDyn.storyWritesText = true
  }
})
const storyTextCharacter = computed(() => {
  return storyText.value.split('')
})
watch(newCharacterTrigger, () => {
  if (gameDyn.storyWritesText && storyText.value !== storyTextId.value) {
    displayedStoryText.value += storyTextCharacter.value[currentTextIndex.value]
    if (currentTextIndex.value < storyText.value.length - 1) {
      currentTextIndex.value += 1
    } else {
      gameDyn.storyWritesText = false
    }
  }
})

function getText (id) {
  return appConst.getText(id)
}

function abort () {}

function continueStory () {
  if (displayedStoryText.value === storyText.value || storyText.value === storyTextId.value) {
    if (gameConst.fragments[savestate.game.storyFragment].updateCalls.length > savestate.game.storyPart) {
      savestate.game.storyPart += 1
    }
  } else {
    displayedStoryText.value = storyText.value
    gameDyn.storyWritesText = false
  }
}

function skipStoryPart() {}
</script>

<style lang="scss" scoped>
.story {
  height: 1rem;
}
</style>
