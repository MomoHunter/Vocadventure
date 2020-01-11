<template>
  <div class="flexContainer">
    <TheHero class="marginBottomSmall" :title="destination" />
    <div class="field has-addons is-10 marginBottomSmall">
      <div class="control halfWidth" v-if="!showSort">
        <ButtonBasic color="is-link" icon="sort" text="categoryButton1" @click="toggleSort()" />
      </div>
      <DropdownRounded class="halfWidth" v-show="showSort" :options="sorters" icon="sort" selected="sortStandard" color="is-link"
                       @change="sort($event.target.value)" />
      <div class="control" v-show="showSort">
        <ButtonIcon color="is-link" icon="times" @click="toggleSort()" />
      </div>
      <div class="control halfWidth">
        <ButtonBasic v-show="!showSearch" color="is-link" icon="search" text="categoryButton2" @click="toggleSearch()" />
        <SearchBar v-show="showSearch" colorInput="is-link" colorButton="is-link" type="text" icon="times"
                   @change="search($event.target.value)" @click="toggleSearch()" />
      </div>
    </div>
    <div class="field is-grouped is-grouped-multiline maxThirdHeight overflowAuto is-10">
      <div v-for="category of $store.state.categoriesChosen" :key="category" class="control">
        <TagBasic :textOne="category" colorOne="is-primary" colorDelete="is-danger" hasDelete
                  @click="removeCategory(category)"/>
      </div>
    </div>
    <div class="buttons is-10 flexGrow overflowAuto">
      <ButtonText v-for="category of categoriesAvailable" :key="category" color="is-primary" :text="category"
                  @click="addCategory(category)" />
    </div>
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" color="is-success" icon="check" text="categoryButton3"
                   @click="$router.push({ name: 'selection' })" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" text="categoryButton4"
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
import ButtonText from '@/components/ButtonText.vue'
import SearchBar from '@/components/SearchBar.vue'

export default {
  name: 'SelectionCategory',
  components: {
    TheHero,
    DropdownRounded,
    TagBasic,
    ButtonBasic,
    ButtonIcon,
    ButtonText,
    SearchBar
  },
  data () {
    return {
      showSort: false,
      showSearch: false
    }
  },
  computed: {
    destination () {
      return this.$route.params.destination
    },
    sorters () {
      return ['sortStandard']
    },
    categoriesAvailable () {
      return Object.keys(this.getCategories()).filter(entry => {
        return !this.$store.state.categoriesChosen.includes(entry)
      }, this)
    }
  },
  methods: {
    getCategories () {
      return this.$store.getters.getVocabs.words
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
          break
        case 'alphabeticDesc':
          break
        default:
      }
    },
    search (string) {
      console.log('hallo')
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

.maxThirdHeight {
  max-height: 20%;
}

.overflowAuto {
  overflow: auto;
}
</style>
