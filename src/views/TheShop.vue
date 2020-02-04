<template>
  <div class="flexContainer">
    <HeroBasic class="marginBottomSmall" title="shopTitle" />
    <div v-show="!showSearch && !showSort" class="field has-addons is-10">
      <div class="control halfWidth">
        <ButtonBasic color="is-link" :icon="sortIcon" text="shopButton1" @click="toggleSort()" />
      </div>
      <div class="control halfWidth">
        <ButtonBasic color="is-link" icon="search" text="shopButton2" @click="toggleSearch()" />
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
    <div class="is-10 flexGrow itemContainer">
      <div class="box customBox">
        <p class="content" :class="getSizeClass('content')">{{ sortIcon }}</p>
        <div class="flexGrow fullWidth">

        </div>
      </div>
      <div class="box customBox">
        <p class="content" :class="getSizeClass('content')">{{ sortIcon }}</p>
        <div class="flexGrow fullWidth">

        </div>
      </div>
      <div class="box customBox">
        <p class="content" :class="getSizeClass('content')">{{ sortIcon }}</p>
        <div class="flexGrow fullWidth">

        </div>
      </div>
      <div class="box customBox">
        <p class="content" :class="getSizeClass('content')">{{ sortIcon }}</p>
        <div class="flexGrow fullWidth">

        </div>
      </div>
    </div>
    <PaginationBasic :pages="9" :currentPage="currentPage" @click="changePage($event)" />
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" color="is-primary" icon="briefcase" text="shopButton4"
                   @click="$router.push({ name: 'inventory' })" />
      <ButtonBasic color="is-danger" icon="arrow-left" text="shopButton5"
                   @click="$router.push({ name: 'menu', query: { sub: 'adventure' } })" />
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
    }
  },
  methods: {
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
}

.itemContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;

  .customBox {
    display: flex;
    flex-direction: column;
    width: calc(50% - .5rem);
    margin-bottom: 1rem;

    &:nth-child(odd) {
      margin-right: .5rem;
    }

    &:nth-child(even) {
      margin-left: .5rem;
    }
  }
}
</style>
