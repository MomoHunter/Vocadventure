<template>
  <div class="dropdown" :class="[getSizeClass('general'), color]">
    <div v-if="hasTitle" class="title">
      {{ getText(title) }}
    </div>
    <div class="relative">
      <span class="icon">
        <font-awesome-icon :icon="['fas', icon]" />
      </span>
      <select class="select" @change="$emit('change', $event.target.value)">
        <option class="option" v-for="option in options" :selected="isSelected(option)" :value="option" :key="option">
          {{ getText(option) }}
        </option>
      </select>
      <span class="arrow">
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownBasic',
  props: {
    title: String,
    options: Array,
    selected: String,
    icon: String,
    color: String
  },
  computed: {
    hasTitle () {
      return this.title !== ''
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    isSelected (option) {
      return option === this.selected
    }
  }
}
</script>
