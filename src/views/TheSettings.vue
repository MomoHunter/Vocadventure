<template>
  <div class="page">
    <HeroBasic title="settingsTitle" />
    <div class="flex-grow overflow-auto">
      <DropdownBasic class="single margin-bottom-medium margin-top-medium" title="settingsLanguage" icon="globe"
                     :options="languages" :selected="$store.state.lang" @change="changeValue('newLanguage', $event)" />
      <DropdownBasic class="single margin-bottom-medium" title="settingsTargetLanguage" icon="user-graduate"
                     :options="targetLanguages" :selected="$store.state.targetLanguage"
                     @change="changeValue('newTargetLanguage', $event)" />
      <DropdownBasic class="single margin-bottom-medium" title="settingsTheme" icon="palette" :options="themes"
                     :selected="$store.state.theme" @change="changeValue('newTheme', $event)" />
      <DropdownBasic class="single margin-bottom-medium" title="settingsSize" icon="expand-arrows-alt" :options="sizes"
                     :selected="$store.state.size" @change="changeValue('newSize', $event)" />
      <TheSlider class="margin-bottom-medium" title="settingsViewport" :min="0.5" :max="1.2" :step="0.05"
                 v-model="newViewport" icon="glasses" />
      <TheSlider class="margin-bottom-medium" title="settingsVolume" :min="0" :max="100" :step="1" v-model="newVolume"
                 icon="volume-up" />
      <CheckboxBasic class="border-bottom-2 margin-bottom-medium" title="settingsUpdateTitle" icon="download"
                     text="settingsUpdate" :active="newAllowUpdates"
                     @click="changeValue('newAllowUpdates', !newAllowUpdates)" />
      <ButtonBasic class="single-2 width-full margin-bottom-medium" color="red" icon="trash" text="settingsButtonDelete"
                   @click="$store.commit('vueDict/showModal', { name: 'areYouSure' })" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" color="red" icon="arrow-left" text="settingsButton2"
                   @click="$router.push({ name: 'menu' })" />
      <ButtonBasic class="width-half" color="green" icon="check" text="settingsButton1"
                   @click="submitChanges()" />
    </div>
  </div>
</template>

<script>
import Themes from '@/data/Themes.json'
import TargetLanguages from '@/data/TargetLanguages.js'

import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import TheSlider from '@/components/TheSlider.vue'
import CheckboxBasic from '@/components/CheckboxBasic.vue'

export default {
  name: 'TheSettings',
  components: {
    HeroBasic,
    ButtonBasic,
    DropdownBasic,
    TheSlider,
    CheckboxBasic
  },
  data () {
    return {
      newLanguage: this.$store.state.lang,
      newTargetLanguage: this.$store.state.targetLanguage,
      newTheme: this.$store.state.theme,
      newSize: this.$store.state.size,
      newViewport: this.$store.state.viewport,
      newVolume: this.$store.state.volume,
      newAllowUpdates: this.$store.state.allowUpdates
    }
  },
  computed: {
    languages () {
      return Object.keys(this.$store.state.texts)
    },
    targetLanguages () {
      return Object.keys(TargetLanguages)
    },
    themes () {
      return Object.keys(Themes)
    },
    sizes () {
      return ['small', 'normal', 'large', 'giga']
    }
  },
  methods: {
    changeValue (variable, value) {
      this[variable] = value
    },
    submitChanges () {
      this.$store.commit('changeLanguage', this.newLanguage)
      this.$store.commit('changeTargetLanguage', this.newTargetLanguage)
      this.$store.commit('changeTheme', this.newTheme)
      this.$store.commit('changeSize', this.newSize)
      this.$store.commit('changeViewport', this.newViewport)
      this.$store.commit('changeVolume', this.newVolume)
      this.$store.commit('changeAllowUpdates', this.newAllowUpdates)
      window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'allowUpdates',
          value: this.newAllowUpdates
        })
      }
      this.$router.push({ name: 'menu' })
    }
  }
}
</script>
