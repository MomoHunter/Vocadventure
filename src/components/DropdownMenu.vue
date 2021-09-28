<template>
  <div class="dropdown-menu overflow-auto" :class="[getSizeClass('general'), color]">
    <div class="dropdown-menu-item" v-for="(words, key) in vocabs.words" :key="key">
      <div class="category">
        {{ getText(getCategory(key)) }}
      </div>
      <div class="word" :class="{ 'selected': isSelected(key, index), 'disabled': isDisabled(key, index) }"
           v-for="(word, index) in words" :key="index">
        <div class="index">
          {{ index + 1 }}
        </div>
        <div class="details flex-column flex-grow">
          <div class="name">
            {{ word[$store.state.lang] }}
          </div>
          <div class="translation">
            {{ word[vocabs.foreignAlphabet] }}
          </div>
        </div>
        <ButtonIcon class="single-1" :icon="getIcon(key, index)" :color="getColor(key, index)"
                    @click="$emit('click', { category: key, index: index })" />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'DropdownMenu',
  props: {
    color: String,
    selected: Object,
    vocabs: Object,
    mode: {
      type: String,
      default: 'select'
    }
  },
  components: {
    ButtonIcon
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    getCategory (id) {
      return this.$store.getters['vueDict/getCategories'].find(category => {
        return category.id === id
      }, this).categoryName
    },
    getIcon (category, index) {
      if (this.mode === 'select') {
        return 'arrow-right'
      } else {
        if (this.$store.getters['vueDict/isWordDeactivated'](category, index)) {
          return 'times'
        } else {
          return 'check'
        }
      }
    },
    getColor (category, index) {
      if (this.mode === 'select') {
        return 'green'
      } else {
        if (this.$store.getters['vueDict/isWordDeactivated'](category, index)) {
          return 'red'
        } else {
          return 'green'
        }
      }
    },
    isSelected (category, index) {
      return category === this.selected.category && index === this.selected.index
    },
    isDisabled (category, index) {
      return this.$store.getters['vueDict/isWordDeactivated'](category, index)
    }
  }
}
</script>
