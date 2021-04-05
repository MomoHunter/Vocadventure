<template>
  <div class="page">
    <HeroBasic :title="destination" :subtitle="['selectionCategorySubtitle']" />
    <div v-show="!searchVisible && !sortVisible" class="action-container flex-row">
      <ButtonBasic class="width-full" color="action" :icon="sortIcon" text="categoryButton1" @click="showSort()" />
      <ButtonMDIIcon color="action" @click="removeAllCategories()">
        <AnimationOutline :class="getSizeClass('general')" />
      </ButtonMDIIcon>
      <ButtonMDIIcon color="action" @click="addAllCategories()">
        <ExpandAll :class="getSizeClass('general')" />
      </ButtonMDIIcon>
      <ButtonBasic class="width-full" color="action" icon="search" text="categoryButton4" @click="showSearch()" />
    </div>
    <div v-show="sortVisible" class="action-container flex-row flex-center">
      <DropdownBasic class="width-full" :icon="sortIcon" color="action" :options="sorters" selected="sortStandard"
                     @change="sort($event)" />
      <ButtonIcon icon="times" color="red" @click="hideSort()" />
    </div>
    <div v-if="searchVisible" class="action-container">
      <InputWithButton class="width-full" type="text" iconInput="search" iconButton="times" colorInput="action"
                       colorButton="red" @click="hideSearch()" v-model="searchString" />
    </div>
    <div class="flex-column overflow-auto max-height flex-shrink" :class="{ 'border-bottom': !nothingSelected }">
      <div v-for="category in $store.state.vueDict.categoriesChosen" class="flex-row" :key="category">
        <ButtonText class="single-1 flex-grow" color="selected" :text="getCategoryName(category)" />
        <ButtonIcon class="single-1" icon="times" color="red" @click="removeCategory(category)" />
      </div>
    </div>
    <div class="flex-grow flex-column overflow-auto">
      <ButtonText v-for="category in categoriesAvailable" class="single-1 width-full" color="info"
                  :text="category.categoryName" :key="category.id" @click="addCategory(category)" />
    </div>
    <div class="button-container flex-row flex-wrap">
      <ButtonBasic class="width-half" color="red" icon="arrow-left" text="categoryButton6" @click="navTo('menu')" />
      <ButtonBasic class="width-half" color="green" icon="check" text="categoryButton5" @click="navTo('next')" />
      <ButtonBasic class="width-full" color="info" icon="tasks" text="categoryButton7" @click="navTo('packages')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="selectionCategoryNotificationTitle"
                       :text="['selectionCategoryNotificationText']" color="red" icon="exclamation"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonMDIIcon from '@/components/ButtonMDIIcon.vue'
import ButtonText from '@/components/ButtonText.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

import AnimationOutline from 'vue-material-design-icons/AnimationOutline.vue'
import ExpandAll from 'vue-material-design-icons/ExpandAll.vue'

