<template>
  <div class="flexboxContainer">
    <HeroBasic title="packagesEditTitle" />
    <div class="is-10 flexGrow marginTopBig">
      <div class="field" @click="hideNotification()">
        <div class="control has-icons-left">
          <input class="input" type="text" :class="getSizeClass('input')" v-model="wordPack.tag" maxlength="3"
                 :placeholder="getText('packagesEditTag')" />
          <span class="icon is-left">
            <font-awesome-icon :icon="['fas', 'tag']" />
          </span>
        </div>
      </div>
      <div class="field" @click="hideNotification()">
        <div class="control has-icons-left">
          <input class="input" type="text" :class="getSizeClass('input')" v-model="wordPack.name"
                 :placeholder="getText('packagesEditName')" />
          <span class="icon is-left">
            <font-awesome-icon :icon="['fas', 'font']" />
          </span>
        </div>
      </div>
      <DropdownBasic class="marginBottomMiddle" :options="targetLanguageOptions" :selected="wordPack.targetLanguage"
                     icon="user-graduate" />
      <h2 class="subtitle has-text-weight-bold marginBottomSmall" :class="getSizeClass('subtitle')">
        {{ getText('packagesEditSupportedLanguages') }}
      </h2>
      <div class="suplangContainer">
        <label class="checkbox" v-for="key in Object.keys($store.state.texts)" :key="key">
          <input type="checkbox" :checked="wordPack.supportedLanguages.includes(key)" @click="toggleSupportedLang(key)">
          {{ getText(key) }}
        </label>
      </div>
    </div>
    <div class="is-10 buttonContainer">
      <ButtonBasic class="marginBottomSmall" icon="list" color="is-info" text="packagesEditButton1"
                   @click="navTo('packagesEditCategories')" />
      <ButtonBasic class="is-half marginRightSmall" icon="times" color="is-danger" text="packagesEditButton2"
                   @click="showModal()" />
      <ButtonBasic class="is-half marginLeftSmall" icon="check" color="is-success" text="packagesEditButton3"
                   @click="navTo('packages', true)" />
    </div>
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
      <TheNotification v-show="notificationVisible" class="fullWidth" color="is-danger" text="packagesEditNotification"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import TheNotification from '@/components/TheNotification.vue'

export default {
  name: 'PackagesEdit',
  components: {
    HeroBasic,
    ButtonBasic,
    DropdownBasic,
    TheNotification
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
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    getNewIndex () {
      return this.$store.state.vueDict.vocabulary.reduce((maxIndex, wordPack) => {
        if (wordPack.isCustom) {
          return wordPack.index >= maxIndex ? wordPack.index + 1 : maxIndex
        }
        return maxIndex
      }, 1)
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
        text: 'packagesEditModalText',
        color: '',
        leftIcon: 'times',
        leftText: 'packagesEditModalButtonLeft',
        leftColor: 'is-danger',
        rightIcon: 'check',
        rightText: 'packagesEditModalButtonRight',
        rightColor: 'is-success'
      })
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
              this.$store.dispatch('savePack', this.wordPack)
              this.$store.commit('vueDict/setSelectedWordPackKey', '')
              this.$store.commit('vueDict/setSelectedWordPack', null)
              this.$router.push({ name: destination })
            }
          } else {
            this.$store.commit('vueDict/setSelectedWordPackKey', '')
            this.$store.commit('vueDict/setSelectedWordPack', null)
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
        case 'buttonLeft':
          this.$store.commit('vueDict/closeModal')
          break
        case 'buttonRight':
          this.navTo('packages')
          this.$store.commit('vueDict/closeModal')
          break
        default:
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flexboxContainer {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  height: calc(100% - 71px);

  .is-10 {
    width: calc(100% / 1.2);
  }

  .flexGrow {
    flex-grow: 1;
  }

  .suplangContainer {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .buttonContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .is-half {
      width: calc(50% - .25rem);
    }
  }
}
</style>
