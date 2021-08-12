<template>
  <div class="page">
    <HeroBasic title="packagesEditCategoriesTitle" :subtitle="wordPackName" />
    <div v-show="!newCategoryVisible" ref="categories" class="flex-grow overflow-auto">
      <PackageCategoryEntry v-for="category in categories" :category="category"
                            :expanded="expandedCategories.includes(category.index)" :key="category.index"
                            @expand="toggleExpanded(category.index)" @edit="editEntry($event, category.index)"
                            @delete="removeEntry($event, category.index)"
                            @new="navTo('packagesEditWord', category.index)" />
    </div>
    <div v-show="newCategoryVisible" class="flex-grow overflow-auto padding-top-medium">
      <InputBasic class="border-bottom margin-bottom-medium" v-for="lang in supportedLanguages"
                  v-model="newCategoryData[lang]" :title="lang" type="text" icon="font" noFocus :key="lang" />
    </div>
    <div v-show="newCategoryVisible" class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="packagesEditCategoriesNewButton2"
                   @click="hideNewCategory()" />
      <ButtonBasic class="width-half" icon="check" color="green" text="packagesEditCategoriesNewButton1"
                   @click="saveNewCategory()" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="packagesEditCategoriesButton2"
                   @click="navTo('packagesEdit')" />
      <ButtonBasic class="width-half" icon="plus" color="green" text="packagesEditCategoriesButton1"
                   @click="showNewCategory()" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="packagesEditCategoriesNotificationTitle"
                       :text="['packagesEditCategoriesNotificationText']" color="red" icon="exclamation"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import PackageCategoryEntry from '@/components/PackageCategoryEntry.vue'
import InputBasic from '@/components/InputBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