export default {
  name: 'SelectionCategory',
  components: {
    HeroBasic,
    DropdownBasic,
    ButtonBasic,
    ButtonIcon,
    ButtonMDIIcon,
    ButtonText,
    InputWithButton,
    NotificationBasic,
    AnimationOutline,
    ExpandAll
  },
  data () {
    return {
      sortVisible: false,
      searchVisible: false,
      notificationVisible: false,
      searchString: '',
      sortIcon: 'sort',
      sortFunction (that) {
        return (a, b) => { return 0 }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'menu' || to.name === 'packages') {
      this.$store.commit('vueDict/setCategories', [])
      this.$store.commit('vueDict/setDifficulty', 1)
      this.$store.commit('vueDict/setWordCount', 10)
      this.$store.commit('vueDict/setReversed', false)
    }
    next()
  },
  computed: {
    destination () {
      return this.$route.params.destination
    },
    sorters () {
      return [
        'sortStandard', 'sortAlphAsc', 'sortAlphDesc', 'sortDiffAsc', 'sortDiffDesc', 'sortPlayedAsc', 'sortPlayedDesc'
      ]
    },
    categoriesAvailable () {
      return this.$store.getters['vueDict/getCategories'].filter(entry => {
        return !this.$store.state.vueDict.categoriesChosen.includes(entry.id) &&
          entry.categoryName.toLowerCase().includes(this.searchString.toLowerCase())
      }, this).sort(this.sortFunction(this))
    },
    nothingSelected () {
      return this.$store.state.vueDict.categoriesChosen.length === 0
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    getCategoryPlayed (id) {
      return this.$store.getters['vueDict/getCategoryPlayed'](id)
    },
    getCategoryName (id) {
      return this.$store.getters['vueDict/getCategories'].find(entry => entry.id === id).categoryName
    },
    addCategory (category) {
      this.$store.commit('vueDict/addCategory', category.id)
      this.hideNotification()
    },
    addAllCategories () {
      this.$store.commit('vueDict/setCategories',
        this.$store.getters['vueDict/getCategories'].filter(entry =>
          entry.categoryName.toLowerCase().includes(this.searchString.toLowerCase())
        , this).map(entry => entry.id)
      )
      this.hideNotification()
    },
    removeCategory (category) {
      this.$store.commit('vueDict/removeCategory', category)
    },
    removeAllCategories () {
      this.$store.commit('vueDict/setCategories', [])
    },
    showSort () {
      this.sortVisible = true
    },
    hideSort () {
      this.sortVisible = false
    },
    showSearch () {
      this.searchVisible = true
    },
    hideSearch () {
      this.searchVisible = false
    },
    sort (type) {
      if (type.endsWith('Asc')) {
        this.sortIcon = 'sort-down'
      } else if (type.endsWith('Desc')) {
        this.sortIcon = 'sort-up'
      } else {
        this.sortIcon = 'sort'
      }

      switch (type) {
        case 'sortStandard':
          this.sortFunction = function (that) {
            return (a, b) => { return 0 }
          }
          break
        case 'sortAlphAsc':
          this.sortFunction = function (that) {
            return (a, b) => {
              if (a.categoryName > b.categoryName) {
                return 1
              } else if (a.categoryName < b.categoryName) {
                return -1
              } else {
                return 0
              }
            }
          }
          break
        case 'sortAlphDesc':
          this.sortFunction = function (that) {
            return (a, b) => {
              if (a.categoryName < b.categoryName) {
                return 1
              } else if (a.categoryName > b.categoryName) {
                return -1
              } else {
                return 0
              }
            }
          }
          break
        case 'sortDiffAsc':
          this.sortFunction = function (that) {
            return (a, b) => {
              if (that.getDifficulty(a.id) > that.getDifficulty(b.id)) {
                return 1
              } else if (that.getDifficulty(a.id) < that.getDifficulty(b.id)) {
                return -1
              } else {
                return 0
              }
            }
          }
          break
        case 'sortDiffDesc':
          this.sortFunction = function (that) {
            return (a, b) => {
              if (that.getDifficulty(a.id) < that.getDifficulty(b.id)) {
                return 1
              } else if (that.getDifficulty(a.id) > that.getDifficulty(b.id)) {
                return -1
              } else {
                return 0
              }
            }
          }
          break
        case 'sortPlayedAsc':
          this.sortFunction = function (that) {
            return (a, b) => {
              if (that.getCategoryPlayed(a.id).count > that.getCategoryPlayed(b.id).count) {
                return 1
              } else if (that.getCategoryPlayed(a.id).count < that.getCategoryPlayed(b.id).count) {
                return -1
              } else {
                return 0
              }
            }
          }
          break
        case 'sortPlayedDesc':
          this.sortFunction = function (that) {
            return (a, b) => {
              if (that.getCategoryPlayed(a.id).count < that.getCategoryPlayed(b.id).count) {
                return 1
              } else if (that.getCategoryPlayed(a.id).count > that.getCategoryPlayed(b.id).count) {
                return -1
              } else {
                return 0
              }
            }
          }
          break
        default:
      }
    },
    getDifficulty (id) {
      return this.$store.getters['vueDict/getCategoryDifficulty'](id)
    },
    navTo (name) {
      switch (name) {
        case 'menu':
          let destination = this.destination
          if (this.destination === 'writeKanji') {
            destination = 'training'
          }

          if (destination === 'training' && this.$store.state.targetLanguage !== 'japanese') {
            this.$router.push({ name: name })
          } else {
            this.$router.push({ name: name, query: { sub: destination } })
          }
          break
        case 'packages':
          this.$store.commit('vueDict/setDestination', this.destination)
          this.$router.push({ name: name })
          break
        case 'next':
          if (this.nothingSelected) {
            this.showNotification()
            break
          }

          if (this.destination === 'adventure') {
            this.$router.push({ name: 'selection' })
          } else {
            this.$router.push({ name: this.destination })
          }
          break
        default:
      }
    },
    showNotification () {
      this.notificationVisible = true
    },
    hideNotification () {
      this.notificationVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.max-height {
  max-height: 22%;
}
</style>
