<template>
  <div class="page">
    <HeroBasic title="packagesEditTitle" />
    <div class="flex-grow overflow-auto">
      <InputBasic class="border-bottom margin-top-medium margin-bottom-medium" v-model="wordPack.tag"
                  title="packagesEditTag" type="text" icon="tag" :maxlength="3" noFocus />
      <InputBasic class="border-bottom margin-bottom-medium" v-model="wordPack.name" title="packagesEditName"
                  type="text" icon="font" noFocus />
      <DropdownBasic class="border-bottom margin-bottom-medium" title="packagesEditTargetLanguage"
                     :options="targetLanguageOptions" icon="user-graduate" :selected="wordPack.targetLanguage"
                     @change="setTargetLanguage($event)" />
      <CheckboxBasic class="border-bottom margin-bottom-medium" v-for="key in Object.keys($store.state.texts)"
                     title="packagesEditSupportedLanguages" icon="globe" :text="key"
                     :active="wordPack.supportedLanguages.includes(key)" :key="key" @click="toggleSupportedLang(key)" />
    </div>
    <div class="button-container flex-row flex-wrap">
      <ButtonBasic class="width-half" icon="times" color="red" text="packagesEditButton2" @click="showModal()" />
      <ButtonBasic class="width-half" icon="check" color="green" text="packagesEditButton3"
                   @click="navTo('packages', true)" />
      <ButtonBasic class="width-full" icon="list" color="info" text="packagesEditButton1"
                   @click="navTo('packagesEditCategories')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="packagesEditNotificationTitle"
                       :text="['packagesEditNotificationText']" color="red" icon="exclamation"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import InputBasic from '@/components/InputBasic.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import CheckboxBasic from '@/components/CheckboxBasic.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

export default {
  name: 'PackagesEdit',
  components: {
    HeroBasic,
    ButtonBasic,
    InputBasic,
    DropdownBasic,
    CheckboxBasic,
    NotificationBasic
  },
  data () {
    return {
      wordPack: {
        index: 1,
        tag: '',
        name: '',
        targetLanguage: 'japanese',
        supportedLanguages: [],
        isCustom: true,
        categories: []
      },
      notificationVisible: false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'packages') {
      if (this.$store.state.vueDict.selectedWordPackKey === '') {
        next()
      } else if (!this.modalVisible) {
        this.showModal()
        next(false)
      } else {
        this.$store.commit('vueDict/closeModal')
        this.$store.commit('vueDict/setSelectedWordPackKey', '')
        this.$store.commit('vueDict/setSelectedWordPack', null)
        next()
      }
    } else {
      next()
    }
  },
  beforeCreate () {
    if (this.$store.state.vueDict.selectedWordPackKey === '') {
      this.$router.push({ name: 'packages' })
    }
  },
  created () {
    let foundPack = null
    if (this.$store.state.vueDict.selectedWordPack) {
      foundPack = JSON.parse(JSON.stringify(this.$store.state.vueDict.selectedWordPack))
    } else if (this.currentWordPack) {
      foundPack = this.currentWordPack
    }

    if (foundPack) {
      if (!foundPack.isCustom) {
        this.wordPack.index = this.getNewIndex()
      } else {
        this.wordPack.index = foundPack.index
      }
      this.wordPack.tag = foundPack.tag
      this.wordPack.name = foundPack.name
      this.wordPack.targetLanguage = foundPack.targetLanguage
      this.wordPack.supportedLanguages = foundPack.supportedLanguages
      this.wordPack.categories = foundPack.categories
    } else {
      this.wordPack.index = parseInt(this.$store.state.vueDict.selectedWordPackKey.split('_')[1])
    }
  },
  computed: {
    answer () {
      return this.$store.state.vueDict.currentModalAnswer
    },
    currentWordPack () {
      return this.$store.getters['vueDict/getSelectedWordPack']
    },
    targetLanguageOptions () {
      return Object.keys(this.$store.state.vueDict.targetLanguages)
    }
  },
  methods: {
    getNewIndex () {
      return this.$store.state.vueDict.vocabulary.reduce((maxIndex, wordPack) => {
        if (wordPack.isCustom) {
          return wordPack.index >= maxIndex ? wordPack.index + 1 : maxIndex
        }
        return maxIndex
      }, 1)
    },
    setTargetLanguage (value) {
      this.wordPack.targetLanguage = value
    },
    toggleSupportedLang (lang) {
      if (this.wordPack.supportedLanguages.includes(lang)) {
        this.wordPack.supportedLanguages = this.wordPack.supportedLanguages.filter(language => language !== lang)
      } else {
        this.wordPack.supportedLanguages.push(lang)
      }
      this.hideNotification()
    },
    showNotification () {
      this.notificationVisible = true
    },
    hideNotification () {
      this.notificationVisible = false
    },
    showModal () {
      this.$store.commit('vueDict/showModal', {
        name: 'message',
        title: 'packagesEditModalTitle',
        text: ['packagesEditModalText'],
        buttons: [
          {
            icon: 'times',
            text: 'packagesEditModalButton1',
            color: 'red'
          },
          {
            icon: 'check',
            text: 'packagesEditModalButton2',
            color: 'green'
          }
        ]
      })
      this.modalVisible = true
    },
    navTo (destination, saving = false) {
      switch (destination) {
        case 'packagesEditCategories':
          this.$store.commit('vueDict/setSelectedWordPack', this.wordPack)
          this.$router.push({ name: destination })
          break
        case 'packages':
          if (saving) {
            if (this.wordPack.tag === '' || this.wordPack.name === '' || this.wordPack.supportedLanguages.length === 0) {
              this.showNotification()
            } else {
              if (!this.$store.state.vueDict.selectedWordPackKey.startsWith('s')) {
                this.$store.commit('vueDict/removeWordPack', this.$store.state.vueDict.selectedWordPackKey)
              }
              this.$store.dispatch('saveEntry', { name: 'wordpackdb', store: 'wordPacks', entry: this.wordPack })
              this.$store.commit('vueDict/setSelectedWordPackKey', '')
              this.$store.commit('vueDict/setSelectedWordPack', null)
              this.$router.push({ name: destination })
            }
          } else {
            this.$router.push({ name: destination })
          }
          break
        default:
      }
    }
  },
  watch: {
    answer () {
      switch (this.answer) {
        case 'button1':
          this.$store.commit('vueDict/closeModal')
          this.modalVisible = false
          break
        case 'button2':
          this.navTo('packages')
          this.$store.commit('vueDict/closeModal')
          break
        default:
      }
    }
  }
}
</script>
