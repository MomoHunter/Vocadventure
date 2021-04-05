<template>
  <div class="package-list-entry flex-row"
       :class="[getSizeClass('general'), { 'special': mode !== 'standard', 'inactive': !active }, color]">
    <ButtonIcon v-show="active" class="single-1" icon="check" color="green" @click="$emit('toggle', false)" />
    <ButtonIcon v-show="!active" class="single-1" icon="times" color="red" @click="$emit('toggle', true)" />
    <div class="details flex-grow">
      <svg class="flag">
        <image class="flag-image" :href="baseUrl + 'img/flags/' + getFlagName(wordPack.targetLanguage) + '.svg'"
               preserveAspectRatio="none" />
      </svg>
      <div class="foreground flex-column">
        <div class="title">
          [{{ wordPack.tag }}] {{ wordPack.name }}
        </div>
        <div class="stats">
          {{ getText('packagesEntryStats1') }}: {{ getCategoryCount(wordPack) }} | {{ getText('packagesEntryStats2') }}:
          {{ getWordCount(wordPack) }}
        </div>
      </div>
    </div>
    <ButtonIcon v-show="mode === 'standard'" class="single-1" icon="edit" color="green" @click="$emit('click')" />
  </div>
</template>

<script>
import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'PackageListEntry',
  props: {
    wordPack: Object,
    mode: String,
    isActiveList: Array
  },
  components: {
    ButtonIcon
  },
  computed: {
    baseUrl () {
      return process.env.BASE_URL
    },
    wordPackKey () {
      return this.$store.getters['vueDict/getWordPackKey'](this.wordPack)
    },
    active () {
      return this.isActiveList.includes(this.wordPackKey)
    },
    color () {
      switch (this.mode) {
        case 'download':
          return 'action'
        case 'delete':
          return 'red'
        default:
          return ''
      }
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    getFlagName (targetLanguage) {
      return this.$store.state.vueDict.targetLanguages[targetLanguage].flag
    },
    getCategoryCount (wordPack) {
      return wordPack.categories.length.toLocaleString()
    },
    getWordCount (wordPack) {
      return wordPack.categories.reduce((count, category) => {
        return count + category.words.length
      }, 0).toLocaleString()
    }
  }
}
</script>

<style lang="scss" scoped>
.package-list-entry {
  .details {
    justify-content: center;
  }
}
</style>