export default {
  name: 'PackagesEditCategories',
  components: {
    HeroBasic,
    PackageCategoryEntry,
    InputBasic,
    ButtonBasic,
    NotificationBasic
  },
  data () {
    return {
      categories: [],
      newCategoryData: {},
      selectedCategoryIndex: -1,
      selectedWordIndex: -1,
      expandedCategories: [],
      newCategoryVisible: false,
      notificationVisible: false,
      modalVisible: false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.modalVisible) {
      this.$store.commit('vueDict/closeModal')
    }

    if (to.name === 'packagesEdit') {
      let wordPack = JSON.parse(JSON.stringify(this.$store.state.vueDict.selectedWordPack))
      wordPack.categories = this.categories
      this.$store.commit('vueDict/setSelectedWordPack', wordPack)
      this.$store.commit('vueDict/setSelectedWordPackCategoryIndex', -1)
      next()
    } else {
      next()
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
  mounted () {
    this.$refs.categories.scrollTop = this.$store.state.vueDict.selectedWordPackCategoriesScroll
    this.$store.commit('vueDict/setSelectedWordPackCategoriesScroll', 0)
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
    },
    wordPackName () {
      let wordPack = this.$store.state.vueDict.selectedWordPack
      if (wordPack) {
        return ['[' + wordPack.tag + '] ' + wordPack.name]
      }
      return ['']
    }
  },
  methods: {
    toggleExpanded (categoryIndex) {
      if (this.expandedCategories.includes(categoryIndex)) {
        this.expandedCategories = this.expandedCategories.filter(index => index !== categoryIndex)
      } else {
        this.expandedCategories.push(categoryIndex)
      }
    },
    editEntry (data, categoryIndex) {
      switch (data.type) {
        case 'category':
          this.showNewCategory(categoryIndex)
          break
        case 'word':
          this.editWord(categoryIndex, data.index)
          break
        default:
      }
    },
    editWord (categoryIndex, index) {
      this.$store.commit('vueDict/setSelectedWordPackWordIndex', index)
      this.navTo('packagesEditWord', categoryIndex)
    },
    saveNewCategory () {
      let filled = true
      for (let lang of this.supportedLanguages) {
        if (this.newCategoryData[lang] === '') {
          filled = false
        }
      }

      if (!filled) {
        this.showNotification()
      } else {
        let category = this.categories.find(cat => cat.index === this.newCategoryData.index)
        if (category) {
          for (let lang of this.supportedLanguages) {
            category[lang] = this.newCategoryData[lang]
          }
        } else {
          this.categories.push(this.newCategoryData)
        }
        this.hideNewCategory()
        this.$store.commit('vueDict/setSelectedWordPackChanged', true)
      }
    },
    removeEntry (data, categoryIndex) {
      switch (data.type) {
        case 'category':
          this.confirmRemoveCategory(categoryIndex)
          break
        case 'word':
          this.confirmRemoveWord(categoryIndex, data.index)
          break
        default:
      }
    },
    confirmRemoveCategory (categoryIndex) {
      let categoryName = ''
      let category = this.categories.find(cat => cat.index === categoryIndex)
      if (category) {
        categoryName = category[this.$store.state.lang]
      }

      this.selectedCategoryIndex = categoryIndex
      this.$store.commit('vueDict/showModal', {
        name: 'message',
        title: 'packagesEditCategoriesModalTitle',
        text: [
          'packagesEditCategoriesModalCategoryText',
          categoryName
        ],
        buttons: [
          {
            icon: 'times',
            text: 'packagesEditCategoriesModalButton1',
            color: 'red'
          },
          {
            icon: 'check',
            text: 'packagesEditCategoriesModalButton2',
            color: 'green'
          }
        ]
      })
      this.modalVisible = true
    },
    deleteCategory (categoryIndex) {
      this.categories = this.categories.filter(category => category.index !== categoryIndex)
      this.expandedCategories = this.expandedCategories.filter(index => index !== categoryIndex)
      this.$store.commit('vueDict/setSelectedWordPackChanged', true)
    },
    confirmRemoveWord (categoryIndex, index) {
      let wordName = ''
      let category = this.categories.find(cat => cat.index === categoryIndex)
      if (category && category.words.length > index) {
        wordName = category.words[index][this.$store.state.lang]
      }

      this.selectedCategoryIndex = categoryIndex
      this.selectedWordIndex = index
      this.$store.commit('vueDict/showModal', {
        name: 'message',
        title: 'packagesEditCategoriesModalTitle',
        text: [
          'packagesEditCategoriesModalWordText',
          wordName
        ],
        buttons: [
          {
            icon: 'times',
            text: 'packagesEditCategoriesModalButton1',
            color: 'red'
          },
          {
            icon: 'check',
            text: 'packagesEditCategoriesModalButton2',
            color: 'green'
          }
        ]
      })
      this.modalVisible = true
    },
    deleteWord (categoryIndex, index) {
      let category = this.categories.find(category => category.index === categoryIndex)
      category.words.splice(index, 1)
      this.$store.commit('vueDict/setSelectedWordPackChanged', true)
    },
    showNewCategory (categoryIndex = -1) {
      this.newCategoryData = {}
      if (categoryIndex < 0) {
        this.newCategoryData.index = this.categories.reduce((newIndex, category) => {
          return category.index >= newIndex ? category.index + 1 : newIndex
        }, 1)
        for (let lang of this.supportedLanguages) {
          this.newCategoryData[lang] = ''
        }
        this.newCategoryData.words = []
      } else {
        let category = this.categories.find(cat => cat.index === categoryIndex)
        this.newCategoryData.index = categoryIndex
        for (let lang of this.supportedLanguages) {
          this.newCategoryData[lang] = category[lang]
        }
        this.newCategoryData.words = []
      }
      this.newCategoryVisible = true
    },
    hideNewCategory () {
      this.newCategoryData = {}
      this.newCategoryVisible = false
    },
    showNotification () {
      this.notificationVisible = true
    },
    hideNotification () {
      this.notificationVisible = false
    },
    navTo (destination, categoryIndex = -1) {
      let wordPack = JSON.parse(JSON.stringify(this.$store.state.vueDict.selectedWordPack))
      wordPack.categories = this.categories

      switch (destination) {
        case 'packagesEditWord':
          this.$store.commit('vueDict/setSelectedWordPack', wordPack)
          this.$store.commit('vueDict/setSelectedWordPackCategoryIndex', categoryIndex)
          this.$store.commit('vueDict/setSelectedWordPackCategoriesScroll', this.$refs.categories.scrollTop)
          break
        default:
      }
      this.$router.push({ name: destination })
    }
  },
  watch: {
    answer () {
      switch (this.answer) {
        case 'button1':
          this.$store.commit('vueDict/closeModal')
          break
        case 'button2':
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
