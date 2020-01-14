<template>
  <div class="flexContainer">
    <TheHero class="marginBottomSmall" :title="destination" />
    <div v-show="!showSearch && !showSort" class="field has-addons is-10">
      <div class="control fullWidth">
        <ButtonBasic color="is-link" icon="sort" text="categoryButton1" @click="toggleSort()" />
      </div>
      <div class="control">
        <ButtonMDIIcon color="is-link" @click="addAllCategories()">
          <ExpandAll />
        </ButtonMDIIcon>
      </div>
      <div class="control">
        <ButtonMDIIcon color="is-link" @click="removeAllCategories()">
          <AnimationOutline />
        </ButtonMDIIcon>
      </div>
      <div class="control fullWidth">
        <ButtonBasic color="is-link" icon="search" text="categoryButton4" @click="toggleSearch()" />
      </div>
    </div>
    <div v-show="showSort" class="field has-addons is-10">
      <DropdownRounded class="is-expanded" :options="sorters" icon="sort" selected="sortStandard" color="is-link"
                       @change="sort($event)" />
      <div class="control">
        <ButtonIcon color="is-danger" icon="times" @click="toggleSort()" />
      </div>
    </div>
    <SearchBar v-show="showSearch" class="is-10" colorInput="is-link" colorButton="is-danger" type="text"
               iconInput="search" iconButton="times" @click="toggleSearch()" @input="search($event)" />
    <div class="field is-grouped is-grouped-multiline maxThirdHeight overflowAuto is-10 flexShrink marginBottomSmall"
         v-show="!nothingSelected">
      <div v-for="category of $store.state.categoriesChosen" :key="category" class="control">
        <TagBasic :textOne="category" colorOne="is-primary" colorDelete="is-danger" hasDelete
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
                   @click="$router.push({ name: 'selection' })" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" text="categoryButton6"
                   @click="$router.push({ name: 'menu', query: { sub: destination } })" />
    </div>
  </div>
</template>

<script>
import TheHero from '@/components/TheHero.vue'
import DropdownRounded from '@/components/DropdownRounded.vue'
import TagBasic from '@/components/TagBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonMDIIcon from '@/components/ButtonMDIIcon.vue'
import ButtonText from '@/components/ButtonText.vue'
import SearchBar from '@/components/SearchBar.vue'

import AnimationOutline from 'vue-material-design-icons/AnimationOutline.vue'
import ExpandAll from 'vue-material-design-icons/ExpandAll.vue'

export default {
  name: 'SelectionCategory',
  components: {
    TheHero,
    DropdownRounded,
    TagBasic,
    ButtonBasic,
    ButtonIcon,
    ButtonMDIIcon,
    ButtonText,
    SearchBar,
    AnimationOutline,
    ExpandAll
  },
  data () {
    return {
      showSort: false,
      showSearch: false,
      searchString: '',
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
      return Object.keys(this.getCategories()).filter(entry => {
        return !this.$store.state.categoriesChosen.includes(entry) &&
          this.getText(entry).toLowerCase().includes(this.searchString.toLowerCase())
      }, this).sort(this.sortFunction(this))
    },
    nothingSelected () {
      return this.$store.state.categoriesChosen.length === 0
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getCategories () {
      return this.$store.getters.getVocabs.words
    },
    getCategoryPlayed (id) {
      return this.$store.getters.getCategoryPlayed(id)
    },
    toggleSort () {
      this.showSort = !this.showSort
    },
    toggleSearch () {
      this.showSearch = !this.showSearch
    },
    addCategory (category) {
      this.$store.commit('addCategory', category)
    },
    addAllCategories () {
      this.$store.commit('setCategories', Object.keys(this.getCategories()))
    },
    removeCategory (category) {
      this.$store.commit('removeCategory', category)
    },
    removeAllCategories () {
      this.$store.commit('setCategories', [])
    },
    sort (type) {
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
    search (string) {
      this.searchString = string
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
  height: 100%;

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
