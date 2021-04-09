<template>
  <div class="page">
    <HeroBasic title="shopTitle" />
    <div v-show="!searchVisible && !sortVisible" class="action-container">
      <ButtonBasic class="width-half" :icon="sortIcon" color="action" text="shopButton1" @click="showSort()" />
      <ButtonBasic class="width-half" icon="search" color="action" text="shopButton2" @click="showSearch()" />
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
    <div v-show="pages === 0" class="no-item-container flex-grow flex-row flex-center"
         :class="getSizeClass('general')">
      {{ getText('shopNoItems') }}
    </div>
    <div v-show="pages !== 0" class="item-container flex-grow">
      <transition-group class="transition-group width-full height-full" tag="div"
                        :enter-active-class="enterTransition"
                        :leave-active-class="leaveTransition">
        <ItemBoxBasic :class="[index % 2 === 0 ? 'left' : 'right', index < 2 ? 'top' : 'bottom']"
                      v-for="(item, index) in visibleItems" mode="shop" :item="item" :key="item.id"
                      @click="navTo('details', item.id)" />
      </transition-group>
    </div>
    <div v-show="pages !== 0" class="pagination button-container flex-row overflow-auto flex-shrink">
      <ButtonText :class="{ 'single-2': currentPage === page }" v-for="page in pages" color="action" :text="page"
                  :key="page" @click="changePage(page)" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="arrow-left" color="red" text="shopButton5"
                   @click="navTo('menu', 'adventure')" />
      <ButtonBasic class="width-half" icon="briefcase" color="info" text="shopButton4" @click="navTo('inventory')" />
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms"
                @after-enter="setTimer()" @after-leave="clearBoughtItems()">
      <NotificationItems v-show="notificationVisible" title="shopNotificationTitle" color="green"
                         icon="shopping-cart" :items="$store.state.vueDict.boughtItems" @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import ItemBoxBasic from '@/components/ItemBoxBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonText from '@/components/ButtonText.vue'
import NotificationItems from '@/components/NotificationItems.vue'

export default {
  name: 'TheShop',
  components: {
    HeroBasic,
    ButtonBasic,
    InputWithButton,
    DropdownBasic,
    ItemBoxBasic,
    ButtonIcon,
    ButtonText,
    NotificationItems
  },
  data () {
    return {
      sortVisible: false,
      searchVisible: false,
      notificationVisible: false,
      searchString: '',
      sortIcon: 'sort',
      enterTransition: 'animate__animated slide-in-left-custom',
      leaveTransition: 'animate__animated slide-out-left-custom',
      sortFunction (that) {
        return (a, b) => { return 0 }
      }
    }
  },
  mounted () {
    if (this.$store.state.vueDict.boughtItems.length > 0) {
      this.notificationVisible = true
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
    changePage (page) {
      this.currentPage = page
    },
    setTimer () {
      setTimeout(this.hideNotification, 30000)
    },
    hideNotification () {
      this.notificationVisible = false
    },
    clearBoughtItems () {
      this.$store.commit('vueDict/setBoughtItems', [])
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
    navTo (name, params = '') {
      switch (name) {
        case 'menu':
          this.$router.push({ name: name, query: { sub: params } })
          break
        case 'details':
          this.$router.push({ name: name, params: { item: params } })
          break
        case 'inventory':
          this.$router.push({ name: name })
          break
        default:
      }
    }
  },
  watch: {
    searchString () {
      this.currentPage = 1
    },
    currentPage (to, from) {
      if (to > from) {
        this.enterTransition = 'animate__animated slide-in-left-custom'
        this.leaveTransition = 'animate__animated slide-out-left-custom'
      } else if (to < from) {
        this.enterTransition = 'animate__animated slide-in-right-custom'
        this.leaveTransition = 'animate__animated slide-out-right-custom'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  justify-content: center;
}
</style>
