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
    <InputWithButton v-if="showSearch" class="is-10" colorInput="is-link" colorButton="is-danger" type="text"
                     iconInput="search" iconButton="times" @click="toggleSearch()" v-model="searchString" />
    <div v-if="visibleItems.length > 0" class="is-10 flexGrow itemContainer marginBottomBig">
      <transition-group class="transitionGroup" tag="div" :enter-active-class="enterTransition"
                        :leave-active-class="leaveTransition">
        <ItemBoxBasic class="customBox" :class="absoluteClass(index)" v-for="(item, index) in visibleItems" :key="item.id"
                    :item="item" @click="$router.push({ name: 'details', params: { item: item.id } })" />
      </transition-group>
    </div>
    <div v-else class="is-10 flexGrow emptyPage">
      <p class="content" :class="getSizeClass('content')">
        {{ getText('shopNoItems') }}
      </p>
    </div>
    <PaginationBasic v-show="pages > 1" :pages="pages" :currentPage="currentPage" @click="changePage($event)" />
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" color="is-primary" icon="briefcase" text="shopButton4"
                   @click="$router.push({ name: 'inventory' })" />
      <ButtonBasic color="is-danger" icon="arrow-left" text="shopButton5"
                   @click="$router.push({ name: 'menu', query: { sub: 'adventure' } })" />
    </div>
    <transition enter-active-class="animated bounceInDown delay-500ms" leave-active-class="animated bounceOutUp"
                @after-enter="setTimer()" @after-leave="clearBoughtItems()">
      <MessageItems v-show="messageVisible" title="shopNewItems" class="fullWidth"
                    color="is-success" :items="$store.state.vueDict.boughtItems" @click="closeMessage()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import DropdownRounded from '@/components/DropdownRounded.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import PaginationBasic from '@/components/PaginationBasic.vue'
import MessageItems from '@/components/MessageItems.vue'
import ItemBoxBasic from '@/components/ItemBoxBasic.vue'

export default {
  name: 'TheShop',
  components: {
    HeroBasic,
    ButtonBasic,
    DropdownRounded,
    ButtonIcon,
    InputWithButton,
    PaginationBasic,
    MessageItems,
    ItemBoxBasic
  },
  data () {
    return {
      showSearch: false,
      showSort: false,
      messageVisible: false,
      searchString: '',
      sortIcon: 'sort',
      enterTransition: 'animated fadeInLeft',
      leaveTransition: 'animated fadeOutRight',
      sortFunction (that) {
        return (a, b) => { return 0 }
      }
    }
  },
  mounted () {
    if (this.$store.state.vueDict.boughtItems.length > 0) {
      this.messageVisible = true
    }
  },
  beforeDestroy () {
    this.clearBoughtItems()
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
      return this.$store.state.vueDict.items.filter(entry => {
        return entry.unlocked && entry.categories.includes('shop') &&
          this.getText(entry.id).toLowerCase().includes(this.searchString.toLowerCase())
      }, this).sort(this.sortFunction(this))
    },
    pages () {
      return Math.ceil(this.items.length / 4)
    },
    baseUrl () {
      return process.env.BASE_URL
    },
    currentPage: {
      get () {
        return this.$store.state.vueDict.currentShopPage
      },
      set (newPage) {
        this.$store.commit('vueDict/setCurrentShopPage', newPage)
      }
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
    },
    absoluteClass (index) {
      switch (index) {
        case 0:
          return 'alignTop alignLeft'
        case 1:
          return 'alignTop alignRight'
        case 2:
          return 'alignBottom alignLeft'
        case 3:
          return 'alignBottom alignRight'
        default:
          return 'alignTop alignLeft'
      }
    },
    setTimer () {
      setTimeout(this.closeMessage, 10000)
    },
    closeMessage () {
      this.messageVisible = false
    },
    clearBoughtItems () {
      this.$store.commit('vueDict/setBoughtItems', [])
    }
  },
  watch: {
    searchString () {
      this.currentPage = 1
    },
    currentPage (to, from) {
      if (to > from) {
        this.enterTransition = 'animated fadeInRight'
        this.leaveTransition = 'animated fadeOutLeft'
      } else {
        this.enterTransition = 'animated fadeInLeft'
        this.leaveTransition = 'animated fadeOutRight'
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

  .emptyPage {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.itemContainer {
  .transitionGroup {
    position: relative;
    width: 100%;
    height: 100%;

    .customBox {
      position: absolute;
      width: calc(50% - .5rem);
      height: calc(50% - .5rem);

      &.alignLeft {
        margin-right: .5rem;
        left: 0px;
      }

      &.alignRight {
        margin-left: .5rem;
        right: 0px;
      }

      &.alignTop {
        top: 0px;
      }

      &.alignBottom {
        bottom: 0px;
      }
    }
  }
}
</style>
