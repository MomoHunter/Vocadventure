<template>
  <div class="package-category-entry flex-column" :class="getSizeClass('general')">
    <div class="flex-row">
      <ButtonIcon class="single-1" :icon="expandIcon" color="action" @click="$emit('expand')" />
      <div class="title flex-grow info">
        {{ category[$store.state.lang] }}
      </div>
      <ButtonIcon class="single-1" icon="pen" color="green" @click="$emit('edit', { type: 'category' })" />
      <ButtonIcon class="single-1" icon="trash" color="red" @click="$emit('delete', { type: 'category' })" />
    </div>
    <ButtonBasic v-show="expanded" class="single-1" icon="plus" color="green" text="packagesEditCategoriesButton3"
                 @click="$emit('new')" />
    <div v-show="expanded" class="flex-row" v-for="(word, index) in category.words" :key="index">
      <div class="details flex-grow flex-row">
        <div class="index">
          {{ index + 1 }}
        </div>
        <div class="word">
          {{ word[$store.state.lang] }}
        </div>
      </div>
      <ButtonIcon class="single-1" icon="pen" color="green" @click="$emit('edit', { type: 'word', index: index })" />
      <ButtonIcon class="single-1" icon="trash" color="red" @click="$emit('delete', { type: 'word', index: index })" />
    </div>
  </div>
</template>

<script>
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'PackageCategoryEntry',
  props: {
    category: Object,
    expanded: Boolean
  },
  components: {
    ButtonIcon,
    ButtonBasic
  },
  computed: {
    expandIcon () {
      return this.expanded ? 'angle-up' : 'angle-down'
    }
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>
