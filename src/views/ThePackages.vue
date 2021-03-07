<template>
  <div class="flexboxContainer">
    <HeroBasic title="packagesTitle" />
    <div class="entryContainer is-10 flexGrow overflowAuto marginTopBig marginBottomBig">
      <div class="outerEntryContainer" v-for="(wordPack, index) in $store.state.vueDict.vocabulary" :key="index">
        <div class="innerEntryContainer" :class="getSizeClass('flag')">
          <svg class="svgFlagElement" :class="getSizeClass('flag')">
            <image class="flagElement" :class="getSizeClass('flag')"
                   :href="baseUrl + 'img/flags/' + getFlagName(wordPack.targetLanguage) + '.svg'"
                   preserveAspectRatio="none" />
          </svg>
          <div class="foregroundContainer" :class="getSizeClass('flag')">
            <div class="textOverflow" :class="getSizeClass('text')">
              [{{ wordPack.tag }}] {{ wordPack.name }}
            </div>
            <div class="textOverflow" :class="getSizeClass('smallText')">
              Kategorien: {{ getCategoryCount(wordPack) }} | Wörter: {{ getWordCount(wordPack) }}
            </div>
          </div>
        </div>
        <button class="button customButton is-success is-outlined" :class="getSizeClass('button')"
                @click="navTo('edit', getWordPackKey(wordPack))">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'pen']" />
          </span>
        </button>
        <button class="button customButton is-info is-outlined" :class="getSizeClass('button')"
                @click="downloadPack(wordPack)">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'download']" />
          </span>
        </button>
        <button class="button customButton is-danger is-outlined" :class="getSizeClass('button')"
                @click="deletePack(wordPack)">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'trash']" />
          </span>
        </button>
      </div>
    </div>
    <div class="is-10 buttonContainer">
      <div class="file fullWidth marginBottomSmall is-info">
        <label class="file-label fullWidth">
          <input class="file-input fullWidth" type="file" name="resume" @change="getFile($event.target.files[0])">
          <span class="file-cta roundBorder fullWidth">
            <span class="file-icon">
              <font-awesome-icon :icon="['fas', 'upload']" />
            </span>
            <span class="file-label">
              {{ getText('packagesButton1') }}
            </span>
          </span>
        </label>
      </div>
      <ButtonBasic class="is-half marginRightSmall" icon="arrow-left" color="is-danger" text="packagesButton3" @click="navTo()" />
      <ButtonBasic class="is-half marginLeftSmall" icon="plus" color="is-success" text="packagesButton4"
                   @click="navTo('edit', getNewPackKey())" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'ThePackages',
  components: {
    HeroBasic,
    ButtonBasic
  },
  data () {
    return {
      selectedPack: null
    }
  },
  computed: {
    answer () {
      return this.$store.state.vueDict.currentModalAnswer
    },
    baseUrl () {
      return process.env.BASE_URL
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
    },
    getWordPackKey (wordPack) {
      return (wordPack.isCustom ? 'c' : 's') + '_' + wordPack.index.toString()
    },
    getNewPackKey () {
      return 'c_' + this.$store.state.vueDict.vocabulary.reduce((maxIndex, wordPack) => {
        if (wordPack.isCustom) {
          return wordPack.index >= maxIndex ? wordPack.index + 1 : maxIndex
        }
        return maxIndex
      }, 1).toString()
    },
    deletePack (wordPack) {
      this.selectedPack = wordPack
      this.$store.commit('vueDict/showModal', {
        name: 'message',
        title: 'packagesModalTitle',
        text: 'packagesModalText',
        color: '',
        leftIcon: 'times',
        leftText: 'packagesModalButtonLeft',
        leftColor: 'is-danger',
        rightIcon: 'check',
        rightText: 'packagesModalButtonRight',
        rightColor: 'is-success'
      })
    },
    downloadPack (wordPack) {
      console.log(wordPack)
      let element = document.createElement('a')
      let file = new Blob([JSON.stringify(wordPack)], { type: 'text/json' })
      element.href = URL.createObjectURL(file)
      element.download = wordPack.name + '-wordpack.json'
      element.click()
    },
    getFile (file) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', event => {
        let loadedPack = JSON.parse(event.target.result)
        loadedPack.isCustom = true
        loadedPack.index = this.$store.state.vueDict.vocabulary.reduce((maxIndex, wordPack) => {
          if (wordPack.isCustom) {
            return wordPack.index >= maxIndex ? wordPack.index + 1 : maxIndex
          }
          return maxIndex
        }, 1)

        this.$store.dispatch('savePack', loadedPack)
      })
      fileReader.readAsText(file)
    },
    navTo (destination = '', packKey = '') {
      if (destination === 'edit') {
        this.$store.commit('vueDict/setSelectedWordPackKey', packKey)
        this.$router.push({ name: 'packagesEdit' })
      } else {
        this.$router.push({ name: 'category', params: { destination: this.$store.state.vueDict.destination } })
      }
    }
  },
  watch: {
    answer () {
      switch (this.answer) {
        case 'buttonLeft':
          this.selectedPack = null
          this.$store.commit('vueDict/closeModal')
          break
        case 'buttonRight':
          this.$store.dispatch('deletePack', this.selectedPack)
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

  .overflowAuto {
    overflow: auto;
  }

  .textOverflow {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .is-size-8 {
    font-size: .6rem !important;
  }

  .entryContainer {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    .outerEntryContainer {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;

      &:first-child {
        border-top: 1px solid #878b8b;
      }

      &:last-child {
        border-bottom: 1px solid #878b8b;
      }

      .innerEntryContainer {
        width: 100%;
        height: 100%;
        position: relative;
        border-top: 1px solid #878b8b;
        border-bottom: 1px solid #878b8b;

        &.is-small {
          max-width: calc(100% - 6.6rem);
        }

        &.is-normal {
          max-width: calc(100% - 8.1rem);
        }

        &.is-medium {
          max-width: calc(100% - 9.9rem);
        }

        &.is-large {
          max-width: calc(100% - 12rem);
        }

        .foregroundContainer {
          position: relative;
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;

          &.is-small {
            background-image: linear-gradient(290deg, rgba(0, 0, 0, 0), #0c0c0c 3.64rem);
            padding-right: 3.74rem;
          }

          &.is-normal {
            background-image: linear-gradient(290deg, rgba(0, 0, 0, 0), #0c0c0c 4.6rem);
            padding-right: 4.7rem;
          }

          &.is-medium {
            background-image: linear-gradient(290deg, rgba(0, 0, 0, 0), #0c0c0c 5.8rem);
            padding-right: 5.9rem;
          }

          &.is-large {
            background-image: linear-gradient(290deg, rgba(0, 0, 0, 0), #0c0c0c 7.6rem);
            padding-right: 7.7rem;
          }
        }

        .svgFlagElement {
          position: absolute;
          top: 0;
          right: 0;
          z-index: -1;

          &.is-small {
            height: 2.4rem;
            width: 3.84rem;
          }

          &.is-normal {
            height: 3rem;
            width: 4.8rem;
          }

          &.is-medium {
            height: 3.75rem;
            width: 6rem;
          }

          &.is-large {
            height: 4.875rem;
            width: 7.8rem;
          }
        }

        .flagElement {
          &.is-small {
            height: 2.4rem;
            width: 3.84rem;
          }

          &.is-normal {
            height: 3rem;
            width: 4.8rem;
          }

          &.is-medium {
            height: 3.75rem;
            width: 6rem;
          }

          &.is-large {
            height: 4.875rem;
            width: 7.8rem;
          }
        }
      }

      .customButton {
        border-radius: 0px;
        height: 100%;
        border-bottom-width: 1px;
        width: 2.7rem;

        &.is-small {
          width: 2.2rem;
        }

        &.is-medium {
          width: 3.3rem;
        }

        &.is-large {
          width: 4rem;
        }
      }
    }
  }

  .buttonContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .is-half {
      width: calc(50% - .25rem);
    }

    .roundBorder {
      border-radius: 290486px;
      border-color: #3298dc;
      background-color: transparent;
      color: #3298dc;
      text-transform: uppercase;
      font-size: .85rem;
      font-weight: bold;
      height: 36px;
      justify-content: center;
    }
  }
}
</style>
