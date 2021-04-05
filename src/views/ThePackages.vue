<template>
  <div class="page">
    <HeroBasic title="packagesTitle" :subtitle="subtitle" />
    <div class="action-container">
      <ButtonBasic class="width-half" icon="download" color="action"
                   text="packagesButton1" @click="switchMode('download')" />
      <ButtonUpload class="width-half" icon="upload" color="action" text="packagesButton2"
                    @change="processFiles($event)" />
    </div>
    <div class="flex-grow overflow-auto">
      <PackageListEntry v-for="(wordPack, index) in $store.state.vueDict.vocabulary" :wordPack="wordPack" :mode="mode"
                        :isActiveList="activeList" @toggle="handleEntryToggle(wordPack, $event)"
                        @click="navTo('edit', getWordPackKey(wordPack))" :key="index" />
    </div>
    <div v-show="mode !== 'standard'" class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="packagesButton5" @click="switchMode('standard')" />
      <ButtonBasic class="width-half" icon="check" color="green" text="packagesButton6"
                   @click="showModal()" :disabled="selectedPacks.length === 0" />
    </div>
    <div class="button-container flex-row flex-wrap">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="packagesButton3" @click="navTo('category')" />
      <ButtonBasic class="width-half" icon="plus" color="green" text="packagesButton4"
                   @click="navTo('edit', getNewPackKey())" />
      <ButtonBasic class="width-full" icon="trash" color="red" text="packagesButton7" @click="switchMode('delete')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="packagesNotificationTitle"
                       :text="['packagesNotificationText', supportedLanguages]" color="red" icon="exclamation"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import PackageListEntry from '@/components/PackageListEntry.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonUpload from '@/components/ButtonUpload.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

