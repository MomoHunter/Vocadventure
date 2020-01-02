<template>
  <p class="control has-icons-left">
    <span class="select is-fullwidth" :class="getSizeClass('select')">
      <select @change="$emit('change', $event.target.value)">
        <option v-for="option in options" :selected="selected(option)" :value="option" :key="option">
          {{ getText(option) }}
        </option>
      </select>
    </span>
    <span class="icon is-left">
      <font-awesome-icon :icon="['fas', icon]" />
    </span>
  </p>
</template>

<script>
export default {
  name: 'DropdownBasic',
  props: ['options', 'selected', 'icon'],
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style scoped>

</style>
