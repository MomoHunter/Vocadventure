<template>
  <div class="flexboxContainer">
    <HeroBasic title="packagesEditCategoriesTitle" />
    <div class="is-10 flexGrow overflowAuto marginBottomBig">
      <div class="categoryContainer" v-for="category in categories" :key="category.index">
        <div class="flexGrow has-background-info has-text-black textOverflow" :class="getSizeClass('text')">
          {{ category[$store.state.lang] }}
        </div>
        <ButtonIcon class="customButton small" :icon="getExpandedIcon(category.index)" color="is-info"
                    @click="toggleExpanded(category.index)" />
        <ButtonIcon class="customButton small" icon="pen" color="is-success"
                    @click="showPanel(category.index)" />
        <ButtonIcon class="customButton small" icon="trash" color="is-danger"
                    @click="confirmRemoveCategory(category.index)" />
        <div v-show="expandedCategories.includes(category.index)" class="wordContainer"
             v-for="(word, index) in category.words" :key="index">
          <div class="flexGrow textOverflow" :class="getSizeClass('text')">
            {{ word[$store.state.lang] }}
          </div>
          <ButtonIcon class="customButton small" icon="pen" color="is-success" @click="editWord(category.index, index)" />
          <ButtonIcon class="customButton small" icon="trash" color="is-danger"
                      @click="confirmRemoveWord(category.index, index)" />
        </div>
        <ButtonBasic v-show="expandedCategories.includes(category.index)" class="customButton full" icon="plus"
                     color="is-success" text="packagesEditCategoriesButton3"
                     @click="navTo('packagesEditWord', category.index)" />
      </div>
    </div>
    <div class="is-10 buttonContainer">
      <ButtonBasic class="marginBottomSmall" icon="plus" color="is-success" text="packagesEditCategoriesButton1"
                   @click="showPanel()" />
      <ButtonBasic icon="arrow-left" color="is-danger" text="packagesEditCategoriesButton2"
                   @click="navTo('packagesEdit')" />
    </div>
    <transition enter-active-class="animated fadeInUp a-little-bit-faster"
                leave-active-class="animated fadeOutDown a-little-bit-faster">
      <div v-show="newCategoryVisible" class="specialPanel has-background-background">
        <h1 class="title marginTopBig" :class="getSizeClass('title')">
          {{ getText('packagesEditCategoriesPanelTitle') }}
        </h1>
        <div class="flexGrow overflowAuto is-10">
          <input class="input marginBottomSmall" type="text" v-for="lang in supportedLanguages" :key="lang"
                 :placeholder="getText(lang)" v-model="newCategoryData[lang]" />
        </div>
        <div class="innerFlexContainerButton is-10">
          <ButtonBasic class="marginBottomSmall" icon="check"
                       color="is-success" text="packagesEditCategoriesPanelButton1" @click="saveNewCategory()" />
          <ButtonBasic icon="times" color="is-danger" text="packagesEditCategoriesPanelButton2" @click="hidePanel()" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'PackagesEditCategories',
  components: {
    HeroBasic,
    ButtonIcon,
    ButtonBasic
  },
  data () {
    return {
      categories: [],
      newCategoryData: {},
      selectedCategoryIndex: -1,
      selectedWordIndex: -1,
      expandedCategories: [],
      newCategoryVisible: false
    }
  },
  beforeCreate () {
    if (!this.$store.state.vueDict.selectedWordPack) {
      this.$router.push({ name: 'packages' })
    }
  },
  created () {
    if (this.$store.state.vueDict.selectedWordPack) {
      this.categories = JSON.parse(JSON.stringify(this.$store.state.vueDict.selectedWordPack.categories))
    }
    if (this.$store.state.vueDict.selectedWordPackCategoryIndex >= 0) {
      this.expandedCategories.push(this.$store.state.vueDict.selectedWordPackCategoryIndex)
    }
  },
  computed: {
    answer () {
      return this.$store.state.vueDict.currentModalAnswer
    },
    supportedLanguages () {
      if (this.$store.state.vueDict.selectedWordPack) {
        return this.$store.state.vueDict.selectedWordPack.supportedLanguages
      }
      return []
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    getExpandedIcon (categoryIndex) {
      return this.expandedCategories.includes(categoryIndex) ? 'angle-up' : 'angle-down'
    },
    toggleExpanded (categoryIndex) {
      if (this.expandedCategories.includes(categoryIndex)) {
        this.expandedCategories = this.expandedCategories.filter(index => index !== categoryIndex)
      } else {
        this.expandedCategories.push(categoryIndex)
      }
    },
    editWord (categoryIndex, index) {
      this.$store.commit('vueDict/setSelectedWordPackWordIndex', index)
      this.navTo('packagesEditWord', categoryIndex)
    },
    saveNewCategory () {
      let category = this.categories.find(cat => cat.index === this.newCategoryData.index)
      if (category) {
        for (let lang of this.supportedLanguages) {
          category[lang] = this.newCategoryData[lang]
        }
      } else {
        this.categories.push(this.newCategoryData)
      }
      this.hidePanel()
    },
    confirmRemoveCategory (categoryIndex) {
      this.selectedCategoryIndex = categoryIndex
      this.$store.commit('vueDict/showModal', {
        name: 'message',
        title: 'packagesEditCategoriesModalTitle',
        text: 'packagesEditCategoriesModalCategoryText',
        color: '',
        leftIcon: 'times',
        leftText: 'packagesEditCategoriesModalButtonLeft',
        leftColor: 'is-danger',
        rightIcon: 'check',
        rightText: 'packagesEditCategoriesModalButtonRight',
        rightColor: 'is-success'
      })
    },
    deleteCategory (categoryIndex) {
      this.categories = this.categories.filter(category => category.index !== categoryIndex)
      this.expandedCategories = this.expandedCategories.filter(index => index !== categoryIndex)
    },
    confirmRemoveWord (categoryIndex, index) {
      console.log(categoryIndex, index)
      this.selectedCategoryIndex = categoryIndex
      this.selectedWordIndex = index
      this.$store.commit('vueDict/showModal', {
        name: 'message',
        title: 'packagesEditCategoriesModalTitle',
        text: 'packagesEditCategoriesModalWordText',
        color: '',
        leftIcon: 'times',
        leftText: 'packagesEditCategoriesModalButtonLeft',
        leftColor: 'is-danger',
        rightIcon: 'check',
        rightText: 'packagesEditCategoriesModalButtonRight',
        rightColor: 'is-success'
      })
    },
    deleteWord (categoryIndex, index) {
      let category = this.categories.find(category => category.index === categoryIndex)
      category.words.splice(index, 1)
    },
    showPanel (categoryIndex = -1) {
      this.newCategoryData = {}
      if (categoryIndex < 0) {
        this.newCategoryData.index = this.categories.reduce((newIndex, category) => {
          return category.index >= newIndex ? category.index + 1 : newIndex
        }, 1)
        this.newCategoryData.words = []
        for (let lang of this.supportedLanguages) {
          this.newCategoryData[lang] = ''
        }
      } else {
        let category = this.categories.find(cat => cat.index === categoryIndex)
        this.newCategoryData.index = categoryIndex
        this.newCategoryData.words = []
        for (let lang of this.supportedLanguages) {
          this.newCategoryData[lang] = category[lang]
        }
      }
      this.newCategoryVisible = true
    },
    hidePanel () {
      this.newCategoryData = {}
      this.newCategoryVisible = false
    },
    navTo (destination, categoryIndex = -1) {
      let wordPack = JSON.parse(JSON.stringify(this.$store.state.vueDict.selectedWordPack))
      wordPack.categories = this.categories

      switch (destination) {
        case 'packagesEditWord':
          this.$store.commit('vueDict/setSelectedWordPack', wordPack)
          this.$store.commit('vueDict/setSelectedWordPackCategoryIndex', categoryIndex)
          break
        case 'packagesEdit':
          this.$store.commit('vueDict/setSelectedWordPack', wordPack)
          this.$store.commit('vueDict/setSelectedWordPackCategoryIndex', -1)
          break
        default:
      }
      this.$router.push({ name: destination })
    }
  },
  watch: {
    answer () {
      switch (this.answer) {
        case 'buttonLeft':
          this.$store.commit('vueDict/closeModal')
          break
        case 'buttonRight':
          if (this.selectedWordIndex < 0) {
            this.deleteCategory(this.selectedCategoryIndex)
          } else {
            this.deleteWord(this.selectedCategoryIndex, this.selectedWordIndex)
          }
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

  .categoryContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-top: 1px solid #878b8b;
    border-bottom: 1px solid #878b8b;

    .wordContainer {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;
    }

    .customButton {
      height: 100%;
      border-radius: 0;
      border-width: 1px;

      &.small {
        width: 1rem;
      }

      &.full {
        width: 100%;
      }
    }
  }

  .specialPanel {
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    height: calc(100% + .5rem + 71px);
    padding-bottom: 71px;
    top: 0px;
    z-index: 4;

    .innerFlexContainerButton {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
    }
  }
}

.paddingBottomMiddle {
  padding-bottom: 1rem !important;
}
</style>
