<template>
  <div class="flexContainer">
    <HeroBasic class="marginBottomSmall" :title="destination" />
    <div v-show="!showSearch && !showSort" class="field has-addons is-10">
      <div class="control fullWidth">
        <ButtonBasic color="is-link" :icon="sortIcon" text="categoryButton1" @click="toggleSort()" />
      </div>
      <div class="control">
        <ButtonMDIIcon color="is-link" @click="addAllCategories()">
          <ExpandAll :class="getSizeClass('mdi')" />
        </ButtonMDIIcon>
      </div>
      <div class="control">
        <ButtonMDIIcon color="is-link" @click="removeAllCategories()">
          <AnimationOutline :class="getSizeClass('mdi')" />
        </ButtonMDIIcon>
      </div>
      <div class="control fullWidth">
        <ButtonBasic color="is-link" icon="search" text="categoryButton4" @click="toggleSearch()" />
      </div>
    </div>
    <div v-show="showSort" class="field has-addons is-10">
      <DropdownRounded class="is-expanded" :options="sorters" :icon="sortIcon" selected="sortStandard" color="is-link"
                       @change="sort($event)" />
      <div class="control">
        <ButtonIcon color="is-danger" icon="times" @click="toggleSort()" />
      </div>
    </div>
    <InputWithButton v-show="showSearch" class="is-10" colorInput="is-link" colorButton="is-danger" type="text"
               iconInput="search" iconButton="times" @click="toggleSearch()" v-model="searchString" />
    <div class="field is-grouped is-grouped-multiline maxThirdHeight overflowAuto is-10 flexShrink marginBottomSmall"
         v-show="!nothingSelected">
      <div v-for="category of $store.state.vueDict.categoriesChosen" :key="category" class="control">
        <TagWithDelete :textOne="category" colorOne="is-primary" colorDelete="is-danger"
                       @click="removeCategory(category)"/>
      </div>
    </div>
    <div class="is-10 flexGrow overflowAuto marginBottomSmall">
      <div class="buttons">
        <ButtonText v-for="category of categoriesAvailable" :key="category" color="is-primary" :text="category"
                    @click="addCategory(category)" />
      </div>
    </div>
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" color="is-success" icon="check" text="categoryButton5"
                   @click="navTo()" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" text="categoryButton6"
                   @click="navTo('menu')" />
    </div>
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
      <TheNotification v-show="showNotification" color="is-danger" text="selectionCategoryNotification"
                       @click="closeNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import DropdownRounded from '@/components/DropdownRounded.vue'
import TagWithDelete from '@/components/TagWithDelete.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonMDIIcon from '@/components/ButtonMDIIcon.vue'
import ButtonText from '@/components/ButtonText.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import TheNotification from '@/components/TheNotification.vue'

import AnimationOutline from 'vue-material-design-icons/AnimationOutline.vue'
import ExpandAll from 'vue-material-design-icons/ExpandAll.vue'

export default {
  name: 'SelectionCategory',
  components: {
    HeroBasic,
    DropdownRounded,
    TagWithDelete,
    ButtonBasic,
    ButtonIcon,
    ButtonMDIIcon,
    ButtonText,
    InputWithButton,
    TheNotification,
    AnimationOutline,
    ExpandAll
  },
  data () {
    return {
      showSort: false,
      showSearch: false,
      showNotification: false,
      searchString: '',
      sortIcon: 'sort',
      sortFunction (that) {
        return (a, b) => { return 0 }
      }
    }
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
        return !this.$store.state.vueDict.categoriesChosen.includes(entry) &&
          this.getText(entry).toLowerCase().includes(this.searchString.toLowerCase())
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
    toggleSort () {
      this.showSort = !this.showSort
    },
    toggleSearch () {
      this.showSearch = !this.showSearch
      if (!this.showSearch) {
        this.searchString = ''
      }
    },
    addCategory (category) {
      this.$store.commit('vueDict/addCategory', category)
      this.closeNotification()
    },
    addAllCategories () {
      this.$store.commit('vueDict/setCategories', Object.keys(this.getCategories()))
      this.closeNotification()
    },
    removeCategory (category) {
      this.$store.commit('vueDict/removeCategory', category)
    },
    removeAllCategories () {
      this.$store.commit('vueDict/setCategories', [])
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
              if (that.getText(a).toString() > that.getText(b).toString()) {
                return 1
              } else if (that.getText(a).toString() < that.getText(b).toString()) {
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
              if (that.getText(a).toString() < that.getText(b).toString()) {
                return 1
              } else if (that.getText(a).toString() > that.getText(b).toString()) {
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
              if (that.getDifficulty(a) > that.getDifficulty(b)) {
                return 1
              } else if (that.getDifficulty(a) < that.getDifficulty(b)) {
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
              if (that.getDifficulty(a) < that.getDifficulty(b)) {
                return 1
              } else if (that.getDifficulty(a) > that.getDifficulty(b)) {
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
              if (that.getCategoryPlayed(a).count > that.getCategoryPlayed(b).count) {
                return 1
              } else if (that.getCategoryPlayed(a).count < that.getCategoryPlayed(b).count) {
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
              if (that.getCategoryPlayed(a).count < that.getCategoryPlayed(b).count) {
                return 1
              } else if (that.getCategoryPlayed(a).count > that.getCategoryPlayed(b).count) {
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
      let vocabs = this.getCategories()[id]

      return vocabs.reduce((acc, entry) => {
        return acc + parseInt(entry.difficulty)
      }, 0) / vocabs.length
    },
    navTo (destination) {
      if (destination === 'menu') {
        this.$store.commit('vueDict/setCategories', [])
        this.$store.commit('vueDict/setDifficulty', '')
        this.$store.commit('vueDict/setWordCount', 0)
        this.$router.push({ name: 'menu', query: { sub: this.destination } })
      } else {
        if (this.$store.state.vueDict.categoriesChosen.length !== 0) {
          if (this.destination === 'training') {
            this.$router.push({ name: 'training' })
          } else {
            this.$router.push({ name: 'selection' })
          }
        } else {
          this.showNotification = true
        }
      }
    },
    closeNotification () {
      this.showNotification = false
    }
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100% - 71px);

  .is-10 {
    width: calc(100% / 1.2);
  }

  .flexGrow {
    flex-grow: 1;
  }
}

.halfWidth {
  width: 50%;
}

.quarterWidth {
  width: 25%;
}

.maxThirdHeight {
  max-height: 20%;
}

.overflowAuto {
  overflow: auto;
}

.flexShrink {
  flex-shrink: 0;
}
</style>
