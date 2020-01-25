<template>
  <div class="control has-icons-left">
    <span class="select is-fullwidth" :class="[getSizeClass('select'), color]">
      <select @change="$emit('change', $event.target.value)">
        <option v-for="option in options" :selected="isSelected(option)" :value="option" :key="option">
          {{ getText(option) }}
        </option>
      </select>
    </span>
    <span class="icon is-left">
      <font-awesome-icon :icon="['fas', icon]" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'DropdownBasic',
  props: {
    options: Array,
    selected: String,
    icon: String,
    color: String
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
