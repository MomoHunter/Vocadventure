<template>
  <div class="flexContainer">
    <HeroBasic class="marginBottomSmall" title="inventoryTitle" />
    <div v-show="!showSearch && !showSort" class="field has-addons is-10">
      <div class="control halfWidth">
        <ButtonBasic color="is-link" :icon="sortIcon" text="inventoryButton1" @click="toggleSort()" />
      </div>
      <div class="control halfWidth">
        <ButtonBasic color="is-link" icon="search" text="inventoryButton2" @click="toggleSearch()" />
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
    <div v-if="visibleItems.length > 0" class="is-10 flexGrow itemContainer">
      <div class="box customBox" v-for="item in visibleItems" :key="item.id">
        <p class="content boxTitle" :class="getSizeClass('content')">{{ getText(item.id) }}</p>
        <div class="flexGrow fullWidth backgroundPicture"
             :style="{ backgroundImage: 'url(' + item.spriteKey + ')' }">

        </div>
      </div>
    </div>
    <div v-else class="is-10 flexGrow emptyPage">
      <p class="content" :class="getSizeClass('content')">
        {{ getText('inventoryNoItems') }}
      </p>
    </div>
    <PaginationBasic v-show="pages > 0" :pages="pages" :currentPage="currentPage" @click="changePage($event)" />
    <div class="is-10">
      <ButtonBasic color="is-danger" icon="arrow-left" text="inventoryButton5"
                   @click="$router.push({ name: 'shop' })" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import DropdownRounded from '@/components/DropdownRounded.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import PaginationBasic from '@/components/PaginationBasic.vue'

export default {
  name: 'TheShop',
  components: {
    HeroBasic,
    ButtonBasic,
    DropdownRounded,
    ButtonIcon,
    InputWithButton,
    PaginationBasic
  },
  data () {
    return {
      showSearch: false,
      showSort: false,
      searchString: '',
      sortIcon: 'sort',
      currentPage: 1,
      sortFunction (that) {
        return (a, b) => { return 0 }
      }
    }
  },
  computed: {
    sorters () {
      return [
        'sortStandard', 'sortAlphAsc', 'sortAlphDesc'
      ]
    },
    visibleItems () {
      let result = []
      for (let i = (this.currentPage - 1) * 4; i < Math.min(this.items.length, this.currentPage * 4); i++) {
        result.push(this.items[i])
      }
      return result
    },
    items () {
      return this.$store.state.vueDict.inventory.filter(entry => {
        return this.getText(entry.id).toLowerCase().includes(this.searchString.toLowerCase())
      }, this).sort(this.sortFunction(this))
    },
    pages () {
      return Math.ceil(this.items.length / 4)
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
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
              if (that.getText(a.id) > that.getText(b.id)) {
                return 1
              } else if (that.getText(a.id) < that.getText(b.id)) {
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
              if (that.getText(a.id) < that.getText(b.id)) {
                return 1
              } else if (that.getText(a.id) > that.getText(b.id)) {
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
    toggleSort () {
      this.showSort = !this.showSort
    },
    toggleSearch () {
      this.showSearch = !this.showSearch
      if (!this.showSearch) {
        this.searchString = ''
      }
    },
    changePage (page) {
      if (page !== '&hellip;') {
        this.currentPage = page
      }
    }
  },
  watch: {
    searchString () {
      this.currentPage = 1
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
  flex-wrap: wrap;
  align-items: center;
  height: calc(100% - 71px);

  .is-10 {
    width: calc(100% / 1.2);
  }

  .halfWidth {
    width: 50%;
  }

  .flexGrow {
    flex-grow: 1;
  }

  .emptyPage {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.itemContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .customBox {
    display: flex;
    flex-direction: column;
    width: calc(50% - .5rem);
    margin-bottom: 1rem;
    height: calc(50% - 1rem);

    &:nth-child(odd) {
      margin-right: .5rem;
    }

    &:nth-child(even) {
      margin-left: .5rem;
    }

    .boxTitle {
      text-align: center;
    }

    .backgroundPicture {
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
}
</style>