export default {
  name: 'ThePackages',
  components: {
    HeroBasic,
    PackageListEntry,
    ButtonBasic,
    ButtonUpload,
    NotificationBasic
  },
  data () {
    return {
      mode: 'standard',
      selectedPacks: [],
      selectedWordPack: null,
      notificationVisible: false
    }
  },
  computed: {
    answer () {
      return this.$store.state.vueDict.currentModalAnswer
    },
    baseUrl () {
      return process.env.BASE_URL
    },
    activeList () {
      switch (this.mode) {
        case 'download':
        case 'delete':
          return this.selectedPacks
        default:
          return this.$store.state.vueDict.activeWordPacks
      }
    },
    subtitle () {
      switch (this.mode) {
        case 'download':
          return ['packagesSubtitleDownload']
        case 'delete':
          return ['packagesSubtitleDelete']
        default:
          return ['']
      }
    },
    supportedLanguages () {
      if (this.selectedWordPack) {
        return this.selectedWordPack.supportedLanguages.map(lang => {
          return '<li>' + this.getText(lang) + '</li>'
        }).join('')
      }
      return ''
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    handleEntryToggle (wordPack, bool) {
      switch (this.mode) {
        case 'download':
          if (bool) {
            if (this.selectedPacks.length === 1) {
              this.selectedPacks = []
            }
            this.selectedPacks.push(this.getWordPackKey(wordPack))
          } else {
            this.selectedPacks = this.selectedPacks.filter(key => key !== this.getWordPackKey(wordPack))
          }
          break
        case 'delete':
          if (bool) {
            this.selectedPacks.push(this.getWordPackKey(wordPack))
          } else {
            this.selectedPacks = this.selectedPacks.filter(key => key !== this.getWordPackKey(wordPack))
          }
          break
        default:
          if (bool) {
            this.$store.commit('vueDict/activateWordPack', this.getWordPackKey(wordPack))
          } else {
            this.$store.commit('vueDict/deactivateWordPack', this.getWordPackKey(wordPack))
          }
      }
    },
    switchMode (newMode) {
      if (this.mode !== newMode) {
        this.mode = newMode
        this.selectedPacks = []
      }
    },
    getWordPackKey (wordPack) {
      return this.$store.getters['vueDict/getWordPackKey'](wordPack)
    },
    getNewPackKey () {
      return 'c_' + this.$store.state.vueDict.vocabulary.reduce((maxIndex, wordPack) => {
        if (wordPack.isCustom) {
          return wordPack.index >= maxIndex ? wordPack.index + 1 : maxIndex
        }
        return maxIndex
      }, 1).toString()
    },
    showModal () {
      switch (this.mode) {
        case 'download':
          for (let key of this.selectedPacks) {
            this.downloadPack(this.getWordPack(key))
          }
          this.switchMode('standard')
          break
        case 'delete':
          this.$store.commit('vueDict/showModal', {
            name: 'message',
            title: 'packagesModalTitle',
            text: [
              'packagesModalText',
              this.selectedPacks.map(key => {
                let wordPack = this.getWordPack(key)
                if (wordPack) {
                  return '<li>[' + wordPack.tag + '] ' + wordPack.name + '</li>'
                }
                return ''
              }, this).join('')
            ],
            buttons: [
              {
                icon: 'times',
                text: 'packagesModalButton1',
                color: 'red'
              },
              {
                icon: 'check',
                text: 'packagesModalButton2',
                color: 'green'
              }
            ]
          })
          break
        default:
      }
    },
    getWordPack (key) {
      let keyParts = key.split('_')
      return this.$store.state.vueDict.vocabulary.find(pack => {
        if (((!pack.isCustom && keyParts[0] === 's') || (pack.isCustom && keyParts[0] === 'c')) &&
              pack.index === parseInt(keyParts[1])) {
          return pack
        }
      })
    },
    downloadPack (wordPack) {
      let element = document.createElement('a')
      let file = new Blob([JSON.stringify(wordPack)], { type: 'application/json' })
      element.href = URL.createObjectURL(file)
      element.download = wordPack.name.toLowerCase().trim().replace(/ /g, '_') + '-wordpack.json'
      element.click()
    },
    processFiles (files) {
      let newFirstIndex = this.$store.state.vueDict.vocabulary.reduce((maxIndex, wordPack) => {
        if (wordPack.isCustom) {
          return wordPack.index >= maxIndex ? wordPack.index + 1 : maxIndex
        }
        return maxIndex
      }, 1)

      for (let i = 0; i < files.length; i++) {
        this.getFile(files[i], newFirstIndex + i)
      }
    },
    getFile (file, index) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', event => {
        let loadedPack = JSON.parse(event.target.result)
        loadedPack.isCustom = true
        loadedPack.index = index

        this.$store.dispatch('savePack', loadedPack)
        this.handleEntryToggle(loadedPack, true)
      })
      fileReader.readAsText(file)
    },
    showNotification () {
      this.notificationVisible = true
    },
    hideNotification () {
      this.notificationVisible = false
    },
    navTo (destination = '', packKey = '') {
      if (destination === 'edit') {
        let wordPack = this.getWordPack(packKey)
        if (!wordPack || wordPack.supportedLanguages.includes(this.$store.state.lang)) {
          this.$store.commit('vueDict/setSelectedWordPackKey', packKey)
          this.$router.push({ name: 'packagesEdit' })
        } else {
          this.selectedWordPack = wordPack
          this.showNotification()
        }
      } else {
        window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
        if (this.$store.state.vueDict.destination !== '') {
          this.$router.push({ name: 'category', params: { destination: this.$store.state.vueDict.destination } })
        } else {
          this.$router.push({ name: 'category', params: { destination: 'training' } })
        }
      }
    }
  },
  watch: {
    answer () {
      switch (this.answer) {
        case 'button1':
          this.$store.commit('vueDict/closeModal')
          break
        case 'button2':
          for (let key of this.selectedPacks) {
            this.$store.dispatch('deletePack', this.getWordPack(key))
          }
          this.$store.commit('vueDict/closeModal')
          this.switchMode('standard')
          break
        default:
      }
    }
  }
}
</script>
