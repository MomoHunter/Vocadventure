<template>
  <div class="page">
    <HeroBasic title="dictionaryTitle" />
    <div class="action-container">
      <DropdownBasic class="width-full margin-top-medium margin-bottom-medium" title="dictionaryDropdown" icon="tasks" color="action" :options="types" selected="lel"
                     @change="changeType($event)" />
      <InputBasic class="margin-bottom-small" v-model="searchString"
                  title="dictionaryInput" type="text" icon="search" color="action" noFocus />
    </div>
    <div class="dictionary-list flex-grow overflow-auto" :class="getSizeClass('general')">
      <div v-if="searchString === ''" class="height-full flex-column flex-center">
        {{ getText('dictionaryNoSearchTerm')}}
      </div>
      <div v-else-if="words.length === 0" class="height-full flex-column flex-center">
        {{ getText('dictionaryNoWords') }}
      </div>
      <div class="word" v-for="(wordObj, index) in words" :key="index">
        <div class="index">
          {{ index + 1 }}
        </div>
        <div class="details flex-column flex-grow">
          <div class="label">
            {{ wordObj.word[returnType] }}
          </div>
          <div class="info">
            {{ wordObj.word[types[currentTypeIndex]] }}
          </div>
          <div class="category selected">
            {{ wordObj.category }}
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="dictionaryButton1"
                   @click="navTo('menu')" />
      <ButtonBasic class="width-half" icon="list" color="info" text="dictionaryButton2"
                   @click="navTo('packages')" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import InputBasic from '@/components/InputBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheDictionary',
  components: {
    HeroBasic,
    DropdownBasic,
    InputBasic,
    ButtonBasic
  },
  data () {
    return {
      currentTypeIndex: 0,
      searchString: ''
    }
  },
  computed: {
    targetLang () {
      return this.$store.state.vueDict.targetLanguages[this.$store.state.targetLanguage]
    },
    types () {
      let languages = new Set()
      languages.add(this.$store.state.lang)
      Object.keys(this.$store.state.texts).forEach((lang) => {
        languages.add(lang)
      })
      languages.add(this.targetLang.latinAlphabet)
      if (this.targetLang.foreignAlphabet !== '') {
        languages.add(this.targetLang.foreignAlphabet)
      }
      return Array.from(languages)
    },
    words () {
      if (this.searchString === '') {
        return []
      }
      return this.$store.getters['vueDict/getSearchedWords'](this.types[this.currentTypeIndex], this.searchString)
    },
    returnType () {
      if (this.targetLang.latinAlphabet === this.types[this.currentTypeIndex] ||
          this.targetLang.foreignAlphabet === this.types[this.currentTypeIndex]) {
        return this.$store.state.lang
      } else {
        if (this.targetLang.foreignAlphabet === '') {
          return this.targetLang.latinAlphabet
        } else {
          return this.targetLang.foreignAlphabet
        }
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
    changeType (newType) {
      this.currentTypeIndex = this.types.indexOf(newType)
    },
    navTo (destination) {
      if (destination === 'menu') {
        this.$router.push({ name: destination, query: { sub: 'training' } })
      } else {
        this.$store.commit('vueDict/setDestination', this.$route.name)
        this.$router.push({ name: destination })
      }
    }
  }
}
</script>
